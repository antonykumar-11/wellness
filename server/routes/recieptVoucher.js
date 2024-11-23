const express = require("express");
const router = express.Router();
const receiptVoucherController = require("../controllers/recieptVoucher"); // Adjusted the controller import
const { isAuthenticatedUser } = require("../middlewares/authenticate");

// Create a new Receipt Voucher
router.post(
  "/",
  isAuthenticatedUser,
  receiptVoucherController.createReceiptVoucher // Adjusted to use createReceiptVoucher
);

// Get all Receipt Vouchers
router.get(
  "/",
  isAuthenticatedUser,
  receiptVoucherController.getAllReceiptVouchers // Adjusted to use getAllReceiptVouchers
);
// Get all Receipt Vouchers
router.get(
  "/check",
  isAuthenticatedUser,
  receiptVoucherController.getAllVoucherNumbers // Adjusted to use getAllReceiptVouchers
);
// Get a single Receipt Voucher by ID
router.get(
  "/:id",
  isAuthenticatedUser,
  receiptVoucherController.getReceiptVoucherById // Adjusted to use getReceiptVoucherById
);

// Update a Receipt Voucher by ID
router.put(
  "/:id",
  isAuthenticatedUser,
  receiptVoucherController.updateReceiptVoucher // Adjusted to use updateReceiptVoucher
);

// Delete a Receipt Voucher by ID
router.delete(
  "/:id",
  isAuthenticatedUser,
  receiptVoucherController.deleteReceiptVoucher // Adjusted to use deleteReceiptVoucher
);

module.exports = router;
