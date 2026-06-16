# 🎮 S.BRAIN — The Gamified Digital Second Brain (Monorepo)

**S.BRAIN** (Second Brain Arcade Universe) is a gamified, cyberpunk/retro-arcade-themed productivity ecosystem. It bridges the gap between routine task management and high-octane RPG dynamics. Users complete tasks (Quests) to gain experience (XP), level up, earn coins, and summon/collect holographic pixel-art **Neural Net Idols** via a gacha system.

This repository is structured as a monorepo containing:
* **Backend:** FastAPI (Python) service connected to a PostgreSQL database, secured with Firebase Auth.
* **Frontend:** React 19 + Vite 8 web application styled with Tailwind CSS v4.

---

## 📂 Repository Structure

```plaintext
todo-web-monorepo/
├── backend/                  # FastAPI Web Service
│   ├── app/                  # FastAPI main application source code
│   │   ├── database.py       # Database connection setup
│   │   ├── main.py           # API routes, middleware, and entrypoint
│   │   └── models.py         # Pydantic schemas and schemas mapping
│   ├── data/                 # Database initialization SQL scripts
│   │   ├── schema.sql        # Database schema definitions (tables)
│   │   └── seed.sql          # Seed data (Heroes, Classes, Achievements)
│   ├── scripts/              # Python helper scripts
│   │   └── init_db.py        # Database setup and migration runner
│   ├── .env.example          # Template for backend environment variables
│   ├── requirements.txt      # Python dependencies manifest
│   └── README.md             # Backend-specific documentation
│
└── frontend/                 # React 19 Client
    ├── public/               # Static configuration assets
    ├── src/                  # React source code
    │   ├── assets/           # Pixel-art graphics & static media assets
    │   ├── pages/            # Application views (Dashboard, Gacha, Arena, Profile)
    │   ├── firebase.js       # Firebase initialization client
    │   ├── main.jsx          # React app entry point
    │   └── index.css         # Styling, variables, and Tailwind imports
    ├── .env.example          # Template for frontend environment variables
    ├── vite.config.js        # Vite compilation configuration
    ├── package.json          # Frontend packages & build script configurations
    └── README.md             # Frontend-specific documentation
```

---

## ⚙️ Prerequisites & Requirements

Before setting up the project locally, make sure you have:
1. **Node.js (v18.0.0 or newer)** & `npm` installed (for the frontend).
2. **Python 3.10+** installed (for the backend).
3. **PostgreSQL Database** (a local instance, or a hosted service like [Supabase](https://supabase.com/)).
4. **Firebase Project** configured with **Authentication** enabled (supporting Google or Email Sign-in).

---

## 🚀 Step-by-Step Setup Guide

### 1. Backend Setup

The backend handles database transactions, quest scoring, coin wallets, gacha mechanics, and session states.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment:**
   * **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   * **Mac/Linux (Bash):**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure:
   * `DATABASE_URL`: PostgreSQL connection URL (e.g., Supabase connection string with `?sslmode=require`).
   * `FIREBASE_CREDENTIALS_FILE`: Absolute or relative path to your Firebase Service Account private key JSON file (downloaded from Firebase Console -> Project Settings -> Service Accounts).
   * `CORS_ORIGINS`: Set to `http://localhost:5173` (default Vite port) or your client URL.

5. **Initialize and Seed the Database:**
   Ensure your PostgreSQL instance is running and accessible via `DATABASE_URL`, then run the database script to create the tables and seed the game assets:
   ```bash
   python scripts/init_db.py
   ```

6. **Run the Backend Server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * The backend API will be available at: `http://localhost:8000`
   * Swagger Interactive docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

The frontend client serves the web interface, holographic 3D cards, custom retro pixel layouts, and tracks Pomodoro sessions.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node modules:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure with your Firebase web configuration (from Firebase Console -> Project Settings -> Web App Setup):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

4. **Run the Frontend Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to run the application.

---

## 🔒 Firebase Configuration Warning

Ensure that **Firebase Authentication** is fully set up in your Firebase console:
1. Navigate to **Build > Authentication** in the Firebase Console.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable the desired Sign-in provider(s) (e.g. **Google** or **Email/Password**).
4. Verify that `localhost` is listed under your **Authorized Domains** (under settings) so you can login from local development servers.

---

## 🛠️ Tech Stack Overview

* **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React
* **Backend:** FastAPI, Python, PostgreSQL/psycopg2, Firebase Admin SDK
* **Database:** PostgreSQL (ideal for Supabase PostgreSQL)
