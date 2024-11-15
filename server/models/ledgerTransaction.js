const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionLedgerSchema = new Schema({
  debitLedger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  debitLedgerName: { type: String },
  debitAmount: { type: Number },
  creditLedger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  creditLedgerName: { type: String },
  creditAmount: { type: Number },
  purchase: {
    type: Schema.Types.ObjectId,
    ref: "Purchase",
    required: true,
  },
});

const TransactionLedger = mongoose.model(
  "TransactionLedger",
  transactionLedgerSchema
);

module.exports = TransactionLedger;
