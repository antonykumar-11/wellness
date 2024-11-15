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

// Define the Payment schema
const PaymentSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voucherType: { type: String },
    transactionDate: { type: Date, required: false },
    description: { type: String, required: false },
    creditDueDate: { type: Date, required: false },
    creditPeriod: { type: String, required: false },
    voucherNumber: { type: String, required: true, unique: true }, // Ensure unique index
    paymentDate: { type: Date, required: false },
    amountPaid: { type: Number, required: false },
    bankDetails: {
      bankName: { type: String, required: false },
      accountNumber: { type: String, required: false },
      branch: { type: String, required: false },
    },
    purposeOfPayment: { type: String, required: false },
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
      required: true,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the Company model
      required: true,
    },
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    }, // Reference to purchase
    paymentMethod: { type: String, required: false },
    debitLedgers: { type: [LedgerEntrySchema], required: false }, // Array of debit ledger entries
    creditLedgers: { type: [LedgerEntrySchema], required: false }, // Array of credit ledger entries
    balanceBillByBill: { type: Boolean, default: false },
    defaultCreditPeriod: { type: Number, default: 0 },
    checkCreditDays: { type: Boolean, default: false },
    panItNo: { type: String },
    registrationType: { type: String },
    gstinUin: { type: String },
    transactionType: { type: String },
    thisPurchase: {
      type: String,
      enum: ["New bill", "Against Bill", "On Account", "Advance"],
    },
    status: {
      type: String,
      enum: ["Unsettled", "Partially Settled", "Settled"],
    },
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

// Create a unique index on voucherNumber to enforce uniqueness
PaymentSchema.index({ voucherNumber: 1 }, { unique: true });

// Pre-validation middleware to filter invalid ledger entries
PaymentSchema.pre("validate", function (next) {
  this.debitLedgers = this.debitLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );
  this.creditLedgers = this.creditLedgers.filter(
    (entry) => entry.ledgerId && entry.ledgerName && entry.amount
  );
  next();
});

// Middleware to set transactionDate based on purchasedBy.invoiceDate and generate voucherNumber
PaymentSchema.pre("save", async function (next) {
  if (this.purchasedBy && this.purchasedBy.invoiceDate) {
    this.transactionDate = this.purchasedBy.invoiceDate;
  }

  if (!this.voucherNumber) {
    let isUnique = false;
    while (!isUnique) {
      // Generate the next voucher number
      const lastPayment = await this.constructor
        .findOne()
        .sort({ voucherNumber: -1 })
        .exec();
      const lastVoucherNumber = lastPayment
        ? parseInt(lastPayment.voucherNumber)
        : 0;
      this.voucherNumber = (lastVoucherNumber + 1).toString().padStart(6, "0");

      // Check if this voucherNumber is already used
      const existingPayment = await this.constructor.findOne({
        voucherNumber: this.voucherNumber,
      });

      if (!existingPayment) {
        isUnique = true;
      }
    }
  }

  next();
});

// Post-save middleware to handle duplicate key errors
PaymentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    // Retry logic: regenerate voucherNumber and save again
    return doc.save().catch(next);
  } else {
    next(error);
  }
});

// Create and export the Payment model
const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
