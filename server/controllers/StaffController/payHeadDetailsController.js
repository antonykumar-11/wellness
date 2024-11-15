const PayHeadDetails = require("../../models/staffmodel/payHeadDetailsSchema");
const moment = require("moment");

const mongoose = require("mongoose");

// // Get a single PayHeadDetails by ID
// exports.getPayHeadDetailsById = async (req, res) => {
//   console.log("req", req.body);
//   try {
//     const { employeeId } = req.params;
//     const payHeadDetails = await PayHeadDetails.find({ employeeId }).exec();
//     if (!payHeadDetails) {
//       return res.status(404).json({ message: "Pay head details not found" });
//     }
//     res.json(payHeadDetails);
//     console.log("payHeadDetails", payHeadDetails);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getPayHeadDetailsById = async (req, res) => {
  console.log("req.query", req.query);
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query; // Get startDate and endDate from query parameters

  try {
    // Create a base filter object for employeeId and owner
    const filter = {
      employeeId,
      owner: req.user.id,
    };

    // If startDate and endDate are provided, add a date range filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const payHeadDetails = await PayHeadDetails.find(filter).exec();

    if (!payHeadDetails || payHeadDetails.length === 0) {
      return res.status(404).json({ message: "Pay head details not found" });
    }

    res.json(payHeadDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.createPayHeadDetails = async (req, res) => {
//   try {
//     const { date, details, employeeId } = req.body;

//     // Validate required fields
//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required." });
//     }
//     if (!details || !details.length) {
//       return res.status(400).json({ message: "Details are required." });
//     }

//     // Create new PayHeadDetails
//     const newPayHeadDetails = new PayHeadDetails({
//       date: date ? new Date(date) : undefined,
//       employeeId,
//       details,
//     });

//     await newPayHeadDetails.save();

//     res.status(201).json(newPayHeadDetails);
//   } catch (error) {
//     console.error("Error creating PayHeadDetails:", error);
//     res.status(400).json({
//       message: `Failed to create PayHeadDetails: ${error.message}`,
//     });
//   }
// };

// exports.updatePayHeadDetails = async (req, res) => {
//   try {
//     const { date, details } = req.body;
//     const { employeeId } = req.params;
//     // Validate required fields
//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required." });
//     }
//     if (!details || !details.length) {
//       return res.status(400).json({ message: "Details are required." });
//     }

//     // Validate date if provided
//     const formattedDate = date ? new Date(date) : undefined;

//     // Find the PayHeadDetails document for the given employeeId
//     const payHeadDetails = await PayHeadDetails.findOne({ employeeId });

//     if (!payHeadDetails) {
//       return res.status(404).json({
//         message: `PayHeadDetails document not found for employeeId ${employeeId}.`,
//       });
//     }

//     // Update each detail in the array
//     details.forEach((detail) => {
//       const detailIndex = payHeadDetails.details.findIndex(
//         (d) => d._id.toString() === detail.payHeadId
//       );
//       if (detailIndex !== -1) {
//         payHeadDetails.details[detailIndex] = {
//           ...payHeadDetails.details[detailIndex].toObject(),
//           ...detail,
//         };
//       } else {
//         throw new Error(`Detail with ID ${detail.payHeadId} not found.`);
//       }
//     });

//     if (formattedDate) {
//       payHeadDetails.date = formattedDate;
//     }

//     await payHeadDetails.save();

//     res.status(200).json({ message: "PayHead details updated successfully." });
//   } catch (error) {
//     console.error("Error updating PayHeadDetails:", error);
//     res.status(400).json({
//       message: `Failed to update PayHeadDetails: ${error.message}`,
//     });
//   }
// };

// Delete PayHeadDetails by employeeId

exports.createPayHeadDetails = async (req, res) => {
  console.log("req.user", req.user);
  try {
    const { date, details, employeeId } = req.body;

    // Validate required fields
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }
    if (!details || !details.length) {
      return res.status(400).json({ message: "Details are required." });
    }

    // Create new PayHeadDetails with owner set to the authenticated user's ID
    const newPayHeadDetails = new PayHeadDetails({
      date: date ? new Date(date) : undefined,
      employeeId,
      details,
      owner: req.user.id, // Set owner to the authenticated user's ID
    });

    await newPayHeadDetails.save();

    res.status(201).json(newPayHeadDetails);
  } catch (error) {
    console.error("Error creating PayHeadDetails:", error);
    res.status(400).json({
      message: `Failed to create PayHeadDetails: ${error.message}`,
    });
  }
};

// exports.deletePayHeadDetailsById = async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     // Find and delete the document based on employeeId
//     const deletedPayHeadDetails = await PayHeadDetails.findOneAndDelete({
//       employeeId,
//     });

//     if (!deletedPayHeadDetails) {
//       return res.status(404).json({ message: "PayHeadDetails not found" });
//     }

//     res.status(200).json({ message: "PayHeadDetails deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting pay head details:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// exports.updatePayHeadDetails = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const { date, details } = req.body;

//     // Validate employeeId
//     if (!employeeId) {
//       return res.status(400).json({ message: "Employee ID is required." });
//     }

//     // Validate date format
//     if (date && !moment(date, moment.ISO_8601, true).isValid()) {
//       return res.status(400).json({ message: "Invalid date format" });
//     }

//     // Validate details array
//     if (!Array.isArray(details) || details.length === 0) {
//       return res.status(400).json({ message: "Details array cannot be empty" });
//     }

//     // Validate and clean details array
//     const cleanedDetails = details.map((detail) => {
//       if (!detail.payHeadName) {
//         throw new Error("PayHeadName is required");
//       }
//       if (
//         !detail.displayNameInPayslip ||
//         detail.displayNameInPayslip.trim() === ""
//       ) {
//         throw new Error(
//           "displayNameInPayslip is required and cannot be null or empty"
//         );
//       }

//       // Ensure rate is a number
//       const rate =
//         typeof detail.rate === "string" ? parseFloat(detail.rate) : detail.rate;
//       const cleanedRate = isNaN(rate) ? 0 : rate;

//       return {
//         payHeadId: detail.payHeadId,
//         payHeadName: detail.payHeadName,
//         rate: cleanedRate,
//         totalDays: detail.totalDays || 0,
//         totalHoursPerDay: detail.totalHoursPerDay || 0,
//         overtime: detail.overtime || 0,
//         payHeadType: detail.payHeadType,
//         calculationType: detail.calculationType,
//         computedOn: detail.computedOn,
//         operations: detail.operations || [],
//         numberOfCalculations: detail.numberOfCalculations || 1,
//         under: detail.under,
//         category: detail.category || null,
//         group: detail.group || null,
//         nature: detail.nature || null,
//         displayNameInPayslip: detail.displayNameInPayslip,
//       };
//     });

//     // Create the updated pay head details object
//     const updatedPayHeadDetails = {
//       date: date ? moment(date).toDate() : undefined, // Only update date if provided
//       details: cleanedDetails,
//     };

//     // Find and update the document
//     const updatedDocument = await PayHeadDetails.findOneAndUpdate(
//       { employeeId },
//       updatedPayHeadDetails,
//       { new: true, runValidators: true }
//     );

//     if (!updatedDocument) {
//       return res.status(404).json({ message: "Pay head details not found" });
//     }

//     res.json({
//       message: "Pay head details updated successfully",
//       data: updatedDocument,
//     });
//   } catch (error) {
//     console.error("Error updating pay head details:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get all PayHeadDetails
// exports.getAllPayHeadDetails = async (req, res) => {
//   try {
//     const payHeads = await PayHeadDetails.find();
//     res.json(payHeads);
//   } catch (error) {
//     console.error("Error fetching pay head details:", error);
//     res.status(500).json({ message: "Error fetching pay head details" });
//   }
// };
exports.deletePayHeadDetailsById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find and delete the document based on employeeId and owner
    const deletedPayHeadDetails = await PayHeadDetails.findOneAndDelete({
      employeeId,
      owner: req.user.id, // Ensure the deletion is only for the owner's records
    });

    if (!deletedPayHeadDetails) {
      return res.status(404).json({ message: "PayHeadDetails not found" });
    }

    res.status(200).json({ message: "PayHeadDetails deleted successfully" });
  } catch (error) {
    console.error("Error deleting pay head details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updatePayHeadDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date, details } = req.body;

    // Validate employeeId
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    // Validate date format
    if (date && !moment(date, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Validate details array
    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ message: "Details array cannot be empty" });
    }

    // Validate and clean details array
    const cleanedDetails = details.map((detail) => {
      if (!detail.payHeadName) {
        throw new Error("PayHeadName is required");
      }
      if (
        !detail.displayNameInPayslip ||
        detail.displayNameInPayslip.trim() === ""
      ) {
        throw new Error(
          "displayNameInPayslip is required and cannot be null or empty"
        );
      }

      // Ensure rate is a number
      const rate =
        typeof detail.rate === "string" ? parseFloat(detail.rate) : detail.rate;
      const cleanedRate = isNaN(rate) ? 0 : rate;

      return {
        payHeadId: detail.payHeadId,
        payHeadName: detail.payHeadName,
        rate: cleanedRate,
        totalDays: detail.totalDays || 0,
        totalHoursPerDay: detail.totalHoursPerDay || 0,
        overtime: detail.overtime || 0,
        totalDaysPerMonth: detail.totalDaysPerMonth || 0,

        payHeadType: detail.payHeadType,
        calculationType: detail.calculationType,
        computedOn: detail.computedOn,
        operations: detail.operations || [],
        numberOfCalculations: detail.numberOfCalculations || 1,
        under: detail.under,
        category: detail.category || null,
        group: detail.group || null,
        nature: detail.nature || null,
        displayNameInPayslip: detail.displayNameInPayslip,
      };
    });

    // Create the updated pay head details object
    const updatedPayHeadDetails = {
      date: date ? moment(date).toDate() : undefined, // Only update date if provided
      details: cleanedDetails,
    };

    // Find and update the document by employeeId and owner
    const updatedDocument = await PayHeadDetails.findOneAndUpdate(
      { employeeId, owner: req.user.id }, // Ensure the update is only for the owner's records
      updatedPayHeadDetails,
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Pay head details not found" });
    }

    res.json({
      message: "Pay head details updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating pay head details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all PayHeadDetails for the authenticated user
// Get all PayHeadDetails for the authenticated user within a date range
exports.getAllPayHeadDetails = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = { owner: req.user.id }; // Add the owner filter based on the authenticated user

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    console.log("filter", filter);

    // Fetch attendances based on the filter (owner and date range)
    const payHeads = await PayHeadDetails.find(filter);
    res.status(200).json(payHeads);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
