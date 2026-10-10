const express = require('express');
const router = express.Router();
const { protect, requireStudent } = require('../middleware/auth');
const { getStudentDashboardSummary } = require('../controllers/analyticsController');

router.use(protect, requireStudent);

router.get('/dashboard', getStudentDashboardSummary);

module.exports = router;
