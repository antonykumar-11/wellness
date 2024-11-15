const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseExpense");

// Create a new expense
router.post("/expenses", expenseController.createExpense);

// Get all expenses
router.get("/expenses", expenseController.getExpenses);

// Get a single expense by ID
router.get("/expenses/:id", expenseController.getExpenseById);

// Update an expense by ID
router.put("/expenses/:id", expenseController.updateExpense);

// Delete an expense by ID
router.delete("/expenses/:id", expenseController.deleteExpense);

module.exports = router;
