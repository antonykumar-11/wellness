// const PayHead = require("../../models/staffmodel/payheadModel");

// // Create a new PayHead
// exports.createPayHead = async (req, res) => {
//   try {
//     const payHeadData = { ...req.body };

//     // Replace empty strings with null
//     for (let key in payHeadData) {
//       if (payHeadData[key] === "") {
//         payHeadData[key] = null; // Set to null if allowed
//       }
//     }

//     // Validate name field
//     if (!payHeadData.name) {
//       return res.status(400).json({ message: "name is required." });
//     }

//     // Validate 'under' field to ensure it's a valid ObjectId if provided
//     if (
//       payHeadData.under &&
//       !mongoose.Types.ObjectId.isValid(payHeadData.under)
//     ) {
//       return res.status(400).json({ message: "Invalid Ledger ID for 'under'" });
//     }

//     // Check if name is unique
//     const existingPayHead = await PayHead.findOne({
//       name: payHeadData.name,
//     });

//     if (existingPayHead) {
//       return res.status(400).json({
//         message: `PayHead with name "${payHeadData.name}" already exists.`,
//       });
//     }

//     // Create new PayHead
//     const payHead = new PayHead(payHeadData);
//     await payHead.save();
//     console.log("payHead", payHead);
//     res.status(201).json(payHead);
//   } catch (error) {
//     console.error("Error creating PayHead:", error);
//     res
//       .status(400)
//       .json({ message: `Failed to create PayHead: ${error.message}` });
//   }
// };

// // Get all PayHeads
// exports.getAllPayHeads = async (req, res) => {
//   try {
//     const payHeads = await PayHead.find();
//     res.status(200).json(payHeads);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single PayHead by ID
// exports.getPayHeadById = async (req, res) => {
//   try {
//     const payHead = await PayHead.findById(req.params.id);
//     if (payHead) {
//       return res.status(404).json({ message: "PayHead not found" });
//     }
//     res.status(200).json(payHead);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a PayHead
// exports.updatePayHead = async (req, res) => {
//   try {
//     const payHead = await PayHead.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!payHead) {
//       return res.status(404).json({ message: "PayHead not found" });
//     }
//     res.status(200).json(payHead);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a PayHead
// exports.deletePayHead = async (req, res) => {
//   try {
//     const payHead = await PayHead.findByIdAndDelete(req.params.id);
//     if (!payHead) {
//       return res.status(404).json({ message: "PayHead not found" });
//     }
//     res.status(200).json({ message: "PayHead deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const mongoose = require("mongoose");
// const EmployeeAdVehicle = require("../../models/staffmodel/employees");

// function parseDotNotationToNestedObject(dotNotationObj) {
//   const result = {};
//   for (const [key, value] of Object.entries(dotNotationObj)) {
//     const keys = key.split(".");
//     keys.reduce((acc, part, index) => {
//       if (index === keys.length - 1) {
//         acc[part] = value;
//       } else {
//         if (!acc[part]) acc[part] = {};
//         return acc[part];
//       }
//     }, result);
//   }
//   return result;
// }

// exports.createEmployeeOrVehicle = async (req, res) => {
//   console.log("Incoming Request Body:", req.body);
//   console.log("Incoming Request File:", req.file);

//   let avatar;
//   const BASE_URL =
//     process.env.NODE_ENV === "production"
//       ? `${req.protocol}://${req.get("host")}`
//       : process.env.BACKEND_URL;

//   if (req.file) {
//     avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
//   }

//   try {
//     const body = parseDotNotationToNestedObject(req.body);
//     console.log("Parsed Body:", body);

//     if (!body.registrationType) {
//       return res
//         .status(400)
//         .json({ message: "Registration type is required", success: false });
//     }

//     const employeeOrVehicleData = {
//       ...body,
//       dateOfBirth: body?.dateOfBirth ? new Date(body.dateOfBirth) : null,
//       dateOfHire: body?.dateOfHire ? new Date(body.dateOfHire) : null,
//       registrationType: body?.registrationType || "employee",
//       under: body?.under || null,
//       avatar: avatar || body.avatar,
//     };

//     const record = new EmployeeAdVehicle(employeeOrVehicleData);
//     await record.save();

//     res.status(201).json({
//       message: "Record Created",
//       success: true,
//       record,
//       avatar,
//     });
//   } catch (err) {
//     console.log("Error:", err);
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//       error: err,
//     });
//   }
// };
const mongoose = require("mongoose");
const EmployeeAdVehicle = require("../../models/staffmodel/employees");

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

exports.createEmployeeOrVehicle = async (req, res) => {
  console.log("Incoming Request Body:", req.body);
  console.log("Incoming Request File:", req.file);

  let avatar;
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}`
      : process.env.BACKEND_URL;

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  try {
    const body = parseDotNotationToNestedObject(req.body);
    console.log("Parsed Body:", body);

    if (!body.registrationType) {
      return res
        .status(400)
        .json({ message: "Registration type is required", success: false });
    }

    // Ensure the owner field is set correctly to the authenticated user's id
    const employeeOrVehicleData = {
      ...body,
      dateOfBirth: body?.dateOfBirth ? new Date(body.dateOfBirth) : null,
      dateOfHire: body?.dateOfHire ? new Date(body.dateOfHire) : null,
      registrationType: body?.registrationType || "employee",
      under: body?.under || null,
      avatar: avatar || body.avatar,
      owner: req.user.id, // This line ensures the record is associated with the authenticated user
    };

    const record = new EmployeeAdVehicle(employeeOrVehicleData);
    await record.save();

    res.status(201).json({
      message: "Record Created",
      success: true,
      record,
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
