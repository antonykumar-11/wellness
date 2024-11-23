const ContraVoucher = require("../models/contaSchema.js");
const Ledger = require("../models/ledgerSchema");
exports.getAllJournalVoucher = async (req, res) => {
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await ContraVoucher.find(
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
exports.createContraVoucher = async (req, res) => {
  try {
    const newContraVoucher = new ContraVoucher({
      ...req.body,
      owner: req.user._id, // Assign the owner's ID
    });
    const savedContraVoucher = await newContraVoucher.save();
    res.status(201).json(savedContraVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Contra Vouchers
exports.getAllContraVouchers = async (req, res) => {
  try {
    const contraVouchers = await ContraVoucher.find({ owner: req.user._id }); // Filter by owner
    res.status(200).json(contraVouchers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single Contra Voucher by ID
exports.getContraVoucherById = async (req, res) => {
  try {
    const contraVoucher = await ContraVoucher.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the voucher belongs to the owner
    });
    if (!contraVoucher) {
      return res.status(404).json({ error: "Contra Voucher not found" });
    }
    res.status(200).json(contraVoucher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Contra Voucher
exports.updateContraVoucher = async (req, res) => {
  try {
    const updatedJournalVoucher = await ContraVoucher.findOneAndUpdate(
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
// Delete a Contra Voucher
exports.deleteContraVoucher = async (req, res) => {
  try {
    const deletedContraVoucher = await ContraVoucher.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the voucher belongs to the owner
    });
    if (!deletedContraVoucher) {
      return res.status(404).json({ error: "Contra Voucher not found" });
    }
    res.status(200).json({ message: "Contra Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contra voucher" });
  }
};
