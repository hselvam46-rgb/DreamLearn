const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedOptionId: String,
    isCorrect: Boolean,
  }],
  score: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'timed_out'],
    default: 'in_progress',
  },
});

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
