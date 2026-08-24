<div align="center">

<img src="public/chrome-shiny-wordmark.png" alt="Applytics Logo" width="200" />

# Applytics

**AI-Powered Resume Tailoring for Pakistan's Job Seekers**

> This is the production development repository for Applytics. The original `APPLYTICS` repository is kept as a historical reference. Job ingestion runs in the separate [`applytics-job-scraper`](https://github.com/mr-ahtashamulhaq/applytics-job-scraper) repository.

The production refactor is tracked in [`plan.md`](plan.md). Read [`APPLYTICS_REFACTOR_PLAN.md`](APPLYTICS_REFACTOR_PLAN.md) before making product changes. The design rules are in [`DESIGN.md`](DESIGN.md), and the security release checklist is in [`videcodingsecurity.txt`](videcodingsecurity.txt).

*Paste a job description. Get a tailored, ATS-safe resume in seconds.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)](https://clerk.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![Groq](https://img.shields.io/badge/AI-Groq-orange)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

<br/>

[![Visit Live App](https://img.shields.io/badge/Live_Site-Applytics.online-de0d12?style=for-the-badge)](https://www.applytics.online)


</div>

---

## 🎯 What is Applytics?

Applytics is an AI-powered resume tailoring platform built specifically for university students, fresh graduates, and entry-level job seekers in Pakistan. Instead of sending the same generic resume to every employer, Applytics intelligently rewrites your resume to match each job description — optimized for ATS (Applicant Tracking Systems) and keyword-rich.

**The core promise:** Paste any job description → Applytics tailors your resume to match it → Download a polished, ATS-safe PDF → Track your application.

---

## 🚀 The Problem We Solve

Pakistani students and fresh graduates face a brutal job market reality:
- Most CVs are rejected by ATS software before a human ever reads them
- Job seekers send the same generic resume to every company
- No tool exists that bridges the gap between a student's raw profile and what employers actually want
- Tailoring a resume manually for each job takes hours

Applytics solves all of this in **under 60 seconds**.

---

## ✨ Features

### 🧠 AI Resume Tailoring
- Paste any job description (minimum 100 characters)
- Groq AI (powered by LLaMA 3.3 70B) analyzes your profile against the job requirements
- Rewrites your experience bullets using the XYZ formula (What · How · Result)
- Reorders resume sections for maximum relevance to the specific role
- Generates a tailored, ATS-optimized resume — never fabricating facts

### 📊 Match Score & Keyword Analysis
- Instant match score (0–100%) showing how well your profile fits the job
- Missing keywords list — skills you should highlight or add
- Suggested keywords — terms the employer specifically looks for

### 📄 ATS-Safe PDF Export
- Download your tailored resume as a clean, single-column PDF
- Built with `@react-pdf/renderer` — no LaTeX, no external services
- Helvetica font, no graphics, no tables — maximum ATS compatibility
- Filename auto-generated: `resume_{company}_{role}.pdf`

### 📋 Application Tracker
- Save every job you apply to in one place
- Track status: Draft → Applied → Interview → Rejected → Accepted
- Visual color-coded status badges
- Instant optimistic UI updates — no page refresh needed

### 📈 Dashboard
- At-a-glance stats: resumes generated, applications, interviews, average match score
- Recent resumes and applications list
- Profile completeness indicator

### 🔐 Security
- Clerk authentication — email + social sign-in
- Supabase Row Level Security (RLS) — every user sees only their own data
- All AI/DB API keys are server-side only — never exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` are server-only environment variables

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16.2 (App Router) | Server Components + Server Actions = full-stack in one repo |
| **Language** | TypeScript | Type safety across the entire stack |
| **Styling** | Tailwind CSS v4 + Custom CSS tokens | Design system with 60+ CSS variables |
| **Auth** | Clerk v7 | Pre-built UI, secure sessions, Next.js middleware |
| **Database** | Supabase (PostgreSQL) | DB + RLS + Storage in one service |
| **AI** | Groq API (LLaMA 3.3 70B) | Structured JSON Output, fast inference, free tier |
| **PDF** | @react-pdf/renderer | Server-side ATS-safe PDF generation |
| **Animations** | Framer Motion + GSAP | Premium UI motion on landing page |
| **Icons** | Phosphor Icons | Consistent, lightweight icon system |
| **Toasts** | Sonner | Non-blocking success/error notifications |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Deploy** | Vercel | First-class Next.js CI/CD |

---

## 📁 Project Structure

```
applytics/
├── app/
│   ├── api/
│   │   └── pdf/[id]/          # PDF generation route handler
│   ├── app/                   # Protected /app/* routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── generate/          # Resume generator + result pages
│   │   ├── profile/           # User profile setup
│   │   ├── tracker/           # Application tracker
│   │   └── layout.tsx         # Auth-guarded app shell
│   ├── privacy/               # Privacy policy page
│   ├── sign-in/               # Clerk sign-in page
│   ├── sign-up/               # Clerk sign-up page
│   ├── globals.css            # Design token system
│   ├── layout.tsx             # Root layout + ClerkProvider
│   └── page.tsx               # Public landing page / auth redirect
├── components/
│   ├── landing/               # Landing page sections (Hero, Features, etc.)
│   ├── layout/                # App shell components (Sidebar, MobileTopBar)
│   ├── profile/               # Profile form + skills input
│   ├── tracker/               # Tracker table component
│   └── ui/                    # Shared UI primitives
├── lib/
│   ├── actions/               # Server Actions (dashboard, generate, profile, tracker)
│   ├── auth/                  # ensureUser utility
│   ├── groq/                  # Groq client + AI schema
│   ├── supabase/              # DB clients (admin + browser)
│   └── types/                 # TypeScript types
├── public/                    # Static assets (logo, images)
├── supabase/
│   └── migrations/            # SQL migration files
├── proxy.ts                   # Clerk middleware (route protection)
├── DESIGN.md                  # Full design system specification
├── plan.md                    # Development roadmap
└── AGENTS.md                  # AI agent configuration
```

---

## 🗄️ Database Schema

### 5 Tables (Supabase PostgreSQL)

| Table | Key Columns | Purpose |
|-------|------------|---------|
| `users` | `clerk_user_id`, `name`, `email` | Clerk ↔ Supabase user sync |
| `profiles` | `skills[]`, `experience_text`, `projects_text`, education | Resume source data |
| `job_inputs` | `job_title`, `company_name`, `job_description` | Stored JD for each generation |
| `generated_resumes` | `match_score`, `missing_keywords[]`, `ai_output` (jsonb) | AI output + metadata |
| `applications` | `company_name`, `role_title`, `status`, `applied_date` | Job application tracking |

All tables have Row Level Security (RLS) policies ensuring complete data isolation between users.

---

## 🔄 AI Pipeline

```
User Profile + Job Description
         ↓
   Groq API (LLaMA 3.3 70B)
   Structured JSON Output
         ↓
┌─────────────────────────────┐
│  summary                    │
│  skills_to_emphasize[]      │
│  rewritten_experience[]     │
│  rewritten_projects[]       │
│  suggested_keywords[]       │
│  missing_keywords[]         │
│  match_score (0–100)        │
│  section_order_recommendation│
└─────────────────────────────┘
         ↓
   @react-pdf/renderer
   ATS-safe PDF generation
         ↓
   Download + Save to Tracker
```

**AI Rules (strictly enforced in system prompt):**
- ✅ May rewrite and strengthen bullet points
- ✅ May reframe experience using XYZ formula  
- ✅ May reorder sections for relevance
- ❌ Must NOT invent numbers, companies, tools, or employment history

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Groq AI
GROQ_API_KEY=gsk_...
```

> **Security note:** `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` are never prefixed with `NEXT_PUBLIC_` and are only accessible server-side.

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- A Clerk account (free tier works)
- A Groq API key (free tier works)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/mr-ahtashamulhaq/applytics-manus.git
cd applytics-manus

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in your keys in .env.local

# 4. Run Supabase migrations
# Go to Supabase Dashboard → SQL Editor
# Run the contents of: supabase/migrations/001_initial_schema.sql

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with product overview |
| `/sign-in` | Public | Clerk sign-in page |
| `/sign-up` | Public | Clerk sign-up page |
| `/privacy` | Public | Privacy policy |
| `/app/dashboard` | Protected | Stats overview + recent activity |
| `/app/profile` | Protected | User profile setup form |
| `/app/generate` | Protected | Job description input + AI generation |
| `/app/generate/result/[id]` | Protected | Resume preview + PDF download |
| `/app/tracker` | Protected | Application status tracker |

---

## 🎨 Design System

Applytics uses a custom design token system defined in `globals.css`. Key decisions:

- **Font:** Geist (primary) + Geist Mono (data/labels) — not Inter
- **Brand color:** `#de0d12` (brand-red)
- **Canvas:** `#ffffff` white + `#f7f6f5` warm off-white surface
- **Text:** `#0f0f0f` near-black (not pure #000)
- **Radius:** 6px buttons, 8px cards
- **Motion:** Framer Motion (UI) + GSAP ScrollTrigger (landing page)
- **Icons:** Phosphor (consistent weight)
- **No gradients, no glassmorphism, no Inter** — Notion-inspired clean aesthetic

See `DESIGN.md` for the complete design specification.

---

## 🤝 Contributing

This is a Entrepreneurship Subject project / startup MVP. Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Development rules

Use short commit messages with no more than three words and no punctuation. Commit each meaningful change. Update `plan.md` immediately after each completed task and include the related commit hash.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for Pakistan's next generation of professionals**

[Visit Applytics](https://applytics.online) · [Privacy Policy](/privacy)

</div>
