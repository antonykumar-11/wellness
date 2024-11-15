const mongoose = require("mongoose");

const stockCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the stock category
    stockGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockGroup", // Reference to the stock group
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who owns the stock category
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const StockCategory = mongoose.model("StockCategory", stockCategorySchema);

module.exports = StockCategory;
