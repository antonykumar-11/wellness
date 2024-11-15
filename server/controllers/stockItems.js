const Inventory = require("../models/stockItems");
const StockGroup = require("../models/stockGroup");

// Create a new stock item under a stock group

// Create a new Stock Item

// Create a new Stock Item
exports.createStockItem = async (req, res) => {
  console.log("req.body", req.body);
  try {
    // Check if the stockName already exists
    const existingStockItem = await Inventory.findOne({
      stockName: req.body.stockName,
    });
    if (existingStockItem) {
      return res.status(400).json({ error: "Stock name must be unique." });
    }

    const newStockItem = new Inventory({
      ...req.body,
      owner: req.user.id, // Set the owner to the authenticated user's ID
    });

    const savedStockItem = await newStockItem.save();
    res.status(201).json(savedStockItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Optionally, create more controllers for retrieving, updating, and deleting stock items

// Get all stock items under a specific stock group

exports.getStockItemsByGroup = async (req, res) => {
  console.log("get", req.body);
  try {
    const stockItems = await Inventory.find();
    res.status(200).json(stockItems);
    console.log("get", stockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a stock item by ID
exports.getStockItemById = async (req, res) => {
  try {
    const stockItem = await Inventory.findById(req.params.id).populate(
      "stockGroup",
      "stockGroup"
    );
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(stockItem);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock item", error });
  }
};

// Update a stock item
exports.updateStockItem = async (req, res) => {
  try {
    const { name, description, quantity, price, unit } = req.body;
    const stockItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { name, description, quantity, price, unit }, // Update unit
      { new: true }
    );
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(stockItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating stock item", error });
  }
};

// Delete a stock item
exports.deleteStockItem = async (req, res) => {
  try {
    const stockItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock item", error });
  }
};
