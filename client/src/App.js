import React, { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import CategoryChart from './components/CategoryChart';
import Filters from './components/Filters';
import BudgetModal from './components/BudgetModal';
import { getExportUrl } from './api/expenses';
import styles from './App.module.css';

export default function App() {
  const {
    expenses, summary, budgets, filters, setFilters,
    loading, error, addExpense, editExpense, removeExpense, saveBudget,
  } = useExpenses();

  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  async function handleFormSubmit(data) {
    if (editingExpense) {
      await editExpense(editingExpense.id, data);
      setEditingExpense(null);
    } else {
      await addExpense(data);
      setShowForm(false);
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelForm() {
    setEditingExpense(null);
    setShowForm(false);
  }

  const exportUrl = getExportUrl(filters);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💰</span>
            <span className={styles.logoText}>ExpenseTracker</span>
          </div>
          <div className={styles.headerActions}>
            <a href={exportUrl} download className={styles.exportBtn}>
              ⬇ Export CSV
            </a>
            <button className={styles.budgetBtn} onClick={() => setShowBudget(true)}>
              🎯 Budgets
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Left column */}
        <div className={styles.left}>
          {/* Form: edit or add */}
          {editingExpense ? (
            <ExpenseForm
              initial={editingExpense}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          ) : showForm ? (
            <ExpenseForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
          ) : (
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>
              + Add Expense
            </button>
          )}

          {/* Filters */}
          <Filters filters={filters} setFilters={setFilters} />

          {/* Error */}
          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Expense list */}
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={removeExpense}
            loading={loading}
          />
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <SummaryPanel summary={summary} budgets={budgets} />
          <CategoryChart summary={summary} />
        </div>
      </main>

      {showBudget && (
        <BudgetModal
          budgets={budgets}
          onSave={saveBudget}
          onClose={() => setShowBudget(false)}
        />
      )}
    </div>
  );
}
