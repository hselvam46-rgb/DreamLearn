const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  contentType: {
    type: String,
    enum: ['video', 'article', 'code', 'quiz', 'pdf'],
    default: 'article',
  },
  contentText: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  codeSnippet: {
    type: String,
    default: '',
  },
  codeLanguage: {
    type: String,
    default: 'javascript',
  },
  durationMinutes: {
    type: Number,
    default: 15,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  attachments: [{
    title: String,
    url: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Module = mongoose.model('Module', moduleSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = { Module, Lesson };
