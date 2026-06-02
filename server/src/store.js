const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/expenses.json');
const BUDGET_FILE = path.join(__dirname, '../../data/budgets.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readExpenses() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeExpenses(expenses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

function readBudgets() {
  try {
    if (!fs.existsSync(BUDGET_FILE)) return {};
    const raw = fs.readFileSync(BUDGET_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeBudgets(budgets) {
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(budgets, null, 2));
}

module.exports = { readExpenses, writeExpenses, readBudgets, writeBudgets };
