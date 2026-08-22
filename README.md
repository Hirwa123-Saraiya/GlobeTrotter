# GlobeTrotter ✈️ — Empowering Personalized Travel Planning

GlobeTrotter is a personalized, intelligent, multi-city travel planning platform. This repository contains the complete full-stack workspace featuring a **Node.js (Express)** backend with **PostgreSQL** relational database & **Swagger** documentation, and a **Next.js (TypeScript)** frontend.

---

## 🛠 Project Architecture

```text
GlobeTrotter/
├── Docs/
│   ├── PROBLEM_STATEMENT.md             # Problem statement & feature specs
│   └── IMPLEMENTATION_PLAN.md           # Architecture, DB schema & roadmap
├── docker-compose.yml                   # PostgreSQL container service (port 5432)
├── backend/                             # Express REST API (Node.js / JavaScript)
│   ├── prisma/                          # Prisma Schema & Migrations
│   ├── src/
│   │   ├── config/                      # DB & Swagger configuration
│   │   ├── controllers/                 # HTTP Request/Response controllers
│   │   ├── middleware/                  # Auth middleware
│   │   ├── routes/                      # API endpoints & Swagger annotations
│   │   ├── services/                    # Database SQL queries & business logic
│   │   └── server.js                    # Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/                            # Web Application (Next.js / TypeScript)
    ├── src/app/                         # App Router pages
    └── package.json
```

---

## 📋 Prerequisites & Tools Installation

Ensure you have **Node.js (v18+)** installed.

### 🐳 Docker Installation (If Docker Desktop is not installed)

#### Windows (PowerShell):
```powershell
winget install -e --id Docker.DockerDesktop
```

#### macOS:
```bash
brew install --cask docker
```

#### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
```

---

## 🚀 Quick Start Guide for Teammates

### Step 1: Start Database (PostgreSQL via Docker)

From the project root directory (`GlobeTrotter/`):

```powershell
docker compose up -d
```
*(This starts a PostgreSQL 15 instance listening on `localhost:5432` with database `globetrotter`).*

---

### Step 2: Set Up Backend

Navigate to the `backend/` directory:

```powershell
cd backend
```

1. **Install Dependencies**:
   ```powershell
   npm install
   ```

2. **Run Database Migrations**:
   ```powershell
   npm run db:migrate
   ```

3. **Launch Backend Server**:
   ```powershell
   npm run dev
   ```
   - **Base API URL**: `http://localhost:5000/api`
   - **Interactive Swagger Docs**: 👉 **`http://localhost:5000/api-docs`**

4. **(Optional) Open Browser Database GUI (Prisma Studio)**:
   In a separate terminal window inside `backend/`:
   ```powershell
   npm run studio
   ```
   - **Visual Database Web UI**: 👉 **`http://localhost:5555`**

---

### Step 3: Set Up Frontend

Navigate to the `frontend/` directory:

```powershell
cd ../frontend
```

1. **Install Dependencies**:
   ```powershell
   npm install
   ```

2. **Launch Frontend App**:
   ```powershell
   npm run dev
   ```
   - **Web App URL**: 👉 **`http://localhost:3000`**

---

## 🔑 Backend Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=globetrotter_super_secret_jwt_key_2026
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=globetrotter
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter?schema=public"
FRONTEND_URL=http://localhost:3000
```

---

## 📡 Trips API Endpoints Summary

All backend endpoints are documented interactively in Swagger at `http://localhost:5000/api-docs`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trips` | List all trips for logged-in user |
| `POST` | `/api/trips` | Create a new trip |
| `GET` | `/api/trips/:id` | Get trip details & calculate health score |
| `PUT` | `/api/trips/:id` | Update trip metadata & budget |
| `DELETE` | `/api/trips/:id` | Delete a trip |
| `POST` | `/api/trips/:id/share` | Toggle public visibility & share URL token |
| `POST` | `/api/trips/:id/copy` | Clone a shared trip into user's account |

---

## 🛠 Handy Command Cheat Sheet

| Task | Command | Directory |
| :--- | :--- | :--- |
| **Start DB Container** | `docker compose up -d` | Root (`GlobeTrotter/`) |
| **Stop DB Container** | `docker compose down` | Root (`GlobeTrotter/`) |
| **Run Migrations** | `npm run db:migrate` | `backend/` |
| **Open DB Browser UI** | `npm run studio` | `backend/` |
| **Start Backend API** | `npm run dev` | `backend/` |
| **Start Frontend** | `npm run dev` | `frontend/` |
