# 🚀 PrepAI — Full-Stack GenAI Technical Interview & ATS Resume Platform

<div align="center">

![PrepAI Banner](https://img.shields.io/badge/PrepAI-GenAI%20Career%20Intelligence-ec4899?style=for-the-badge&logo=openai&logoColor=white)
<br/>

[![React](https://img.shields.io/badge/React_19-Vite_8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer_Core-Strict_1--Page_A4_Engine-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)](https://pptr.dev/)
[![Theme Support](https://img.shields.io/badge/Theme-Dark%20%7C%20Light%20%7C%20System-8b5cf6?style=flat-square)](https://github.com/vivek25tech/PrepAI)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

**An enterprise-grade, full-stack AI career preparation platform that transforms job descriptions and candidate resumes into customized FAANG-level interview strategies, diagnostic skill roadmaps, and strictly 1-page ATS-optimized resumes.**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [API Reference](#-api-endpoints) • [Deployment](#-deployment-guide) • [Author](#-author)

</div>

---

## 🌟 Key Features

### 🎯 1. Tailored AI Interview Intelligence
- **Candidate-Job Alignment Engine:** Evaluates candidate resumes against target Job Descriptions (JD) to compute an objective **Match Score (0–100%)**.
- **FAANG-Grade Technical Questions:** Formulates role-specific coding, system design, and framework questions accompanied by **Interviewer Intention diagnostics** and comprehensive **Model Answers** (with syntax-aware code examples).
- **STAR Behavioral Scenarios:** Situation, Task, Action, and Result structured interview simulations assessing leadership and conflict resolution.
- **Diagnostic Skill Gap Analysis:** Identifies missing competencies categorized with severity badges (`High`, `Medium`, `Low`).
- **5-Day Actionable Preparation Plan:** Daily structured focus topics and concrete coding tasks.

### 📄 2. Strictly 1-Page ATS Resume Compiler
- **Guaranteed Single-Page A4 PDF:** Overcomes the common multi-page spillover issue using dynamic DOM `scrollHeight` measurement, proportional auto-scaling, strict CSS single-page rules (`8.8pt` font, `1.25` line height, `8mm` margins), and a `pdf-parse` self-correction loop ensuring `numpages === 1`.
- **Zero-Hallucination Factual Grounding:** Strictly preserves the candidate's real identity, university degrees, and actual projects. Forbids fake corporate companies (e.g., "InnovateTech", "WebSphere") or fabricated degrees.
- **Google XYZ Formula Bullet Points:** Rewrites resume bullet points using: *"Accomplished [X], as measured by [Y], by doing [Z]"* with high-impact action verbs and JD keywords.
- **Cross-Platform PDF Worker:** Automatically resolves local Google Chrome / Microsoft Edge on Windows and macOS, and leverages `@sparticuz/chromium` in Linux/serverless cloud production.

### ⚡ 3. Resilient Dual-Model AI Architecture
- **Dual-Model Automatic Failover:** Primary model uses **Google Gemini 2.5 Flash**. If free-tier rate limits or `429 Quota Exceeded` spikes occur, the backend automatically falls back to **Gemini Flash Latest** without failing user requests.
- **Structured Schema Enforcement:** All AI outputs adhere to strict Zod schemas and JSON-only response contracts with recursive safety parsers.

### 🌓 4. 3-Way Theme Architecture (Dark / Light / System Mode)
- **Fluid Multi-Theme System:** Native support for **Dark Mode**, **Light Mode**, and **System Mode**.
- **Real-Time OS Sync:** Automatically mirrors the user's operating system preferences via `prefers-color-scheme` media queries and persists choices across sessions in `localStorage`.
- **WCAG High-Contrast Polish:** All cards, typography, score gauges, inputs, and buttons feature high contrast (`#0f172a` deep slate text on light backgrounds and `#f8fafc` on dark surfaces).

### 🔐 5. Enterprise-Grade Authentication & Security
- **1-Click Google Sign-In:** Integrated Google Identity Services (`@react-oauth/google`) with token exchange verification.
- **Secure Password Recovery:** 6-digit OTP verification powered by `nodemailer` with a branded HTML template, 10-minute expiry, 60s resend cooldown, and 3-attempt brute-force protection.
- **Anti-Brute Force Rate Limiting:** Dedicated `authLimiter` (max 20 attempts per 15 minutes per IP) on all sensitive authentication endpoints.
- **Zero Credential UI Leakage:** Server never exposes OTPs or private hashes in API responses or browser state.
- **NoSQL Injection Defense:** `express-mongo-sanitize` actively sanitizes `req.body`, `req.params`, and `req.query`.
- **IDOR Protection:** All report retrieval and resume PDF downloads enforce strict ownership validation (`{ _id, user: req.user.id }`).
- **Token Blacklisting & Cookies:** Cookie-based JWT authentication (`httpOnly`, `secure`, `sameSite`) with active MongoDB token blacklist on logout.

### 🎨 6. Ultra-Premium UI & UX Polish
- **Split-Screen Showcase Auth:** Interactive split-screen layout with live Gemini 2.5 badge, feature preview cards, and social proof.
- **Dynamic Browser Tab Titles:** Tab title dynamically updates across routes (`Dashboard | PrepAI`, `Sign In | PrepAI`, etc.).
- **Custom Branded SVG Favicon:** Custom starburst squircle icon matching the app's visual identity.
- **Branded 404 Error Page:** Modern error page with one-click return to dashboard.

---

## 📐 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + Vite 8)"]
        UI["Modern UI / Responsive Dashboard"]
        ThemeContext["Theme Provider (Dark / Light / System)"]
        AuthContext["Auth Context & Protected Routes"]
        InterviewContext["Interview Context & State"]
        GoogleAuth["Google Identity OAuth"]
    end

    subgraph Gateway["Security & Middleware Layer"]
        CORS["CORS (Whitelist + Cloud Wildcards)"]
        AuthLimiter["Auth Rate Limiter (20 req / 15m)"]
        APILimiter["Global API Limiter (100 req / 15m)"]
        AuthGuard["JWT & Token Blacklist Guard"]
        Sanitize["Mongo Sanitize & Helmet OWASP Headers"]
    end

    subgraph Server["Backend Server (Express 5 + Node.js)"]
        AuthCtrl["Auth Controller"]
        InterviewCtrl["Interview Controller"]
        EmailService["Nodemailer SMTP Email Service"]
        DualModelAI["Dual-Model AI Failover Engine"]
        PuppeteerEngine["Puppeteer 1-Page PDF Engine"]
    end

    subgraph External["External Cloud Infrastructure"]
        Gemini25["Google Gemini 2.5 Flash (Primary)"]
        GeminiLatest["Google Gemini Flash (Failover)"]
        MongoAtlas[("MongoDB Atlas Database")]
        SMTP["SMTP Mail Server (Gmail / SES)"]
    end

    UI -->|REST API Requests| Gateway
    Gateway --> Server
    AuthCtrl -->|Store User / Verify OTP| MongoAtlas
    AuthCtrl -->|Dispatch OTP Emails| EmailService --> SMTP
    InterviewCtrl -->|Parse & Read Resume PDF| DualModelAI
    DualModelAI -->|Primary| Gemini25
    DualModelAI -.->|Fallback on 429| GeminiLatest
    InterviewCtrl -->|Render HTML & Scale to 1-Page| PuppeteerEngine
    PuppeteerEngine -->|Download ATS PDF| UI
    InterviewCtrl -->|Persist Reports| MongoAtlas
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Routing:** React Router v7
- **Styling:** Modular SCSS (BEM architecture), CSS Variables, Responsive Design
- **Theme Engine:** React Context API (`ThemeContext`) with `prefers-color-scheme` listener
- **State Management:** React Context API + Custom Hooks (`useAuth`, `useInterview`, `useTheme`, `useDocumentTitle`)
- **Authentication:** Google OAuth2 Client (`@react-oauth/google`), Axios with credentials

### Backend
- **Runtime:** Node.js (>= 20.0.0)
- **Framework:** Express.js 5
- **Database:** MongoDB Atlas via Mongoose ODM
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash + Flash Latest)
- **PDF Generation:** `puppeteer-core` with `@sparticuz/chromium`
- **PDF Parsing:** `pdf-parse`
- **Email Service:** `nodemailer`
- **Security:** `jsonwebtoken`, `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser`, `express-mongo-sanitize`

---

## 📁 Project Structure

```text
GEN-AI/
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB Atlas connection
│   │   │   └── env.js               # Environment variables registry
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Login, Register, Google Auth, OTP Reset
│   │   │   └── interview.controller.js # AI Report creation, 1-page PDF controller
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # JWT validation & Token blacklist check
│   │   │   ├── error.middleware.js  # Global centralized error handler
│   │   │   └── file.middleware.js   # Multer in-memory PDF resume upload (3MB max)
│   │   ├── models/
│   │   │   ├── blacklist.model.js   # Revoked tokens TTL store (24h auto-delete)
│   │   │   ├── interviewReport.model.js # Strategy reports schema
│   │   │   └── user.model.js        # User credentials & password reset fields
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth endpoint mappings
│   │   │   └── interview.routes.js  # Interview & PDF download routes
│   │   ├── services/
│   │   │   ├── ai.service.js        # Dual-Model AI failover & 1-page PDF engine
│   │   │   └── email.service.js     # Nodemailer SMTP OTP delivery service
│   │   └── app.js                   # Express app setup, CORS, reverse proxy trust, rate limiters
│   ├── .env.example                 # Documented backend environment template
│   ├── package.json                 # Backend dependencies & engine requirements
│   └── server.js                    # HTTP server bootstrap entry
│
├── Frontend/
│   ├── public/
│   │   ├── favicon.svg              # Custom branded PrepAI glowing SVG favicon
│   │   └── icons.svg                # Application vector icons
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/      # AuthShowcase, Protected, GoogleAuthButton
│   │   │   │   ├── hooks/           # useAuth hook
│   │   │   │   ├── pages/           # Login, Register, ForgotPassword, Navbar
│   │   │   │   └── services/        # auth.api.js (Axios)
│   │   │   ├── interview/
│   │   │   │   ├── hooks/           # useInterview hook
│   │   │   │   ├── pages/           # Home (Input / Generator), Interview (Report UI)
│   │   │   │   └── services/        # interview.api.js
│   │   │   ├── theme/
│   │   │   │   ├── theme.context.jsx # 3-way theme provider & OS sync
│   │   │   │   ├── ThemeToggle.jsx  # Segmented theme control
│   │   │   │   └── theme.scss       # Theme control styles
│   │   │   └── common/
│   │   │       └── NotFound.jsx     # Branded 404 Not Found error page
│   │   ├── hooks/
│   │   │   └── useDocumentTitle.js  # Dynamic browser tab title manager
│   │   ├── app.routes.jsx           # Application routing tree
│   │   ├── App.jsx                  # App root with Theme, Auth & Interview providers
│   │   ├── main.jsx                 # Entry point
│   │   ├── style.scss               # Comprehensive theme variables & responsive styles
│   │   └── style/
│   │       └── button.scss          # High-contrast button styles
│   ├── .env.example                 # Documented frontend environment template
│   ├── index.html                   # SEO metadata, OpenGraph tags, branded favicon link
│   ├── package.json                 # Frontend dependencies (prepai-client)
│   ├── vercel.json                  # Vercel SPA rewrite configuration
│   └── vite.config.js               # Vite build & plugin configuration
└── README.md                        # Master project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js:** v20.0.0 or higher
- **MongoDB:** A local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI
- **Google AI Studio API Key:** Free key from [ai.google.dev](https://ai.google.dev/)
- **Google OAuth Client ID (Optional):** From [Google Cloud Console](https://console.cloud.google.com/)
- **SMTP Credentials (Optional for Email OTP):** Gmail App Password or any SMTP provider

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/vivek25tech/PrepAI.git
cd PrepAI
```

---

### Step 2: Configure Backend Environment
```bash
cd BACKEND
cp .env.example .env
```

Edit `BACKEND/.env` with your values:
```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/prepai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_random_key_here

GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Optional: SMTP Email Settings (for password reset OTPs)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_16_digit_app_password
EMAIL_FROM="PrepAI Security <your_email@gmail.com>"
```

Install dependencies and start the backend server:
```bash
npm install
npm run dev
```
Backend will start on `http://localhost:3000`.

---

### Step 3: Configure Frontend Environment
In a new terminal:
```bash
cd ../Frontend
cp .env.example .env
```

Edit `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Install dependencies and start the Vite client:
```bash
npm install
npm run dev
```
Frontend will be running on `http://localhost:5173`.

---

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Rate Limit | Access | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/auth/register` | 20 / 15m | Public | Register new candidate account |
| `POST` | `/api/auth/login` | 20 / 15m | Public | Authenticate user & issue HTTP-only cookie |
| `POST` | `/api/auth/google` | 20 / 15m | Public | Verify Google OAuth identity & authenticate |
| `POST` | `/api/auth/forgot-password` | 20 / 15m | Public | Request 6-digit email OTP (60s cooldown) |
| `POST` | `/api/auth/reset-password` | 20 / 15m | Public | Verify OTP & update account password |
| `POST` | `/api/auth/logout` | Global | Private | Revoke session & blacklist current token |
| `GET` | `/api/auth/get-me` | Global | Private | Retrieve authenticated candidate profile |

### 💼 Interview & Resume Routes (`/api/interview`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/interview/` | Private | Upload resume (PDF) & JD to generate AI strategy |
| `GET` | `/api/interview/report/:interviewId` | Private | Retrieve a specific interview report |
| `GET` | `/api/interview/` | Private | Get paginated list of candidate's generated reports |
| `GET` | `/api/interview/resume/pdf/:interviewReportId` | Private | Download strictly 1-page ATS Resume PDF |

---

## 🚀 Deployment Guide

### Deploying Backend to Render / Railway / Cloud
1. Create a **Web Service** pointing to your repository with root directory set to `BACKEND`.
2. **Build Command:** `npm install`
3. **Start Command:** `node server.js`
4. Set all Environment Variables from `BACKEND/.env.example` in your cloud provider dashboard.
5. `app.js` is already configured with `app.set("trust proxy", 1)` and dynamic CORS origin matching for `*.vercel.app` and custom domains.

### Deploying Frontend to Vercel
1. Create a new Vercel project pointing to the repository with root directory set to `Frontend`.
2. **Framework Preset:** Vite
3. Set `VITE_API_URL` to your production backend URL (e.g., `https://your-backend.onrender.com`).
4. Set `VITE_GOOGLE_CLIENT_ID`.
5. The included `Frontend/vercel.json` automatically configures SPA routing rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🛡️ Factual Grounding & ATS Compliance Pipeline

```text
Input Candidate Resume (PDF / Text)
       │
       ▼
Extract Authentic Identity (Name, Contact, Education, Real Projects)
       │
       ▼
Google XYZ Formula Bullet Transformation ("Accomplished [X] measured by [Y] by doing [Z]")
       │
       ▼
Dual-Model Gemini AI Optimization (Strict Zero-Hallucination Constraints)
       │
       ▼
Inject Single-Page Normalizer CSS (8.8pt font, 1.25 line-height, 8mm margins)
       │
       ▼
Puppeteer Dynamic Height Measurement & Native Scale Factor Calculation
       │
       ▼
pdf-parse Verification Loop (Guarantees numpages === 1)
       │
       ▼
Recruiter-Ready 1-Page ATS Resume PDF
```

---

## 👨‍💻 Author

**Vivek Shukla**  
Master of Computer Applications (MCA) — *Jawaharlal Nehru University (JNU), New Delhi*  
- **GitHub:** [@vivek25tech](https://github.com/vivek25tech)  
- **LinkedIn:** [Vivek Shukla](https://linkedin.com/in/vivek-shukla)  
- **Email:** [vivek25tech@gmail.com](mailto:vivek25tech@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
