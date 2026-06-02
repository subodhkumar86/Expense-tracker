const request = require('supertest');
const app = require('../src/app');
const { writeExpenses, writeBudgets } = require('../src/store');

// Reset data before each test
beforeEach(() => {
  writeExpenses([]);
  writeBudgets({});
});

describe('Expense API', () => {
  test('POST /api/expenses - creates a valid expense', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 250,
      category: 'Food',
      date: '2024-01-15',
      note: 'Lunch',
    });
    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(250);
    expect(res.body.category).toBe('Food');
    expect(res.body.id).toBeDefined();
  });

  test('POST /api/expenses - rejects negative amount', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: -50,
      category: 'Food',
      date: '2024-01-15',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/expenses - rejects missing category', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      date: '2024-01-15',
    });
    expect(res.status).toBe(400);
  });

  test('GET /api/expenses - returns list sorted newest first', async () => {
    await request(app).post('/api/expenses').send({ amount: 100, category: 'Food', date: '2024-01-10' });
    await request(app).post('/api/expenses').send({ amount: 200, category: 'Bills', date: '2024-01-20' });

    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body[0].date).toBe('2024-01-20');
  });

  test('PUT /api/expenses/:id - updates an expense', async () => {
    const created = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2024-01-15',
    });
    const id = created.body.id;

    const res = await request(app).put(`/api/expenses/${id}`).send({
      amount: 150,
      category: 'Transport',
      date: '2024-01-15',
    });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(150);
    expect(res.body.category).toBe('Transport');
  });

  test('DELETE /api/expenses/:id - deletes an expense', async () => {
    const created = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2024-01-15',
    });
    const id = created.body.id;

    const del = await request(app).delete(`/api/expenses/${id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get('/api/expenses');
    expect(list.body.length).toBe(0);
  });

  test('GET /api/expenses/summary - returns monthly summary', async () => {
    const today = new Date().toISOString().split('T')[0];
    await request(app).post('/api/expenses').send({ amount: 500, category: 'Food', date: today });
    await request(app).post('/api/expenses').send({ amount: 300, category: 'Transport', date: today });

    const res = await request(app).get('/api/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body.totalThisMonth).toBe(800);
    expect(res.body.totalPerCategory.Food).toBe(500);
  });
});
