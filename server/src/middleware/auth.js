const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const JWT_SECRET = process.env.JWT_SECRET || 'dreamlearn_jwt_secret_super_secure_key_2026';

// Protect routes: verify JWT and attach user
const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

// Strict Role Guard
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${roles.join(', ')}] privileges.`,
      });
    }
    next();
  };
};

// Convenience role guards
const requireAdmin = requireRole('admin');
const requireStudent = requireRole('student');

// Audit logger helper for admin actions
const recordAuditLog = async (adminUser, action, targetType, targetId, details, req) => {
  try {
    await AuditLog.create({
      adminId: adminUser._id,
      adminEmail: adminUser.email,
      action,
      targetType,
      targetId: String(targetId || ''),
      details: String(details || ''),
      ipAddress: req?.ip || req?.connection?.remoteAddress || '127.0.0.1',
    });
  } catch (err) {
    console.error('Audit log creation failed:', err.message);
  }
};

module.exports = {
  protect,
  requireRole,
  requireAdmin,
  requireStudent,
  recordAuditLog,
  JWT_SECRET,
};
