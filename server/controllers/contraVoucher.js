// const ContraVoucher = require("../models/contaSchema.js");
// const Ledger = require("../models/ledgerSchema");

// exports.createContraVoucher = async (req, res) => {
//   console.log("journal", req.body);
//   try {
//     const newContraVoucher = new ContraVoucher(req.body);
//     const savedContraVoucher = await newContraVoucher.save();
//     res.status(201).json(savedContraVoucher);
//     console.log("journal", savedContraVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all Contra Vouchers
// exports.getAllContraVouchers = async (req, res) => {
//   try {
//     const contraVouchers = await ContraVoucher.find();
//     res.status(200).json(contraVouchers);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get a single Contra Voucher by ID
// exports.getContraVoucherById = async (req, res) => {
//   try {
//     const contraVoucher = await ContraVoucher.findById(req.params.id);
//     if (!contraVoucher) {
//       return res.status(404).json({ error: "Contra Voucher not found" });
//     }
//     res.status(200).json(contraVoucher);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update a Contra Voucher
// exports.updateContraVoucher = async (req, res) => {
//   try {
//     const {
//       voucherNumber,
//       date,
//       debitLedger,
//       debitAmount,
//       creditLedger,
//       creditAmount,
//       description,
//     } = req.body;

//     let contraVoucher = await ContraVoucher.findById(req.params.id);
//     if (!contraVoucher) {
//       return res.status(404).json({ error: "Contra Voucher not found" });
//     }

//     // Determine debitLedger and creditLedger names
//     const debitLedgerName = await determineLedgerName(debitLedger);
//     const creditLedgerName = await determineLedgerName(creditLedger);

//     // Check if both debitLedger and creditLedger names were determined
//     if (!debitLedgerName || !creditLedgerName) {
//       return res
//         .status(404)
//         .json({ error: "One or both ledger IDs not found." });
//     }

//     contraVoucher.voucherNumber = voucherNumber;
//     contraVoucher.date = date;
//     contraVoucher.debitLedger = debitLedger;
//     contraVoucher.debitLedgerName = debitLedgerName;
//     contraVoucher.debitAmount = debitAmount;
//     contraVoucher.creditLedger = creditLedger;
//     contraVoucher.creditLedgerName = creditLedgerName;
//     contraVoucher.creditAmount = creditAmount;
//     contraVoucher.description = description;

//     const updatedContraVoucher = await contraVoucher.save();
//     res.status(200).json(updatedContraVoucher);
//   } catch (error) {
//     console.error("Error updating contra voucher:", error);
//     res.status(500).json({ error: "Failed to update contra voucher" });
//   }
// };

// // Delete a Contra Voucher
// exports.deleteContraVoucher = async (req, res) => {
//   try {
//     const deletedContraVoucher = await ContraVoucher.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedContraVoucher) {
//       return res.status(404).json({ error: "Contra Voucher not found" });
//     }
//     res.status(200).json({ message: "Contra Voucher deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting contra voucher:", error);
//     res.status(500).json({ error: "Failed to delete contra voucher" });
//   }
// };
const ContraVoucher = require("../models/contaSchema.js");
const Ledger = require("../models/ledgerSchema");

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
