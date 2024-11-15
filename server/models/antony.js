const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the transaction schema
const transactionSchema = new Schema({
  date: { type: Date, required: true },

  debitAccount: { type: String, required: true },
  debitDescription: { type: String, required: true },
  debitAmount: { type: Number, required: true },

  creditAccount: { type: String, required: true },
  creditDescription: { type: String, required: true },
  creditAmount: { type: Number, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
