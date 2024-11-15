const express = require("express");
const router = express.Router();
const primaryLedgerController = require("../controllers/p&l");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Get all Primary Ledgers
router.get(
  "/expenses",
  isAuthenticatedUser,
  primaryLedgerController.getAllTransactions
);
router.get(
  "/expensess",
  isAuthenticatedUser,
  primaryLedgerController.getAllTransactionssinsle
);
module.exports = router;
