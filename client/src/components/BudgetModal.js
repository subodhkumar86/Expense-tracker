import React, { useState } from 'react';
import { CATEGORIES, formatCurrency } from '../utils';
import styles from './BudgetModal.module.css';

export default function BudgetModal({ budgets, onSave, onClose }) {
  const [values, setValues] = useState({ ...budgets });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      for (const cat of CATEGORIES) {
        const val = Number(values[cat] || 0);
        if (val !== (budgets[cat] || 0)) {
          await onSave(cat, val);
        }
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Set Monthly Budgets</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p className={styles.sub}>Set a spending limit per category. Leave blank or 0 for no limit.</p>

        {CATEGORIES.map((cat) => (
          <div key={cat} className={styles.row}>
            <label>{cat}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="No limit"
              value={values[cat] || ''}
              onChange={(e) => setValues((v) => ({ ...v, [cat]: e.target.value }))}
            />
          </div>
        ))}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Budgets'}
          </button>
        </div>
      </div>
    </div>
  );
}
