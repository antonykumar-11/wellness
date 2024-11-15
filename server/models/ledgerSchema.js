const mongoose = require("mongoose");

// Schema for individual operations
const operationSchema = new mongoose.Schema({
  operands: {
    type: [String],
    required: false,
    default: [],
  },
  operator: {
    type: String,
    required: false,
  },
});

// Combined schema
const ledgerSchema = new mongoose.Schema({
  voucherType: { type: String },

  name: { type: String, required: true }, // 'name' is unique per user
  openingBalance: { type: Number },
  alias: { type: String },

  nature: { type: String },
  under: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  StockName: {
    type: String,
  },

  category: {
    type: String,
    enum: ["Assets", "Liabilities", "Income", "Expenses", "Equity"],
  },
  voucher1: { type: String },
  payHeadType: { type: String },
  date: { type: Date },
  description: { type: String },
  displayNameInPayslip: { type: String, required: false },
  operations: {
    type: [operationSchema],
    required: false,
    default: [],
  },
  payHeadType: {
    type: String,
    required: false,
    default: null,
  },
  calculationType: {
    type: String,
    required: false,
    default: null,
  },
  category: {
    type: String,
    required: false,
    default: null,
  },
  group: {
    type: String,
    required: false,
    default: null,
  },
  nature: {
    type: String,
    required: false,
    default: null,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  days: {
    type: Number,
    required: false,
    default: null,
  },
});

// Create a compound index for name and owner
ledgerSchema.index({ name: 1, owner: 1 }, { unique: true }); // Ensure this is set

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
