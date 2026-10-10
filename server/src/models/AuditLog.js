const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    required: true, // 'Course', 'Lesson', 'Assessment', 'Student', 'Problem'
  },
  targetId: {
    type: String,
    default: '',
  },
  details: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
