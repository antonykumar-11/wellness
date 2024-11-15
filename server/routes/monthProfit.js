const express = require("express");
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/monthTransaction");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();

// GET all transactions
router.get("/", isAuthenticatedUser, getTransactions);

// GET a transaction by ID
router.get("/:id", isAuthenticatedUser, getTransactionById);

// POST a new transaction
router.post("/", isAuthenticatedUser, createTransaction);

// PUT update a transaction by ID
router.put("/:id", isAuthenticatedUser, updateTransaction);

// DELETE a transaction by ID
router.delete("/:id", isAuthenticatedUser, deleteTransaction);

module.exports = router;
