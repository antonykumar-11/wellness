const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nature: { type: String, required: true },
  category: { type: String, required: true },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
