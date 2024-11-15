const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeAdVehicle",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dutyHours: {
      type: Number, // Assuming dutyHours is a numeric value representing the number of hours
      default: 0,
    },
    totalDaysWorked: {
      type: Number, // Assuming dutyHours is a numeric value representing the number of hours
      default: 0,
    },

    overtime: {
      type: Number, // Assuming overtime is a numeric value representing the number of overtime hours
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
