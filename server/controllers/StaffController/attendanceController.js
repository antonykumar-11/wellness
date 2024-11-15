const Attendance = require("../../models/staffmodel/attendanceSchema");
const Employee = require("../../models/staffmodel/employees");
const moment = require("moment");
// Create a new attendance record

const mongoose = require("mongoose");

// exports.createAttendance = async (req, res) => {
//   console.log("Request Body:", req.body);
//   try {
//     const { employeeId, status, date, dutyHours, overtime } = req.body;

//     // Validate required fields
//     if (!employeeId || !status || !date) {
//       return res.status(400).json({
//         message: "All fields (employeeId, status, date) are required.",
//       });
//     }

//     // Optional: Validate that dutyHours and overtime are numbers
//     if (isNaN(dutyHours) || isNaN(overtime)) {
//       return res.status(400).json({
//         message: "Duty hours and overtime must be valid numbers.",
//       });
//     }

//     // Check if the employee exists
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee with this ID does not exist.",
//       });
//     }

//     // Check for existing attendance record for the same date
//     const existingAttendance = await Attendance.findOne({
//       employeeId,
//       date: {
//         $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // Start of the day
//         $lte: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
//       },
//     });

//     if (existingAttendance) {
//       return res.status(400).json({
//         message:
//           "Attendance record for this employee on this day already exists.",
//       });
//     }

//     // Create a new attendance record
//     const newAttendance = new Attendance({
//       employeeId,
//       status,
//       date,
//       dutyHours,
//       overtime,
//     });

//     const savedAttendance = await newAttendance.save();
//     console.log("Saved Attendance:", savedAttendance);
//     res.status(201).json(savedAttendance);
//   } catch (error) {
//     console.error("Error:", error);
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Duplicate key error.",
//       });
//     }
//     // Handle other errors
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };

