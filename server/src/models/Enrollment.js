const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completedLessonsCount: {
    type: Number,
    default: 0,
  },
  totalLessonsCount: {
    type: Number,
    default: 0,
  },
  lastAccessedLessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active',
  },
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
