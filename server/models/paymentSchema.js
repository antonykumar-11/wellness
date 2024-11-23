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

// Define the Payment schema
const PaymentSchema = new mongoose.Schema({
  voucherType: { type: String, default: "Payment Voucher" }, // Updated to Payment Voucher
  voucherNumber: { type: String, required: true },
  date: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  debitLedgers: { type: [LedgerEntrySchema], required: true }, // Array of debit ledgers (e.g., where payment goes)
  creditLedgers: { type: [LedgerEntrySchema], required: true }, // Array of credit ledgers (e.g., payment sources)
  description: { type: String, required: true },
});

// Create and export the Payment model
const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
