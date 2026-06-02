const BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const message =
      data.errors ? data.errors.join(', ') : data.error || 'Something went wrong';
    throw new Error(message);
  }
  return data;
}

export function getExpenses(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'All') params.set(k, v);
  });
  const query = params.toString();
  return request(`/expenses${query ? `?${query}` : ''}`);
}

export function getSummary() {
  return request('/expenses/summary');
}

export function createExpense(data) {
  return request('/expenses', { method: 'POST', body: JSON.stringify(data) });
}

export function updateExpense(id, data) {
  return request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: 'DELETE' });
}

export function getBudgets() {
  return request('/budgets');
}

export function setBudget(category, amount) {
  return request('/budgets', { method: 'PUT', body: JSON.stringify({ category, amount }) });
}

export function getExportUrl(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'All') params.set(k, v);
  });
  const query = params.toString();
  return `${BASE_URL}/expenses/export${query ? `?${query}` : ''}`;
}
