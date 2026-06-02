import React, { useState, useEffect } from 'react';
import { CATEGORIES, today } from '../utils';
import styles from './ExpenseForm.module.css';

const EMPTY_FORM = { amount: '', category: '', date: today(), note: '' };

export default function ExpenseForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...EMPTY_FORM, ...initial });
    else setForm(EMPTY_FORM);
  }, [initial]);

  function validate() {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a positive amount';
    if (!form.category) e.category = 'Select a category';
    if (!form.date) e.date = 'Pick a date';
    else if (form.date > today()) e.date = 'Date cannot be in the future';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      setForm(EMPTY_FORM);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <h2 className={styles.title}>{initial ? 'Edit Expense' : 'Add Expense'}</h2>

      {errors.server && <p className={styles.serverError}>{errors.server}</p>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Amount (₹) *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 250"
            min="0.01"
            step="0.01"
            className={errors.amount ? styles.inputError : ''}
          />
          {errors.amount && <span className={styles.error}>{errors.amount}</span>}
        </div>

        <div className={styles.field}>
          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? styles.inputError : ''}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={today()}
            className={errors.date ? styles.inputError : ''}
          />
          {errors.date && <span className={styles.error}>{errors.date}</span>}
        </div>

        <div className={styles.field}>
          <label>Note</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional note…"
          />
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
