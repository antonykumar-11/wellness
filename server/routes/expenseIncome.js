const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/expenseIncome");

// Create a new income entry
router.post("/", incomeController.createIncome);

// Get all income entries
router.get("/", incomeController.getAllIncomes);

// Get a single income entry by ID
router.get("/:id", incomeController.getIncomeById);

// Update an income entry by ID
router.put("/:id", incomeController.updateIncome);

// Delete an income entry by ID
router.delete("/:id", incomeController.deleteIncome);

module.exports = router;
