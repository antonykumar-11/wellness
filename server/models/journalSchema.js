const mongoose = require("mongoose");

const LedgerEntrySchema = new mongoose.Schema({
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: true,
  },
  ledgerName: { type: String, required: true }, // Ledger name
  amount: { type: Number, required: true }, // Amount
});

const JournalVoucherSchema = new mongoose.Schema({
  voucherType: { type: String, default: "Journal Voucher" },
  voucherNumber: { type: String, required: true },
  date: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  debitLedgers: { type: [LedgerEntrySchema], required: true }, // Array of debit ledgers
  creditLedgers: { type: [LedgerEntrySchema], required: true }, // Array of credit ledgers
  description: { type: String, required: true },
});

const JournalVoucher = mongoose.model("JournalVoucher", JournalVoucherSchema);

module.exports = JournalVoucher;
