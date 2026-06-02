import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from '../utils';
import styles from './CategoryChart.module.css';

export default function CategoryChart({ summary }) {
  const [view, setView] = React.useState('pie');

  if (!summary) return null;

  const data = CATEGORIES
    .map((cat) => ({ name: cat, value: summary.totalPerCategory[cat] || 0 }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>No data for chart this month.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Spending by Category</h3>
        <div className={styles.toggle}>
          <button
            className={view === 'pie' ? styles.activeBtn : styles.btn}
            onClick={() => setView('pie')}
          >
            Pie
          </button>
          <button
            className={view === 'bar' ? styles.activeBtn : styles.btn}
            onClick={() => setView('bar')}
          >
            Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        {view === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
