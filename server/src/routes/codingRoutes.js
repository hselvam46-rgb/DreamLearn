const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, protect, requireStudent } = require('../middleware/auth');
const {
  runSandboxCode,
  getCodingProblems,
  getProblemDetails,
  submitProblemCode,
} = require('../controllers/codingController');

const softAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (e) {}
  }
  next();
};

// Sandbox run - accessible to students and visitors for interactive learning!
router.post('/run', runSandboxCode);

// Problems catalog & detail
router.get('/problems', softAuth, getCodingProblems);
router.get('/problems/:slug', softAuth, getProblemDetails);

// Problem submission (authenticated student)
router.post('/problems/:slug/submit', protect, requireStudent, submitProblemCode);

module.exports = router;
