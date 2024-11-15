// controllers/StaffController/employeeHead.js
const Employee = require("../../models/staffmodel/employeeHead");

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, date } = req.body;
    const employee = new Employee({
      name,
      date,
      owner: req.user.id, // Set owner to the authenticated user's ID
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all employees for the authenticated user
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ owner: req.user.id }); // Only fetch employees for the authenticated user
    res.status(200).json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
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
exports.updateEmployee = async (req, res) => {
  try {
    const { name, date } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, // Ensure the user owns the employee record
      { name, date },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
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
