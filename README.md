# Mini Expense Tracker

A full-stack expense tracking application built for the **Studio Graphene Full Stack Developer Assessment** — **Exercise 2: Mini Expense Tracker**.

Users can log daily spending across categories, filter and edit expenses, view a monthly summary, set per-category budgets, visualise spending with pie/bar charts, and export data as CSV. No authentication — single-user app.

---

## Live Demo

> Deploy to Render (backend) + Vercel (frontend) and add links here.

---

## Tech Stack

| Layer | Library / Tool | Why |
|---|---|---|
| Backend | Node.js + Express | Lightweight, widely supported REST framework |
| Storage | JSON file (`data/expenses.json`) | Simple persistence without a database setup |
| Frontend | React 18 (Create React App) | Functional components with hooks as required |
| Charts | Recharts | Composable React chart library, easy to use |
| Styling | CSS Modules | Scoped styles, no extra runtime cost |
| Testing | Jest + Supertest | Meaningful API integration tests |

---

## How to Run Locally

Assumes **Node.js 16+** and **npm** are installed.

### 1. Install dependencies

```bash
# From the project root
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start the backend

```bash
cd server
npm run dev      # uses nodemon for auto-reload
# Server runs on http://localhost:5000
```

### 3. Start the frontend (new terminal)

```bash
cd client
npm start
# Opens http://localhost:3000 in your browser
```

The React dev server proxies `/api/*` requests to `localhost:5000` automatically (configured in `client/package.json`).

### 4. Run tests

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### GET /expenses
Returns filtered expense list, sorted by date (newest first).

| Query param | Type | Description |
|---|---|---|
| `category` | string | Filter by category name |
| `startDate` | YYYY-MM-DD | Filter from this date |
| `endDate` | YYYY-MM-DD | Filter to this date |

**Response** `200 OK`
```json
[
  {
    "id": "uuid",
    "amount": 250,
    "category": "Food",
    "date": "2024-06-01",
    "note": "Lunch",
    "createdAt": "2024-06-01T10:00:00.000Z"
  }
]
```

### POST /expenses
Create a new expense.

**Body**
```json
{ "amount": 250, "category": "Food", "date": "2024-06-01", "note": "Lunch" }
```
**Response** `201 Created` — the created expense object.
**Errors** `400` with `{ "errors": ["..."] }` for validation failures.

### PUT /expenses/:id
Update an existing expense. Same body as POST.
**Response** `200 OK` — updated expense object.

### DELETE /expenses/:id
Delete an expense.
**Response** `204 No Content`

### GET /expenses/summary
Monthly aggregated stats.

**Response**
```json
{
  "totalThisMonth": 3450,
  "totalPerCategory": { "Food": 1200, "Transport": 800, "Bills": 1450, "Entertainment": 0, "Other": 0 },
  "highestExpense": { "id": "...", "amount": 1450, "category": "Bills", ... }
}
```

### GET /expenses/export
Download filtered expenses as CSV.
Same query params as `GET /expenses`. Returns `text/csv`.

### GET /budgets
Returns per-category budget map.
**Response** `200 OK` — `{ "Food": 2000, "Transport": 1000 }`

### PUT /budgets
Set a budget for a category.
**Body** `{ "category": "Food", "amount": 2000 }`
**Response** `200 OK` — full budgets map.

---

## Project Structure

```
expense-tracker/
├── client/                   # React frontend
│   ├── public/index.html
│   └── src/
│       ├── api/expenses.js   # All API calls
│       ├── components/       # UI components (form, list, chart, etc.)
│       ├── hooks/
│       │   └── useExpenses.js  # Central state + data-fetching hook
│       ├── utils.js          # Formatting helpers, constants
│       ├── App.js            # Root layout component
│       └── index.css         # CSS variables / global reset
├── server/
│   ├── src/
│   │   ├── index.js          # HTTP server entry point
│   │   ├── app.js            # Express app + middleware
│   │   ├── store.js          # JSON file read/write helpers
│   │   └── routes/
│   │       ├── expenses.js   # CRUD + summary + export endpoints
│   │       └── budgets.js    # Budget get/set endpoints
│   └── tests/
│       └── expenses.test.js  # Jest + Supertest integration tests
├── data/                     # Auto-created; holds expenses.json & budgets.json
├── package.json              # Root convenience scripts
└── README.md
```

---

## Features Implemented

**Must Have ✅**
- Add expense (amount, category, date, optional note)
- List sorted newest-first
- Edit and delete expenses
- Filter by category and date range (this month / last month / custom)
- Summary panel: total this month, per-category totals, highest expense

**Should Have ✅**
- Pie and bar charts via Recharts
- Indian Rupee formatting (`₹1,234.50`) via `Intl.NumberFormat`
- Full form validation (no negative amounts, no future dates, category required)

**Bonus ✅**
- CSV export (respects active filters)
- Per-category budget limits with progress bars + over-budget warning
- JSON file persistence across server restarts

---

## Next Steps

Given more time I would:
- Add drag-and-drop reordering
- Month-over-month trend chart (line chart)
- Search/filter by note text
- Recurring expense support
- Unit tests for the React components (React Testing Library)
- Dockerise the app for easier deployment
- Swap JSON file for SQLite via `better-sqlite3` for concurrent-safe writes

---

## Notes

- AI tools (Claude) were used to assist with boilerplate and CSS. Every line was reviewed and understood.
