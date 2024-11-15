const Attendance = require("../../models/staffmodel/attendanceSchema");
const Employee = require("../../models/staffmodel/employees");

exports.getAttendanceFor = async (req, res) => {
  console.log("Request Query:", req.query);
  try {
    const { employeeId, status, date, startDate, endDate } = req.query;

    // Build query object
    let query = {};

    // Filter by employeeId if provided
    if (employeeId) {
      query.employeeId = employeeId;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by a specific date if provided
    if (date) {
      query.date = {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // Start of the day
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
      };
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch attendance records based on the query object
    const attendanceRecords = await Attendance.find(query);

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
