import React, { useState } from 'react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils';
import styles from './ExpenseList.module.css';

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  const [confirmId, setConfirmId] = useState(null);

  function handleDeleteClick(id) {
    setConfirmId(id);
  }

  function handleConfirmDelete() {
    onDelete(confirmId);
    setConfirmId(null);
  }

  if (loading) {
    return (
      <div className={styles.skeletonWrap}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>💸</span>
        <p>No expenses found.</p>
        <small>Add one above or adjust your filters.</small>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className={styles.date}>{formatDate(e.date)}</td>
                <td>
                  <span
                    className={styles.badge}
                    style={{ background: CATEGORY_COLORS[e.category] + '22', color: CATEGORY_COLORS[e.category] }}
                  >
                    {e.category}
                  </span>
                </td>
                <td className={styles.amount}>{formatCurrency(e.amount)}</td>
                <td className={styles.note}>{e.note || <span className={styles.noNote}>—</span>}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => onEdit(e)} title="Edit">
                      ✏️
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteClick(e.id)} title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <h3>Delete Expense?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.dialogActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmId(null)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
