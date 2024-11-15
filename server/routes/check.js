// routes/ledgerRoutes.js

const express = require("express");
const { fetchLedgersWithTransactions } = require("../controllers/checck");

const router = express.Router();

router.get("/ledgers", fetchLedgersWithTransactions);

module.exports = router;
