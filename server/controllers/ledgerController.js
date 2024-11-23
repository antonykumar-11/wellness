const Ledger = require("../models/ledgerSchema");

// Create a new ledger
exports.createLedger = async (req, res) => {
  try {
    const newLedger = new Ledger({
      ...req.body,
      owner: req.user.id, // Ensure owner is set correctly
    });

    const savedLedger = await newLedger.save();
    res.status(201).json(savedLedger);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Ledger name must be unique per user." });
    }
    res.status(400).json({ message: err.message });
  }
};

// Get all ledgers
exports.getAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find({ owner: req.user.id }); // Filter by owner
    res.status(200).json(ledgers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all ledgers
// exports.getAllLedgersPay = async (req, res) => {
//   const voucher1 = "PayMaster"; // Set voucher1 to "PayMaster"
//   const group = "Cash-in-Hand"; // Set group to "Cash-in-Hand"
//   const voucherType = "payHead";
//   try {
//     // Build the query object with optional _id filtering
//     const query = {
//       owner: req.user._id, // Match on owner (user ID)
//       voucherType,
//       voucher1, // Match on voucher1 ("PayMaster")
//       group, // Match on group ("Cash-in-Hand")
//     };

//     // If an ID is passed in params, add it to the query
//     if (req.params.id) {
//       query._id = req.params.id; // Filter by _id if provided
//     }

//     // Find ledgers that match the specific criteria
//     const ledgers = await Ledger.find(query);

//     console.log("ledgers bbbbbb", ledgers);

//     // If no ledgers found, return 404 response
//     if (ledgers.length === 0) {
//       return res.status(404).json({ message: "No ledgers found." });
//     }

//     // Return the found ledgers
//     res.status(200).json(ledgers);
//   } catch (err) {
//     // Return a 500 error if something goes wrong
//     res.status(500).json({ message: err.message });
//   }
// };
// exports.getAllLedgersPay = async (req, res) => {
//   const group = "Cash-in-Hand"; // Fixed group value
//   const voucher1 = ["PayMaster", "otherType"]; // Array of voucher types to filter by
//   const payHeadType = ["Staff", "otherType"]; // Array of pay head types to filter by

//   try {
//     const ledgers = await Ledger.find({
//       owner: req.user.id,
//       $or: [
//         { group: group },
//         { voucher1: { $in: voucher1 } },
//         { payHeadType: { $in: payHeadType } }, // Combine the conditions correctly
//       ],
//     });

//     // If no ledgers found, return a 404
//     if (ledgers.length === 0) {
//       return res.status(404).json({ message: "No ledgers found." });
//     }

//     // Return the found ledgers
//     res.status(200).json(ledgers);
//   } catch (err) {
//     console.error("Error fetching ledgers:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getAllLedgersPay = async (req, res) => {
  try {
    // Fetch all ledgers for the user
    const ledgers = await Ledger.find({ owner: req.user.id });

    // If no ledgers found, return a 404
    if (ledgers.length === 0) {
      return res.status(404).json({ message: "No ledgers found." });
    }

    // Return the found ledgers
    res.status(200).json(ledgers);
  } catch (err) {
    console.error("Error fetching ledgers:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all ledgers with specific StockName
exports.getAllLedgersall = async (req, res) => {
  try {
    const stockName = "ithuStock"; // Specify the StockName you want to filter by
    const ledgers = await Ledger.find({
      owner: req.user.id,
      StockName: stockName, // Filter by StockName
    });

    // Optional: Transform the response if needed
    const response = ledgers.map((ledger) => ({
      _id: ledger._id,
      name: ledger.name,
      openingBalance: ledger.openingBalance,
      group: ledger.group,
      nature: ledger.nature,
      under: ledger.under,
      StockName: ledger.StockName,
      category: ledger.category,
      payHeadType: ledger.payHeadType,
      date: ledger.date,
      description: ledger.description,
      calculationType: ledger.calculationType,
      owner: ledger.owner,
      days: ledger.days,
      operations: ledger.operations,
      __v: ledger.__v,
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLedgersallPurchase = async (req, res) => {
  try {
    const stockName = "ithuStock"; // Specify the StockName you want to filter by
    const ledgers = await Ledger.find({
      owner: req.user.id,
      StockName: stockName, // Filter by StockName
    });

    // Optional: Transform the response if needed
    const response = ledgers.map((ledger) => ({
      _id: ledger._id,
      name: ledger.name,
      openingBalance: ledger.openingBalance,
      group: ledger.group,
      nature: ledger.nature,
      under: ledger.under,
      StockName: ledger.StockName,
      category: ledger.category,
      payHeadType: ledger.payHeadType,
      date: ledger.date,
      description: ledger.description,
      calculationType: ledger.calculationType,
      owner: ledger.owner,
      days: ledger.days,
      operations: ledger.operations,
      __v: ledger.__v,
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single ledger by ID
exports.getLedgerById = async (req, res) => {
  console.log(" _id: req.params.id,", req.params.id);
  console.log(" _id: req.params.id,", req.user.id);
  try {
    const ledger = await Ledger.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }); // Filter by owner
    if (!ledger) {
      return res.status(404).json({ message: "Ledger not found" });
    }
    res.status(200).json(ledger);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a ledger by ID
exports.updateLedger = async (req, res) => {
  try {
    const updatedLedger = await Ledger.findOneAndUpdate(
      { _id: req.params.id }, // Filter by owner
      req.body,
      { new: true }
    );
    if (!updatedLedger) {
      return res.status(404).json({ message: "Ledger not found" });
    }
    res.status(200).json(updatedLedger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a ledger by ID
exports.deleteLedger = async (req, res) => {
  try {
    const deletedLedger = await Ledger.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    }); // Filter by owner
    if (!deletedLedger) {
      return res.status(404).json({ message: "Ledger not found" });
    }
    res.status(200).json({ message: "Ledger deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
