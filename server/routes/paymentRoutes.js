const express = require("express");
const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getAllVoucherNumbers,
} = require("../controllers/paymentControllers");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();
router.get("/check", isAuthenticatedUser, getAllVoucherNumbers);
// Get all payments
router.get("/", isAuthenticatedUser, getPayments);

// Get a single payment by ID
router.get("/:id", isAuthenticatedUser, getPaymentById);

// Create a new payment
router.post("/", isAuthenticatedUser, createPayment);

// Update a payment by ID
router.put("/:id", isAuthenticatedUser, updatePayment);

// Delete a payment by ID
router.delete("/:id", isAuthenticatedUser, deletePayment);

module.exports = router;
