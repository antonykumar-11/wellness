const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/StaffController/attendanceController");

const { isAuthenticatedUser } = require("../../middlewares/authenticate");

// Create a new attendance record (authenticated)
router.post("/", isAuthenticatedUser, attendanceController.createAttendance);

// Get all attendance records (authenticated)
router.get("/", isAuthenticatedUser, attendanceController.getAllAttendances);

// Get a single attendance record by employee ID (authenticated)
router.get(
  "/:employeeId",
  isAuthenticatedUser,
  attendanceController.getAttendanceByEmployeeId
);

// Update an attendance record by ID (authenticated)
router.put("/:id", isAuthenticatedUser, attendanceController.updateAttendance);

// Delete an attendance record by ID and date (authenticated)
router.delete(
  "/:id",
  isAuthenticatedUser,
  attendanceController.deleteAttendance
);

module.exports = router;
