// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/antony3"); // Adjust the path according to your project structure
const { isAuthenticatedUser } = require("../middlewares/authenticate"); // Import the authentication middleware
// Route to get all transactions
router.get(
  "/expenses",
  isAuthenticatedUser,
  transactionController.getAllTransactions
);
router.get(
  "/assets",
  isAuthenticatedUser,
  transactionController.getAllTransactionsAssets
);

module.exports = router;
