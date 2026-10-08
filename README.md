# Faculty Feedback (FacultyMetrics)

An anonymous faculty rating and review platform built for students of **Thapar Institute of Engineering and Technology**. Students browse faculty members, see aggregated star ratings, and read reviews. Verified college students (`@thapar.edu` accounts only) can leave comments, which pass through a profanity filter and an admin moderation queue before they go public.

**Live site:** [facultymetrics.vercel.app](https://facultymetrics.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication and Authorization](#authentication-and-authorization)
- [Anti-Abuse and Moderation](#anti-abuse-and-moderation)
- [Frontend Routes](#frontend-routes)
- [Deployment](#deployment)
- [Known Issues and Roadmap](#known-issues-and-roadmap)
- [Contributing](#contributing)

---

## Features

**For students**
- Browse all faculty members with their department, average rating and review count
- Search by faculty name and filter by department
- Expand a faculty card for a quick preview, or open a full profile with a star-distribution breakdown (1 to 5 stars)
- Rate a faculty member from 1 to 5 stars with **no login required** (one rating per device)
- Re-rate a faculty member after your first rating
- Read approved reviews, newest first
- Sign in with a college Google account to write a review, tagged with the semester you studied under that faculty member
- Live platform stats on the landing page (unique visitors, total ratings, approved comments)

**For admins**
- Restricted `/admin` dashboard, gated by an `admin_user` table
- Add, edit and delete faculty records
- Review a moderation queue of pending comments and approve or reject each one
- Suspend abusive user accounts, with an optional reason

**Platform**
- Only `@thapar.edu` accounts can authenticate
- Reviewer identity is never exposed: `user_id` is stripped from every public comment response
- Profanity filtering on submission, plus per-IP rate limiting on comment posting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4 |
| Backend | Node.js (ESM), Express 5 |
| Database | PostgreSQL (hosted on Supabase), accessed with `pg` |
| Auth | Supabase Auth (Google OAuth and email OTP) |
| Moderation | `bad-words` profanity filter, `express-rate-limit` |
| Hosting | Vercel (frontend), with SPA rewrites configured in `vercel.json` |

---

## Architecture

```
┌────────────────────┐        HTTPS / JSON         ┌─────────────────────┐
│  React + Vite SPA  │ ──────────────────────────► │  Express REST API   │
│  (Vercel)          │ ◄────────────────────────── │  (Node.js)          │
└─────────┬──────────┘                             └───────┬─────────┬───┘
          │                                                │         │
          │ Google OAuth (hd=thapar.edu)                   │ pg      │ supabase-js
          ▼                                                ▼         ▼
┌────────────────────┐                             ┌──────────────┐ ┌──────────────┐
│  Supabase Auth     │ ◄───────────────────────────│  PostgreSQL  │ │ Supabase Auth│
│                    │   access_token (JWT)        │  (Supabase)  │ │  (verify JWT)│
└────────────────────┘                             └──────────────┘ └──────────────┘
```

1. The frontend starts Google sign-in through Supabase, restricted to the `thapar.edu` hosted domain.
2. Supabase redirects back to `/auth/callback` with an `access_token`.
3. The frontend stores the token and sends it as `Authorization: Bearer <token>` on protected requests.
4. The backend validates the token with `supabase.auth.getUser()`, enforces the college email domain, checks the suspension list, and then handles the request.
5. All data reads and writes go directly to Postgres via a `pg` connection pool.

---

## Project Structure

```
Faculty-Feedback/
├── backend/
│   ├── index.js                  # Express app: all routes, middleware, rate limiters
│   ├── lib/
│   │   ├── db.js                 # pg connection pool (DATABASE_URL)
│   │   ├── supabase.js           # Supabase client for server-side auth checks
│   │   └── serializers.js        # toPublicComment(): strips user_id from comments
│   ├── sql/
│   │   ├── 001_create_faculty.sql  # faculty table
│   │   └── seed.sql                # sample faculty data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Route definitions and OAuth hash handling
│   │   ├── main.jsx              # App entry (BrowserRouter)
│   │   ├── components/
│   │   │   ├── FacultyList.jsx          # Home page: search, filter, stats, expandable cards
│   │   │   ├── FacultyProfile.jsx       # Faculty detail: rating summary, breakdown, reviews
│   │   │   ├── RatingWidget.jsx         # 1-5 star input with already-rated / re-rate flow
│   │   │   ├── CommentsPage.jsx         # Write-a-review page (auth gate + semester step)
│   │   │   ├── CommentForm.jsx          # Review submission form
│   │   │   ├── CommentList.jsx          # Approved reviews list
│   │   │   ├── GoogleSignIn.jsx         # Google OAuth button (hd=thapar.edu)
│   │   │   ├── AuthCallback.jsx         # OAuth redirect handler and token verification
│   │   │   ├── AdminPage.jsx            # Admin dashboard shell and access check
│   │   │   ├── AdminFacultyManage.jsx   # Add / edit / delete faculty
│   │   │   ├── AdminModerationQueue.jsx # Approve / reject pending comments
│   │   │   └── AdminUserSuspend.jsx     # Suspend a user by ID
│   │   └── lib/
│   │       ├── auth.js           # signOut()
│   │       └── deviceToken.js    # Anonymous per-device UUID in localStorage
│   ├── vercel.json               # SPA rewrite to index.html
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A [Supabase](https://supabase.com) project with:
  - Google OAuth provider enabled (and email OTP if you want the OTP endpoints)
  - A Postgres database
- A Google Cloud OAuth client configured for your Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/Singh1veer/Faculty-Feedback.git
cd Faculty-Feedback
```

### 2. Set up the database

Create the tables described in [Database Schema](#database-schema), then seed sample faculty:

```bash
psql "$DATABASE_URL" -f backend/sql/001_create_faculty.sql
psql "$DATABASE_URL" -f backend/sql/seed.sql
```

> **Note:** `seed.sql` begins with `DELETE FROM faculty;`, so it wipes existing faculty rows. Only run it on a fresh or development database.

### 3. Run the backend

```bash
cd backend
npm install
# create backend/.env (see Environment Variables)
npm run dev          # node --watch index.js
```

The API starts on **http://localhost:5000**. A health check is available at `GET /`.

### 4. Run the frontend

```bash
cd frontend
npm install
# create frontend/.env (see Environment Variables)
npm run dev
```

The app starts on **http://localhost:5173**, which is also the backend's default CORS origin.

### Useful scripts

| Location | Command | Purpose |
|---|---|---|
| `backend` | `npm run dev` | Start API with file watching |
| `frontend` | `npm run dev` | Start Vite dev server |
| `frontend` | `npm run build` | Production build to `dist/` |
| `frontend` | `npm run preview` | Preview the production build |
| `frontend` | `npm run lint` | Run ESLint |

---

## Environment Variables

**`backend/.env`**

```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

`.env` files are git-ignored. Never commit real keys.

---

## Database Schema

The repository only ships the `faculty` migration. The other tables below are **inferred from the queries in `backend/index.js`**, so adjust types and constraints to match your actual database.

```sql
-- Shipped in backend/sql/001_create_faculty.sql
CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL
);

-- Inferred from the API code
CREATE TABLE rating (
  id SERIAL PRIMARY KEY,
  faculty_id INT REFERENCES faculty(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  device_token TEXT NOT NULL,
  UNIQUE (faculty_id, device_token)
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  faculty_id INT REFERENCES faculty(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  semester TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE visit (
  device_token TEXT PRIMARY KEY             -- needed for ON CONFLICT (device_token)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,                      -- Supabase auth user id
  email TEXT NOT NULL
);

CREATE TABLE admin_user (
  user_id UUID PRIMARY KEY
);

CREATE TABLE suspended_user (
  user_id UUID PRIMARY KEY,
  reason TEXT
);
```

To make someone an admin, insert their Supabase user ID into `admin_user`:

```sql
INSERT INTO admin_user (user_id) VALUES ('<supabase-user-uuid>');
```

---

## API Reference

Base URL: `http://localhost:5000` in development. Legend: 🌐 public, 🔐 requires a valid `@thapar.edu` session, 🛡️ requires admin.

### Health and stats

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | 🌐 | Health check, returns `{ status: "ok" }` |
| POST | `/api/visits` | 🌐 | Record a unique visitor. Body: `{ deviceToken }` |
| GET | `/api/stats` | 🌐 | Returns `{ visitors, ratings, comments }` (comments counts approved only) |

### Faculty

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/faculty` | 🌐 | List faculty with `average` and `total` rating count. Optional query: `name`, `department` (case-insensitive partial match) |
| GET | `/api/faculty/:name` | 🌐 | Get one faculty member by exact name |
| GET | `/api/faculty/:id/rating-summary` | 🌐 | Average score and total ratings |
| GET | `/api/faculty/:id/rating-breakdown` | 🌐 | Count per star: `{ "1": n, ..., "5": n }` |
| GET | `/api/faculty/:id/comments` | 🌐 | Approved comments, newest first, with `user_id` removed |

### Ratings and comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ratings` | 🌐 | Body: `{ facultyId, score (1-5), deviceToken }`. Returns `409` if this device already rated that faculty member |
| POST | `/api/comments` | 🔐 | Body: `{ facultyId, text, semester }`. Profanity-checked and rate limited to 10 per hour |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/send-otp` | 🌐 | Body: `{ email }`. Sends a one-time code to a `@thapar.edu` address |
| POST | `/api/auth/verify-otp` | 🌐 | Body: `{ email, token }`. Returns `{ session, user }` |
| GET | `/api/protected-test` | 🔐 | Returns a greeting with the user's email. Used by the frontend to validate a session |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/protected-test` | 🛡️ | Confirms admin access |
| GET | `/api/admin/comments/pending` | 🛡️ | Pending comments, oldest first |
| PATCH | `/api/admin/comments/:id/moderate` | 🛡️ | Body: `{ status: "approved" \| "rejected" }` |
| POST | `/api/admin/faculty` | 🛡️ | Body: `{ name, department }` |
| PATCH | `/api/admin/faculty/:id` | 🛡️ | Partial update of `name` and/or `department` |
| DELETE | `/api/admin/faculty/:id` | 🛡️ | Delete a faculty member |
| POST | `/api/admin/users/:userId/suspend` | 🛡️ | Body: `{ reason? }` |

Errors return JSON in the form `{ "error": "message" }` with an appropriate HTTP status.

---

## Authentication and Authorization

- **Sign-in:** Google OAuth through Supabase, with `hd=thapar.edu` and `prompt=select_account` to steer users to their college account. An email-OTP flow is also exposed through the API.
- **Domain enforcement:** the `requireAuth` middleware rejects any session whose email does not end in `@thapar.edu`.
- **Session storage:** the access token is kept in `localStorage` and attached as a Bearer token.
- **User sync:** on first authenticated request, the user is inserted into the local `users` table.
- **Suspension:** suspended users get `403 Your account has been suspended` on every protected route.
- **Admins:** `requireAdmin` validates the token and then looks the user up in `admin_user`.
- **Post-login redirect:** the page you signed in from is saved as `return_to` and restored after the OAuth callback.

---

## Anti-Abuse and Moderation

| Mechanism | Detail |
|---|---|
| Domain restriction | Only `@thapar.edu` emails can write reviews |
| Anonymous ratings | Ratings are tied to a random per-device UUID, not to a user account |
| One rating per device per faculty | Enforced by a lookup before insert (returns `409`) |
| Profanity filter | `bad-words` rejects comments containing profane language |
| Comment rate limit | 10 comments per hour per client |
| Moderation queue | Comments are only public once an admin sets `status = 'approved'` |
| Suspensions | Admins can block repeat offenders |
| Identity protection | `user_id` is never returned from public endpoints |

> Device tokens live in `localStorage`, so clearing browser storage or using another browser lets someone rate again. This is a deliberate trade-off for frictionless anonymous ratings, not a hard guarantee.

---

## Frontend Routes

| Path | Component | Purpose |
|---|---|---|
| `/faculty` | `FacultyList` | Home: stats, search, department filter, faculty cards |
| `/faculty/:name` | `FacultyProfile` | Profile, rating widget, breakdown, reviews |
| `/faculty/:name/comments` | `CommentsPage` | Sign in, pick semester, write a review |
| `/auth/callback` | `AuthCallback` | Handles the OAuth redirect |
| `/admin` | `AdminPage` | Admin dashboard (faculty, moderation, suspension) |

---

## Deployment

**Frontend (Vercel)**
1. Import the repo and set the root directory to `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist`.
3. Add the three `VITE_*` environment variables.
4. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh.

**Backend**
1. Deploy `backend/` to any Node host (Render, Railway, Fly.io and similar).
2. Set `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `FRONTEND_URL` (your Vercel URL, for CORS).
3. Point the frontend's `VITE_API_URL` at the deployed API.

**Supabase**
- Add your production frontend URL and `https://<your-domain>/auth/callback` to the allowed redirect URLs.

---

## Known Issues and Roadmap

Observed while reviewing the code. Worth fixing before relying on this in production.

**Bugs**
- **Crash on non-college login:** in `requireAuth`, the cleanup call uses `supabase.auth.admin.deleteUser(user.id)`, but `user` is undefined (it should be `data.user.id`). Deleting users also requires the Supabase **service role** key, not the anon key the backend currently uses.
- **Missing endpoints:** the frontend calls `GET /api/auth/profile`, `POST /api/auth/complete-profile` and `PUT /api/ratings/:facultyId` (the re-rate flow), but none of them exist in `backend/index.js`. The semester step and re-rating will fail until they are implemented.
- **Unused rate limiter:** `ratingLimiter` is defined but never attached to `POST /api/ratings`.
- **Route ordering:** `GET /api/faculty/:name` is declared after the more specific `/:id/...` routes, so a faculty member whose name matches a sub-path pattern could be shadowed. Keep specific routes first.

**Hardening ideas**
- Make the port configurable (`process.env.PORT || 5000`); it is currently hard-coded to `5000`, which breaks most hosting platforms.
- Validate `score` as an integer and validate `facultyId` and `:id` params.
- Add a unique index on `rating (faculty_id, device_token)` to prevent race-condition duplicates.
- Check suspension status inside `requireAdmin` and add an "unsuspend" endpoint.
- Consider storing sessions via Supabase's client library or `httpOnly` cookies instead of `localStorage`.
- Remove the large blocks of commented-out legacy code in several components.
- Add automated tests (the backend `test` script is a placeholder) and a CI workflow.
- Commit all table migrations, not only `faculty`.

**Possible features**
- Per-course and per-semester filtering of reviews
- Review helpfulness votes and reporting
- Faculty-level analytics (rating trends over time)
- Pagination for the faculty list and comments

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch and open a pull request

---

## Disclaimer

This is a student-built tool. Ratings and reviews are subjective opinions from students and do not represent the views of the institution or the developers.

## License

No license file is currently included. Add one (for example MIT) if you want others to reuse the code.
