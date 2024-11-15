const Transaction = require("../models/monthPrifit");

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      owner: req.user._id,
    }).populate("owner");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "owner"
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};

// Create a new transaction
const createTransaction = async (req, res) => {
  const {
    invoiceNumber,
    vehicleNumber,
    ownerName,
    amount,
    gst,
    tds,
    ownerAmount,
    esi,
    pf,
    openingBalance,
    expense,
    closingBalance,
    transactionDate,
  } = req.body;

  try {
    // Check if a transaction with the same invoice number already exists
    const existingTransaction = await Transaction.findOne({ invoiceNumber });
    if (existingTransaction) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }

    // Create the new transaction if no duplicate is found
    const newTransaction = new Transaction({
      invoiceNumber,
      vehicleNumber,
      ownerName,
      amount,
      gst,
      tds,
      ownerAmount,
      esi,
      pf,
      openingBalance,
      expense,
      closingBalance,
      transactionDate,
      owner: req.user._id, // The logged-in user is the owner
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
