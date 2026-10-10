const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem',
    required: true,
    index: true,
  },
  language: {
    type: String,
    enum: ['python', 'cpp', 'c', 'java', 'javascript'],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    required: true,
  },
  passedTestCases: {
    type: Number,
    default: 0,
  },
  totalTestCases: {
    type: Number,
    default: 0,
  },
  runtimeMs: {
    type: Number,
    default: 0,
  },
  memoryKb: {
    type: Number,
    default: 0,
  },
  outputLog: {
    type: String,
    default: '',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
