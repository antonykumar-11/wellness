// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../../middlewares/authenticate");
const employeeController = require("../../controllers/StaffController/employeeHead");

// Apply authentication middleware to all routes
router.post(
  "/employees",
  isAuthenticatedUser,
  employeeController.createEmployee
);
router.get("/employees", isAuthenticatedUser, employeeController.getEmployees);
router.get(
  "/employees/:id",
  isAuthenticatedUser,
  employeeController.getEmployeeById
);
router.put(
  "/employees/:id",
  isAuthenticatedUser,
  employeeController.updateEmployee
);
router.delete(
  "/employees/:id",
  isAuthenticatedUser,
  employeeController.deleteEmployee
);

module.exports = router;