// exports.getAllAttendances = async (req, res) => {
//   try {
//     const attendances = await Attendance.find();
//     res.status(200).json(attendances);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.createAttendance = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { employeeId, status, date, dutyHours, overtime, totalDaysWorked } =
      req.body;

    // Validate required fields
    if (!employeeId || !status || !date) {
      return res.status(400).json({
        message: "All fields (employeeId, status, date) are required.",
      });
    }

    // Optional: Validate that dutyHours, overtime, and totalDaysWorked are numbers
    if (isNaN(dutyHours) || isNaN(overtime) || isNaN(totalDaysWorked)) {
      return res.status(400).json({
        message:
          "Duty hours, overtime, and total days worked must be valid numbers.",
      });
    }

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee with this ID does not exist.",
      });
    }

    // Check for existing attendance record for the same date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // Start of the day
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "Attendance record for this employee on this day already exists.",
      });
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      employeeId,
      status,
      date,
      dutyHours: parseFloat(dutyHours),
      overtime: parseFloat(overtime),
      totalDaysWorked: parseFloat(totalDaysWorked),
      owner: req.user._id, // Set the owner as the authenticated user
    });

    // Save the attendance record
    const savedAttendance = await newAttendance.save();
    console.log("Saved Attendance:", savedAttendance);
    res.status(201).json(savedAttendance);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getAllAttendances = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = { owner: req.user.id }; // Add the owner filter based on the authenticated user

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    console.log("filter", filter);

    // Fetch attendances based on the filter (owner and date range)
    const attendances = await Attendance.find(filter);
    res.status(200).json(attendances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single attendance record by ID
// attendanceController.js
// exports.getAttendanceByEmployeeId = async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Extract employeeId from request parameters
//     const { startDate, endDate } = req.query; // Extract startDate and endDate from query parameters

//     console.log("req.params", employeeId);
//     console.log("req.query", { startDate, endDate });

//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }

//     // Build query object
//     let query = { employeeId };

//     if (startDate && endDate) {
//       // Filter by date range if both startDate and endDate are provided
//       query.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     // Find all attendance records for the given employeeId and date range
//     const attendances = await Attendance.find(query).populate("employeeId");

//     if (attendances.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No attendance records found for this employee" });
//     }

//     // Compute totals
//     const totals = attendances.reduce(
//       (acc, record) => {
//         const { status, dutyHours, overtime } = record;

//         if (status === "Present") {
//           acc.totalPresentDays += 1;
//         }

//         if (dutyHours) {
//           acc.totalHoursWorked += dutyHours;
//         }

//         if (overtime) {
//           acc.totalOvertime += overtime;
//         }

//         return acc;
//       },
//       {
//         totalPresentDays: 0,
//         totalHoursWorked: 0,
//         totalOvertime: 0,
//       }
//     );
//     console.log("attendance", totals);
//     res.status(200).json(totals);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getAttendanceByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params; // Extract employeeId from request parameters
    const { startDate, endDate } = req.query; // Extract startDate and endDate from query parameters

    console.log("req.params", employeeId);
    console.log("req.query", { startDate, endDate });

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Build query object with employeeId and owner (authenticated user)
    let query = { employeeId, owner: req.user.id };

    if (startDate && endDate) {
      // Filter by date range if both startDate and endDate are provided
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Find all attendance records for the given employeeId, owner, and date range
    const attendances = await Attendance.find(query).populate("employeeId");

    if (attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this employee" });
    }

    // Compute totals
    const totals = attendances.reduce(
      (acc, record) => {
        const { status, dutyHours, overtime, totalDaysWorked } = record;

        // Count total present days
        if (status === "Present") {
          acc.totalPresentDays += 1;
        }

        // Sum up duty hours and overtime
        if (dutyHours) {
          acc.totalHoursWorked += dutyHours;
        }

        if (overtime) {
          acc.totalOvertime += overtime;
        }

        // Sum total days worked; ensure it's counted appropriately
        if (totalDaysWorked) {
          acc.subtotalDaysWorked += totalDaysWorked;
        }

        return acc;
      },
      {
        totalPresentDays: 0,
        totalHoursWorked: 0,
        totalOvertime: 0,
        subtotalDaysWorked: 0,
      }
    );

    console.log("attendance totals", totals);
    res.status(200).json(totals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single attendance record by ID
// exports.getAttendanceByEmployeeId = async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Extract employeeId from request parameters
//     const { month, year } = req.query; // Extract month and year from query parameters

//     console.log("req.params", employeeId);
//     console.log("req.query month:", month, "year:", year); // Log query params

//     if (!employeeId || !month || !year) {
//       return res
//         .status(400)
//         .json({ message: "Employee ID, month, and year are required" });
//     }

//     // Build a date range for the given month and year
//     const startDate = new Date(`${year}-${month}-01`);
//     const endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + 1); // Move to the next month

//     // Create the query object
//     const query = { employeeId, date: { $gte: startDate, $lt: endDate } };

//     // Find attendance records based on employeeId and the date range
//     const attendances = await Attendance.find(query).populate("employeeId");

//     if (attendances.length === 0) {
//       return res.status(200).json({
//         totalPresentDays: 0,
//         totalHoursWorked: 0,
//         totalOvertime: 0,
//       });
//     }

//     // Compute totals
//     const totals = attendances.reduce(
//       (acc, record) => {
//         const { status, dutyHours, overtime } = record;

//         if (status === "Present") {
//           acc.totalPresentDays += 1;
//         }

//         if (dutyHours) {
//           acc.totalHoursWorked += dutyHours;
//         }

//         if (overtime) {
//           acc.totalOvertime += overtime;
//         }

//         return acc;
//       },
//       {
//         totalPresentDays: 0,
//         totalHoursWorked: 0,
//         totalOvertime: 0,
//       }
//     );

//     console.log("attendance totals", totals);
//     res.status(200).json(totals);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Update an attendance record by IDmon
// exports.updateAttendance = async (req, res) => {
//   try {
//     const updatedAttendance = await Attendance.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedAttendance)
//       return res.status(404).json({ message: "Attendance not found" });
//     res.status(200).json(updatedAttendance);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
exports.updateAttendance = async (req, res) => {
  try {
    // First, find the attendance record by ID and populate the employee details
    const attendance = await Attendance.findById(req.params.id).populate(
      "employeeId"
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Check if the owner of the employee matches the authenticated user
    if (attendance.employeeId.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this attendance" });
    }

    // Proceed with updating the attendance if the owner matches
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an attendance record by ID and date

// exports.deleteAttendance = async (req, res) => {
//   console.log("Request params:", req.params); // Log the request params to debug
//   console.log("Request body:", req.body); // Log the request body to debug

//   try {
//     const id = req.params.id; // Get the id from request params
//     const { date } = req.body; // Get the date from request body

//     // Ensure you have both id and date for deletion
//     if (!id || !date) {
//       return res
//         .status(400)
//         .json({ message: "EmployeeId and date are required." });
//     }

//     // Find and delete the attendance record
//     const result = await Attendance.findOneAndDelete({
//       employeeId: id, // Use employeeId field to match the record
//       date: new Date(date), // Convert the date to a Date object if needed
//     });

//     if (!result) {
//       return res.status(404).json({ message: "Attendance record not found." });
//     }

//     res
//       .status(200)
//       .json({ message: "Attendance record deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Server error: " + error.message });
//   }
// };

exports.deleteAttendance = async (req, res) => {
  console.log("Request params:", req.params); // Log the request params to debug
  console.log("Request body:", req.body); // Log the request body to debug

  try {
    const id = req.params.id; // Get the employeeId from request params
    const { date } = req.body; // Get the date from request body

    // Ensure both employeeId and date are provided
    if (!id || !date) {
      return res
        .status(400)
        .json({ message: "EmployeeId and date are required." });
    }

    // Find the attendance record by employeeId and date
    const attendance = await Attendance.findOne({
      employeeId: id, // Use employeeId field to match the record
      date: new Date(date), // Convert the date to a Date object if needed
    }).populate("employeeId"); // Populate employee details including owner

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    // Check if the authenticated user is the owner of the employee
    if (attendance.employeeId.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this attendance record.",
      });
    }

    // Proceed to delete the attendance record
    await attendance.remove(); // Remove the attendance document

    res
      .status(200)
      .json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// exports.createAttendanceFor = async (req, res) => {
//   console.log("Request Body:", req.body);
//   try {
//     const { employeeId, status, date, dutyHours, overtime } = req.body;

//     // Validate required fields
//     if (!employeeId || !status || !date) {
//       return res.status(400).json({
//         message: "All fields (employeeId, status, date) are required.",
//       });
//     }

//     // Optional: Validate that dutyHours and overtime are numbers
//     if (isNaN(dutyHours) || isNaN(overtime)) {
//       return res.status(400).json({
//         message: "Duty hours and overtime must be valid numbers.",
//       });
//     }

//     // Check if the employee exists
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee with this ID does not exist.",
//       });
//     }

//     // Check for existing attendance record for the same date
//     const existingAttendance = await Attendance.findOne({
//       employeeId,
//       date: {
//         $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // Start of the day
//         $lte: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
//       },
//     });

//     if (existingAttendance) {
//       // If the record exists and the status is 'Absent', delete it
//       if (status === "Absent") {
//         await Attendance.deleteOne({
//           _id: existingAttendance._id,
//         });
//         return res.status(200).json({
//           message: "Attendance record removed successfully (marked as absent).",
//         });
//       } else {
//         return res.status(400).json({
//           message:
//             "Attendance record already exists for this employee on this day.",
//         });
//       }
//     } else {
//       // Create a new attendance record if it does not exist
//       const newAttendance = new Attendance({
//         employeeId,
//         status,
//         date: new Date(date), // Ensure the date is in Date format
//         dutyHours: parseFloat(dutyHours), // Ensure dutyHours is a number
//         overtime: parseFloat(overtime), // Ensure overtime is a number
//       });

//       // Save the new attendance record to the database
//       await newAttendance.save();

//       res.status(201).json({
//         message: "Attendance record created successfully.",
//         attendance: newAttendance,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createAttendanceFor = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { employeeId, status, date, dutyHours, overtime } = req.body;

    // Validate required fields
    if (!employeeId || !status || !date) {
      return res.status(400).json({
        message: "All fields (employeeId, status, date) are required.",
      });
    }

    // Optional: Validate that dutyHours and overtime are numbers
    if (isNaN(dutyHours) || isNaN(overtime)) {
      return res.status(400).json({
        message: "Duty hours and overtime must be valid numbers.",
      });
    }

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee with this ID does not exist.",
      });
    }

    // Check for existing attendance record for the same date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)), // Start of the day
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999)), // End of the day
      },
    });

    if (existingAttendance) {
      // If the record exists and the status is 'Absent', delete it
      if (status === "Absent") {
        await Attendance.deleteOne({
          _id: existingAttendance._id,
        });
        return res.status(200).json({
          message: "Attendance record removed successfully (marked as absent).",
        });
      } else {
        return res.status(400).json({
          message:
            "Attendance record already exists for this employee on this day.",
        });
      }
    }

    // Create a new attendance record with the `owner` field
    const newAttendance = new Attendance({
      employeeId,
      status,
      date: new Date(date),
      dutyHours: parseFloat(dutyHours),
      overtime: parseFloat(overtime),
      owner: req.user._id, // Set owner as the authenticated user
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance record created successfully.",
      attendance: newAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
