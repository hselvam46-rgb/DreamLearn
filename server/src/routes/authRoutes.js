const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, loginAdmin, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public auth
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/admin/login', loginAdmin);

// Protected user routes
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
