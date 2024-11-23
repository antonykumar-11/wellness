const mongoose = require("mongoose");

// Define the schema for individual ledger entries in a receipt
const receiptSchema = new mongoose.Schema({
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: true,
  },
  ledgerName: { type: String, required: true }, // Ledger name
  amount: { type: Number, required: true }, // Amount
});

// Define the schema for receipt vouchers
const ReceiptVoucherSchema = new mongoose.Schema({
  voucherType: { type: String, default: "Receipt Voucher" },
  voucherNumber: { type: String, required: true },
  date: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  debitLedgers: { type: [receiptSchema], required: true }, // Array of debit ledgers
  creditLedgers: { type: [receiptSchema], required: true }, // Array of credit ledgers
  description: { type: String, required: true },
});

// Define and export the model for Receipt Voucher
const ReceiptVoucher = mongoose.model("ReceiptVoucher", ReceiptVoucherSchema);

module.exports = ReceiptVoucher;
