const Course = require('../models/Course');
const { Module, Lesson } = require('../models/Curriculum');
const Enrollment = require('../models/Enrollment');
const { recordAuditLog } = require('../middleware/auth');

// Public & Student: Get published courses
const getPublishedCourses = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = { status: 'Published' };

    if (category && category !== 'All' && category !== 'undefined' && category !== 'null') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined' && difficulty !== 'null') {
      query.difficulty = difficulty;
    }

    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { topic: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ featured: -1, createdAt: -1 });

    // Attach modules and lessons count to each course
    const enhancedCourses = await Promise.all(
      courses.map(async (course) => {
        const modulesCount = await Module.countDocuments({ courseId: course._id });
        const lessonsCount = await Lesson.countDocuments({ courseId: course._id });
        return {
          ...course.toObject(),
          modulesCount,
          lessonsCount,
        };
      })
    );

    return res.json({
      success: true,
      count: enhancedCourses.length,
      courses: enhancedCourses,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get single course by ID or Slug
const getCourseDetails = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let course = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(idOrSlug);
    } else {
      course = await Course.findOne({ slug: idOrSlug });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Only admins can view non-published courses directly unless user is enrolled
    if (course.status !== 'Published') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'This course is currently in draft or unpublished status.',
        });
      }
    }

    // Fetch curriculum
    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 });
    const curriculum = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ moduleId: mod._id })
          .sort({ order: 1 })
          .select('title description order contentType durationMinutes isPreview isPublished');
        return {
          ...mod.toObject(),
          lessons,
        };
      })
    );

    // Check enrollment if student is logged in
    let isEnrolled = false;
    let studentProgress = null;
    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId: course._id });
      if (enrollment) {
        isEnrolled = true;
        studentProgress = enrollment;
      }
    }

    return res.json({
      success: true,
      course,
      curriculum,
      isEnrolled,
      studentProgress,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all courses (including Drafts, Archived)
const getAdminCourses = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All' && status !== 'undefined' && status !== 'null') {
      query.status = status;
    }

    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ updatedAt: -1 });

    const enhanced = await Promise.all(
      courses.map(async (c) => {
        const modulesCount = await Module.countDocuments({ courseId: c._id });
        const lessonsCount = await Lesson.countDocuments({ courseId: c._id });
        const enrollmentsCount = await Enrollment.countDocuments({ courseId: c._id });
        return {
          ...c.toObject(),
          modulesCount,
          lessonsCount,
          enrollmentsCount,
        };
      })
    );

    return res.json({
      success: true,
      courses: enhanced,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create course (5-step workflow)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      topic,
      difficulty,
      duration,
      thumbnail,
      videoUrl,
      pdfNotes,
      syllabusUrl,
      learningOutcomes,
      prerequisites,
      instructor,
      status,
    } = req.body;

    if (!title || !shortDescription || !description) {
      return res.status(400).json({
        success: false,
        message: 'Course title, short description, and full description are required.',
      });
    }

    // Generate slug
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const course = await Course.create({
      title,
      slug,
      shortDescription,
      description,
      category: category || 'General',
      topic: topic || 'Tech',
      difficulty: difficulty || 'Beginner to Advanced',
      duration: duration || '8 weeks',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: videoUrl || '',
      pdfNotes: Array.isArray(pdfNotes) ? pdfNotes : [],
      syllabusUrl: syllabusUrl || '',
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
      instructor: instructor || { name: 'DreamLearn Faculty', title: 'Senior Technical Instructor' },
      status: status || 'Published',
    });

    await recordAuditLog(req.user, 'CREATE_COURSE', 'Course', course._id, `Created course: ${course.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    Object.assign(course, req.body);
    await course.save();

    await recordAuditLog(req.user, 'UPDATE_COURSE', 'Course', course._id, `Updated course: ${course.title}`, req);

    return res.json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Toggle course status (Draft / Published / Unpublished / Archived)
const setCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    course.status = status;
    await course.save();

    await recordAuditLog(req.user, 'CHANGE_COURSE_STATUS', 'Course', course._id, `Set status to ${status} for: ${course.title}`, req);

    return res.json({
      success: true,
      message: `Course status changed to ${status}.`,
      course,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete course (Requires confirmation)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Cascade delete modules and lessons
    await Module.deleteMany({ courseId: id });
    await Lesson.deleteMany({ courseId: id });
    await Course.findByIdAndDelete(id);

    await recordAuditLog(req.user, 'DELETE_COURSE', 'Course', id, `Deleted course: ${course.title}`, req);

    return res.json({
      success: true,
      message: 'Course and associated curriculum deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPublishedCourses,
  getCourseDetails,
  getAdminCourses,
  createCourse,
  updateCourse,
  setCourseStatus,
  deleteCourse,
};
