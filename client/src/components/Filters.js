import React from 'react';
import { CATEGORIES, today, startOfMonth, startOfLastMonth, endOfLastMonth } from '../utils';
import styles from './Filters.module.css';

const DATE_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
];

export default function Filters({ filters, setFilters }) {
  const [preset, setPreset] = React.useState('all');

  function handlePreset(val) {
    setPreset(val);
    if (val === 'all') {
      setFilters((f) => ({ ...f, startDate: '', endDate: '' }));
    } else if (val === 'thisMonth') {
      setFilters((f) => ({ ...f, startDate: startOfMonth(), endDate: today() }));
    } else if (val === 'lastMonth') {
      setFilters((f) => ({ ...f, startDate: startOfLastMonth(), endDate: endOfLastMonth() }));
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.group}>
        <label>Category</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label>Date Range</label>
        <div className={styles.presets}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.value}
              className={preset === p.value ? styles.activePreset : styles.preset}
              onClick={() => handlePreset(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div className={styles.dateRange}>
          <div className={styles.group}>
            <label>From</label>
            <input
              type="date"
              value={filters.startDate || ''}
              max={today()}
              onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            />
          </div>
          <div className={styles.group}>
            <label>To</label>
            <input
              type="date"
              value={filters.endDate || ''}
              max={today()}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
