const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, recordAuditLog } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Student Registration (Public admin registration is blocked!)
const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student', // Always student! No public admin registration allowed.
      status: 'active',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to DreamLearn.',
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Student Login (/login)
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account has been suspended. Please contact support.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Admin Login (/admin/login)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Administrator email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    // Role verification: strictly require admin!
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This account does not possess administrator credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await recordAuditLog(user, 'ADMIN_LOGIN', 'User', user._id, 'Admin logged in via /admin/login', req);

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Admin authorization granted.',
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Current User Me
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'college', 'graduationYear', 'targetCompany', 'avatar'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    if (req.body.password && req.body.password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      req.user.passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    await req.user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Change Password with current password verification
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    req.user.passwordHash = await bcrypt.hash(newPassword, salt);
    await req.user.save();

    await recordAuditLog(
      req.user,
      'CHANGE_PASSWORD',
      'User',
      req.user._id,
      `User ${req.user.email} updated their account password`,
      req
    );

    return res.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
  getMe,
  updateProfile,
  changePassword,
};

