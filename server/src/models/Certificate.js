const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    default: 'Excellence',
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);
