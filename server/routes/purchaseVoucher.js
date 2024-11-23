const express = require("express");
const router = express.Router();
const purchaseVoucherController = require("../controllers/purchase");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
router.get(
  "/check",
  isAuthenticatedUser,
  purchaseVoucherController.getAllVoucherNumbers
);
router.post(
  "/checks",
  isAuthenticatedUser,
  purchaseVoucherController.getAllVoucherNumber
);
router.get(
  "/some",
  isAuthenticatedUser,
  purchaseVoucherController.getAllPurchaseReturn
);
// Create a new Purchase Voucher
router.post("/", isAuthenticatedUser, purchaseVoucherController.createPurchase);

// Get all Purchase Vouchers
router.get("/", isAuthenticatedUser, purchaseVoucherController.getPurchases);

// Get a single Purchase Voucher by ID
router.get(
  "/:id",
  isAuthenticatedUser,
  purchaseVoucherController.getPurchaseById
);

// Update a Purchase Voucher by ID
router.put(
  "/:id",
  isAuthenticatedUser,
  purchaseVoucherController.updatePurchaseById
);

// Delete a Purchase Voucher by ID
router.delete(
  "/:id",
  isAuthenticatedUser,
  purchaseVoucherController.deletePurchaseById
);

module.exports = router;
