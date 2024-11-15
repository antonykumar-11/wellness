const Staff = require("../../models/staffmodel/employees");

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

// Create a new employee
exports.createEmployee = async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  let avatar;
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : process.env.BACKEND_URL;

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  try {
    // Convert dot notation to nested object
    const body = parseDotNotationToNestedObject(req.body);

    // Prepare employee registration object
    const employeeRegistration = {
      registrationType: body.registrationType,
      name: body.name, // Ensure you're correctly accessing the name
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
      },
      incomeTaxPAN: body.incomeTaxPAN,
      underEmployee: body.underEmployee,
      aadhaarCard: body.aadhaarCard,
      pfAccountNumber: body.pfAccountNumber,
      prAccountNumber: body.prAccountNumber,
      under: body.under,
      esiNumber: body.esiNumber,
      dateOfHire: body.dateOfHire ? new Date(body.dateOfHire) : null,
      avatar: body.avatar, // Ensure you're handling the binary data correctly
      owner: req.user.id,
    };

    if (avatar) {
      employeeRegistration.avatar = avatar;
    }

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
    console.log("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err,
    });
  }
};

// Update an employee by ID
exports.updateEmployeeById = async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  let avatar;
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : process.env.BACKEND_URL;

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  try {
    const { id } = req.params; // Use req.params.id to get the employee ID
    const body = parseDotNotationToNestedObject(req.body);

    const employeeRegistration = {
      ...body.employeeRegistration,
      dateOfBirth: body.employeeRegistration?.dateOfBirth
        ? new Date(body.employeeRegistration.dateOfBirth)
        : null,
      dateOfHire: body.employeeRegistration?.dateOfHire
        ? new Date(body.employeeRegistration.dateOfHire)
        : null,
      registrationType:
        body.employeeRegistration?.registrationType || "employee",
      under: body.employeeRegistration?.under || null,
    };

    if (avatar) {
      employeeRegistration.avatar = avatar;
    }

    const employee = await Staff.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // Ensure the user is updating their own employee
      employeeRegistration,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Employee Updated Successfully",
      success: true,
      employee,
      avatar,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err,
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
    }); // Filter by owner
    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

// Delete an employee by ID
exports.deleteEmployeeById = async (req, res) => {
  try {
    const employee = await Staff.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    }); // Filter by owner
    if (!employee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    res
      .status(200)
      .json({ message: "Employee Deleted Successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};
