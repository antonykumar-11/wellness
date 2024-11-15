const mongoose = require("mongoose");

const SequenceSchema = new mongoose.Schema({
  sequenceValue: { type: Number, default: 0 },
});

module.exports = mongoose.model("Sequence", SequenceSchema);
