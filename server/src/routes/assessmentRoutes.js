const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, protect, requireStudent } = require('../middleware/auth');
const {
  getAssessments,
  startAssessment,
  submitAssessment,
  getAttemptDetails,
  getMyAttempts,
} = require('../controllers/assessmentController');

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

router.get('/', softAuth, getAssessments);
router.post('/:id/start', protect, startAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.get('/attempts/:attemptId', protect, getAttemptDetails);
router.get('/user/my-attempts', protect, requireStudent, getMyAttempts);

module.exports = router;
