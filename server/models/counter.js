const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // For tracking different counters (e.g., "stockItem")
  seq: { type: Number, default: 0 }, // The last serial number
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
