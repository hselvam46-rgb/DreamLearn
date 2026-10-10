const Company = require('../models/Company');
const { recordAuditLog } = require('../middleware/auth');

// List companies
const getCompanies = async (req, res) => {
  try {
    const { search, difficulty } = req.query;
    const query = {};

    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined' && difficulty !== 'null') query.difficulty = difficulty;
    if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { industry: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const companies = await Company.find(query).sort({ featured: -1, name: 1 });

    return res.json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get single company by slug
const getCompanyDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    return res.json({
      success: true,
      company,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create Company
const createCompany = async (req, res) => {
  try {
    const { name, industry, description, hiringRoles, salaryRange, difficulty, interviewRounds, frequentlyAskedTopics, preparationResources, logo } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Company name and description are required.' });
    }

    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await Company.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const company = await Company.create({
      name,
      slug,
      logo: logo || '',
      industry: industry || 'Technology',
      description,
      hiringRoles: Array.isArray(hiringRoles) ? hiringRoles : [],
      salaryRange: salaryRange || '₹8 - 25 LPA',
      difficulty: difficulty || 'Hard',
      interviewRounds: Array.isArray(interviewRounds) ? interviewRounds : [],
      frequentlyAskedTopics: Array.isArray(frequentlyAskedTopics) ? frequentlyAskedTopics : [],
      preparationResources: Array.isArray(preparationResources) ? preparationResources : [],
      featured: true,
    });

    await recordAuditLog(req.user, 'CREATE_COMPANY', 'Company', company._id, `Added company: ${name}`, req);

    return res.status(201).json({
      success: true,
      message: 'Company profile added successfully.',
      company,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    Object.assign(company, req.body);
    await company.save();

    await recordAuditLog(req.user, 'UPDATE_COMPANY', 'Company', company._id, `Updated company: ${company.name}`, req);

    return res.json({
      success: true,
      message: 'Company profile updated.',
      company,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete Company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    await Company.findByIdAndDelete(id);
    await recordAuditLog(req.user, 'DELETE_COMPANY', 'Company', id, `Deleted company: ${company.name}`, req);

    return res.json({
      success: true,
      message: 'Company profile deleted.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyDetails,
  createCompany,
  updateCompany,
  deleteCompany,
};
