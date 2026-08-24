# Applytics

Applytics is an early-access SaaS for job seekers in Pakistan. It connects four parts of a job search:

1. A catalog of independently ingested job listings.
2. Explainable recommendations based on profile data.
3. A resume tailored to a selected job.
4. An application tracker linked to the job and resume.

The product is still in active development. **Mustakbil is the first verified live job source.** LinkedIn, Indeed, and Rozee are not part of the automatic feed until their listing access and parsing are verified.

> Applytics does not promise that a resume will pass an ATS or lead to an interview. Review every generated claim before you use a resume.

## Product flow

Create a profile with your education, skills, experience, and projects. Browse the authenticated job catalog. Each listing shows its source, last checked time, and available job details. Save roles that you want to revisit.

The recommendations page compares the profile city and skills with catalog records. It shows the evidence for each suggestion. It excludes listings with no matching profile signal. It does not create a match score from missing data.

When you select a catalog job, Applytics passes the listing to the resume generator from the server. The job title, company, description, and required skills come from the catalog record. The server stores the selected `job_id` with the job input and generated resume.

The generator asks the AI model to rewrite profile content for the selected role. Server validation rejects malformed responses and responses that contain unsupported skills, experience entries, projects, or numbers. You must still review the result because automated checks cannot replace human review.

The tracker can store manual applications or applications created from a catalog job and generated resume. It supports status, date applied, application deadline, follow-up date, notes, and a constrained outcome vocabulary.

## Current source health

| Source | Automatic schedule | Current state |
|---|---:|---|
| Mustakbil | Yes | Verified end-to-end and written to the live catalog |
| LinkedIn | No | No successful controlled write has been verified |
| Indeed | No | Controlled access is bot-detected |
| Rozee | No | Current listing markup produced no parseable cards |

