const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  category: {
    type: String,
    required: true,
    default: 'Arrays',
  },
  description: {
    type: String,
    required: true,
  },
  examples: [{
    input: String,
    output: String,
    explanation: String,
  }],
  constraints: [{
    type: String,
  }],
  starterCode: {
    python: { type: String, default: '# Write your Python solution here\ndef solve():\n    pass\n' },
    cpp: { type: String, default: '// C++ Solution\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n' },
    c: { type: String, default: '// C Solution\n#include <stdio.h>\n\nint main() {\n    return 0;\n}\n' },
    java: { type: String, default: '// Java Solution\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}\n' },
    javascript: { type: String, default: '// JavaScript Solution\nfunction solve() {\n}\n' },
  },
  testCases: [{
    input: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    isHidden: { type: Boolean, default: false },
  }],
  acceptanceRate: {
    type: Number,
    default: 75.5,
  },
  submissionsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
