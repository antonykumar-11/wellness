const StockGroup = require("../models/stockGroup");

// Create a new stock group
exports.createStockGroup = async (req, res) => {
  try {
    const { name } = req.body; // Get stock group name from request body

    const newStockGroup = new StockGroup({
      name,
      owner: req.user._id, // Reference to the authenticated user
    });

    await newStockGroup.save();

    res.status(201).json({
      message: "Stock group created successfully",
      stockGroup: newStockGroup,
    });
  } catch (error) {
    console.error("Error creating stock group:", error);
    res.status(500).json({ message: "Error creating stock group", error });
  }
};

// Get all stock groups for the authenticated user
exports.getAllStockGroups = async (req, res) => {
  try {
    const stockGroups = await StockGroup.find({ owner: req.user._id });
    res.status(200).json(stockGroups);
  } catch (error) {
    console.error("Error fetching stock groups:", error);
    res.status(500).json({ message: "Error fetching stock groups", error });
  }
};

// Get a stock group by ID for the authenticated user
exports.getStockGroupById = async (req, res) => {
  try {
    const stockGroup = await StockGroup.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!stockGroup) {
      return res.status(404).json({ message: "Stock group not found" });
    }

    res.status(200).json(stockGroup);
  } catch (error) {
    console.error("Error retrieving stock group:", error);
    res.status(500).json({ message: "Error retrieving stock group", error });
  }
};

// Update a stock group by ID
exports.updateStockGroup = async (req, res) => {
  try {
    const { name } = req.body; // Get updated stock group name from request body

    const updatedStockGroup = await StockGroup.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the stock group belongs to the user
      { name }, // Update the name
      { new: true }
    );

    if (!updatedStockGroup) {
      return res.status(404).json({ message: "Stock group not found" });
    }

    res.status(200).json({
      message: "Stock group updated successfully",
      stockGroup: updatedStockGroup,
    });
  } catch (error) {
    console.error("Error updating stock group:", error);
    res.status(500).json({ message: "Error updating stock group", error });
  }
};

// Delete a stock group by ID
exports.deleteStockGroup = async (req, res) => {
  try {
    const deletedStockGroup = await StockGroup.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the stock group belongs to the user
    });

    if (!deletedStockGroup) {
      return res.status(404).json({ message: "Stock group not found" });
    }

    res.status(200).json({ message: "Stock group deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock group:", error);
    res.status(500).json({ message: "Error deleting stock group", error });
  }
};
