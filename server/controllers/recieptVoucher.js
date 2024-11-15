// const Receipt = require("../models/recieptVoucherSchema");
// const mongoose = require("mongoose");
// // Create a new receipt
// const createReceipt = async (req, res) => {
//   try {
//     const newReceipt = new Receipt(req.body);
//     const savedReceipt = await newReceipt.save();
//     res.status(201).json(savedReceipt);
//     console.log("Create Receipt:", savedReceipt);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateReceipt = async (req, res) => {
//   const { id } = req.params; // Extract the ID from the request parameters

//   try {
//     // Log the entire request body
//     console.log("Request Body:", req.body);

//     // Check if the request body contains the updated receipt
//     const update = req.body.updatedReceipt;

//     if (!update) {
//       // If update is undefined or null, return a 400 Bad Request error
//       return res.status(400).json({ message: "No update data provided" });
//     }

//     // Find the existing receipt by ID and update it with the new data
//     const updatedReceipt = await Receipt.findByIdAndUpdate(
//       id,
//       { $set: update },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure that validation is run on the updated data
//       }
//     );

//     // If no receipt is found with the provided ID, return a 404 error
//     if (!updatedReceipt) {
//       return res.status(404).json({ message: "Receipt not found" });
//     }

//     // Send the updated receipt as a response
//     res.status(200).json(updatedReceipt);
//     console.log("Updated Receipt:", updatedReceipt);
//   } catch (error) {
//     // Handle errors, e.g., validation errors, database errors, etc.
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all receipts
// const getAllReceipts = async (req, res) => {
//   try {
//     const receipts = await Receipt.find()
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     res.status(200).json(receipts); // Sends the fetched receipts as JSON
//     console.log("Get All Receipts:", receipts);
//   } catch (error) {
//     res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
//   }
// };

// // Get a single receipt by ID
// const getReceiptById = async (req, res) => {
//   try {
//     const receipt = await Receipt.findById(req.params.id)
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     if (!receipt) {
//       return res.status(404).json({ message: "Receipt not found" });
//     }

//     res.status(200).json(receipt);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a receipt by ID
// const deleteReceipt = async (req, res) => {
//   try {
//     const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);
//     if (!deletedReceipt)
//       return res.status(404).json({ message: "Receipt not found" });
//     res.status(200).json({ message: "Receipt deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createReceipt,
//   getAllReceipts,
//   getReceiptById,
//   updateReceipt,
//   deleteReceipt,
// };
const Receipt = require("../models/recieptVoucherSchema");
const mongoose = require("mongoose");
const getAllVoucherNumbers = async (req, res) => {
  console.log("req.body", req.body);
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await Receipt.find(
      { owner: req.user._id }, // Filter by the authenticated user's ID
      { voucherNumber: 1, _id: 0 } // Select only the voucherNumber field
    ).sort({ voucherNumber: 1 });

    if (vouchers.length > 0) {
      // If vouchers exist, return them
      return res.status(200).json(vouchers);
    } else {
      // No vouchers exist, return a default value to set the first voucher number as 0
      return res.status(200).json([{ voucherNumber: 0 }]);
    }
  } catch (error) {
    // Handle any errors that might occur during the database operation
    res.status(500).json({ message: error.message });
  }
};
// Create a new receipt
const createReceipt = async (req, res) => {
  console.log("journal", req.body);
  try {
    const newPaymentVoucher = new Receipt({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savednewPaymentVoucher = await newPaymentVoucher.save();
    res.status(201).json(savednewPaymentVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a receipt by ID
const updateReceipt = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Log the entire request body to verify the structure

    // Proceed to update the receipt by ID and owner
    const updatedReceipt = await Receipt.findOneAndUpdate(
      { _id: id, owner: req.user._id }, // Ensure the owner matches
      { $set: req.body }, // Directly use the entire request body for the update
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation is run on the updated data
      }
    );

    if (!updatedReceipt) {
      return res
        .status(404)
        .json({ message: "Receipt not found or not authorized" });
    }

    // Respond with the updated receipt
    res.status(200).json(updatedReceipt);
    console.log("Updated Receipt:", updatedReceipt);
  } catch (error) {
    // Handle any errors during the update process
    res.status(500).json({ message: error.message });
  }
};

// Get all receipts for the logged-in user
const getAllReceipts = async (req, res) => {
  try {
    // Fetch only the user's receipts and populate purchasedTo and purchasedBy with companyName
    const receipts = await Receipt.find({ owner: req.user._id })
      .populate("purchasedTo", "companyName") // Populate only the companyName from purchasedTo
      .populate("purchasedBy", "companyName"); // Populate only the companyName from purchasedBy

    res.status(200).json(receipts); // Sends the fetched receipts as JSON
    console.log("Get All Receipts:", receipts);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
  }
};

// Get a single receipt by ID
const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    })
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    if (!receipt) {
      return res
        .status(404)
        .json({ message: "Receipt not found or not authorized" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a receipt by ID
const deleteReceipt = async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedReceipt) {
      return res
        .status(404)
        .json({ message: "Receipt not found or not authorized" });
    }
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getAllVoucherNumbers,
};
