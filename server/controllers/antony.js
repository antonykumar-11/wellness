const Transaction = require("../models/antony"); // Adjust the path according to your project structure
const Transaction1 = require("../models/antony1");
exports.createTransaction = async (req, res) => {
  try {
    const {
      date,
      debitAccount,
      debitDescription,
      debitAmount,
      creditAccount,
      creditDescription,
      creditAmount,
    } = req.body;

    // Validate required fields
    if (
      !date ||
      !debitAccount ||
      !debitDescription ||
      debitAmount === undefined ||
      !creditAccount ||
      !creditDescription ||
      creditAmount === undefined
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create and save the transaction
    const transaction = new Transaction({
      date,
      debitAccount,
      debitDescription,
      debitAmount,
      creditAccount,
      creditDescription,
      creditAmount,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Function to fetch all transactions (optional, for listing purposes)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
