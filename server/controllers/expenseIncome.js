const Income = require("../models/expenseIncome");

// Create a new income entry
exports.createIncome = async (req, res) => {
  try {
    const { title, type, amount, date, category, description } = req.body;
    const newIncome = new Income({
      title,
      type,
      amount,
      date,
      category,
      description,
    });
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all income entries
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single income entry by ID
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an income entry by ID
exports.updateIncome = async (req, res) => {
  try {
    const { title, type, amount, date, category, description } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { title, type, amount, date, category, description },
      { new: true, runValidators: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an income entry by ID
exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);
    if (!deletedIncome) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
