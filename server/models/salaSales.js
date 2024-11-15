const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Salesi", salesSchema);
