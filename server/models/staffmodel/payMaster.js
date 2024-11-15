const mongoose = require("mongoose");

const LedgerEntrySchema = new mongoose.Schema({
  ledgerId: {
    // Add ledgerId field
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: true,
  },
  ledgerName: { type: String, required: true },
  amount: { type: Number, required: true }, // Ensure this is a Number
});

const PayMasterSchema = new mongoose.Schema({
  voucherType: { type: String, default: "PayMaster Voucher" },
  voucherNumber: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  debitLedgers: { type: [LedgerEntrySchema], required: true },
  creditLedgers: { type: [LedgerEntrySchema], required: true },
  description: { type: String, required: true },
});

const PayMaster = mongoose.model("PayMaster", PayMasterSchema);

module.exports = PayMaster;
