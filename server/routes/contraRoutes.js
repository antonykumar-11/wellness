// routes/contraVouchers.js
const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate"); // Import the authentication middleware
const {
  createContraVoucher,
  getAllContraVouchers,
  getContraVoucherById,
  updateContraVoucher,
  deleteContraVoucher,
  getAllJournalVoucher,
} = require("../controllers/contraVoucher");

// Create a new Contra Voucher
router.post("/", isAuthenticatedUser, createContraVoucher);

// Get all Contra Vouchers
router.get("/", isAuthenticatedUser, getAllContraVouchers);
// Get all Contra Vouchers
router.get("/check", isAuthenticatedUser, getAllJournalVoucher);
// Get a single Contra Voucher by ID
router.get("/:id", isAuthenticatedUser, getContraVoucherById);

// Update a Contra Voucher
router.put("/:id", isAuthenticatedUser, updateContraVoucher);

// Delete a Contra Voucher
router.delete("/:id", isAuthenticatedUser, deleteContraVoucher);

module.exports = router;
