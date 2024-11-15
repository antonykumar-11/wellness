const Expense = require("../models/expenseExpense");

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category, description } = req.body;
    const newExpense = new Expense({
      title,
      amount,
      date,
      category,
      description,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, date, category, description } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, date, category, description },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
