const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesVoucherController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Create a new sales record
router.post("/", isAuthenticatedUser, salesController.createSales);

// Get all sales records
router.get("/", isAuthenticatedUser, salesController.getAllSales);
// Get all sales records
router.post(
  "/checks",
  isAuthenticatedUser,
  salesController.getAllVoucherNumbers
);
// Get all sales records
router.get("/check", isAuthenticatedUser, salesController.getAllVoucherNumber);
// Get a sales record by ID
router.get("/:id", isAuthenticatedUser, salesController.getSalesById);

// Update a sales record by ID
router.put("/:id", isAuthenticatedUser, salesController.updateSales);

// Delete a sales record by ID
router.delete("/:id", isAuthenticatedUser, salesController.deleteSales);

module.exports = router;
