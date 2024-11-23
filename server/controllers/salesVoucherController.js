// const mongoose = require("mongoose");
// const Sales = require("../models/salesSchema"); // Adjust the path if necessary

// // Create a new sale
// const createSales = async (req, res) => {
//   try {
//     const newSale = new Sales(req.body);
//     const savedSale = await newSale.save();
//     res.status(201).json(savedSale);
//     console.log("Create Sale:", savedSale);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a sale by ID
// const updateSales = async (req, res) => {
//   const { id } = req.params; // Extract the ID from the request parameters

//   try {
//     // Validate and sanitize your items or other fields here if necessary
//     const update = req.body.updatedPurchase;

//     // Find the existing sale by ID and update it with the new data
//     const updatedSale = await Sales.findByIdAndUpdate(
//       id,
//       { $set: update },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure that the validation is run on the updated data
//       }
//     );

//     // If no sale is found with the provided ID, return a 404 error
//     if (!updatedSale) {
//       return res.status(404).json({ message: "Sale not found" });
//     }

//     // Send the updated sale as a response
//     res.status(200).json(updatedSale);
//     console.log("Updated Sale:", updatedSale);
//   } catch (error) {
//     // Handle errors, e.g., validation errors, database errors, etc.
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all sales
// const getAllSales = async (req, res) => {
//   try {
//     const sales = await Sales.find()
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     res.status(200).json(sales); // Sends the fetched sales as JSON
//     console.log("Get Sales:", sales);
//   } catch (error) {
//     res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
//   }
// };

// // Get a single sale by ID
// const getSalesById = async (req, res) => {
//   try {
//     const sale = await Sales.findById(req.params.id)
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     if (!sale) {
//       return res.status(404).json({ message: "Sale not found" });
//     }

//     res.status(200).json(sale);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a sale by ID
// const deleteSales = async (req, res) => {
//   try {
//     const deletedSale = await Sales.findByIdAndDelete(req.params.id);
//     if (!deletedSale)
//       return res.status(404).json({ message: "Sale not found" });
//     res.status(200).json({ message: "Sale deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getAllSales,
//   getSalesById,
//   updateSales,
//   deleteSales,
//   createSales,
// };
const mongoose = require("mongoose");
const Sales = require("../models/salesSchema"); // Adjust the path if necessary
const Inventory = require("../models/stockItems");
const getAllVoucherNumber = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const vouchers = await Sales.find(
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
// const getAllVoucherNumbers = async (req, res) => {
//   console.log("req.body", req.body);
//   const { thisPurchase } = req.body;

//   try {
//     const query = {
//       thisPurchase, // Match the purchase type
//       owner: req.user._id, // Match authenticated user
//       status: { $in: ["Unsettled", "Partially Settled"] }, // Filter by status
//     };

//     const purchases = await Sales.find(query).sort({ voucherNumber: 1 });
//     console.log("purchases", purchases);
//     const purchasesWithDetails = purchases.map((purchase) => ({
//       ...purchase._doc,
//       purchasedBy: purchase.purchasedBy || null,
//       purchasedTo: purchase.purchasedTo || null,
//     }));

//     if (purchasesWithDetails.length > 0) {
//       return res.status(200).json(purchasesWithDetails);
//     } else {
//       return res.status(200).json([]);
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Create a new sale

const getAllVoucherNumbers = async (req, res) => {
  console.log("req.body", req.body); // Log the request body to see the incoming data
  const { thisPurchase } = req.body; // Extract 'thisPurchase' from the request body

  try {
    const query = {
      thisPurchase, // Match the purchase field (e.g., 'New bill')
      owner: req.user._id, // Ensure only the purchases of the authenticated user are retrieved
      status: { $in: ["Unsettled", "Partially Settled"] }, // Match status values
    };

    const purchases = await Sales.find(query)
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

const createSales = async (req, res) => {
  try {
    // Create a new sale document
    const newSale = new Sales({
      ...req.body, // Spread the request body to create the sale document
      owner: req.user._id, // Set the owner to the logged-in user
    });

    // Save the sale first
    const savedSale = await newSale.save();

    // Handle inventory updates for each item in the sale
    for (const item of req.body.items) {
      const { stockName, quantity, hsnCode } = item; // Extract relevant fields

      // Update the inventory: decrement the quantityAvailable
      const inventoryItem = await Inventory.findOneAndUpdate(
        { stockName, hsnCode }, // Ensure you use both stockName and hsnCode for unique identification
        { $inc: { quantityAvailable: -quantity } }, // Decrement the quantity
        { new: true }
      );
      console.log("inventoryItem", inventoryItem);
      // Optional: Handle case where inventory item is not found
      if (!inventoryItem) {
        console.warn(
          `Inventory item not found for stockName: ${stockName} and hsnCode: ${hsnCode}`
        );
        // You may choose to handle this differently, like throwing an error or logging
      }
    }

    // Send the response back
    res.status(201).json(savedSale);
    console.log("Create Sale:", savedSale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createSales;

const updateSales = async (req, res) => {
  console.log("Request Body:", req.body);
  const { id } = req.params;

  // Ensure that purchasedTo and purchasedBy are ObjectIds (not null or empty)
  if (
    !mongoose.Types.ObjectId.isValid(req.body.purchasedTo) ||
    !mongoose.Types.ObjectId.isValid(req.body.purchasedBy)
  ) {
    return res.status(400).json({
      message: "Invalid ObjectId for purchasedTo or purchasedBy",
    });
  }

  try {
    const updatedSales = await Sales.findByIdAndUpdate(
      id,
      {
        $set: {
          "authorizedBy.name": req.body.authorizedBy?.name || null,
          "authorizedBy.designation":
            req.body.authorizedBy?.designation || null,
          "authorizedBy.signature": req.body.authorizedBy?.signature || null,
          debitLedgers: req.body.debitLedgers || [],
          creditLedgers: req.body.creditLedgers || [],
          items: req.body.items || [],
          transactionDate: req.body.transactionDate || null,
          voucherNumber: req.body.voucherNumber || "",
          creditPeriod: req.body.creditPeriod || null,
          creditDueDate: req.body.creditDueDate || "",
          description: req.body.description || "",
          thisPurchase: req.body.thisPurchase || "",
          total: req.body.total || 0,
          taxAmount: req.body.taxAmount || 0,
          taxRate: req.body.taxRate || 0,
          status: req.body.status || "Unsettled",
          // Ensure purchasedTo and purchasedBy are valid ObjectId values
          purchasedTo: mongoose.Types.ObjectId(req.body.purchasedTo),
          purchasedBy: mongoose.Types.ObjectId(req.body.purchasedBy),
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
    const sales = await Sales.find({ owner: req.user._id }) // Fetch only the user's sales
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
    const sale = await Sales.findOne({
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
    console.log("sales", sale);
  } catch (error) {
    res.status(500).json({ message: "please fill all item" });
  }
};

// Delete a sale by ID
const deleteSales = async (req, res) => {
  try {
    const deletedSale = await Sales.findOneAndDelete({
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
