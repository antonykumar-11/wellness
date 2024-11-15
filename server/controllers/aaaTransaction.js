const Ledger = require("../models/Ledger");
const Transaction = require("../models/Transaction");

exports.createLedger = async (req, res) => {
  try {
    const { name, type, openingBalance } = req.body;
    const newLedger = new Ledger({
      name,
      type,
      openingBalance,
      currentBalance: openingBalance,
    });
    await newLedger.save();
    res.status(201).json(newLedger);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLedgerDetails = async (req, res) => {
  try {
    const { ledgerName } = req.params;
    const ledger = await Ledger.findOne({ name: ledgerName });

    if (!ledger) {
      return res.status(404).json({ error: "Ledger not found" });
    }

    const transactions = await Transaction.find({
      $or: [{ debitLedgerId: ledger._id }, { creditLedgerId: ledger._id }],
    });

    res.json({
      ledger,
      transactions,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const Ledger = require("../models/Ledger");
const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { debitLedgerName, creditLedgerName, amount, description } = req.body;

    // Find or create the debit ledger
    let debitLedger = await Ledger.findOne({ name: debitLedgerName });
    if (!debitLedger) {
      debitLedger = new Ledger({
        name: debitLedgerName,
        type: "Asset",
        openingBalance: 0,
        currentBalance: 0,
      });
      await debitLedger.save();
    }

    // Find or create the credit ledger
    let creditLedger = await Ledger.findOne({ name: creditLedgerName });
    if (!creditLedger) {
      creditLedger = new Ledger({
        name: creditLedgerName,
        type: "Liability",
        openingBalance: 0,
        currentBalance: 0,
      });
      await creditLedger.save();
    }

    // Create the transaction
    const transaction = new Transaction({
      debitLedgerId: debitLedger._id,
      creditLedgerId: creditLedger._id,
      amount,
      description,
      date: new Date(),
    });

    // Update the ledger balances
    debitLedger.currentBalance += amount; // Debit increases balance
    creditLedger.currentBalance -= amount; // Credit decreases balance

    await transaction.save();
    await debitLedger.save();
    await creditLedger.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");

router.post("/create", ledgerController.createLedger);
router.get("/:ledgerName", ledgerController.getLedgerDetails);

module.exports = router;
