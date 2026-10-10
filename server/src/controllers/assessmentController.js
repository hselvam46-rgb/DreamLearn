const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { recordAuditLog } = require('../middleware/auth');
const { evaluateTestCases } = require('../services/compilerService');

// Student: List published assessments
const getAssessments = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const query = { status: 'Published' };

    if (category && category !== 'All' && category !== 'undefined' && category !== 'null') query.category = category;
    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined' && difficulty !== 'null') query.difficulty = difficulty;

    const assessments = await Assessment.find(query).sort({ createdAt: -1 });

    // Attach student's previous attempts if logged in
    let studentAttempts = [];
    if (req.user && req.user.role === 'student') {
      studentAttempts = await AssessmentAttempt.find({ studentId: req.user._id, status: 'completed' })
        .sort({ submittedAt: -1 });
    }

    const enhanced = assessments.map((a) => {
      const attempts = studentAttempts.filter((att) => att.assessmentId.toString() === a._id.toString());
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map((att) => att.percentage)) : null;
      return {
        ...a.toObject(),
        userAttemptsCount: attempts.length,
        bestPercentage: bestScore,
      };
    });

    return res.json({
      success: true,
      assessments: enhanced,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Start assessment test (HIDES correct answers and explanations!)
const startAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id).populate({
      path: 'questions',
      select: 'text topic difficulty type options points allowedLanguages defaultLanguage starterCode testCases caseStudyText scenarioTitle', // correctAnswerId and explanation explicitly EXCLUDED!
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    if (assessment.status !== 'Published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'This assessment is not currently available.' });
    }

    // Check attempts count
    if (req.user.role === 'student') {
      const attemptsCount = await AssessmentAttempt.countDocuments({
        studentId: req.user._id,
        assessmentId: assessment._id,
        status: 'completed',
      });

      if (attemptsCount >= assessment.attemptsAllowed) {
        return res.status(400).json({
          success: false,
          message: `You have reached the maximum allowed attempts (${assessment.attemptsAllowed}) for this assessment.`,
        });
      }
    }

    // Create a new in-progress attempt session
    const attempt = await AssessmentAttempt.create({
      studentId: req.user._id,
      assessmentId: assessment._id,
      startedAt: new Date(),
      status: 'in_progress',
      totalQuestions: assessment.questions.length,
    });

    return res.json({
      success: true,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        description: assessment.description,
        category: assessment.category,
        difficulty: assessment.difficulty,
        durationMinutes: assessment.durationMinutes,
        passingScore: assessment.passingScore,
        totalQuestions: assessment.questions.length,
        questions: assessment.questions.map((q) => {
          const qObj = q.toObject ? q.toObject() : { ...q };
          if (qObj.testCases && Array.isArray(qObj.testCases)) {
            qObj.testCases = qObj.testCases.filter((tc) => !tc.isHidden);
          }
          // In student assessment mode, ensure code editor starts completely empty
          qObj.starterCode = '';
          return qObj;
        }),
      },
      attemptId: attempt._id,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Submit assessment answers & authoritative scoring
const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { attemptId, answers = [], timeSpentSeconds = 0 } = req.body;
    // answers format: [{ questionId: '...', selectedOptionId: 'a' }]

    const assessment = await Assessment.findById(id).populate('questions');
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    let attempt = null;
    if (attemptId) {
      attempt = await AssessmentAttempt.findById(attemptId);
    }

    const questionMap = new Map();
    assessment.questions.forEach((q) => {
      questionMap.set(q._id.toString(), q);
    });

    let score = 0;
    let totalPoints = 0;
    let correctCount = 0;
    const detailedAnswers = [];

    // Evaluate each question authoritatively on the backend based on its specific type
    for (const q of assessment.questions) {
      const qIdStr = q._id.toString();
      const points = q.points || 1;
      totalPoints += points;

      const userSubmission = answers.find((ans) => String(ans.questionId) === qIdStr);
      let isCorrect = false;
      const selectedOptionId = userSubmission ? userSubmission.selectedOptionId : null;

      if (q.type === 'mcq' || q.type === 'case_based' || q.type === 'boolean') {
        isCorrect = selectedOptionId && selectedOptionId === q.correctAnswerId;
      } else if (q.type === 'range') {
        const val = parseFloat(userSubmission ? (userSubmission.numericAnswer ?? userSubmission.selectedOptionId) : NaN);
        if (!isNaN(val)) {
          if (q.exactAnswer !== undefined && q.exactAnswer !== null) {
            const tol = q.tolerance !== undefined && q.tolerance !== null ? q.tolerance : 0;
            isCorrect = Math.abs(val - q.exactAnswer) <= tol;
          } else if (q.rangeMin !== undefined && q.rangeMax !== undefined) {
            isCorrect = val >= q.rangeMin && val <= q.rangeMax;
          }
        }
      } else if (q.type === 'coding') {
        const code = userSubmission ? userSubmission.code : '';
        const lang = userSubmission ? userSubmission.language : (q.defaultLanguage || 'python');
        if (code && code.trim()) {
          if (q.testCases && q.testCases.length > 0) {
            try {
              const evalResult = await evaluateTestCases(lang, code, q.testCases);
              isCorrect = evalResult.passedTestCases === evalResult.totalTestCases;
            } catch (e) {
              isCorrect = false;
            }
          } else {
            isCorrect = true;
          }
        }
      }

      if (isCorrect) {
        score += points;
        correctCount += 1;
      }

      detailedAnswers.push({
        questionId: q._id,
        selectedOptionId: selectedOptionId || (userSubmission ? String(userSubmission.numericAnswer || '') : null),
        isCorrect: !!isCorrect,
      });
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= assessment.passingScore;

    if (attempt) {
      attempt.answers = detailedAnswers;
      attempt.score = score;
      attempt.totalPoints = totalPoints;
      attempt.percentage = percentage;
      attempt.passed = passed;
      attempt.correctCount = correctCount;
      attempt.totalQuestions = assessment.questions.length;
      attempt.timeSpentSeconds = timeSpentSeconds;
      attempt.submittedAt = new Date();
      attempt.status = 'completed';
      await attempt.save();
    } else {
      attempt = await AssessmentAttempt.create({
        studentId: req.user._id,
        assessmentId: assessment._id,
        answers: detailedAnswers,
        score,
        totalPoints,
        percentage,
        passed,
        correctCount,
        totalQuestions: assessment.questions.length,
        timeSpentSeconds,
        startedAt: new Date(Date.now() - (timeSpentSeconds || 60) * 1000),
        submittedAt: new Date(),
        status: 'completed',
      });
    }

    // Update student placement readiness and assessments count
    const student = req.user;
    if (student.placementReadiness) {
      student.placementReadiness.assessmentsCompleted = (student.placementReadiness.assessmentsCompleted || 0) + 1;
      // Slight bump to placement readiness score
      if (passed && student.placementReadiness.score < 98) {
        student.placementReadiness.score = Math.min(99, student.placementReadiness.score + 2);
      }
      await student.save();
    }

    return res.json({
      success: true,
      message: passed ? 'Congratulations! You passed the assessment!' : 'Assessment completed.',
      attemptId: attempt._id,
      result: {
        score,
        totalPoints,
        percentage,
        passingScore: assessment.passingScore,
        passed,
        correctCount,
        totalQuestions: assessment.questions.length,
        timeSpentSeconds,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student & Admin: Review attempt result with answers & explanations
const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('assessmentId')
      .populate({
        path: 'answers.questionId',
        select: 'text topic difficulty type options correctAnswerId explanation points',
      });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Assessment attempt not found.' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && attempt.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this attempt.' });
    }

    return res.json({
      success: true,
      attempt,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Get my attempts history
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ studentId: req.user._id })
      .populate('assessmentId', 'title category difficulty durationMinutes passingScore')
      .sort({ submittedAt: -1 });

    return res.json({
      success: true,
      attempts,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: List all assessments
const getAdminAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('questions', 'text topic difficulty points').sort({ createdAt: -1 });
    const attemptsCountMap = await AssessmentAttempt.aggregate([
      { $group: { _id: '$assessmentId', count: { $sum: 1 }, avgScore: { $avg: '$percentage' } } },
    ]);

    const enriched = assessments.map((a) => {
      const stat = attemptsCountMap.find((s) => s._id && s._id.toString() === a._id.toString());
      return {
        ...a.toObject(),
        totalAttempts: stat ? stat.count : 0,
        averagePercentage: stat ? Math.round(stat.avgScore) : 0,
      };
    });

    return res.json({
      success: true,
      assessments: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create Assessment
const createAssessment = async (req, res) => {
  try {
    const { title, description, category, difficulty, durationMinutes, passingScore, attemptsAllowed, status, questions } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await Assessment.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const assessment = await Assessment.create({
      title,
      slug,
      description,
      category: category || 'DSA',
      difficulty: difficulty || 'Intermediate',
      durationMinutes: durationMinutes || 30,
      passingScore: passingScore || 70,
      attemptsAllowed: attemptsAllowed || 3,
      status: status || 'Published',
      questions: Array.isArray(questions) ? questions : [],
      totalQuestions: Array.isArray(questions) ? questions.length : 0,
    });

    await recordAuditLog(req.user, 'CREATE_ASSESSMENT', 'Assessment', assessment._id, `Created assessment: ${title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Assessment created successfully.',
      assessment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Assessment
const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    Object.assign(assessment, req.body);
    if (req.body.questions) {
      assessment.totalQuestions = req.body.questions.length;
    }
    await assessment.save();

    await recordAuditLog(req.user, 'UPDATE_ASSESSMENT', 'Assessment', assessment._id, `Updated assessment: ${assessment.title}`, req);

    return res.json({
      success: true,
      message: 'Assessment updated successfully.',
      assessment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Assessment
const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    await Assessment.findByIdAndDelete(id);
    await recordAuditLog(req.user, 'DELETE_ASSESSMENT', 'Assessment', id, `Deleted assessment: ${assessment.title}`, req);

    return res.json({
      success: true,
      message: 'Assessment deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAssessments,
  startAssessment,
  submitAssessment,
  getAttemptDetails,
  getMyAttempts,
  getAdminAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};
