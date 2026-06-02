const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readExpenses, writeExpenses } = require('../store');

const router = express.Router();

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function validateExpense(body) {
  const errors = [];
  const { amount, category, date } = body;

  if (amount === undefined || amount === null || amount === '') {
    errors.push('Amount is required');
  } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!category) {
    errors.push('Category is required');
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!date) {
    errors.push('Date is required');
  } else {
    const d = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(d.getTime())) {
      errors.push('Date is invalid');
    } else if (d > today) {
      errors.push('Date cannot be in the future');
    }
  }

  return errors;
}

// GET /api/expenses — list with optional filters
router.get('/', (req, res) => {
  let expenses = readExpenses();

  const { category, startDate, endDate, search } = req.query;

  if (category && category !== 'All') {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    expenses = expenses.filter((e) => new Date(e.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  if (search) {
    const q = search.toLowerCase();
    expenses = expenses.filter(
      (e) =>
        e.note?.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(expenses);
});

// GET /api/expenses/summary — aggregated stats
router.get('/summary', (req, res) => {
  const expenses = readExpenses();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const totalPerCategory = VALID_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = thisMonth
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  const highest = thisMonth.length
    ? thisMonth.reduce((max, e) => (e.amount > max.amount ? e : max), thisMonth[0])
    : null;

  res.json({ totalThisMonth, totalPerCategory, highestExpense: highest });
});

// GET /api/expenses/export — CSV download
router.get('/export', (req, res) => {
  let expenses = readExpenses();
  const { category, startDate, endDate } = req.query;

  if (category && category !== 'All') {
    expenses = expenses.filter((e) => e.category === category);
  }
  if (startDate) {
    const start = new Date(startDate);
    expenses = expenses.filter((e) => new Date(e.date) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  const header = 'id,amount,category,date,note,createdAt';
  const rows = expenses.map(
    (e) =>
      `${e.id},${e.amount},${e.category},${e.date},"${(e.note || '').replace(/"/g, '""')}",${e.createdAt}`
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send([header, ...rows].join('\n'));
});

// GET /api/expenses/:id
router.get('/:id', (req, res) => {
  const expenses = readExpenses();
  const expense = expenses.find((e) => e.id === req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
});

// POST /api/expenses
router.post('/', (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { amount, category, date, note } = req.body;
  const expense = {
    id: uuidv4(),
    amount: Number(amount),
    category,
    date,
    note: note || '',
    createdAt: new Date().toISOString(),
  };

  const expenses = readExpenses();
  expenses.push(expense);
  writeExpenses(expenses);

  res.status(201).json(expense);
});

// PUT /api/expenses/:id
router.put('/:id', (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Expense not found' });

  const { amount, category, date, note } = req.body;
  expenses[index] = {
    ...expenses[index],
    amount: Number(amount),
    category,
    date,
    note: note || '',
    updatedAt: new Date().toISOString(),
  };

  writeExpenses(expenses);
  res.json(expenses[index]);
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Expense not found' });

  expenses.splice(index, 1);
  writeExpenses(expenses);
  res.status(204).send();
});

module.exports = router;
