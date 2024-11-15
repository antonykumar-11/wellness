const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema(
  {
    stockGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockCategory",
      required: true,
    },
    stockGroupName: { type: String, required: true }, // Group name
    stockName: { type: String, required: true }, // Specific stock name
    // unit: { type: String, required: true }, // Unit of measurement
    quantityAvailable: { type: Number, required: true, default: 0 }, // Available stock quantity
    hsnCode: { type: String, trim: true }, // Optional, with `trim` to remove any accidental spaces
    rate: { type: Number, required: false }, // Ensure rate can't be negative
    taxRate: { type: String, required: false }, // Percentage format validation
    taxAmount: { type: Number, required: false, min: 0 }, // Tax amount can't be negative
    amount: { type: Number, required: true }, // Amount for the purchase
    serialNumber: { type: String }, // Optional serial number
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", InventorySchema);
module.exports = Inventory;
