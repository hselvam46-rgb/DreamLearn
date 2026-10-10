const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { recordAuditLog } = require('../middleware/auth');

// Admin: Get all administrators
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create a new Administrator
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account with email ${normalizedEmail} already exists.`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
      status: 'active',
      phone: phone ? phone.trim() : '',
    });

    await recordAuditLog(
      req.user,
      'ADMIN_CREATED',
      'User',
      newAdmin._id,
      `Created new administrator: ${name.trim()} (${normalizedEmail})`,
      req
    );

    const sanitized = newAdmin.toJSON();
    delete sanitized.passwordHash;

    return res.status(201).json({
      success: true,
      message: 'New administrator created successfully.',
      admin: sanitized,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Toggle administrator status (active / suspended)
const setAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: 'Administrators cannot alter their own active status.' });
    }

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Administrator not found.' });
    }

    if (admin.email === 'admin@dreamlearn.edu' && status === 'suspended') {
      return res.status(400).json({ success: false, message: 'The primary system administrator cannot be suspended.' });
    }

    admin.status = status;
    await admin.save();

    await recordAuditLog(
      req.user,
      'ADMIN_STATUS_CHANGED',
      'User',
      admin._id,
      `Changed administrator ${admin.email} status to ${status}`,
      req
    );

    const sanitized = admin.toJSON();
    delete sanitized.passwordHash;

    return res.json({
      success: true,
      message: `Administrator status set to ${status}.`,
      admin: sanitized,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete administrator
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: 'Administrators cannot delete their own account.' });
    }

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Administrator not found.' });
    }

    if (admin.email === 'admin@dreamlearn.edu') {
      return res.status(400).json({ success: false, message: 'The primary system administrator account cannot be deleted.' });
    }

    await User.findByIdAndDelete(id);

    await recordAuditLog(
      req.user,
      'ADMIN_DELETED',
      'User',
      id,
      `Deleted administrator account: ${admin.email}`,
      req
    );

    return res.json({
      success: true,
      message: 'Administrator removed successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdmins,
  createAdmin,
  setAdminStatus,
  deleteAdmin,
};
