const mongoose = require("mongoose");
const SalesServise = require("../models/salesServiceSchema"); // Adjust the path if necessary

const Inventory = require("../models/stockItems"); // Inventory model
const getAllVoucherNumber = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const vouchers = await SalesServise.find(
      { owner: req.user._id }, // Filter by the authenticated user's ID
      { voucherNumber: 1, _id: 0 } // Only return voucherNumber
    ).sort({ voucherNumber: 1 });

    if (vouchers.length > 0) {
      return res.status(200).json(vouchers);
    } else {
      return res.status(200).json([{ voucherNumber: 0 }]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllVoucherNumbers = async (req, res) => {
  console.log("req.body", req.body); // Log the request body to see the incoming data
  const { thisPurchase } = req.body; // Extract 'thisPurchase' from the request body

  try {
    const query = {
      thisPurchase, // Match the purchase field (e.g., 'New bill')
      owner: req.user._id, // Ensure only the purchases of the authenticated user are retrieved
      status: { $in: ["Unsettled", "Partially Settled"] }, // Match status values
    };

    const purchases = await SalesServise.find(query)
      .populate("purchasedBy", "companyName") // Populate purchasedBy with only the companyName field
      .populate("purchasedTo", "companyName") // Populate purchasedTo with only the companyName field
      .sort({ voucherNumber: 1 });

    if (purchases.length > 0) {
      console.log("Retrieved Purchases:", purchases); // Log the retrieved purchases
      return res.status(200).json(purchases);
    } else {
      return res.status(200).json([]); // Return an empty array if no purchases found
    }
  } catch (error) {
    console.error("Error fetching purchases:", error); // Log the error
    res.status(500).json({ message: error.message }); // Handle any errors during the database operation
  }
};
// Function to handle sales and update inventory
const handleSale = async (saleData) => {
  const { items } = saleData; // Extract items from sale data

  for (const item of items) {
    // Find the item in the inventory by stockGroup and stockName
    const inventoryItem = await Inventory.findOne({
      stockGroup: item.stockGroup,
      stockName: item.stockName,
    });

    if (inventoryItem) {
      if (inventoryItem.quantityAvailable >= item.quantity) {
        // Subtract the sold quantity from inventory
        inventoryItem.quantityAvailable -= item.quantity;
        await inventoryItem.save(); // Save updated inventory item
      } else {
        throw new Error(
          `Not enough stock available for ${item.stockName}. Available: ${inventoryItem.quantityAvailable}, Required: ${item.quantity}`
        );
      }
    } else {
      throw new Error(`Inventory item not found for ${item.stockName}`);
    }
  }
};

// Function to create a new sale and update inventory
const createSales = async (req, res) => {
  try {
    // Create a new sale document
    const newSale = new SalesService({
      ...req.body, // Spread the request body to create the sale document
      owner: req.user._id, // Set the owner to the logged-in user
    });

    const savedSale = await newSale.save(); // Save new sale

    // Call handleSale to update inventory based on the sale
    await handleSale(savedSale); // Pass sale data to handleSale

    res.status(201).json(savedSale); // Respond with saved sale
    console.log("Create Sale:", savedSale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: error.message }); // Send error response
  }
};

// Update a sale by ID
// Update a sale by ID
const updateSales = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSales = await SalesServise.findByIdAndUpdate(
      id,
      {
        $set: {
          "authorizedBy.name": req.body.authorizedBy?.name,
          "authorizedBy.designation": req.body.authorizedBy?.designation,
          "authorizedBy.signature": req.body.authorizedBy?.signature,
          debitLedgers: req.body.debitLedgers,
          creditLedgers: req.body.creditLedgers,
          items: req.body.items,
          transactionDate: req.body.transactionDate,
          voucherNumber: req.body.voucherNumber,
          creditPeriod: req.body.creditPeriod,
          creditDueDate: req.body.creditDueDate,
          description: req.body.description,
          thisPurchase: req.body.thisPurchase,
          total: req.body.total,
          taxAmount: req.body.taxAmount,
          taxRate: req.body.taxRate,
          status: req.body.status,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSales) {
      return res.status(404).json({ message: "Sales voucher not found." });
    }

    res.status(200).json(updatedSales);
  } catch (error) {
    console.error("Error updating sales voucher:", error);
    res.status(500).json({ message: "Error updating sales voucher", error });
  }
};
// Get all sales for the logged-in user
const getAllSales = async (req, res) => {
  try {
    const sales = await SalesServise.find({ owner: req.user._id }) // Fetch only the user's sales
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    res.status(200).json(sales); // Sends the fetched sales as JSON
    console.log("Get Sales:", sales);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
  }
};

// Get a single sale by ID
const getSalesById = async (req, res) => {
  try {
    const sale = await SalesServise.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    })
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    if (!sale) {
      return res
        .status(404)
        .json({ message: "Sale not found or not authorized" });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "please fill all item" });
  }
};

// Delete a sale by ID
const deleteSales = async (req, res) => {
  try {
    const deletedSale = await SalesServise.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedSale)
      return res
        .status(404)
        .json({ message: "Sale not found or not authorized" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSales,
  getSalesById,
  updateSales,
  deleteSales,
  createSales,
  getAllVoucherNumbers,
  getAllVoucherNumber,
};
