// const mongoose = require("mongoose");
const ServicePurchase = require("../models/servicePurchaseScheea"); // Adjust the path if necessary

// };
const mongoose = require("mongoose");

// Get all voucher numbers from purchases
const getAllVoucherNumbers = async (req, res) => {
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await ServicePurchase.find(
      { owner: req.user._id }, // Filter by the authenticated user's ID
      { voucherNumber: 1, _id: 0 } // Select only the voucherNumber field
    ).sort({ voucherNumber: 1 });

    if (vouchers.length > 0) {
      // If vouchers exist, return them
      return res.status(200).json(vouchers);
    } else {
      // No vouchers exist, return a default value to set the first voucher number as 0
      return res.status(200).json([{ voucherNumber: 0 }]);
    }
  } catch (error) {
    // Handle any errors that might occur during the database operation
    res.status(500).json({ message: error.message });
  }
};

// Get all voucher numbers for the authenticated user
// Get all voucher numbers for the authenticated user
const getAllVoucherNumber = async (req, res) => {
  const { thisPurchase } = req.body; // Extract 'thisPurchase' from the request body

  try {
    const query = {
      thisPurchase, // Match the purchase field (e.g., 'New bill')
      owner: req.user._id, // Ensure only the purchases of the authenticated user are retrieved
      status: { $in: ["Unsettled", "Partially Settled"] }, // Match status values
    };

    const purchases = await ServicePurchase.find(query)
      .populate("purchasedBy", "companyName") // Populate purchasedBy with only the companyName field
      .populate("purchasedTo", "companyName") // Populate purchasedTo with only the companyName field
      .sort({ voucherNumber: 1 });

    if (purchases.length > 0) {
      return res.status(200).json(purchases);
    } else {
      return res.status(200).json([]); // Return an empty array if no purchases found
    }
  } catch (error) {
    console.error("Error fetching purchases:", error); // Log the error
    res.status(500).json({ message: error.message }); // Handle any errors during the database operation
  }
};

// Create a new purchase
const createPurchase = async (req, res) => {
  try {
    const newPurchase = new ServicePurchase({
      ...req.body,
      owner: req.user._id, // Set owner from authenticated user
    });
    const savedPurchase = await newPurchase.save();

    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a purchase by ID
const updatePurchaseById = async (req, res) => {
  const { id } = req.params; // Get purchase ID from request parameters

  try {
    // Find the purchase by ID and update it with the data from the request body
    const updatedPurchase = await ServicePurchase.findByIdAndUpdate(
      id,
      {
        ...req.body, // Spread the updated fields from the request body
      },
      { new: true } // This option returns the updated document
    );

    // Check if the purchase was found and updated
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(updatedPurchase); // Respond with the updated purchase
  } catch (error) {
    console.error("Error updating purchase:", error); // Log the error for debugging
    res.status(500).json({ message: error.message }); // Respond with an error message
  }
};

const getPurchases = async (req, res) => {
  try {
    const query = {
      owner: req.user._id, // Ensure only the purchases of the authenticated user are retrieved
    };

    const purchases = await ServicePurchase.find(query).sort({
      voucherNumber: 1,
    });

    // Extract only the items from each purchase
    const items = purchases.map((purchase) => purchase.items).flat();

    return res.status(200).json(items); // Return the items
  } catch (error) {
    console.error("Error fetching purchases:", error); // Log the error
    res.status(500).json({ message: error.message }); // Handle any errors during the database operation
  }
};

// Get a single purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    // Change req.params._id to req.params.id
    const purchase = await ServicePurchase.findById(req.params.id)
      .populate("purchasedTo")
      .populate("purchasedBy");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check ownership
    if (purchase.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this purchase." });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a purchase by ID
const deletePurchaseById = async (req, res) => {
  try {
    const purchase = await ServicePurchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check ownership
    if (purchase.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this purchase.",
      });
    }

    await ServicePurchase.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
  getAllVoucherNumbers,
  getAllVoucherNumber,
};
