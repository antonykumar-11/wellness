// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/antony"); // Adjust the path according to your project structure

// Route to create a new transaction
router.post("/expenses", transactionController.createTransaction);

// Route to get all transactions
router.get("/expenses", transactionController.getTransactions);

// Route to get a single transaction by ID
router.get("/transactions/:id", transactionController.getTransactionById);

// Route to update a transaction by ID
router.put("/transactions/:id", transactionController.updateTransaction);

// Route to delete a transaction by ID
router.delete("/transactions/:id", transactionController.deleteTransaction);

module.exports = router;
