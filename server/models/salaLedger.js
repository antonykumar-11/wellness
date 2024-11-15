const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  transactionType: String,
  amount: Number,
  name: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ledgeri", ledgerSchema);
