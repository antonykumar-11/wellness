const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const stockCategoryController = require("../controllers/stockCategory");

// Create a new stock category under a stock group
router.post(
  "/createStockCategory",
  isAuthenticatedUser,
  stockCategoryController.createStockCategory
);

// Get all stock categories for the authenticated user
router.get(
  "/createStockCategory",
  isAuthenticatedUser,
  stockCategoryController.getAllStockCategories
);

// Get a stock category by ID
router.get(
  "/createStockCategory/:id",
  isAuthenticatedUser,
  stockCategoryController.getStockCategoryById
);

// Update a stock category by ID
router.put(
  "/createStockCategory/:id",
  isAuthenticatedUser,
  stockCategoryController.updateStockCategory
);

// Delete a stock category by ID
router.delete(
  "/createStockCategory/:id",
  isAuthenticatedUser,
  stockCategoryController.deleteStockCategory
);

module.exports = router;
