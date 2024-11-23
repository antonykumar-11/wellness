const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the LedgerEntry schema
const LedgerEntrySchema = new Schema({
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: true,
  },
  ledgerName: { type: String, required: true }, // Ledger name
  amount: { type: Number, required: true }, // Amount
});

// Define the Item schema
const itemSchema = new Schema({
  serialNumber: { type: String },
  description: { type: String, required: false },
  unit: { type: String, required: false },
  hsnCode: { type: String, required: false },
  rate: { type: Number, required: false },
  quantity: { type: Number, required: false },
  taxRate: { type: String, required: false },
  taxAmount: { type: Number, required: false },
  amount: { type: Number, required: false },
  stockName: { type: String, required: false },
  stockGroupName: { type: String, required: false },
  stockGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StockCategory",
    required: false,
    validate: {
      validator: function (v) {
        return v == null || mongoose.Types.ObjectId.isValid(v);
      },
      message: "Invalid stockItem ID",
    },
  },
});

// Define the Sale schema
const SaleServiceSchema = new Schema(
  {
    voucherType: { type: String },
    transactionDate: { type: Date, required: false },
    description: { type: String, required: false },
    saleDate: { type: Date, required: false },
    voucherNumber: { type: String, required: true }, // Unique per owner
    totalAmount: { type: Number, required: false },
    paymentTerms: { type: String, required: false },
    saleNumber: { type: String, required: false },
    selectedOption: { type: String, required: false },
    creditPeriod: { type: Number, required: false },
    creditAmount: { type: Number, required: false },
    creditDueDate: { type: Date, required: false },
    purposeOfSale: { type: String, required: false },
    customerDetails: {
      name: { type: String, required: false },
      address: { type: String, required: false },
      gstin: { type: String, required: false },
    },
    authorizedBy: {
      name: { type: String, required: false },
      designation: { type: String, required: false },
      signature: { type: String, required: false },
    },
    departmentCostCenter: { type: String, required: false },
    remarks: { type: String },
    receivable: { type: Number },
    received: { type: Number },
    purchasedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    debitLedgers: { type: [LedgerEntrySchema], required: false },
    creditLedgers: { type: [LedgerEntrySchema], required: false },
    balanceBillByBill: { type: Boolean, default: false },
    checkCreditDays: { type: Boolean, default: false },
    panItNo: { type: String },
    registrationType: { type: String },
    gstinUin: { type: String },
    transactionType: { type: String },
    subTotal: { type: Number, required: false },
    total: { type: Number, required: false },
    taxRate: { type: Number, required: false },
    taxAmount: { type: Number, required: false },
    taxName: { type: String, required: false },
    TypeOfSales: {
      type: String,
      enum: ["Services", "Goods"],
    },
    items: [itemSchema],
    thisPurchase: {
      type: String,
      enum: ["New bill", "Against Bill", "On Account", "Advance"],
    },
    status: {
      type: String,
      enum: ["Unsettled", "Partially Settled", "Settled"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound unique index on voucherNumber and owner
SaleServiceSchema.index({ voucherNumber: 1, owner: 1 }, { unique: true });

// Pre-validation middleware to filter invalid ledger entries
SaleServiceSchema.pre("validate", function (next) {
  this.debitLedgers = this.debitLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );
  this.creditLedgers = this.creditLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );
  next();
});

// Middleware to set transactionDate and generate voucherNumber
SaleServiceSchema.pre("save", async function (next) {
  if (this.soldBy && this.soldBy.invoiceDate) {
    this.transactionDate = this.soldBy.invoiceDate;
  }

  if (!this.voucherNumber) {
    const lastSale = await this.constructor
      .findOne()
      .sort({ voucherNumber: -1 })
      .exec();
    const lastVoucherNumber = lastSale ? parseInt(lastSale.voucherNumber) : 0;
    this.voucherNumber = (lastVoucherNumber + 1).toString().padStart(6, "0");
  }

  if (this.transactionDate && this.creditPeriod) {
    const transactionDate = new Date(this.transactionDate);
    const creditPeriod = parseInt(this.creditPeriod, 10);
    const creditDueDate = new Date(
      transactionDate.setDate(transactionDate.getDate() + creditPeriod)
    );
    this.creditDueDate = creditDueDate;
  }

  next();
});

// Create and export the Sale model
const SalesServise = mongoose.model("SalesServise", SaleServiceSchema);
module.exports = SalesServise;
