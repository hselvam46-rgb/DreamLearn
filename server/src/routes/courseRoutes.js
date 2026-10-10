const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, protect, requireStudent } = require('../middleware/auth');
const { getPublishedCourses, getCourseDetails } = require('../controllers/courseController');
const { getCourseCurriculum, getLessonContent } = require('../controllers/curriculumController');
const { enrollInCourse, getMyEnrollments, toggleLessonProgress, getCourseProgress } = require('../controllers/learningController');

// Soft auth helper to inspect user if token is provided without failing public requests
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

// Public & Student Course browsing
router.get('/', getPublishedCourses);
router.get('/:idOrSlug', softAuth, getCourseDetails);
router.get('/:courseId/curriculum', getCourseCurriculum);

// Lesson player
router.get('/lessons/:lessonId/content', softAuth, getLessonContent);

// Student enrollments and progress
router.post('/:courseId/enroll', protect, requireStudent, enrollInCourse);
router.get('/user/my-enrollments', protect, requireStudent, getMyEnrollments);
router.post('/progress/toggle-lesson', protect, requireStudent, toggleLessonProgress);
router.get('/:courseId/user-progress', protect, requireStudent, getCourseProgress);

module.exports = router;
