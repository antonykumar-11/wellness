// controllers/StaffController/employeeHead.js
const Employee = require("../../models/staffmodel/EmployeeGroup");

const mongoose = require("mongoose");

exports.createEmployeeGroup = async (req, res) => {
  try {
    const { name, date } = req.body;

    // Set the base URL dynamically
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.file) {
      avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    // Create a new employee group
    const employeeGroup = new Employee({
      name,
      date,
      owner: req.user.id, // Set owner to the authenticated user's ID
      avatar, // Add avatar to the employee group
    });

    // Save the employee group to the database
    await employeeGroup.save();
    res.status(201).json(employeeGroup);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (due to compound index on name and owner)
      return res
        .status(400)
        .json({ message: "Employee group name must be unique per user." });
    }
    res.status(400).json({ message: err.message });
  }
};

// Get all employees for the authenticated user
exports.getAllEmployeeGroups = async (req, res) => {
  try {
    const employees = await Employee.find({ owner: req.user.id }); // Only fetch employees for the authenticated user
    res.status(200).json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single employee by ID
exports.getEmployeeGroupById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      owner: req.user.id, // Check if the employee belongs to the user
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an employee by ID
exports.updateEmployeeGroup = async (req, res) => {
  try {
    const { name, date } = req.body;
    console.log("coming namereq.body", req.body);
    // Set the base URL dynamically
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.file) {
      avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, // Ensure the user owns the employee record
      { name, date, avatar }, // Include avatar update if present
      { new: true }
    );
    console.log("updatedemployee", employee);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an employee by ID
exports.deleteEmployeeGroup = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id, // Ensure the user owns the employee record
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
