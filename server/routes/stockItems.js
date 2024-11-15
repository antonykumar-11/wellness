const express = require("express");
const router = express.Router();
const stockItemController = require("../controllers/stockItems");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Create a new stock item under a stock group
router.post(
  "/stock-items",
  isAuthenticatedUser,
  stockItemController.createStockItem
);

// Get all stock items under a specific stock group
router.get(
  "/stock-items",
  isAuthenticatedUser,
  stockItemController.getStockItemsByGroup
);

// Get a single stock item by ID
router.get(
  "/stock-items/:id",
  isAuthenticatedUser,
  stockItemController.getStockItemById
);

// Update a stock item by ID
router.put(
  "/stock-items/:id",
  isAuthenticatedUser,
  stockItemController.updateStockItem
);

// Delete a stock item by ID
router.delete(
  "/stock-items/:id",
  isAuthenticatedUser,
  stockItemController.deleteStockItem
);

module.exports = router;
