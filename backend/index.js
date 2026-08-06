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
      values.push(`%${name}`);
      query += ` AND name ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {app.get('/api/faculty/:id/rating-summary', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT AVG(score)::numeric(10,1) AS average, COUNT(*) AS total FROM rating WHERE faculty_id = $1',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/api/faculty/:id/rating-summary', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT AVG(score)::numeric(10,1) AS average, COUNT(*) AS total FROM rating WHERE faculty_id = $1',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/api/faculty/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query('SELECT * FROM faculty WHERE name = $1', [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.post('/api/ratings', async (req, res) => {
  try {
    const facultyId  = req.body.facultyId;
    const score  = req.body.score;

    if (!facultyId || !score) {
      return res.status(400).json({ error: 'facultyId and score are required' });
    }

    const result = await pool.query(
      'INSERT INTO rating (faculty_id, score) VALUES ($1, $2) RETURNING *',
      [facultyId, score]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));