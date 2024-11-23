const Receipt = require("../models/recieptVoucherSchema");
exports.getAllVoucherNumbers = async (req, res) => {
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
// Create a new Receipt Voucher
exports.createReceiptVoucher = async (req, res) => {
  console.log("receipt", req.body);
  try {
    const newReceiptVoucher = new Receipt({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savedReceiptVoucher = await newReceiptVoucher.save();
    res.status(201).json(savedReceiptVoucher);
    console.log("receipt", savedReceiptVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Receipt Vouchers for the logged-in user
exports.getAllReceiptVouchers = async (req, res) => {
  try {
    const receiptVouchers = await Receipt.find({ owner: req.user._id }); // Fetch only the user's vouchers
    res.status(200).json(receiptVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Receipt Voucher by ID
exports.getReceiptVoucherById = async (req, res) => {
  try {
    const receiptVoucher = await Receipt.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!receiptVoucher) {
      return res
        .status(404)
        .json({ message: "Receipt Voucher not found or not authorized" });
    }
    res.status(200).json(receiptVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Receipt Voucher by ID
exports.updateReceiptVoucher = async (req, res) => {
  try {
    const updatedReceiptVoucher = await Receipt.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the owner matches
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReceiptVoucher) {
      return res
        .status(404)
        .json({ message: "Receipt Voucher not found or not authorized" });
    }
    res.status(200).json(updatedReceiptVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Receipt Voucher by ID
exports.deleteReceiptVoucher = async (req, res) => {
  try {
    const deletedReceiptVoucher = await Receipt.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedReceiptVoucher) {
      return res
        .status(404)
        .json({ message: "Receipt Voucher not found or not authorized" });
    }
    res.status(200).json({ message: "Receipt Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
