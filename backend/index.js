import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./lib/db.js";
import supabase from "./lib/supabase.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/faculty", async (req, res) => {
  try {
    const { department, name } = req.query;
    
    let query = "SELECT * FROM faculty WHERE 1=1";
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/faculty/:id/rating-summary", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT AVG(score)::numeric(10,1) AS average, COUNT(*) AS total FROM rating WHERE faculty_id = $1",
      [id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/faculty/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query("SELECT * FROM faculty WHERE name = $1", [
      name,
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.post("/api/ratings", async (req, res) => {
  try {
    const facultyId = req.body.facultyId;
    const score = req.body.score;
    
    if (!facultyId || !score) {
      return res
      .status(400)
      .json({ error: "facultyId and score are required" });
    }
    
    const result = await pool.query(
      "INSERT INTO rating (faculty_id, score) VALUES ($1, $2) RETURNING *",
      [facultyId, score],
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//<<<<-------------------------AUTHENTICATION------------------------->>

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const suspendedCheck = await pool.query(
      'SELECT * FROM suspended_user WHERE user_id = $1',
      [data.user.id]
    );
    if (suspendedCheck.rows.length > 0) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    req.user = data.user;
    next();
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.endsWith("@thapar.edu")) {
      return res
        .status(400)
        .json({ error: "A valid college email is required" });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, token } = req.body;

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return res.status(401).json({ error: "Invalid or expired code" });
    }

    res.json({ session: data.session, user: data.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/protected-test", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authenticated` });
});

//<<-----------------------------------Comment Section-------------------------------------->>
import { Filter } from 'bad-words';
const filter = new Filter();

app.post('/api/comments', requireAuth, async (req, res) => {
  try {
    const { facultyId, text, semester } = req.body;
    const userId = req.user.id;

    if (!facultyId || !text || !semester) {
      return res.status(400).json({ error: 'facultyId, text, and semester are required' });
    }

    if (filter.isProfane(text)) {
      return res.status(400).json({ error: 'Please remove inappropriate language and try again' });
    }

    const result = await pool.query(
      'INSERT INTO comment (faculty_id, user_id, text, semester) VALUES ($1, $2, $3, $4) RETURNING *',
      [facultyId, userId, text, semester]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

import { toPublicComment } from './lib/serializers.js';

app.get('/api/faculty/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM comment WHERE faculty_id = $1 AND status = 'approved' ORDER BY created_at DESC",
      [id]
    );
    res.json(result.rows.map(toPublicComment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


//<<--------- Admin moderation in comment section--------->>

//requireAdmin Middleware

async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const adminCheck = await pool.query(
    'SELECT * FROM admin_user WHERE user_id = $1',
    [data.user.id]
  );

  if (adminCheck.rows.length === 0) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.user = data.user;
  next();
}

app.get('/api/admin/comments/pending', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comment WHERE status = 'pending' ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.patch('/api/admin/comments/:id/moderate', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status must be approved or rejected' });
    }

    const result = await pool.query(
      'UPDATE comment SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

//<<=------------------------------Admin priveleges---------------------------------->>


//<<=--------------------For adding faculties------------------------->>

app.post('/api/admin/faculty', requireAdmin, async (req, res) => {
  try {
    const { name, department } = req.body;
    if (!name || !department) {
      return res.status(400).json({ error: 'name and department are required' });
    }
    const result = await pool.query(
      'INSERT INTO faculty (name, department) VALUES ($1, $2) RETURNING *',
      [name, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.patch('/api/admin/faculty/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department } = req.body;
    const result = await pool.query(
      'UPDATE faculty SET name = COALESCE($1, name), department = COALESCE($2, department) WHERE id = $3 RETURNING *',
      [name, department, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/api/admin/faculty/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM faculty WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json({ message: 'Faculty deleted', faculty: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

//<<=--------------------For suspension of student accounts------------------------->>
app.post('/api/admin/users/:userId/suspend', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const result = await pool.query(
      'INSERT INTO suspended_user (user_id, reason) VALUES ($1, $2) RETURNING *',
      [userId, reason || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));