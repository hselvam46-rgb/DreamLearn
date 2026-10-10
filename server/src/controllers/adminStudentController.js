const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const CodeSubmission = require('../models/CodeSubmission');
const AuditLog = require('../models/AuditLog');
const { recordAuditLog } = require('../middleware/auth');

// Admin: Get all students with search and filters
const getStudents = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = { role: 'student' };

    if (status && status !== 'All' && status !== 'undefined' && status !== 'null') {
      query.status = status;
    }

    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { college: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      students.map(async (st) => {
        const enrollmentsCount = await Enrollment.countDocuments({ studentId: st._id });
        const attemptsCount = await AssessmentAttempt.countDocuments({ studentId: st._id, status: 'completed' });
        const solvedCount = await CodeSubmission.countDocuments({ studentId: st._id, status: 'Accepted' });
        return {
          ...st.toJSON(),
          enrollmentsCount,
          attemptsCount,
          solvedCount,
        };
      })
    );

    return res.json({
      success: true,
      count: enriched.length,
      students: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get student full profile with enrollments and assessment results
const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const enrollments = await Enrollment.find({ studentId: id }).populate('courseId');
    const attempts = await AssessmentAttempt.find({ studentId: id }).populate('assessmentId').sort({ submittedAt: -1 });
    const submissions = await CodeSubmission.find({ studentId: id }).populate('problemId').sort({ submittedAt: -1 }).limit(20);

    return res.json({
      success: true,
      student: student.toJSON(),
      enrollments,
      attempts,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update student account status (Activate / Suspend)
const setStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    student.status = status;
    await student.save();

    await recordAuditLog(
      req.user,
      'UPDATE_STUDENT_STATUS',
      'User',
      student._id,
      `Changed student (${student.email}) status to ${status}`,
      req
    );

    return res.json({
      success: true,
      message: `Student account ${status === 'active' ? 'activated' : 'suspended'} successfully.`,
      student: student.toJSON(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get Audit Logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    return res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getStudents,
  getStudentDetails,
  setStudentStatus,
  getAuditLogs,
};
