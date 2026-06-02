import React from 'react';
import { formatCurrency, CATEGORIES, CATEGORY_COLORS } from '../utils';
import styles from './SummaryPanel.module.css';

export default function SummaryPanel({ summary, budgets }) {
  if (!summary) return null;

  const { totalThisMonth, totalPerCategory, highestExpense } = summary;

  return (
    <div className={styles.panel}>
      <div className={styles.statCards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>This Month</span>
          <span className={styles.cardValue}>{formatCurrency(totalThisMonth)}</span>
        </div>
        {highestExpense && (
          <div className={styles.card}>
            <span className={styles.cardLabel}>Highest Expense</span>
            <span className={styles.cardValue}>{formatCurrency(highestExpense.amount)}</span>
            <span className={styles.cardSub}>{highestExpense.category}</span>
          </div>
        )}
      </div>

      <div className={styles.categories}>
        <h3 className={styles.sectionTitle}>By Category</h3>
        {CATEGORIES.map((cat) => {
          const spent = totalPerCategory[cat] || 0;
          const budget = budgets[cat] || 0;
          const overBudget = budget > 0 && spent > budget;
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

          return (
            <div key={cat} className={styles.catRow}>
              <div className={styles.catHeader}>
                <span className={styles.catName} style={{ color: CATEGORY_COLORS[cat] }}>
                  ● {cat}
                </span>
                <span className={`${styles.catAmount} ${overBudget ? styles.over : ''}`}>
                  {formatCurrency(spent)}
                  {budget > 0 && <small> / {formatCurrency(budget)}</small>}
                </span>
              </div>
              {budget > 0 && (
                <div className={styles.barBg}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${pct}%`,
                      background: overBudget ? 'var(--danger)' : CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
