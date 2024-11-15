const Tax = require("../models/taxScheema");

// Create a new tax document
exports.createTax = async (req, res) => {
  try {
    const { taxId, taxRate, taxAmount, saleId, purchaseId } = req.body;

    // Validate required fields
    if (!taxId || taxRate == null || taxAmount == null) {
      return res
        .status(400)
        .json({ error: "taxId, taxRate, and taxAmount are required." });
    }

    // Create a new Tax instance
    const newTax = new Tax({
      taxId,
      taxRate,
      taxAmount,
      saleId,
      purchaseId,
    });

    // Save the tax document to the database
    const savedTax = await newTax.save();

    res.status(201).json(savedTax);
  } catch (error) {
    console.error("Error creating tax:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tax documents
exports.getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find()
      .populate("taxId")
      .populate("saleId")
      .populate("purchaseId");
    res.status(200).json(taxes);
  } catch (error) {
    console.error("Error retrieving taxes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific tax document by ID
exports.getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id)
      .populate("taxId")
      .populate("saleId")
      .populate("purchaseId");
    if (!tax) {
      return res.status(404).json({ error: "Tax not found" });
    }
    res.status(200).json(tax);
  } catch (error) {
    console.error("Error retrieving tax:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a tax document
exports.updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { taxId, taxRate, taxAmount, saleId, purchaseId } = req.body;

    // Validate required fields
    if (!taxId || taxRate == null || taxAmount == null) {
      return res
        .status(400)
        .json({ error: "taxId, taxRate, and taxAmount are required." });
    }

    // Find the tax document by ID and update it
    const updatedTax = await Tax.findByIdAndUpdate(
      id,
      { taxId, taxRate, taxAmount, saleId, purchaseId, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTax) {
      return res.status(404).json({ error: "Tax not found" });
    }

    res.status(200).json(updatedTax);
  } catch (error) {
    console.error("Error updating tax:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a tax document
exports.deleteTax = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the tax document by ID and delete it
    const deletedTax = await Tax.findByIdAndDelete(id);

    if (!deletedTax) {
      return res.status(404).json({ error: "Tax not found" });
    }

    res.status(200).json({ message: "Tax deleted successfully" });
  } catch (error) {
    console.error("Error deleting tax:", error);
    res.status(500).json({ error: error.message });
  }
};
