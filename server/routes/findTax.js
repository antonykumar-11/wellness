const express = require("express");
const router = express.Router();
const { findTaxRelatedLedger } = require("../controllers/findTax");

// Route to get all transactions
router.get("/find", findTaxRelatedLedger);

module.exports = router;
