const CodingProblem = require('../models/CodingProblem');
const CodeSubmission = require('../models/CodeSubmission');
const { executeCode, evaluateTestCases } = require('../services/compilerService');
const { recordAuditLog } = require('../middleware/auth');

// Run code in sandbox (C, C++, Java, Python, JavaScript)
const runSandboxCode = async (req, res) => {
  try {
    const { language, code, customInput = '', testCases } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    // Multiple test cases batch evaluation (LeetCode-style)
    if (Array.isArray(testCases) && testCases.length > 0) {
      const evalResult = await evaluateTestCases(language || 'python', code, testCases);
      return res.json({
        success: true,
        ...evalResult,
      });
    }

    const result = await executeCode(language || 'python', code, customInput);

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// List coding problems
const getCodingProblems = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = {};

    if (category && category !== 'All' && category !== 'undefined' && category !== 'null') query.category = category;
    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined' && difficulty !== 'null') query.difficulty = difficulty;
    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const problems = await CodingProblem.find(query).select('-testCases').sort({ createdAt: -1 });

    // Check student status if logged in
    let submissions = [];
    if (req.user && req.user.role === 'student') {
      submissions = await CodeSubmission.find({ studentId: req.user._id });
    }

    const enhanced = problems.map((p) => {
      const userSubs = submissions.filter((s) => s.problemId.toString() === p._id.toString());
      const hasAccepted = userSubs.some((s) => s.status === 'Accepted');
      return {
        ...p.toObject(),
        solved: hasAccepted,
        attemptsCount: userSubs.length,
      };
    });

    return res.json({
      success: true,
      problems: enhanced,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get problem by slug
const getProblemDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await CodingProblem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Only expose non-hidden test cases to students
    const publicTestCases = problem.testCases
      .filter((tc) => !tc.isHidden)
      .map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput }));

    let previousSubmissions = [];
    if (req.user) {
      previousSubmissions = await CodeSubmission.find({
        studentId: req.user._id,
        problemId: problem._id,
      }).sort({ submittedAt: -1 }).limit(10);
    }

    return res.json({
      success: true,
      problem: {
        _id: problem._id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starterCode,
        sampleTestCases: publicTestCases,
        acceptanceRate: problem.acceptanceRate,
      },
      previousSubmissions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Submit code against all test cases
const submitProblemCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const { language, code } = req.body;

    const problem = await CodingProblem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Evaluate against all test cases
    const evalResult = await evaluateTestCases(language, code, problem.testCases);

    const submission = await CodeSubmission.create({
      studentId: req.user._id,
      problemId: problem._id,
      language,
      code,
      status: evalResult.overallStatus,
      passedTestCases: evalResult.passedTestCases,
      totalTestCases: evalResult.totalTestCases,
      runtimeMs: evalResult.averageRuntimeMs,
      outputLog: JSON.stringify(evalResult.results),
    });

    // Update problem submission metrics
    problem.submissionsCount += 1;
    await problem.save();

    // Update student solved count if accepted
    if (evalResult.overallStatus === 'Accepted') {
      const alreadySolved = await CodeSubmission.findOne({
        studentId: req.user._id,
        problemId: problem._id,
        status: 'Accepted',
        _id: { $ne: submission._id },
      });

      if (!alreadySolved && req.user.placementReadiness) {
        req.user.placementReadiness.solvedCount = (req.user.placementReadiness.solvedCount || 0) + 1;
        await req.user.save();
      }
    }

    return res.json({
      success: true,
      submission,
      evalResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create Problem
const createProblem = async (req, res) => {
  try {
    const { title, difficulty, category, description, examples, constraints, starterCode, testCases } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await CodingProblem.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const problem = await CodingProblem.create({
      title,
      slug,
      difficulty: difficulty || 'Easy',
      category: category || 'Arrays',
      description,
      examples: Array.isArray(examples) ? examples : [],
      constraints: Array.isArray(constraints) ? constraints : [],
      starterCode: starterCode || {},
      testCases: Array.isArray(testCases) ? testCases : [],
    });

    await recordAuditLog(req.user, 'CREATE_PROBLEM', 'CodingProblem', problem._id, `Created problem: ${title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Coding problem created successfully.',
      problem,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Problem
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await CodingProblem.findById(id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    Object.assign(problem, req.body);
    await problem.save();

    await recordAuditLog(req.user, 'UPDATE_PROBLEM', 'CodingProblem', problem._id, `Updated problem: ${problem.title}`, req);

    return res.json({
      success: true,
      message: 'Coding problem updated successfully.',
      problem,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Problem
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await CodingProblem.findById(id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    await CodingProblem.findByIdAndDelete(id);
    await recordAuditLog(req.user, 'DELETE_PROBLEM', 'CodingProblem', id, `Deleted problem: ${problem.title}`, req);

    return res.json({
      success: true,
      message: 'Problem deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  runSandboxCode,
  getCodingProblems,
  getProblemDetails,
  submitProblemCode,
  createProblem,
  updateProblem,
  deleteProblem,
};
