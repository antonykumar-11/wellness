const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the LedgerEntry schema
const LedgerEntrySchema = new Schema({
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: true, // Required field
  },
  ledgerName: {
    type: String,
    required: true, // Required field
  },
  amount: {
    type: Number,
    required: true, // Required field
  },
});

// Define the ContraVoucher schema
const ContraVoucherSchema = new Schema(
  {
    voucherType: {
      type: String,
      default: "Contra Voucher", // Default value
    },
    voucherNumber: {
      type: String,
      required: true,
      unique: true, // Ensures the voucher number is unique
    },
    date: {
      type: Date,
      required: true, // Required field
    },
    debitLedgers: {
      type: [LedgerEntrySchema], // Array of debit ledger entries
      required: true, // Required field
    },
    creditLedgers: {
      type: [LedgerEntrySchema], // Array of credit ledger entries
      required: true, // Required field
    },
    description: {
      type: String,
      required: false, // Optional field
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Required field
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the ContraVoucher model
const ContraVoucher = mongoose.model("ContraVoucher", ContraVoucherSchema);
module.exports = ContraVoucher;
