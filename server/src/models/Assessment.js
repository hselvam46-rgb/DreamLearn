const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['DSA', 'Web Development', 'Aptitude', 'Core CS', 'Placement Mock', 'General'],
    default: 'DSA',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 30,
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70, // percentage e.g. 70%
  },
  attemptsAllowed: {
    type: Number,
    default: 3,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published',
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  totalQuestions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

assessmentSchema.pre('save', function (next) {
  if (this.questions) {
    this.totalQuestions = this.questions.length;
  }
  this.updatedAt = Date.now();
  if (next) next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
