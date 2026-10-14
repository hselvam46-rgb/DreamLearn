const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Course = require('../models/Course');
const { Lesson } = require('../models/Curriculum');
const Certificate = require('../models/Certificate');

// Student: Enroll in course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let enrollment = await Enrollment.findOne({ studentId, courseId });
    if (enrollment) {
      return res.json({
        success: true,
        message: 'Already enrolled in this course.',
        enrollment,
      });
    }

    const totalLessons = await Lesson.countDocuments({ courseId });

    enrollment = await Enrollment.create({
      studentId,
      courseId,
      totalLessonsCount: totalLessons,
      progressPercentage: 0,
      completedLessonsCount: 0,
    });

    course.enrolledCount += 1;
    await course.save();

    return res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${course.title}!`,
      enrollment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Get my enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId')
      .sort({ enrolledAt: -1 });

    const validEnrollments = enrollments.filter((e) => e.courseId != null);

    return res.json({
      success: true,
      enrollments: validEnrollments,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Mark lesson completed or uncompleted
const toggleLessonProgress = async (req, res) => {
  try {
    const { lessonId, isCompleted = true } = req.body;
    const studentId = req.user._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    const courseId = lesson.courseId;

    if (isCompleted) {
      await LessonProgress.findOneAndUpdate(
        { studentId, lessonId },
        { studentId, courseId, lessonId, isCompleted: true, completedAt: new Date() },
        { upsert: true, new: true }
      );
    } else {
      await LessonProgress.findOneAndDelete({ studentId, lessonId });
    }

    // Recalculate enrollment progress
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = await LessonProgress.countDocuments({ studentId, courseId });

    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    let enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        studentId,
        courseId,
        totalLessonsCount: totalLessons,
        completedLessonsCount: completedCount,
        progressPercentage,
        lastAccessedLessonId: lessonId,
      });
    } else {
      enrollment.totalLessonsCount = totalLessons;
      enrollment.completedLessonsCount = completedCount;
      enrollment.progressPercentage = progressPercentage;
      enrollment.lastAccessedLessonId = lessonId;

      if (progressPercentage >= 100 && enrollment.status !== 'completed') {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date();

        // Issue Certificate if not already created
        const existingCert = await Certificate.findOne({ studentId, courseId });
        if (!existingCert) {
          const course = await Course.findById(courseId);
          await Certificate.create({
            certificateNumber: `DL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            studentId,
            studentName: req.user.name,
            courseId,
            courseTitle: course ? course.title : 'DreamLearn Course',
            verificationCode: `VERIFY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            grade: 'Distinction',
          });
        }
      }

      await enrollment.save();
    }

    // Update streak if needed
    const user = req.user;
    const today = new Date().toDateString();
    const lastActive = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate).toDateString() : '';
    if (today !== lastActive) {
      user.streak.current += 1;
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }
      user.streak.lastActiveDate = new Date();
      await user.save();
    }

    return res.json({
      success: true,
      message: isCompleted ? 'Lesson marked as completed!' : 'Lesson marked as incomplete.',
      progressPercentage,
      completedLessonsCount: completedCount,
      totalLessonsCount: totalLessons,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student: Get completed lesson IDs for a course
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const progresses = await LessonProgress.find({ studentId, courseId }).select('lessonId completedAt');
    const completedLessonIds = progresses.map((p) => p.lessonId.toString());

    return res.json({
      success: true,
      completedLessonIds,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  toggleLessonProgress,
  getCourseProgress,
};
