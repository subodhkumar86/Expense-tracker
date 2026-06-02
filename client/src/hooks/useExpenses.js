import { useState, useEffect, useCallback } from 'react';
import {
  getExpenses,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
  getBudgets,
  setBudget,
} from '../api/expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [filters, setFilters] = useState({ category: 'All', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expenseList, summaryData, budgetData] = await Promise.all([
        getExpenses(filters),
        getSummary(),
        getBudgets(),
      ]);
      setExpenses(expenseList);
      setSummary(summaryData);
      setBudgets(budgetData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addExpense = async (data) => {
    const created = await createExpense(data);
    await fetchAll();
    return created;
  };

  const editExpense = async (id, data) => {
    const updated = await updateExpense(id, data);
    await fetchAll();
    return updated;
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    await fetchAll();
  };

  const saveBudget = async (category, amount) => {
    await setBudget(category, amount);
    const updated = await getBudgets();
    setBudgets(updated);
  };

  return {
    expenses,
    summary,
    budgets,
    filters,
    setFilters,
    loading,
    error,
    addExpense,
    editExpense,
    removeExpense,
    saveBudget,
    refresh: fetchAll,
  };
}
