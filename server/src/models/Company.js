const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  logo: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: 'Technology',
  },
  description: {
    type: String,
    required: true,
  },
  hiringRoles: [{
    type: String,
  }],
  salaryRange: {
    type: String,
    default: '₹8 - 25 LPA',
  },
  difficulty: {
    type: String,
    enum: ['Medium', 'Hard', 'Very Hard'],
    default: 'Hard',
  },
  interviewRounds: [{
    roundNumber: Number,
    title: String,
    description: String,
    duration: String,
  }],
  frequentlyAskedTopics: [{
    type: String,
  }],
  preparationResources: [{
    title: String,
    category: { type: String, enum: ['DSA', 'System Design', 'Aptitude', 'HR', 'Behavioral'] },
    link: String,
    description: String,
  }],
  featured: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', companySchema);
