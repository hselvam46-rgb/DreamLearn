const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const CodingProblem = require('../models/CodingProblem');
const CodeSubmission = require('../models/CodeSubmission');

// Admin Analytics Overview
const getAdminAnalyticsOverview = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', status: 'active' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'Published' });
    const draftCourses = await Course.countDocuments({ status: 'Draft' });
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const totalAssessments = await Assessment.countDocuments();
    const totalAttempts = await AssessmentAttempt.countDocuments({ status: 'completed' });
    const passedAttempts = await AssessmentAttempt.countDocuments({ status: 'completed', passed: true });
    const totalProblems = await CodingProblem.countDocuments();
    const totalSubmissions = await CodeSubmission.countDocuments();
    const acceptedSubmissions = await CodeSubmission.countDocuments({ status: 'Accepted' });

    // Recent activity
    const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name email college createdAt status');
    const recentAttempts = await AssessmentAttempt.find({ status: 'completed' })
      .populate('studentId', 'name email')
      .populate('assessmentId', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        completedEnrollments,
        courseCompletionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
        totalAssessments,
        totalAttempts,
        passedAttempts,
        assessmentPassRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        totalProblems,
        totalSubmissions,
        codeAcceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
      },
      recentStudents,
      recentAttempts,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Student Dashboard Summary
const getStudentDashboardSummary = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ studentId }).populate('courseId').sort({ enrolledAt: -1 });
    const validEnrollments = enrollments.filter((e) => e.courseId != null);
    const recentAttempts = await AssessmentAttempt.find({ studentId, status: 'completed' })
      .populate('assessmentId', 'title category durationMinutes')
      .sort({ submittedAt: -1 })
      .limit(3);
    const recentSubmissions = await CodeSubmission.find({ studentId })
      .populate('problemId', 'title difficulty slug')
      .sort({ submittedAt: -1 })
      .limit(5);

    const solvedCount = await CodeSubmission.countDocuments({ studentId, status: 'Accepted' });
    const assessmentsCompleted = await AssessmentAttempt.countDocuments({ studentId, status: 'completed' });

    const userObj = req.user.toJSON();
    if (!userObj.placementReadiness) {
      userObj.placementReadiness = { score: 0, solvedCount: 0, assessmentsCompleted: 0 };
    }
    userObj.placementReadiness.solvedCount = Math.max(userObj.placementReadiness.solvedCount || 0, solvedCount);
    userObj.placementReadiness.assessmentsCompleted = Math.max(userObj.placementReadiness.assessmentsCompleted || 0, assessmentsCompleted);

    return res.json({
      success: true,
      user: userObj,
      enrollments: validEnrollments,
      recentAttempts,
      recentSubmissions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAdminAnalyticsOverview,
  getStudentDashboardSummary,
};
