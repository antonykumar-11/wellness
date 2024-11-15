const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentSchema");

// Update a transaction
router.put("/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTransaction = await Payment.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// Delete a transaction
router.delete("/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;
