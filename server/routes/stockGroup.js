const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const stockGroupController = require("../controllers/stockGroup");

// Create a new stock group
router.post(
  "/createStockGroup",
  isAuthenticatedUser,
  stockGroupController.createStockGroup
);

// Get all stock groups for the authenticated user
router.get(
  "/createStockGroup",
  isAuthenticatedUser,
  stockGroupController.getAllStockGroups
);

// Get a stock group by ID
router.get(
  "/createStockGroup/:id",
  isAuthenticatedUser,
  stockGroupController.getStockGroupById
);

// Update a stock group by ID
router.put(
  "/createStockGroup/:id",
  isAuthenticatedUser,
  stockGroupController.updateStockGroup
);

// Delete a stock group by ID
router.delete(
  "/createStockGroup/:id",
  isAuthenticatedUser,
  stockGroupController.deleteStockGroup
);

module.exports = router;
