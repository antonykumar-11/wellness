const JournalVoucher = require("../models/journalSchema");
exports.getAllJournalVoucher = async (req, res) => {
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await JournalVoucher.find(
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
// Create a new Journal Voucher
exports.createJournalVoucher = async (req, res) => {
  console.log("journal", req.body);
  try {
    const newJournalVoucher = new JournalVoucher({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savedJournalVoucher = await newJournalVoucher.save();
    res.status(201).json(savedJournalVoucher);
    console.log("journal", savedJournalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Journal Vouchers for the logged-in user
exports.getAllJournalVouchers = async (req, res) => {
  try {
    const journalVouchers = await JournalVoucher.find({ owner: req.user._id }); // Fetch only the user's vouchers
    res.status(200).json(journalVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Journal Voucher by ID
exports.getJournalVoucherById = async (req, res) => {
  try {
    const journalVoucher = await JournalVoucher.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!journalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json(journalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Journal Voucher by ID
exports.updateJournalVoucher = async (req, res) => {
  try {
    const updatedJournalVoucher = await JournalVoucher.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the owner matches
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJournalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json(updatedJournalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Journal Voucher by ID
exports.deleteJournalVoucher = async (req, res) => {
  try {
    const deletedJournalVoucher = await JournalVoucher.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedJournalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json({ message: "Journal Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
