const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyDetails } = require('../controllers/companyController');

router.get('/', getCompanies);
router.get('/:slug', getCompanyDetails);

module.exports = router;
