const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/recieptVoucher");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Create a new receipt
router.post("/", isAuthenticatedUser, receiptController.createReceipt);
router.get(
  "/check",
  isAuthenticatedUser,
  receiptController.getAllVoucherNumbers
);
// Get all receipts
router.get("/", isAuthenticatedUser, receiptController.getAllReceipts);

// Get a receipt by ID
router.get("/:id", isAuthenticatedUser, receiptController.getReceiptById);

// Update a receipt by ID
router.put("/:id", isAuthenticatedUser, receiptController.updateReceipt);

// Delete a receipt by ID
router.delete("/:id", isAuthenticatedUser, receiptController.deleteReceipt);

module.exports = router;
