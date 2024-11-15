const mongoose = require("mongoose");

const stockGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the stock group
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who owns this stock group
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const StockGroup = mongoose.model("StockGroup", stockGroupSchema);

module.exports = StockGroup;
