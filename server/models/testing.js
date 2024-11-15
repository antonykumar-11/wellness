const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Item Schema
const itemSchema = new Schema({
  serialNumber: { type: String },
  description: { type: String, required: true },
  price: { type: Number },
  unit: { type: String },
  hsnCode: { type: String },
  rate: { type: Number },
  quantity: { type: Number },
  amount: { type: Number },
  stockLedger: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
  ],
  stockAmount: { type: String },
});

// Purchase Schema
const purchaseSchema = new Schema({
  voucherNumber: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  bankDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
  },
  purposeOfPayment: { type: String, required: true },
  authorizedBy: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    signature: { type: String, required: true },
  },
  departmentCostCenter: { type: String },
  remarks: { type: String },
  purchaseTo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    gstNumber: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true },
    companyType: { type: String },
    deliveryNote: { type: String },
    modeTermsOfPayment: { type: String, required: true },
    buyersOrderNumber: { type: String, required: true },
    companyEmail: { type: String },
    companyMobile: { type: String },
    companyPanNumber: { type: String },
    panCard: { type: String },
    date: { type: Date },
  },
  purchaseBy: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    gstNumber: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true },
    companyType: { type: String },
    deliveryNote: { type: String },
    modeTermsOfPayment: { type: String, required: true },
    buyersOrderNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    currentDate: { type: Date, required: true },
    companyAddress: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyMobile: { type: String, required: true },
    companyPanNumber: { type: String, required: true },
    panCard: { type: String, required: true },
    date: { type: Date, required: true },
  },
  balanceBillByBill: { type: Boolean, default: false },
  defaultCreditPeriod: { type: Number, default: 0 },
  checkCreditDays: { type: Boolean, default: false },
  panItNo: { type: String },
  registrationType: { type: String },
  gstinUin: { type: String },
  transactionType: { type: String },
  debitLedger: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ledger", required: true },
  ],
  debitLedgerName: { type: String, required: true },
  debitAmount: { type: Number, required: true },
  creditLedger: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Ledger", required: true },
  ],
  creditAmount: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  taxRate: { type: Number },
  taxAmount: { type: Number },
  items: [itemSchema],
  totalInWords: { type: String },
  isCredit: { type: Boolean, default: false },
  creditDetails: {
    creditPeriod: {
      type: Number,
      required: function () {
        return this.isCredit;
      },
    },
    creditAmount: {
      type: Number,
      required: function () {
        return this.isCredit;
      },
    },
    creditDueDate: {
      type: Date,
      required: function () {
        return this.isCredit;
      },
    },
  },
});

// Ledger Schema
const ledgerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  alias: { type: String },
  group: { type: String }, // Parent ledger (if applicable)
  type: { type: String, enum: ["Debit", "Credit"], required: true }, // Ledger type
  category: {
    type: String,
    enum: ["Asset", "Liability", "Income", "Expense", "Capital"],
  },
  amount: { type: Number, default: 0 }, // Current balance of the ledger
  date: { type: Date, required: true },
  description: { type: String },
});

// Stock Schema
const stockSchema = new mongoose.Schema({
  stockGroup: { type: String },
  stockCategory: { type: String },
  stockItems: { type: String },
});

// Creating Models
const Purchaseee = mongoose.model("Purchaseee", purchaseSchema);
const Ledgereee = mongoose.model("Ledgereee", ledgerSchema);
const Stocksss = mongoose.model("Stocksss", stockSchema);

module.exports = { Purchaseee, Ledgereee, Stocksss };
