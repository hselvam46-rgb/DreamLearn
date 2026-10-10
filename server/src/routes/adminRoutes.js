const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');

// Controllers
const { getAdminAnalyticsOverview } = require('../controllers/analyticsController');
const {
  getAdminCourses,
  createCourse,
  updateCourse,
  setCourseStatus,
  deleteCourse,
} = require('../controllers/courseController');
const {
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/curriculumController');
const {
  getAdminAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const {
  getStudents,
  getStudentDetails,
  setStudentStatus,
  getAuditLogs,
} = require('../controllers/adminStudentController');
const {
  getCodingProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/codingController');
const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const {
  getAdmins,
  createAdmin,
  setAdminStatus,
  deleteAdmin,
} = require('../controllers/adminUserController');

// STRICT PROTECT + ADMIN REQUIREMENT APPLIED TO ALL ROUTES
router.use(protect, requireAdmin);

// Analytics
router.get('/analytics/overview', getAdminAnalyticsOverview);

// Course Management
router.get('/courses', getAdminCourses);
router.post('/courses', createCourse);
router.patch('/courses/:id', updateCourse);
router.patch('/courses/:id/status', setCourseStatus);
router.delete('/courses/:id', deleteCourse);

// Curriculum Management
router.post('/courses/:courseId/modules', createModule);
router.patch('/modules/:moduleId', updateModule);
router.delete('/modules/:moduleId', deleteModule);

router.post('/courses/:courseId/modules/:moduleId/lessons', createLesson);
router.patch('/lessons/:lessonId', updateLesson);
router.delete('/lessons/:lessonId', deleteLesson);

// Assessment Management
router.get('/assessments', getAdminAssessments);
router.post('/assessments', createAssessment);
router.patch('/assessments/:id', updateAssessment);
router.delete('/assessments/:id', deleteAssessment);

// Question Bank
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.patch('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Student Oversight
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetails);
router.patch('/students/:id/status', setStudentStatus);
router.get('/audit-logs', getAuditLogs);

// Coding Problem Management
router.get('/problems', getCodingProblems);
router.post('/problems', createProblem);
router.patch('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);

// Company Management
router.get('/companies', getCompanies);
router.post('/companies', createCompany);
router.patch('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

// Administrator Team Management
router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.patch('/admins/:id/status', setAdminStatus);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;

