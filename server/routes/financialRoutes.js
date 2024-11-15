const express = require("express");
const router = express.Router();
const {
  calculateTradingAccount,
  calculateProfitLossAccount,
  calculateBalanceSheet,
} = require("../controllers/financialStatement");

// Trading Account route
router.get("/trading-account", async (req, res) => {
  try {
    const result = await calculateTradingAccount();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profit and Loss Account route
router.get("/profit-loss-account", async (req, res) => {
  try {
    const result = await calculateProfitLossAccount();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Balance Sheet route
router.get("/balance-sheet", async (req, res) => {
  try {
    const result = await calculateBalanceSheet();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
