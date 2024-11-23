const express = require("express");
const router = express.Router();
const journalVoucherController = require("../controllers/journalControllers");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Create a new Journal Voucher
router.post(
  "/",
  isAuthenticatedUser,
  journalVoucherController.createJournalVoucher
);

// Get all Journal Vouchers
router.get(
  "/",
  isAuthenticatedUser,
  journalVoucherController.getAllJournalVouchers
);
router.get(
  "/check",
  isAuthenticatedUser,
  journalVoucherController.getAllJournalVoucher
);
// Get a single Journal Voucher by ID
router.get(
  "/:id",
  isAuthenticatedUser,
  isAuthenticatedUser,
  journalVoucherController.getJournalVoucherById
);

// Update a Journal Voucher by ID
router.put(
  "/:id",
  isAuthenticatedUser,
  journalVoucherController.updateJournalVoucher
);

// Delete a Journal Voucher by ID
router.delete(
  "/:id",
  isAuthenticatedUser,
  journalVoucherController.deleteJournalVoucher
);

module.exports = router;
