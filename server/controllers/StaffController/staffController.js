const Staff = require("../../models/staffmodel/employees");
const mongoose = require("mongoose");
const Ledger = require("../../models/ledgerSchema");
// Utility function to parse dot notation to nested object
function parseDotNotationToNestedObject(dotNotationObj) {
  const result = {};
  for (const [key, value] of Object.entries(dotNotationObj)) {
    const keys = key.split(".");
    keys.reduce((acc, part, index) => {
      if (index === keys.length - 1) {
        acc[part] = value;
      } else {
        if (!acc[part]) acc[part] = {};
        return acc[part];
      }
    }, result);
  }
  return result;
}

exports.createEmployee = async (req, res) => {
  console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", req.body);
  let avatar;
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : process.env.BACKEND_URL;

  if (req.file) avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;

  try {
    const body = parseDotNotationToNestedObject(req.body);
    const employeeRegistration = {
      registrationType: body.registrationType,
      name: body.name,
      designation: body.designation,
      address: body.address,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      bloodGroup: body.bloodGroup,
      familyDetails: {
        fatherOrMotherName: body.fatherOrMotherName,
        spouseName: body.spouseName,
      },
      contact: {
        phone: body.contactPhone,
        email: body.contactEmail,
      },
      bankDetails: {
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        branchName: body.branchName,
      },
      incomeTaxPAN: body.incomeTaxPAN,
      underEmployee: body.underEmployee,
      aadhaarCard: body.aadhaarCard,
      pfAccountNumber: body.pfAccountNumber,
      prAccountNumber: body.prAccountNumber,
      under: body.under,
      esiNumber: body.esiNumber,
      dateOfHire: body.dateOfHire ? new Date(body.dateOfHire) : null,
      avatar,
      owner: req.user.id,
      ledgerId: body.ledger,
    };

    const employee = new Staff(employeeRegistration);
    await employee.save();

    res.status(201).json({
      message: "Employee Created",
      success: true,
      employee,
      avatar,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Employee name must be unique per user." });
    }
    res.status(500).json({
      message: "check name or gender",
      success: false,
      error: err,
    });
  }
};

// Update an employee by ID

// Update an employee by ID
exports.updateEmployeeById = async (req, res) => {
  let avatar;
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : process.env.BACKEND_URL;

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  try {
    const { id } = req.params; // Get the employee ID from the request
    const body = req.body; // Get the entire request body
    console.log("body", body);

    // Prepare employee registration object
    const employeeRegistration = {
      registrationType: body.registrationType,
      name: body.name,
      designation: body.designation,
      address: body.address,
      gender: body.gender,
      dateOfBirth: body?.dateOfBirth ? new Date(body.dateOfBirth) : null,
      bloodGroup: body.bloodGroup,
      familyDetails: {
        fatherOrMotherName: body.fatherOrMotherName,
        spouseName: body.spouseName,
      },
      contact: {
        phone: body.contactPhone,
        email: body.contactEmail,
      },
      bankDetails: {
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        branchName: body.branchName,
      },
      incomeTaxPAN: body.incomeTaxPAN,
      underEmployee: body.underEmployee,
      aadhaarCard: body.aadhaarCard,
      userName: body.userName,
      pfAccountNumber: body.pfAccountNumber,
      prAccountNumber: body.prAccountNumber,
      under: body?.under ? mongoose.Types.ObjectId(body.under) : null, // Convert to ObjectId if necessary
      esiNumber: body.esiNumber,
      dateOfHire: body?.dateOfHire ? new Date(body.dateOfHire) : null,
      avatar: avatar || body.avatar, // Avatar field should be handled as well
      owner: req.user.id, // Ensure it's the current user updating the employee
      ledgerId: body.ledgerId, // Include ledgerId in the update
    };

    // Perform the update operation
    const employee = await Staff.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // Ensure user is updating their own employee
      employeeRegistration,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
        success: false,
      });
    }

    // Respond with success
    res.status(200).json({
      message: "Employee Updated Successfully",
      success: true,
      employee,
      avatar, // Return avatar URL if updated
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message, // Send the error message for better debugging
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Staff.find({ owner: req.user.id }); // Filter by owner

    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Staff.findOne({
      _id: req.params.id,
      owner: req.user.id,
    })
      .populate("under") // Populate the 'under' field with the referenced Employeegroup
      .populate("ledgerId"); // Populate the 'ledgerId' field with the referenced Ledger model
    console.log(
      "....................................................................",
      employee
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    res.status(200).json(employee);
    console.log("Employee details with ledger:", employee); // Check the populated data
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete an employee by ID
exports.deleteEmployeeById = async (req, res) => {
  try {
    // Find the employee and populate the ledgerId for additional operations
    const employee = await Staff.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    // If the employee has an associated ledgerId, handle it (e.g., delete or unlink the ledger)
    if (employee.ledgerId) {
      try {
        await Ledger.findByIdAndDelete(employee.ledgerId._id); // Remove the ledger document
        console.log(`Ledger with ID ${employee.ledgerId._id} deleted.`);
      } catch (ledgerError) {
        console.error("Error deleting ledger:", ledgerError);
        return res.status(500).json({
          message: "Failed to delete associated ledger",
          success: false,
          error: ledgerError.message,
        });
      }
    }

    // Delete the employee record
    await Staff.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Employee and associated ledger deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message || error, // Log the error message
    });
  }
};
