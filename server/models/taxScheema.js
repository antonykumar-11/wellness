// models/Tax.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const myTax = new Schema({
  taxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  taxRate: {
    type: Number,
  },
  taxAmount: {
    type: Number,
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    required: false,
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time
  },
});

// Update the `updatedAt` field before each save
myTax.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Tax = mongoose.model("Tax", myTax);

module.exports = Tax;
