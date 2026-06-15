# TodoList Game — Backend (FastAPI + PostgreSQL + Firebase)

FastAPI service backing the cyberpunk todo-game frontend. Data lives in
**PostgreSQL** (e.g. **Supabase**, accessed via **psycopg2**) and authentication
is handled with **Firebase Auth** (the client signs in, the backend verifies the
ID token on every request).

## Prerequisites

1. **Python 3.10+**
2. A **PostgreSQL database**. [Supabase](https://supabase.com/) works out of the
   box — grab the connection string from **Project Settings → Database**.
   PostgreSQL is UTF-8 by default, so the emoji catalog data is preserved.
3. A **Firebase project** and a **service-account JSON** key (Project Settings →
   Service accounts → Generate new private key).

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

Copy-Item .env.example .env   # then edit .env with real values
```

Edit `.env`:

- `DATABASE_URL` — PostgreSQL connection URL. Supabase requires TLS, so append
  `?sslmode=require`.
  - **Direct** (IPv6-only):
    `postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require`
  - **Session pooler** (use this on IPv4-only networks; note the
    `postgres.<project-ref>` username):
    `postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require`

  Find both strings in the dashboard under **Project Settings → Database →
  Connection pooling**.
- `FIREBASE_CREDENTIALS_FILE` — path to your Firebase service-account JSON.
- `CORS_ORIGINS` — the Vite dev origin(s), comma-separated.

Place the Firebase service-account file at the path referenced in `.env`
(default `./firebase-service-account.json`). It is git-ignored.

## Initialize the database

Creates the tables and seeds the catalog data (3 classes, 15 heroes, 52
achievements):

```powershell
python scripts/init_db.py
```

The SQL lives in [data/schema.sql](data/schema.sql) and
[data/seed.sql](data/seed.sql); both are idempotent and safe to re-run.

## Run

```powershell
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs · Health: http://localhost:8000/health

## API overview

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| GET | `/auth/me` | ✅ | Current user (creates a stub on first sign-in) |
| POST | `/auth/register` | ✅ | Set player tag + class |
| GET/PUT | `/profile` | ✅ | Read / update profile |
| GET/POST | `/quests` | ✅ | List / create quests |
| PATCH/DELETE | `/quests/{id}` | ✅ | Edit / delete a quest |
| POST | `/quests/{id}/complete` | ✅ | Complete quest, award XP + coins (1:1) |
| GET | `/wallet` | ✅ | Coin balance |
| POST | `/gacha/pull` | ✅ | Pull heroes (server-side RNG, debits coins) |
| GET | `/heroes` | — | Hero catalog |
| GET | `/me/heroes` | ✅ | Unlocked heroes |
| GET | `/achievements` | — | Achievement catalog |
| GET | `/me/achievements` | ✅ | Unlocked achievements |
| GET | `/notifications` | ✅ | List notifications |
| POST | `/notifications/{id}/read` | ✅ | Mark read |
| DELETE | `/notifications/read` | ✅ | Purge read notifications |

Authenticated requests must send `Authorization: Bearer <Firebase ID token>`.
