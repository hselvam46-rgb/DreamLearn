# DreamLearn (DL) — Learning Management System & Placement Preparation Platform

> **"Learn. Practice. Get Placed."**  
> Complete Full-Stack MERN Application · Production Release 1.0 (2026)  
> *Ready for Commercial Deployment, University Licensing & Software Sale*

---

## 🌟 Executive Overview

**DreamLearn** is an enterprise-grade educational SaaS platform combining an interactive Learning Management System (LMS), LeetCode-style real-time online compiler sandbox, standardized examination engine, and campus placement recruiting blueprints.

### Key Value Highlights:
1. **Zero-Setup Database Architecture**: Connects seamlessly to any MongoDB Atlas / self-hosted instance, or boots automatically with an embedded in-memory database if no external database is configured.
2. **5-Language Sandboxed Online Compiler**: Native execution for **Python 3**, **Java 17**, **C++ (g++)**, **C (gcc)**, and **JavaScript (Node.js)** with custom standard input (stdin), syntax highlighting, bracket auto-closing, and automatic test runner.
3. **Cheating-Deterrent Assessment System**: Server-authoritative scoring where correct answers and explanations are stripped from client payloads during active tests.
4. **Complete Admin Suite**: Course Studio (video lectures + PDF handouts), Assessment Builder, Question Bank (MCQ, Range, Case-Based, Coding), Student Registry, and Audit Logs.
5. **Turnkey Commercial Handover**: Full Docker Compose setup, Nginx reverse proxy configuration, clean `.env.example` templates, and a comprehensive [Commercial Handover Guide](file:///d:/DreamLearn/COMMERCIAL_HANDOVER_GUIDE.md).

---

## 🚀 Quick Start

### 1. One-Click Docker Launch (Production)
```bash
docker compose up --build -d
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

### 2. Local Node.js Development
```bash
# 1. Install all dependencies across client and server
npm run install:all

# 2. Start Backend (Terminal 1)
cd server && npm run dev

# 3. Start Frontend (Terminal 2)
cd client && npm run dev
```

### 3. Windows Native Launchers
Double click **`run.bat`** or run **`start.ps1`** in PowerShell to launch both development environments in separate windows.

---

## 🔑 Default Master Credentials

The platform initializes with pre-populated demonstration accounts upon initial launch:

| Portal | Role | URL | Email | Password |
|---|---|---|---|---|
| **Admin Room** | Administrator | `/admin/login` | `admin@dreamlearn.edu` | `Admin@123` |
| **Learner Portal** | Student | `/login` | `student@dreamlearn.edu` | `Student@123` |

*(One-click demo credential autofill buttons are provided on both login screens).*

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 (TypeScript), Vite 8, Tailwind CSS, Lucide Icons, Prism.js, Canvas Confetti |
| **Backend** | Node.js, Express.js REST API (`/api/v1`), JWT authentication, bcrypt |
| **Database** | MongoDB 6+ with Mongoose ODM (Auto-fallback to `mongodb-memory-server`) |
| **Compiler Engine** | Native child process sandboxing (Python, Java, C, C++, JavaScript) with timeouts |
| **DevOps & Containers** | Docker, Docker Compose, Multi-stage builds, Alpine Nginx |

---

## 📁 Project Architecture

```
DreamLearn/
├── COMMERCIAL_HANDOVER_GUIDE.md  # Complete Technical Due Diligence & Buyer Manual
├── docker-compose.yml            # Multi-container orchestration (Mongo, Server, Client)
├── package.json                  # Root orchestration scripts (install:all, dev, build)
├── run.bat / start.ps1           # Windows one-click local launchers
├── client/
│   ├── Dockerfile & nginx.conf   # Production Nginx SPA container
│   ├── .env.example              # Client environment variables
│   ├── src/
│   │   ├── components/           # Reusable UI components & SmartCodeEditor
│   │   ├── context/              # AuthContext (Role guards & JWT state)
│   │   ├── pages/                # Public, Student, and Admin pages
│   │   └── services/api.ts       # Centralized API service with query sanitization
│   └── vite.config.ts            # Vite proxy and build configuration
└── server/
    ├── Dockerfile                # Production backend container with native compilers
    ├── .env.example              # Server environment variables
    └── src/
        ├── config/               # Database connectors & in-memory fallback
        ├── controllers/          # Business logic for 13 system modules
        ├── middleware/           # Role guards, auth verification & audit logging
        ├── models/               # Mongoose schemas (User, Course, Assessment, etc.)
        ├── routes/               # Versioned API routes (/api/v1/*)
        ├── services/             # Sandbox execution & database seeder
        └── server.js             # Express entrypoint with static SPA serving
```

---

## 💼 Commercial Handover & Sale Documentation

For technical due diligence, white-labeling instructions, production hosting blueprints, and monetization roadmaps, please refer to:
👉 **[COMMERCIAL_HANDOVER_GUIDE.md](file:///d:/DreamLearn/COMMERCIAL_HANDOVER_GUIDE.md)**
