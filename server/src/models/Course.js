const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
  shortDescription: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  pdfNotes: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    fileSize: { type: String, default: 'PDF' },
  }],
  syllabusUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    default: 'Programming',
  },
  topic: {
    type: String,
    default: 'General',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: String,
    default: '8 weeks',
  },
  learningOutcomes: [{
    type: String,
  }],
  prerequisites: [{
    type: String,
  }],
  instructor: {
    name: { type: String, default: 'DreamLearn Faculty' },
    title: { type: String, default: 'Lead Technical Educator' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: 'Industry veteran with 10+ years coaching campus recruits.' },
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Unpublished', 'Archived'],
    default: 'Published',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  ratingCount: {
    type: Number,
    default: 120,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
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

courseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (next) next();
});

module.exports = mongoose.model('Course', courseSchema);
