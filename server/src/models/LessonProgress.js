const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
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
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  },
  isCompleted: {
    type: Boolean,
    default: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

lessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
