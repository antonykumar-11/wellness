// const mongoose = require("mongoose");
const Purchase = require("../models/purchaseScheema"); // Adjust the path if necessary

const Inventory = require("../models/stockItems"); // Adjust path as necessary
const mongoose = require("mongoose");

// Get all voucher numbers from purchases
const getAllVoucherNumbers = async (req, res) => {
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await Purchase.find(
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
const getAllVoucherNumber = async (req, res) => {
  const { thisPurchase, status } = req.body; // Extract 'thisPurchase' and 'status' from the request body
  console.log("Received thisPurchase:", thisPurchase, "Status:", status);

  try {
    // Construct query object
    const query = {
      thisPurchase: thisPurchase || "New bill", // Fallback if thisPurchase is not provided
      owner: req.user._id, // Retrieve only the purchases of the authenticated user
    };

    // Add status filter only if it's provided in the request
    if (status) {
      query.status = { $in: ["Unsettled", "Partially Settled"] };
    }

    // Log the final query object
    console.log("Query Object:", query);

    const purchases = await Purchase.find(query, {
      _id: 1,
      voucherType: 1,
      transactionDate: 1,
      description: 1,
      voucherNumber: 1,
      creditPeriod: 1,
      creditAmount: 1,
      creditDueDate: 1,
      purposeOfPayment: 1,
      authorizedBy: 1,
      purchasedTo: 1,
      purchasedBy: 1,
      owner: 1,
      debitLedgers: 1,
      creditLedgers: 1,
      balanceBillByBill: 1,
      checkCreditDays: 1,
      thisPurchase: 1,
      paidAmount: 1,
      subTotal: 1,
      total: 1,
      taxRate: 1,
      taxAmount: 1,
      taxName: 1,
      items: 1,
    })
      .populate("purchasedBy", "companyName") // Populate purchasedBy with only companyName
      .populate("purchasedTo", "companyName") // Populate purchasedTo with only companyName
      .populate("authorizedBy", "name") // Populate authorizedBy with only name field
      .sort({ voucherNumber: 1 })
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    if (purchases.length > 0) {
      return res.status(200).json(purchases);
    } else {
      return res.status(200).json([]); // Return an empty array if no matches found
    }
  } catch (error) {
    console.error("Error fetching purchases:", error); // Detailed error log
    res.status(500).json({ message: "Error fetching purchases" }); // More user-friendly error message
  }
};
const getAllPurchaseReturn = async (req, res) => {
  try {
    // Construct query object
    const query = {
      owner: req.user._id, // Retrieve only the purchases of the authenticated user
    };

    // Log the final query object
    console.log("Query Object:", query);

    const purchases = await Purchase.find(query, {
      _id: 1,
      voucherType: 1,
      transactionDate: 1,
      description: 1,
      voucherNumber: 1,
      creditPeriod: 1,
      creditAmount: 1,
      creditDueDate: 1,
      purposeOfPayment: 1,
      authorizedBy: 1,
      purchasedTo: 1,
      purchasedBy: 1,
      owner: 1,
      debitLedgers: 1,
      creditLedgers: 1,
      balanceBillByBill: 1,
      checkCreditDays: 1,
      thisPurchase: 1,
      paidAmount: 1,
      subTotal: 1,
      total: 1,
      taxRate: 1,
      taxAmount: 1,
      taxName: 1,
      items: 1,
    })
      .populate("purchasedBy", "companyName") // Populate purchasedBy with only companyName
      .populate("purchasedTo", "companyName") // Populate purchasedTo with only companyName
      .populate("authorizedBy", "name") // Populate authorizedBy with only name field
      .sort({ voucherNumber: 1 })
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    if (purchases.length > 0) {
      return res.status(200).json(purchases);
    } else {
      return res.status(200).json([]); // Return an empty array if no matches found
    }
  } catch (error) {
    console.error("Error fetching purchases:", error); // Detailed error log
    res.status(500).json({ message: "Error fetching purchases" }); // More user-friendly error message
  }
};

// Function to handle purchases and update inventory

// Function to create a new purchase and update inventory
// const createPurchase = async (req, res) => {
//   try {
//     const newPurchase = new Purchase({
//       ...req.body,
//       owner: req.user._id, // Set owner from authenticated user
//     });

//     // Save the new purchase document to the database
//     const savedPurchase = await newPurchase.save(); // You need to save the new purchase

//     // Check if the purchase was saved successfully
//     if (savedPurchase) {
//       res.status(201).json(savedPurchase);
//     } else {
//       res.status(500).json({ message: "Failed to save purchase." }); // Updated error message
//     }
//   } catch (error) {
//     console.error("Error creating purchase:", error); // Log error
//     res.status(500).json({ message: error.message });
//   }
// };

const createPurchase = async (req, res) => {
  try {
    // Initialize an array to hold the inventory operations
    const inventoryUpdates = [];

    // Update inventory for each item in the purchase
    for (const item of req.body.items) {
      const {
        stockName,
        quantity,
        stockGroup,

        hsnCode, // New field for HSN Code
        rate,
        taxRate,
        taxAmount,
        amount,
        serialNumber,
      } = item;

      // Create or update the inventory item
      const inventoryItem = await Inventory.findOneAndUpdate(
        { stockName: stockName, hsnCode: hsnCode }, // Use stockName and hsnCode for unique identification
        {
          $inc: { quantityAvailable: quantity }, // Increment the quantity
          stockGroup, // Set stockGroup
          // Set stockGroupName
          rate, // Set rate
          taxRate, // Set taxRate
          taxAmount, // Set taxAmount
          amount, // Set amount
          serialNumber, // Set serialNumber
          owner: req.user._id, // Set owner for the inventory item
        },
        {
          new: true,
          upsert: true, // Create if not exists
          setDefaultsOnInsert: true, // Set defaults if creating a new item
          runValidators: true, // Validate schema on insert
        }
      );

      // Add the inventory item to the updates array if needed
      inventoryUpdates.push(inventoryItem);
    }

    // After updating the inventory, create the purchase
    const newPurchase = new Purchase({
      ...req.body,
      owner: req.user._id,
    });

    const savedPurchase = await newPurchase.save();

    res.status(201).json(savedPurchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createPurchase;

module.exports = createPurchase;

// Update a purchase by ID
const updatePurchaseById = async (req, res) => {
  const { id } = req.params; // Get purchase ID from request parameters

  try {
    // Find the purchase by ID and update it with the data from the request body
    const updatedPurchase = await Purchase.findByIdAndUpdate(
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

    const purchases = await Purchase.find(query).sort({ voucherNumber: 1 });

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
    const purchase = await Purchase.findById(req.params.id)
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
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check ownership
    if (purchase.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this purchase.",
      });
    }

    await Purchase.findByIdAndDelete(req.params.id);
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
  getAllPurchaseReturn,
};
