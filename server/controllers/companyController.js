const Company = require("../models/companyModels"); // Adjust path as necessary

// Create a new company
// controllers/companyController.js
exports.createCompany = async (req, res) => {
  try {
    const company = new Company({
      ...req.body,
      owner: req.user._id, // Assuming req.user contains the authenticated user's data
    });
    await company.save();
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all companies
// controllers/companyController.js
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ owner: req.user._id });
    console.log("companies ", companies);
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found or not authorized" });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a company by ID
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found or not authorized" });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found or not authorized" });
    }
    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
