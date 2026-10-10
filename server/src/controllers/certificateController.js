const Certificate = require('../models/Certificate');

// Student: Get my certificates
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id }).sort({ issueDate: -1 });
    return res.json({
      success: true,
      certificates,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Public: Verify certificate by certificate number or verification code
const verifyCertificate = async (req, res) => {
  try {
    const { identifier } = req.params;
    const certificate = await Certificate.findOne({
      $or: [
        { certificateNumber: identifier },
        { verificationCode: identifier },
      ],
    }).populate('courseId', 'title description duration');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'No certificate matching this verification code or credential identifier.',
      });
    }

    return res.json({
      success: true,
      valid: true,
      certificate,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getMyCertificates,
  verifyCertificate,
};
