import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './lib/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
  console.log(successful)
});

app.get('/api/faculty', async (req, res) => {
  try {
    const { department, name } = req.query;

    let query = 'SELECT * FROM faculty WHERE 1=1';
    const values = [];

    if (department) {
      values.push(`${department}%`);
      query += ` AND department ILIKE $${values.length}`;
    }

    if (name) {
      values.push(`Dr. ${name}%`);
      query += ` AND name ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));