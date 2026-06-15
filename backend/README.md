# TodoList Game — Backend (FastAPI + pyodbc + Firebase)

FastAPI service backing the cyberpunk todo-game frontend. Data lives in
**Azure Database for MySQL** (accessed via **pyodbc**) and authentication is
handled with **Firebase Auth** (the client signs in, the backend verifies the
ID token on every request).

## Prerequisites

1. **Python 3.10+**
2. **MySQL Connector/ODBC 8.x (Unicode) driver** installed and visible to the
   ODBC Driver Manager. The `DRIVER={...}` name in your connection string must
   match the installed driver exactly.
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

- `PYODBC_CONNECTION_STRING` — full ODBC connection string for your Azure MySQL
  instance. Keep `CHARSET=utf8mb4` (emoji-safe) and `SSLMODE=REQUIRED` (Azure
  requires TLS).
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
