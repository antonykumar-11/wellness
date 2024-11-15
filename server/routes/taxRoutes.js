const express = require("express");
const router = express.Router();
const taxController = require("../controllers/taxControllers");

// Create a new tax
router.post("/taxes", taxController.createTax);

// Get all taxes
router.get("/taxes", taxController.getTaxes);

// Get a specific tax by ID
router.get("/taxes/:id", taxController.getTaxById);

// Update a tax by ID
router.put("/taxes/:id", taxController.updateTax);

// Delete a tax by ID
router.delete("/taxes/:id", taxController.deleteTax);

module.exports = router;
