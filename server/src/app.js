const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
