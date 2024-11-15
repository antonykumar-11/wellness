const StockCategory = require("../models/stockCategory");
const StockGroup = require("../models/stockGroup");

// Create a new stock category under a specific stock group
exports.createStockCategory = async (req, res) => {
  console.log("req.bodyyyyyyyyyyyyyyyyyyyyyy", req.body);
  try {
    const { name, stockGroup } = req.body; // Get stock category name and stock group ID from request body

    // Check if the stock group exists
    const stockGroups = await StockGroup.findById(stockGroup);
    if (!stockGroups) {
      return res.status(404).json({ message: "Stock group not found" });
    }

    // Create a new stock category with the correct field name (stockGroup)
    const newStockCategory = new StockCategory({
      name,
      stockGroup, // Correctly set stockGroup as per the schema
      owner: req.user._id, // Set the owner to the authenticated user
    });

    await newStockCategory.save();

    res.status(201).json({
      message: "Stock category created successfully",
      stockCategory: newStockCategory,
    });
  } catch (error) {
    console.error("Error creating stock category:", error);
    res.status(500).json({ message: "Error creating stock category", error });
  }
};

// Get all stock categories for the authenticated user
exports.getAllStockCategories = async (req, res) => {
  try {
    const stockCategories = await StockCategory.find({ owner: req.user._id });

    res.status(200).json(stockCategories);
  } catch (error) {
    console.error("Error fetching stock categories:", error);
    res.status(500).json({ message: "Error fetching stock categories", error });
  }
};

// Get a stock category by ID for the authenticated user
exports.getStockCategoryById = async (req, res) => {
  try {
    const stockCategory = await StockCategory.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate("stockGroup", "name"); // Populate the stock group name

    if (!stockCategory) {
      return res.status(404).json({ message: "Stock category not found" });
    }

    res.status(200).json(stockCategory);
  } catch (error) {
    console.error("Error retrieving stock category:", error);
    res.status(500).json({ message: "Error retrieving stock category", error });
  }
};

// Update a stock category by ID
exports.updateStockCategory = async (req, res) => {
  try {
    const { name, stockGroupId } = req.body; // Get updated stock category name and stock group ID from request body

    // Check if stock group exists
    const stockGroup = await StockGroup.findById(stockGroupId);
    if (!stockGroup) {
      return res.status(404).json({ message: "Stock group not found" });
    }

    const updatedStockCategory = await StockCategory.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the stock category belongs to the user
      { name, stockGroup: stockGroupId }, // Update the name and stock group reference
      { new: true }
    );

    if (!updatedStockCategory) {
      return res.status(404).json({ message: "Stock category not found" });
    }

    res.status(200).json({
      message: "Stock category updated successfully",
      stockCategory: updatedStockCategory,
    });
  } catch (error) {
    console.error("Error updating stock category:", error);
    res.status(500).json({ message: "Error updating stock category", error });
  }
};

// Delete a stock category by ID
exports.deleteStockCategory = async (req, res) => {
  try {
    const deletedStockCategory = await StockCategory.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the stock category belongs to the user
    });

    if (!deletedStockCategory) {
      return res.status(404).json({ message: "Stock category not found" });
    }

    res.status(200).json({ message: "Stock category deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock category:", error);
    res.status(500).json({ message: "Error deleting stock category", error });
  }
};
