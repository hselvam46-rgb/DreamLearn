const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    default: 'General',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  type: {
    type: String,
    enum: ['mcq', 'coding', 'range', 'case_based', 'boolean'],
    default: 'mcq',
  },
  options: [{
    id: { type: String, required: true }, // 'a', 'b', 'c', 'd'...
    text: { type: String, required: true },
  }],
  correctAnswerId: {
    type: String, // 'a', 'b'...
  },
  // Custom numeric range evaluation (Coursera style)
  rangeMin: {
    type: Number,
  },
  rangeMax: {
    type: Number,
  },
  exactAnswer: {
    type: Number,
  },
  tolerance: {
    type: Number,
    default: 0,
  },
  // Coding / Code Test specific fields
  allowedLanguages: [{
    type: String,
  }],
  defaultLanguage: {
    type: String,
    default: 'python',
  },
  starterCode: {
    type: String,
    default: '',
  },
  testCases: [{
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  }],
  // Case-based scenario fields
  caseStudyText: {
    type: String,
    default: '',
  },
  scenarioTitle: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);
