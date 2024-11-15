// const PayMaster = require("../../models/staffmodel/payMaster"); // Ensure you have this schema defined
// const mongoose = require("mongoose");
// // Create a new PayMaster Voucher
// exports.createPayMasterVoucher = async (req, res) => {
//   console.log("payMaster", req.body);

//   // Convert amount fields to numbers
//   const convertedBody = {
//     ...req.body,
//     debitLedgers: req.body.debitLedgers.map((ledger) => ({
//       ...ledger,
//       amount: parseFloat(ledger.amount), // Ensure amount is a number
//     })),
//     creditLedgers: req.body.creditLedgers.map((ledger) => ({
//       ...ledger,
//       amount: parseFloat(ledger.amount), // Ensure amount is a number
//     })),
//   };

//   try {
//     const newPayMasterVoucher = new PayMaster(convertedBody);
//     const savedPayMasterVoucher = await newPayMasterVoucher.save();
//     res.status(201).json(savedPayMasterVoucher);
//     console.log("payMaster", savedPayMasterVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all PayMaster Vouchers
// exports.getAllPayMasterVouchers = async (req, res) => {
//   try {
//     const payMasterVouchers = await PayMaster.find();
//     res.status(200).json(payMasterVouchers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single PayMaster Voucher by ID
// exports.getPayMasterVoucherById = async (req, res) => {
//   try {
//     const payMasterVoucher = await PayMaster.findById(req.params.id);
//     if (!payMasterVoucher) {
//       return res.status(404).json({ message: "PayMaster Voucher not found" });
//     }
//     res.status(200).json(payMasterVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a PayMaster Voucher by ID
// exports.updatePayMasterVoucher = async (req, res) => {
//   try {
//     const updatedPayMasterVoucher = await PayMaster.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedPayMasterVoucher) {
//       return res.status(404).json({ message: "PayMaster Voucher not found" });
//     }
//     res.status(200).json(updatedPayMasterVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a PayMaster Voucher by ID
// exports.deletePayMasterVoucher = async (req, res) => {
//   try {
//     const deletedPayMasterVoucher = await PayMaster.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedPayMasterVoucher) {
//       return res.status(404).json({ message: "PayMaster Voucher not found" });
//     }
//     res.status(200).json({ message: "PayMaster Voucher deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const PayMaster = require("../../models/staffmodel/payMaster"); // Ensure you have this schema defined
const mongoose = require("mongoose");

// Create a new PayMaster Voucher
exports.createPayMasterVoucher = async (req, res) => {
  console.log("payMaster", req.body);
  console.log("payMaster", req.user);

  // Convert amount fields to numbers
  const convertedBody = {
    ...req.body,
    debitLedgers: req.body.debitLedgers.map((ledger) => ({
      ...ledger,
      amount: parseFloat(ledger.amount), // Ensure amount is a number
    })),
    creditLedgers: req.body.creditLedgers.map((ledger) => ({
      ...ledger,
      amount: parseFloat(ledger.amount), // Ensure amount is a number
    })),
  };

  try {
    // Create new PayMaster voucher with owner (authenticated user)
    const newPayMasterVoucher = new PayMaster({
      ...convertedBody,
      owner: req.user._id, // Assuming req.user is set by your authentication middleware
    });
    const savedPayMasterVoucher = await newPayMasterVoucher.save();
    res.status(201).json(savedPayMasterVoucher);
    console.log("payMaster", savedPayMasterVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all PayMaster Vouchers
exports.getAllPayMasterVouchers = async (req, res) => {
  try {
    // Fetch only the vouchers owned by the authenticated user
    const payMasterVouchers = await PayMaster.find({ owner: req.user._id });
    res.status(200).json(payMasterVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single PayMaster Voucher by ID
exports.getPayMasterVoucherById = async (req, res) => {
  try {
    // Ensure only the owner can access the voucher
    const payMasterVoucher = await PayMaster.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!payMasterVoucher) {
      return res.status(404).json({ message: "PayMaster Voucher not found" });
    }
    res.status(200).json(payMasterVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a PayMaster Voucher by ID
exports.updatePayMasterVoucher = async (req, res) => {
  try {
    // Ensure only the owner can update the voucher
    const updatedPayMasterVoucher = await PayMaster.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayMasterVoucher) {
      return res.status(404).json({ message: "PayMaster Voucher not found" });
    }
    res.status(200).json(updatedPayMasterVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a PayMaster Voucher by ID
exports.deletePayMasterVoucher = async (req, res) => {
  try {
    // Ensure only the owner can delete the voucher
    const deletedPayMasterVoucher = await PayMaster.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedPayMasterVoucher) {
      return res.status(404).json({ message: "PayMaster Voucher not found" });
    }
    res.status(200).json({ message: "PayMaster Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllVoucherNumbers = async (req, res) => {
  console.log("req.body", req.body);
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await PayMaster.find(
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
