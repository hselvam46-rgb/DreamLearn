const express = require('express');
const router = express.Router();
const { protect, requireStudent } = require('../middleware/auth');
const { getMyCertificates, verifyCertificate } = require('../controllers/certificateController');

router.get('/my-certificates', protect, requireStudent, getMyCertificates);
router.get('/verify/:identifier', verifyCertificate);

module.exports = router;