The scraper runs in the private [`applytics-job-scraper`](https://github.com/mr-ahtashamulhaq/applytics-job-scraper) repository. GitHub Actions runs the verified source twice each day. The worker needs only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the scheduled path. The service-role key stays in GitHub Actions secrets and is never sent to the browser.

Read the scraper [`README.md`](https://github.com/mr-ahtashamulhaq/applytics-job-scraper/blob/main/README.md) and [`docs/github-actions.md`](https://github.com/mr-ahtashamulhaq/applytics-job-scraper/blob/main/docs/github-actions.md) for operations and source recovery tests.

## Tech stack

| Layer | Technology |
|---|---|
| Application | Next.js 16 App Router, React, TypeScript |
| UI | Tailwind CSS v4, custom Applytics tokens, Geist, Geist Mono |
| Authentication | Clerk |
| Database | Supabase PostgreSQL with RLS and server-side ownership checks |
| AI | Groq-compatible structured JSON generation |
| PDF | `@react-pdf/renderer` |
| Forms and validation | React Hook Form and Zod |
| UI motion and icons | Framer Motion and Phosphor Icons |
| Deployment target | Vercel |

## Repository structure

```text
app/
  app/                         Protected product routes
    dashboard/                 Activity summary
    generate/                  Resume input and result pages
    jobs/                      Catalog and job details
    recommendations/           Explainable profile-based matches
    saved-jobs/                User-owned saved listings
    profile/                   Profile editor
    tracker/                   Application tracker
  api/pdf/[id]/                Owned resume PDF response
  privacy/                     Public privacy route
  sign-in/ and sign-up/        Clerk authentication routes
components/                    UI components
lib/actions/                  Authenticated server actions
lib/validation/                Server input and AI output schemas
lib/data/                     Shared catalog selections
lib/supabase/                  Server and browser clients
lib/types/                    Handwritten live-schema types
supabase/migrations/           Ordered database migrations
DESIGN.md                     Product design rules
CLAUDE.md                     Engineering behavior rules
plan.md                       User-facing production refactor plan
```

## Database contract

The live database contains shared catalog tables and user-owned workflow tables. All new user-owned actions resolve the Clerk identity to the internal `users.id`, apply ownership filters, validate input with Zod, and return bounded error messages.

| Table | Role |
|---|---|
| `users` | Maps a Clerk identity to a Supabase user row |
| `profiles` | Stores the candidate profile used as resume source data |
| `jobs` | Shared job catalog records from the scraper |
| `ingestion_runs` | Protected scraper run counters and status |
| `ingestion_errors` | Protected scraper role and source errors |
| `job_inputs` | Job context submitted to resume generation |
| `generated_resumes` | Validated AI output and resume metadata |
| `saved_jobs` | User-owned bookmarks for catalog jobs |
| `applications` | User-owned manual or linked applications |
| `suggestions` | Public product suggestions |

The catalog workflow links are nullable. Older manual job inputs, resumes, and applications remain valid. The relevant migrations are `002_jobs_catalog.sql`, `003_ingestion_health.sql`, `007_link_catalog_workflows.sql`, `008_saved_jobs.sql`, and `009_tracker_followups.sql`.

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Product overview and early-access entry point |
| `/privacy` | Public | Privacy information; obtain legal review before launch |
| `/sign-in` | Public | Clerk sign-in |
| `/sign-up` | Public | Clerk sign-up |
| `/app/dashboard` | Authenticated | Resume, application, and profile summary |
| `/app/profile` | Authenticated | Candidate source profile |
| `/app/jobs` | Authenticated | Paginated catalog with bounded filters |
| `/app/jobs/[id]` | Authenticated | Listing details and workflow actions |
| `/app/recommendations` | Authenticated | Evidence-based profile recommendations |
| `/app/saved-jobs` | Authenticated | Saved listing review and removal |
| `/app/generate` | Authenticated | Manual or catalog-based resume generation |
| `/app/generate/result/[id]` | Authenticated | Owned resume review and tracker handoff |
| `/app/tracker` | Authenticated | Application status and follow-up management |

## Local development

### Prerequisites

Use Node.js 22 or a compatible current Node.js release. Create accounts for Clerk, Supabase, and the configured Groq-compatible AI provider.

### Install

```bash
git clone https://github.com/mr-ahtashamulhaq/applytics-manus.git
cd applytics-manus
npm install
```

Create `.env.local` with the values for this deployment. Use angle-bracket placeholders when documenting secrets:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk publishable key>
CLERK_SECRET_KEY=<clerk secret key>
NEXT_PUBLIC_SUPABASE_URL=<supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase publishable or anon key>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
GROQ_API_KEY=<groq api key>
```

Apply the ordered SQL migrations in `supabase/migrations/` to the target Supabase project. Use the Supabase migration tooling or SQL editor. Do not commit `.env.local` or any service key.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks before a push

Run the following commands from the repository root:

```bash
./node_modules/.bin/tsc --noEmit
npm run lint
npm run build
```

The current lint baseline has zero errors and 140 existing warnings. Treat a new error as a release blocker. Run the Impeccable detector for changed UI files before a UI commit.

Every meaningful change must update `plan.md`, use a commit message of no more than three words with no punctuation, and push to `mr-ahtashamulhaq/applytics-manus`. Do not push application work to the historical `APPLYTICS` repository.

## Security boundary

The browser does not receive the Supabase service-role key or AI provider key. Server actions perform authentication, ownership checks, bounded input validation, and safe error mapping. The worker uses the Supabase service-role key only in GitHub Actions secrets.

The `ingestion_runs` and `ingestion_errors` tables are protected from the public API roles. They contain operational data and are not shown to normal job seekers. Review [`docs/security-scan.md`](docs/security-scan.md) for the current repository and history scan limits.

## Early access and legal review

The early-access product is free while the release scope is being validated. This repository does not publish numeric pricing, quotas, or support promises.

The privacy policy and terms of use need a professional final review before commercial launch. The final documents must cover data retention, AI processing, user rights, acceptable use, deletion, export, and service limitations.

## License

MIT. See [`LICENSE`](LICENSE).
