const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the LedgerEntry schema
const LedgerEntrySchema = new Schema({
  ledgerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger", // Reference to the Ledger model
    required: false,
  },
  ledgerName: { type: String, required: false }, // Ledger name
  amount: { type: Number, required: false }, // Amount
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

// Define the Purchase schema
const ServicePurchaseSchema = new Schema(
  {
    voucherType: { type: String },
    transactionDate: { type: Date, required: false },
    description: { type: String, required: false },
    purchaseDate: { type: Date, required: false },
    voucherNumber: { type: String, required: false, unique: false },
    totalAmount: { type: Number, required: false },
    paymentTerms: { type: String, required: false },
    purchaseNumber: { type: String, required: false },
    selectedOption: { type: String, required: false },
    creditPeriod: { type: Number, required: false },
    creditAmount: { type: Number, required: false },
    creditDueDate: { type: Date, required: false },
    purposeOfPayment: { type: String, required: false },
    supplierDetails: {
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
    payable: { type: Number },
    paid: { type: Number },
    purchasedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the Company model
      required: false,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the Company model
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    debitLedgers: { type: [LedgerEntrySchema], required: false }, // Array of debit ledger entries
    creditLedgers: { type: [LedgerEntrySchema], required: false }, // Array of credit ledger entries
    balanceBillByBill: { type: Boolean, default: false },
    checkCreditDays: { type: Boolean, default: false },
    panItNo: { type: String },

    thisPurchase: {
      type: String,
      enum: ["New bill", "Against BillS", "Own bill", "Advance"],
    },
    status: {
      type: String,
      enum: ["Unsettled", "Partially Settled", "Settled"],
    },
    registrationType: { type: String },
    gstinUin: { type: String },
    transactionType: { type: String },
    subTotal: { type: Number, required: false },
    total: { type: Number, required: false },
    taxRate: { type: Number, required: false },
    taxAmount: { type: Number, required: false },
    taxName: { type: String, required: false },
    items: [itemSchema],
  },

  {
    timestamps: false,
  }
);

// Consolidate pre-validation middleware
ServicePurchaseSchema.pre("validate", function (next) {
  // Filter invalid ledger entries
  this.debitLedgers = this.debitLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );
  this.creditLedgers = this.creditLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );

  // Clean invalid stockItem values in items
  if (this.items) {
    this.items = this.items.map((item) => {
      if (
        item.stockItem === "" ||
        !mongoose.Types.ObjectId.isValid(item.stockItem)
      ) {
        item.stockItem = null;
      }
      return item;
    });
  }

  next();
});

// Middleware to set transactionDate based on purchasedBy.invoiceDate and generate voucherNumber
ServicePurchaseSchema.pre("save", async function (next) {
  // Set transactionDate based on purchasedBy.invoiceDate if available
  if (this.purchasedBy && this.purchasedBy.invoiceDate) {
    this.transactionDate = this.purchasedBy.invoiceDate;
  }

  // Automatically generate voucherNumber if not present
  if (!this.voucherNumber) {
    const lastPurchase = await this.constructor
      .findOne()
      .sort({ voucherNumber: -1 })
      .exec();
    const lastVoucherNumber = lastPurchase
      ? parseInt(lastPurchase.voucherNumber)
      : 0;
    this.voucherNumber = (lastVoucherNumber + 1).toString().padStart(6, "0");
  }

  // Ensure each item has a unique ID
  this.items = this.items.map((item, index) => {
    if (!item.id) {
      item.id = index + 1; // Assign an incremental ID or use another logic
    }
    return item;
  });

  // Calculate creditDueDate based on transactionDate and creditPeriod
  if (this.transactionDate && this.creditPeriod) {
    const transactionDate = new Date(this.transactionDate);
    const creditPeriod = parseInt(this.creditPeriod, 10); // Convert creditPeriod to an integer

    // Add the creditPeriod (in days) to the transactionDate
    const creditDueDate = new Date(
      transactionDate.setDate(transactionDate.getDate() + creditPeriod)
    );

    this.creditDueDate = creditDueDate;
  }

  next();
});

// Create and export the Purchase model
const ServicePurchase = mongoose.model(
  "ServicePurchase",
  ServicePurchaseSchema
);
module.exports = ServicePurchase;
