const Ledger = require("../models/ledgerSchema");

// Create a new ledger
// controllers/ledgerController.js
// controllers/ledgerController.js
exports.createLedger = async (req, res) => {
  try {
    const newLedger = new Ledger({
      ...req.body,
      owner: req.user.id, // Ensure owner is set correctly
    });

    const savedLedger = await newLedger.save();
    res.status(201).json(savedLedger);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Ledger name must be unique per user." });
    }
    res.status(400).json({ message: err.message });
  }
};

// Get all ledgers
// Get all ledgers with voucherType "payHead" for the authenticated user
exports.getAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find({
      owner: req.user.id,
      voucherType: "payHead", // Filter by voucherType
    });

    // Check if any ledgers were found
    if (ledgers.length === 0) {
      return res
        .status(404)
        .json({ message: "No ledgers found with voucherType 'payHead'" });
    }

    res.status(200).json(ledgers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single ledger by ID
exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }); // Check if the ledger belongs to the user
    if (!ledger) {
      return res
        .status(404)
        .json({ message: "Ledger not found or not authorized" });
    }
    res.status(200).json(ledger);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a ledger by ID
exports.updateLedger = async (req, res) => {
  try {
    const updatedLedger = await Ledger.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, // Ensure the user owns the ledger
      req.body,
      { new: true }
    );
    if (!updatedLedger) {
      return res
        .status(404)
        .json({ message: "Ledger not found or not authorized" });
    }
    res.status(200).json(updatedLedger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a ledger by ID
exports.deleteLedger = async (req, res) => {
  try {
    const deletedLedger = await Ledger.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    }); // Ensure the user owns the ledger
    if (!deletedLedger) {
      return res
        .status(404)
        .json({ message: "Ledger not found or not authorized" });
    }
    res.status(200).json({ message: "Ledger deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
