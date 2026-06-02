const express = require('express');
const { readBudgets, writeBudgets } = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// GET /api/budgets
router.get('/', (req, res) => {
  const budgets = readBudgets();
  res.json(budgets);
});

// PUT /api/budgets — set budget for a category
router.put('/', (req, res) => {
  const { category, amount } = req.body;

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Valid category is required' });
  }

  if (amount === undefined || isNaN(Number(amount)) || Number(amount) < 0) {
    return res.status(400).json({ error: 'Amount must be a non-negative number' });
  }

  const budgets = readBudgets();
  budgets[category] = Number(amount);
  writeBudgets(budgets);

  res.json(budgets);
});

module.exports = router;
