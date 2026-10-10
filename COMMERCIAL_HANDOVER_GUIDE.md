# DreamLearn — Commercial Handover & Technical Due Diligence Guide

> **Confidential & Proprietary Commercial Documentation**  
> **Platform Version:** 1.0.0 (Production Release)  
> **Architecture:** Modern MERN Stack (React 19 + TypeScript + Node.js Express + MongoDB)

---

## 📑 Table of Contents

1. [Executive Summary & Value Proposition](#1-executive-summary--value-proposition)
2. [Intellectual Property (IP) Inventory](#2-intellectual-property-ip-inventory)
3. [Technology Stack Architecture](#3-technology-stack-architecture)
4. [Platform Capabilities & Core Modules](#4-platform-capabilities--core-modules)
5. [Default Credentials & Master Access](#5-default-credentials--master-access)
6. [Quickstart & Local Development](#6-quickstart--local-development)
7. [Production Deployment Blueprints](#7-production-deployment-blueprints)
   - [Blueprint A: Docker Compose (All-in-One Cloud VPS)](#blueprint-a-docker-compose-all-in-one-cloud-vps)
   - [Blueprint B: Decoupled Cloud (Vercel + Render + MongoDB Atlas)](#blueprint-b-decoupled-cloud-vercel--render--mongodb-atlas)
   - [Blueprint C: Single-Port Unified Production Node.js Server](#blueprint-c-single-port-unified-production-nodejs-server)
8. [White-Labeling & Rebranding Instructions](#8-white-labeling--rebranding-instructions)
9. [Commercial Monetization Roadmap](#9-commercial-monetization-roadmap)
10. [Database Architecture & Backup Protocol](#10-database-architecture--backup-protocol)
11. [Security & Production Hardening Checklist](#11-security--production-hardening-checklist)

---

## 1. Executive Summary & Value Proposition

**DreamLearn** is an enterprise-grade EdTech and Campus Placement Preparation platform designed for high student engagement, scalable technical examinations, and automated programming skills evaluation.

### Core Value Drivers:
- **Zero-Dependency Quick Demo**: Features an intelligent database connector that connects to any cloud MongoDB Atlas database, or falls back dynamically to an embedded in-memory database if no external database is configured.
- **Integrated High-Speed Compiler**: Multi-language execution sandbox (Python 3, Java 17, C, C++, JavaScript) with custom standard input (stdin), real-time bracket closing, auto-indentation, syntax highlighting, and LeetCode-grade test runner.
- **Authoritative Server-Side Evaluation**: Prevents examination cheating by stripping answer keys from client payloads and evaluating submissions entirely on the server.
- **Enterprise Administrator Suite**: Complete content studio for authoring courses, video lectures, PDF roadmaps, assessments, coding problems, question bank items, and overseeing the live student registry.

---

## 2. Intellectual Property (IP) Inventory

A buyer acquiring this software receives complete, royalty-free ownership of:

| Component | Path / Directory | Description |
|---|---|---|
| **Client Application** | `/client` | Full React 19, TypeScript, Tailwind CSS single page application |
| **Backend API Engine** | `/server` | Node.js, Express.js REST API with authentication and execution services |
| **Database Seed Content** | `/server/src/services/seeder.js` | Full mock database with courses, lessons, assessments, and problems |
| **Containerization Assets** | `docker-compose.yml`, `Dockerfile` | Multi-stage Dockerfiles and orchestration manifests |
| **Brand Assets** | `/dl_logo.png`, `DLLogo.tsx` | High-resolution logos, brand vector graphics, and banners |
| **Documentation Suite** | `README.md`, `COMMERCIAL_HANDOVER_GUIDE.md` | Complete setup and operational manuals |

---

## 3. Technology Stack Architecture

### Frontend Layer:
- **Framework**: React 19 (TypeScript)
- **Bundler & Tooling**: Vite 8 with Hot Module Replacement (HMR)
- **Styling**: Tailwind CSS with custom Stitch EdTech design tokens (Dark & Light responsive)
- **Routing**: React Router v7 with role-based private route protection
- **Code Editor**: Custom `SmartCodeEditor` with Prism.js token coloring, tab indentation, and matching bracket auto-pairing

### Backend Layer:
- **Runtime**: Node.js v18+ / v20+
- **HTTP Framework**: Express.js with JSON streaming and CORS middleware
- **Authentication**: Stateless JSON Web Tokens (JWT) with HTTP Bearer headers & bcrypt salt hashing
- **Execution Sandbox**: Native child process process spawning with resource timeouts and memory buffer clamps

### Database Layer:
- **Primary Database**: MongoDB 6+ with Mongoose ODM
- **Memory Fallback**: Embedded `mongodb-memory-server` for instantaneous local demos without database installation

---

## 4. Platform Capabilities & Core Modules

### A. Student Learning Experience (`/student/*`)
1. **Interactive Dashboard**: Track learning streaks, daily study targets, completed coding problems, and resume enrolled courses with one click.
2. **Course Catalog & Player (`/courses`)**: Week-by-week curriculum roadmaps, lecture notes with live PDF preview, video players, and progress check-offs.
3. **Smart Practice Workspace (`/student/problems/:slug`)**: In-browser compiler with test case evaluation, custom input tabs, runtime diagnostics, and language selection.
4. **Standardized Assessments (`/student/assessments`)**: Timed tests with question palette, mark-for-review, and instant diagnostic scorecards.
5. **Verifiable Certificates (`/student/certificates`)**: Unique certificate IDs with public cryptographic verification endpoints.

### B. Administrator Governance Suite (`/admin/*`)
1. **Student Registry (`/admin/students`)**: Live learner directory showing course enrollment count, placement readiness scores, account status toggles, and detailed audit trails.
2. **Course Studio (`/admin/courses`)**: 5-step wizard to create, edit, upload PDF notes, assign instructors, and publish courses.
3. **Assessment Builder (`/admin/assessments`)**: Configure passing scores, duration limits, and assign questions directly from the question bank.
4. **Authoritative Question Bank (`/admin/questions`)**: MCQ, Range, Case-Based, and Coding questions with language restrictions.
5. **Coding Problems Library (`/admin/problems`)**: Create algorithmic problems with sample and hidden test cases.
6. **Company Recruitment Profiles (`/admin/companies`)**: Interview patterns, compensation CTC packages, and technical question roadmaps for top tech recruiters.

---

## 5. Default Credentials & Master Access

The database is pre-seeded with authoritative demonstration accounts:

### 🔑 Administrator Portal
- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (or port 5000 in unified mode)
- **Email**: `admin@dreamlearn.edu`
- **Password**: `Admin@123`
- **Permissions**: Full platform governance, content authoring, user status control.

### 🎓 Student Learning Portal
- **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `student@dreamlearn.edu`
- **Password**: `Student@123`
- **Registration URL**: [http://localhost:3000/register](http://localhost:3000/register) (Open registration)

---

## 6. Quickstart & Local Development

### Option 1: Native Node.js Run (Recommended for Development)

```bash
# 1. Clone repository
git clone <repo-url> dreamlearn
cd dreamlearn

# 2. Install all dependencies with 1 command
npm run install:all

# 3. Start Backend Server (Terminal 1)
cd server
npm run dev
# -> Backend active on http://localhost:5000

# 4. Start Frontend Client (Terminal 2)
cd client
npm run dev
# -> Frontend active on http://localhost:3000 (or 5173)
```

### Option 2: Windows 1-Click Launchers
Double click **`run.bat`** or run **`start.ps1`** in PowerShell to launch both servers simultaneously in separate windows.

---

## 7. Production Deployment Blueprints

### Blueprint A: Docker Compose (All-in-One Cloud VPS)
*Best for: DigitalOcean Droplet, AWS EC2, Linode, Hetzner ($6 - $12/month)*

The repository contains an enterprise multi-container Docker configuration:

```bash
# On your Linux VPS (Ubuntu 22.04 / 24.04 with Docker installed):
cd /var/www/dreamlearn

# Launch MongoDB, Backend with native compilers, and Frontend Nginx:
docker compose up --build -d
```

**Services launched:**
- `dreamlearn-mongo`: Persistent MongoDB on port 27017
- `dreamlearn-backend`: Express API with Python/Java/GCC compilers on port 5000
- `dreamlearn-frontend`: Production Nginx web server on port 3000 (or 80)

---

### Blueprint B: Decoupled Cloud (Vercel + Render + MongoDB Atlas)
*Best for: Serverless hosting with auto-scaling*

1. **Database**: Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and obtain your connection string:
   `mongodb+srv://admin:<password>@cluster0.mongodb.net/dreamlearn?retryWrites=true&w=majority`
2. **Backend (Render / Railway)**:
   - Root directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `MONGODB_URI`: `<your-atlas-uri>`
     - `JWT_SECRET`: `<generate-a-random-32-char-string>`
     - `NODE_ENV`: `production`
     - `CORS_ORIGIN`: `https://your-frontend-domain.vercel.app`
3. **Frontend (Vercel / Netlify)**:
   - Root directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://your-backend-domain.onrender.com/api/v1`

---

### Blueprint C: Single-Port Unified Production Node.js Server
*Best for: Low memory footprint VPS or single container deployments*

The Express server includes built-in static asset serving for `client/dist`.

```bash
# 1. Build frontend bundle:
cd client && npm run build && cd ..

# 2. Start server in production mode:
cd server
NODE_ENV=production PORT=5000 npm start
```
The entire application (SPA + APIs) will now be served from **a single port (`http://your-server-ip:5000`)**!

---

## 8. White-Labeling & Rebranding Instructions

DreamLearn was engineered with modular branding to allow effortless white-label customization:

### 1. Change Brand Name & Taglines
- Search and replace `DreamLearn` across the codebase or update:
  - `client/src/components/layout/Navbar.tsx` (Navbar header logo & title)
  - `client/src/components/layout/Footer.tsx` (Footer copyright & branding)
  - `client/index.html` (`<title>` and meta tags)

### 2. Replace Logo Graphics
- Place your new vector or transparent PNG logo at:
  - `client/src/assets/dl_logo.png` (or update `client/src/components/common/DLLogo.tsx`)
- Favicon: Update `client/public/favicon.ico`.

### 3. Theme Colors (Tailwind Tokens)
- Open `client/tailwind.config.js`:
  - `primary`: Modify `#165DCE` to your brand's primary color.
  - `primary-dark`: Modify `#102344` to your custom dark accent color.
- Re-run `npm run build` in `/client` to compile the updated theme.

---

## 9. Commercial Monetization Roadmap

For an investor or prospective SaaS acquirer, DreamLearn has ready extension points for revenue generation:

1. **B2C Course Purchases & Pro Membership**:
   - Course model (`server/src/models/Course.js`) supports adding `price`, `isFree`, and `stripePriceId`.
   - Payment webhooks can be placed in `server/src/routes/paymentRoutes.js` (Stripe / Razorpay).
2. **B2B Campus Enterprise Licensing**:
   - Charge colleges or coaching academies an annual SaaS fee for student batches to take timed placement assessments.
3. **Sponsored Assessment Drives**:
   - Partner with hiring companies looking to screen top candidates using automated coding challenges.

---

## 10. Database Architecture & Backup Protocol

### Data Models Summary:
- **`User`**: Role-based (`student`, `admin`), placement readiness stats, streaks.
- **`Course`**: Curriculum, PDF handouts, video embeds, category, difficulty.
- **`Curriculum`**: `Module` and `Lesson` schemas with ordering and completion markers.
- **`Enrollment`**: Student-to-Course mapping with real-time percentage tracking.
- **`Question`**: Authoritative question bank supporting `mcq`, `range`, `case_based`, `coding`.
- **`Assessment`**: Test configurations, passing thresholds, time limits.
- **`AssessmentAttempt`**: Individual test submission logs with detailed score breakdowns.
- **`CodingProblem`**: Algorithmic problem bank with public and hidden test cases.
- **`CodeSubmission`**: Student code execution submissions and benchmark results.
- **`Company`**: Technical hiring company portfolios and compensation data.
- **`Certificate`**: Verifiable completion credentials.
- **`AuditLog`**: Tamper-evident admin activity logging.

### Backup & Restore Commands:
```bash
# Export full MongoDB backup
mongodump --uri="mongodb://localhost:27017/dreamlearn" --out=/backups/$(date +%F)

# Restore MongoDB from backup
mongorestore --uri="mongodb://localhost:27017/dreamlearn" /backups/2026-10-10/dreamlearn
```

---

## 11. Security & Production Hardening Checklist

Before handing over to a live commercial production audience:
- [x] **Strict Role Guards**: Students cannot access `/admin/*` APIs (enforced by backend JWT middleware).
- [x] **Server-Side Evaluation**: Correct test answers and explanations are stripped from student payloads during ongoing assessments.
- [x] **Query Parameter Sanitization**: Prevents undefined or injection strings from breaking database filters.
- [ ] **Change Production JWT Secret**: Update `JWT_SECRET` in `server/.env` to a unique 64-character random string.
- [ ] **Enable HTTPS / SSL**: Configure Let's Encrypt SSL certificates on your Nginx reverse proxy.
- [ ] **Set Production CORS**: In `server/.env`, specify your production domain in `CORS_ORIGIN=https://yourdomain.com`.

---

*Handover documentation prepared and certified for commercial sale & technical due diligence.*
