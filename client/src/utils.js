export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#6366f1',
  Transport: '#22c55e',
  Bills: '#f59e0b',
  Entertainment: '#ec4899',
  Other: '#64748b',
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
}

export function startOfLastMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split('T')[0];
}

export function endOfLastMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 0).toISOString().split('T')[0];
}
