const { Module, Lesson } = require('../models/Curriculum');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const { recordAuditLog } = require('../middleware/auth');

// Get curriculum for a course (Admin & Student viewer)
const getCourseCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await Module.find({ courseId }).sort({ order: 1 });

    const curriculum = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 });
        return {
          ...mod.toObject(),
          lessons,
        };
      })
    );

    return res.json({
      success: true,
      curriculum,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Add Module
const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;

    const count = await Module.countDocuments({ courseId });
    const moduleOrder = order !== undefined ? order : count + 1;

    const newModule = await Module.create({
      courseId,
      title: title || `Module ${moduleOrder}`,
      description: description || '',
      order: moduleOrder,
      isPublished: true,
    });

    await recordAuditLog(req.user, 'CREATE_MODULE', 'Module', newModule._id, `Added module: ${newModule.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Module added successfully.',
      module: newModule,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Module
const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const mod = await Module.findById(moduleId);

    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    Object.assign(mod, req.body);
    await mod.save();

    return res.json({
      success: true,
      message: 'Module updated successfully.',
      module: mod,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Module
const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const mod = await Module.findById(moduleId);

    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    await Lesson.deleteMany({ moduleId });
    await Module.findByIdAndDelete(moduleId);

    return res.json({
      success: true,
      message: 'Module and its lessons removed.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Add Lesson to Module
const createLesson = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const {
      title,
      description,
      contentType,
      contentText,
      videoUrl,
      codeSnippet,
      codeLanguage,
      durationMinutes,
      isPreview,
      order,
    } = req.body;

    const count = await Lesson.countDocuments({ moduleId });
    const lessonOrder = order !== undefined ? order : count + 1;

    const lesson = await Lesson.create({
      courseId,
      moduleId,
      title: title || `Lesson ${lessonOrder}`,
      description: description || '',
      contentType: contentType || 'article',
      contentText: contentText || '',
      videoUrl: videoUrl || '',
      codeSnippet: codeSnippet || '',
      codeLanguage: codeLanguage || 'javascript',
      durationMinutes: durationMinutes || 15,
      isPreview: isPreview || false,
      order: lessonOrder,
      isPublished: true,
    });

    await recordAuditLog(req.user, 'CREATE_LESSON', 'Lesson', lesson._id, `Added lesson: ${lesson.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Lesson added successfully.',
      lesson,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Lesson
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    Object.assign(lesson, req.body);
    await lesson.save();

    return res.json({
      success: true,
      message: 'Lesson updated successfully.',
      lesson,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Lesson
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    await Lesson.findByIdAndDelete(lessonId);

    return res.json({
      success: true,
      message: 'Lesson deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Get single lesson content (checks enrollment or isPreview)
const getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    // Free preview accessible to anyone
    if (lesson.isPreview) {
      return res.json({ success: true, lesson, isCompleted: false });
    }

    // Must be logged in student enrolled in this course or admin
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to access this lesson.',
      });
    }

    if (req.user.role === 'admin') {
      return res.json({ success: true, lesson, isCompleted: false });
    }

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: lesson.courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must enroll in this course to access this lesson.',
      });
    }

    // Check if completed
    const progress = await LessonProgress.findOne({
      studentId: req.user._id,
      lessonId: lesson._id,
    });

    return res.json({
      success: true,
      lesson,
      isCompleted: !!progress,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCourseCurriculum,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonContent,
};
