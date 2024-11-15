const express = require("express");
const router = express.Router();
const {
  getAllTransactionsHandler,
} = require("../controllers/getAllTransactions");

// Route to get all transactions
router.get("/", getAllTransactionsHandler);

module.exports = router;
