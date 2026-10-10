const Question = require('../models/Question');
const { recordAuditLog } = require('../middleware/auth');

// Admin: Get questions from Question Bank
const getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, search } = req.query;
    const query = {};

    if (topic && topic !== 'All' && topic !== 'undefined' && topic !== 'null') query.topic = topic;
    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined' && difficulty !== 'null') query.difficulty = difficulty;
    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { text: { $regex: search.trim(), $options: 'i' } },
        { topic: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create Question
const createQuestion = async (req, res) => {
  try {
    const {
      text,
      topic,
      difficulty,
      type = 'mcq',
      options,
      correctAnswerId,
      explanation,
      points,
      rangeMin,
      rangeMax,
      exactAnswer,
      tolerance,
      allowedLanguages,
      defaultLanguage,
      starterCode,
      testCases,
      caseStudyText,
      scenarioTitle,
    } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Question text statement is required.',
      });
    }

    // Type-specific validations
    if ((type === 'mcq' || type === 'case_based') && (!options || options.length === 0 || !correctAnswerId)) {
      return res.status(400).json({
        success: false,
        message: 'Multiple choice questions require at least two options and a correct answer selection.',
      });
    }

    if (type === 'range' && rangeMin === undefined && rangeMax === undefined && exactAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Numeric range questions require minimum and maximum range bounds, or an exact answer target.',
      });
    }

    const question = await Question.create({
      text,
      topic: topic || 'General',
      difficulty: difficulty || 'Medium',
      type,
      options: options || [],
      correctAnswerId: correctAnswerId || '',
      rangeMin: rangeMin !== undefined && rangeMin !== '' ? Number(rangeMin) : undefined,
      rangeMax: rangeMax !== undefined && rangeMax !== '' ? Number(rangeMax) : undefined,
      exactAnswer: exactAnswer !== undefined && exactAnswer !== '' ? Number(exactAnswer) : undefined,
      tolerance: tolerance !== undefined && tolerance !== '' ? Number(tolerance) : 0,
      allowedLanguages: allowedLanguages && allowedLanguages.length > 0 ? allowedLanguages : ['python', 'java', 'cpp', 'javascript'],
      defaultLanguage: defaultLanguage || 'python',
      starterCode: starterCode || '',
      testCases: testCases || [],
      caseStudyText: caseStudyText || '',
      scenarioTitle: scenarioTitle || '',
      explanation: explanation || '',
      points: points || 1,
    });

    await recordAuditLog(req.user, 'CREATE_QUESTION', 'Question', question._id, `Added question: ${text.substring(0, 40)}...`, req);

    return res.status(201).json({
      success: true,
      message: 'Question added to question bank.',
      question,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    Object.assign(question, req.body);
    await question.save();

    await recordAuditLog(req.user, 'UPDATE_QUESTION', 'Question', id, `Updated question: ${question.text.substring(0, 40)}...`, req);

    return res.json({
      success: true,
      message: 'Question updated successfully.',
      question,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    await Question.findByIdAndDelete(id);
    await recordAuditLog(req.user, 'DELETE_QUESTION', 'Question', id, `Deleted question`, req);

    return res.json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
