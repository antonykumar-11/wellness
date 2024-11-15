const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/StaffController/attendenceEmployee");

// Get attendance records based on query parameters
router.get("/", attendanceController.getAttendanceFor);

module.exports = router;
