const mongoose = require("mongoose");

// Transaction Schema
const monthTransactionSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: false,
    },
    vehicleNumber: {
      type: String,
      required: false,
    },
    ownerName: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    gst: {
      type: Number,
      required: false,
    },
    tds: {
      type: Number,
      required: false,
    },
    ownerAmount: {
      type: String,
      required: false,
    },
    esi: {
      type: Number,
      required: false,
    },
    pf: {
      type: Number,
      required: false,
    },
    openingBalance: {
      type: Number,
      required: false,
    },
    expense: {
      type: Number,
      required: false,
    },
    closingBalance: {
      type: Number,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true, // Set to true if you want it to be mandatory
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("MonthTransaction", monthTransactionSchema);
