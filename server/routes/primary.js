const express = require("express");
const router = express.Router();
const primaryLedgerController = require("../controllers/primaryLedger");

// Create a new Primary Ledger
router.post("/", primaryLedgerController.createPrimaryLedger);

// Get all Primary Ledgers
router.get("/", primaryLedgerController.getPrimaryLedgers);

// Get a Primary Ledger by ID
router.get("/:id", primaryLedgerController.getPrimaryLedgerById);

// Update a Primary Ledger by ID
router.put("/:id", primaryLedgerController.updatePrimaryLedger);

// Delete a Primary Ledger by ID
router.delete("/:id", primaryLedgerController.deletePrimaryLedger);

module.exports = router;
