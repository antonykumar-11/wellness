// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
router.post("/companies", isAuthenticatedUser, companyController.createCompany);
router.get("/companies", isAuthenticatedUser, companyController.getCompanies);
router.get(
  "/companies/:id",
  isAuthenticatedUser,
  companyController.getCompanyById
);
router.put(
  "/companies/:id",
  isAuthenticatedUser,
  companyController.updateCompany
);
router.delete(
  "/companies/:id",
  isAuthenticatedUser,
  companyController.deleteCompany
);

module.exports = router;
