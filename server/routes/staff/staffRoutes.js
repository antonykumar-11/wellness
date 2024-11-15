const express = require("express");
const employeeController = require("../../controllers/StaffController/staffController");
const { isAuthenticatedUser } = require("../../middlewares/authenticate");
const multer = require("multer");
const path = require("path");

const router = new express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Route to create a new employee with avatar
router.post(
  "/employees",
  isAuthenticatedUser,
  upload.single("avatar"),
  employeeController.createEmployee
);

// Update an employee by ID with avatar
router.patch(
  "/employees/:id",
  isAuthenticatedUser,
  upload.single("avatar"),
  employeeController.updateEmployeeById
);

// Get all employees
router.get(
  "/employees",
  isAuthenticatedUser,
  employeeController.getAllEmployees
);

// Get an employee by ID
router.get(
  "/employees/:id",
  isAuthenticatedUser,
  employeeController.getEmployeeById
);

// Delete an employee by ID
router.delete(
  "/employees/:id",
  isAuthenticatedUser,
  employeeController.deleteEmployeeById
);

// Export the router
module.exports = router;
