const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentControllers"); // Adjust to your Payment controller path
const { isAuthenticatedUser } = require("../middlewares/authenticate");

// Create a new Payment
router.post("/", isAuthenticatedUser, paymentController.createPayment);

// Get all Payments
router.get("/", isAuthenticatedUser, paymentController.getAllPayments);
// Get all Payments
router.get(
  "/check",
  isAuthenticatedUser,
  paymentController.getAllVoucherNumbers
);
// Get a single Payment by ID
router.get("/:id", isAuthenticatedUser, paymentController.getPaymentById);

// Update a Payment by ID
router.put("/:id", isAuthenticatedUser, paymentController.updatePayment);

// Delete a Payment by ID
router.delete("/:id", isAuthenticatedUser, paymentController.deletePayment);

module.exports = router;
// Get all voucher numbers from purchases
