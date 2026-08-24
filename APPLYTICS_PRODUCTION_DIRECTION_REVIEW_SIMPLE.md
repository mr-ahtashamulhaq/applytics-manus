# APPLYTICS Production Direction Review

**Status:** Analysis only. No source code was changed.  
**Files reviewed:** `pasted_content.txt`, `Business-plan-outline.pdf`, APPLYTICS, and `Scrapling-Job-Boards-Scrapper`.  
**APPLYTICS revision:** `0af0729` on `main`.  
**Scraper revision:** `ef2902b` on `main`.

## 1. The product we are building

Applytics started as a university project. It addresses a real problem for Pakistani students and new graduates. Job openings are spread across LinkedIn, Facebook, WhatsApp groups, company websites, and other portals.

The production goal is to build a real SaaS product. The product must work reliably for real users. It must do more than show a project concept.

The product has four main functions:

| Function | What the user must get | Current state |
|---|---|---|
| **Job aggregation** | Job openings from several sources in one place. | Not in the current APPLYTICS code. The separate scraper is being considered. |
| **Job recommendation** | Jobs that match the user’s skills, location, and preferences. | Not implemented. |
| **AI-tailored resume** | A resume for a specific job. | A first version exists. The resume quality and layout need major improvement. |
| **Application tracking** | A place to record applications, statuses, dates, and notes. | A manual tracker exists. It needs better UX, reliability, analytics, and links to jobs and resumes. |

The product is not about helping users send more applications. It is about helping users send better applications and receive more responses.

The long-term vision is a career operating system. The first production version must focus on one clear user flow:

> Find a useful job. Understand why it matches. Create better application material. Apply on the source website. Track the result.

## 2. Claims and facts

The business-plan outline is useful for product direction and feature ideas. It is not a verified market or financial report. The outline states that its figures and data are AI-generated and not real.

The survey data also differs between the PDF and the current `/research` page. The PDF states that 50 people responded and reports figures such as 75% trial intent. The repository page states that 52 people responded and reports 71% trial intent [1] [2].

Before we publish these numbers, we must create one verified source dataset. The public charts and business-plan numbers must use that dataset.

The same rule applies to these claims:

| Claim | Current treatment |
|---|---|
| “The only Pakistan-focused platform” | A positioning statement, not a verified fact. |
| Market size | A planning estimate until supported by research. |
| Revenue and subscriber forecasts | Business assumptions, not actual results. |
| Funding and breakeven | Planning assumptions, not confirmed requirements. |
| Survey results | Not ready for public use because the sources conflict. |

The business plan also mentions quick apply, master resumes, certificates, career interests, deadlines, interview preparation, skill-gap analysis, recruiter revenue, and university integrations. Most of these features are not in the current code.

Public copy must label each feature as **available now**, **in development**, or **planned**. Users must not assume that a planned feature already works.

## 3. Pricing decision

Removing public price numbers is the correct choice at this stage. The current landing page shows Starter, Pro at PKR 999/month, and Campus custom pricing [3]. These prices were placeholders.

Use this public message:

> Applytics is free during early access. Paid plans are coming later.

The site can also state that early users will receive notice before paid limits start.

Until the product has real quota controls and payment processing, remove or rewrite claims such as these:

| Claim to remove or rewrite | Reason |
|---|---|
| “5 resume tailors per month” | The product does not enforce this limit. |
| “PKR 999” | The price is not final. |
| “Unlimited” | The service does not define or enforce this promise. |
| “Priority support” | The support process does not exist yet. |

We must still build internal usage tracking. Free access for the first 100–200 users must be a planned early-access policy. It must not mean that the product has no limits.

AI generation, scraping, and PDF creation use resources. A private usage ledger will show the cost per active user. It will also let us add fair limits later without a large database change.

## 4. Review of the proposed scraper

The proposed [Scrapling-Job-Boards-Scrapper](https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper) is a useful starting point for a job-ingestion worker. It is **not a drop-in module for Applytics**.

The scraper is a standalone Python 3.12 application. It uses `uv` for package management. It has parsers for LinkedIn, Indeed, Rozee, and Mustakbil.

It uses the following tools and methods:

| Area | Current scraper approach |
|---|---|
| Browser fetching | Scrapling `StealthyFetcher` with Playwright/Camoufox dependencies. |
| Anti-bot handling | Cloudflare-solving behavior and headless/headful fallbacks. |
| Parsing | Separate CSS selector logic for each board. |
| Limits | Page limits, job limits, and request delays. |
| Processing | Role allowlist, Redis duplicate filtering, enrichment, and Supabase upserts. |
| Retry | Failed roles are retried once. |

The batch runner loops through approved roles. It scrapes the boards, removes duplicates with Redis, enriches jobs, and writes records to Supabase [4] [5].

The enrichment code provides useful data. It performs the following actions:

| Enrichment action | Result |
|---|---|
| Clean text | Removes HTML entities and extra spaces. |
| Split sections | Finds sections such as responsibilities and requirements. |
| Extract skills | Matches skills against a master Excel list. |
| Parse experience | Finds experience levels and year ranges. |
| Normalize salary | Finds currency, amount, and payment period. |
| Detect education | Finds education requirements. |
| Detect job type | Finds full-time, part-time, contract, or internship. |
| Score confidence | Records how much structured data the job contains. |

This data can support job filters and recommendations [6].

The scraper is a batch system. It is not a live search service. The included GitHub Actions workflow runs eight scheduled jobs each day. It alternates boards and role sets.

Each run installs Python dependencies and Playwright Chromium. GitHub Actions is a low-cost option for a public repository because standard runners are free for public repositories [7]. However, a scheduled workflow does not promise exact timing. Scheduled workflows run from the default branch and can be delayed or skipped [8].

The scraper has no durable checkpoint system, run history, alerting, or recovery queue. A failed run can therefore leave the job feed incomplete without a clear record for an administrator.

### Main scraper risk

The main risk is dependence on anti-bot behavior and website structure. A scraper that works today can fail later when a board changes its HTML, adds a challenge, changes its rate limits, blocks the runner IP range, or changes its access policy.

Rozee already shows this risk. Its parser reads full job data from listing cards because individual job pages can return HTTP 503. Each job board must therefore be treated as a separate connector that needs maintenance.

## 5. Why we must not merge the scraper directly

The two repositories use different database models.

The scraper writes a `jobs` table with fields such as `job_id`, `job_title`, `job_description`, `skills_required`, `experience_required`, `education_required`, `job_type`, `location`, `industry`, `company`, `url`, `job_source`, and `date_scrapped` [9].

APPLYTICS currently has `users`, `profiles`, `job_inputs`, `generated_resumes`, `applications`, and `suggestions`. It does not have a `jobs` table [10].

The scraper also contains methods for `user_profiles`, `user_quiz_scores`, `resumes`, and `job_applications`. These tables do not match the APPLYTICS tables.

If we copy these methods into APPLYTICS, the product will have two different data models. This will make permissions, migrations, and maintenance harder.

The correct boundary is:

> Keep the scraper as a separate ingestion worker. Create a normalized `jobs` schema owned by Applytics. Make the worker write only to that schema. Let the Next.js application read jobs through server-side query functions.

The application must apply authentication and ranking rules after it reads the jobs.

A scraped job is shared catalog data. It must not belong to one user when it first enters the system. User-specific records can be added later:

| User-specific record | Purpose |
|---|---|
| Saved job | Records that a user saved a job. |
| Recommendation event | Records why a job was shown. |
| Application record | Records that a user applied. |
| Resume version | Records the resume used for an application. |
| Outcome event | Records a response, interview, rejection, or other result. |

This design prevents one copy of a job for every user. It also makes freshness, duplicate control, and analytics easier.

## 6. Recommended product architecture

The product uses five main subsystems:

| Subsystem | Main job | First implementation |
|---|---|---|
| **Ingestion** | Fetch, parse, clean, deduplicate, and save jobs. | Keep the Python scraper separate. Add scheduled runs and a run-status table. |
| **Catalog** | Store jobs, source data, dates, search fields, and source URLs. | Add an Applytics-owned `jobs` table, stable fingerprints, and indexes. |
| **Recommendation** | Match jobs to users and explain the match. | Start with clear rules for skills, titles, and location. Add AI ranking later. |
| **Application workflow** | Tailor a resume, review it, download it, and track the application. | Fix the current schema and PDF quality first. Link `applications` to jobs and resumes. |
| **Operations** | Track scraper failures, old jobs, AI use, and user errors. | Add structured logs, run history, error counts, and safe retries. |

Each scraper run must write an ingestion record. The record must include:

| Field | Example purpose |
|---|---|
| Start and end time | Shows run duration. |
| Board and role set | Shows what the run attempted. |
| Pages attempted | Shows scrape coverage. |
| Jobs found | Shows source results. |
| Jobs inserted or updated | Shows database output. |
| Duplicates | Shows duplicate volume. |
| Parse failures | Shows parser quality. |
| Error details | Helps diagnosis and repair. |

This information is more useful than adding more boards immediately. Production reliability requires a clear view of feed freshness and source failures.

## 7. Free-tier review

The current stack can support early user testing. Each service has different limits.

| Service | Early-stage fit | Main limit |
|---|---|---|
| **Supabase** | Good fit. The Free plan includes 50,000 monthly active users, 500 MB database size, 5 GB egress, 5 GB cached egress, and 1 GB file storage. | Free projects pause after one week of inactivity. We must monitor database, storage, and egress use. The Free plan does not provide the same operating guarantees as a paid plan [11]. |
| **Clerk** | Good fit for early B2C login. Hobby includes 50,000 monthly retained users per app, prebuilt login UI, custom domains, and core authentication features. | Some security, branding, support, and session features require a paid plan. User-data synchronization must work correctly [12]. |
| **Vercel** | Suitable for the Next.js app at small scale. Hobby includes cron jobs, 1M function invocations, 1M edge requests, 100 GB fast transfer, and a 300-second function limit. | Vercel describes Hobby as for personal, non-commercial use. We must plan for Pro before commercial operation or confirm the terms [13] [14]. |
| **GitHub Actions** | Good low-cost option for a public scraper repository. Standard runners are free for public repositories. | Scheduled jobs do not provide a strict freshness promise. Browser setup, long runs, source blocking, and missing checkpoints can create stale data [7] [8]. |
| **Upstash Redis** | Good for early duplicate control at low usage. Free includes 256 MB, 10 GB bandwidth, and 500K commands per month. | Free does not include production features such as multi-zone high availability and an uptime SLA. The current Redis set is not a durable queue [15]. |

A free tier can support early testing. It does not automatically make the product production-ready.

Before we depend on these services for important user promises, we must add monitoring, usage limits, error recovery, and a migration plan.

## 8. APPLYTICS work required before new features

The previous code review found several blockers.

The initial database migration does not create `generated_resumes.ai_output`. Resume generation, result rendering, and PDF generation use this field.

The profile code writes `linkedin_url` and `portfolio_url`. The initial profile table does not contain these columns.

The profile save action writes `users.updated_at`. The initial users table does not contain this column, and the code ignores the error.

The UI makes the job description optional. The database marks `job_inputs.job_description` as `NOT NULL` [10].

We must fix these problems before adding jobs or recommendations. Otherwise, new features will depend on an unstable base. Errors will also appear far from their real cause.

### Resume quality

The resume needs a product-quality redesign. A small CSS change is not enough.

The AI result must be structured resume content. It needs a fixed section order, predictable spacing, correct page breaks, contact information, and consistent date formatting. Users also need a clear review and edit step.

The current `ResumePDF` component has a simple ATS-oriented structure. The current prompt, validation, and layout do not control output quality well enough [16].

### Tracker quality

The tracker must become a job-application workspace. It must record:

| Data | Why it matters |
|---|---|
| The job | Shows what the user applied for. |
| The resume version | Shows which resume the user used. |
| Application date | Shows when the user applied. |
| Follow-up date | Helps the user follow up. |
| Latest outcome | Shows the current result. |

The current “Save to Tracker” flow only pre-fills company and role query parameters. It does not save a link to a generated resume or a catalog job [17].

## 9. Refactoring plan for later approval

### Phase 0: Create one source of truth

Match the database migrations to the code. Add schema validation and database constraints. Stop ignoring database errors. Add environment checks and a safe local setup.

Create a data dictionary. Use the same field names and meanings in APPLYTICS and the scraper.

### Phase 1: Make the current user flow reliable

Improve profile editing, AI response validation, resume quality, PDF layout, loading states, error messages, tracker updates, and accessibility.

Add tests for profile save and load, AI response validation, PDF route access, tracker updates, and database assumptions.

Remove or correct marketing claims for features that do not exist.

### Phase 2: Add the job catalog

Create the Applytics `jobs` table and ingestion-run table. Adapt the scraper to write only to these tables.

Add stable fingerprints, source URLs, first-seen and last-seen dates, stale and expired status, board metadata, and better duplicate rules.

The duplicate rules must not treat two different jobs as the same job only because they share a title, company, and location.

### Phase 3: Add job discovery and recommendations

Add a job catalog with filters for location, employment type, experience, source, age, and skills.

Start with explainable rules. Score skills, titles, and location. Measure clicks, saves, application starts, and completed applications before adding complex AI ranking.

### Phase 4: Connect jobs to applications

From a job page, let the user tailor a resume, review it, edit it, download it, and create a linked application record.

Add resume version history. Save the exact job description used for tailoring.

This creates the first complete product loop.

### Phase 5: Operate and learn from users

Add usage tracking, quota controls, scraper monitoring, admin diagnostics, privacy and deletion tools, error reporting, support processes, analytics events, and data export.

Use real user and outcome data before finalizing paid plans, advanced career coaching, interview preparation, or university offerings.

## 10. Final understanding

The immediate goal is a production refactor and product expansion. It is not only a classroom project improvement.

The first product promise must be small and reliable. Pakistani job seekers should receive useful jobs, better role-specific resumes, and a tracker that helps them complete the process.

The open-source scraper is a useful ingestion worker. It already has board parsers, enrichment, duplicate control, and scheduled execution.

We must not copy it into Applytics without changes. The two systems need one shared schema. They also need a clear separation between shared job data and user-owned career data.

No code changes have started. The next decision is the refactoring plan. The most important parts are the shared database model and the first production milestone.

## References

[1]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/components/research/ResearchDashboard.tsx "APPLYTICS research dashboard"
[2]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/applytics.md "APPLYTICS internal product brief"
[3]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/components/landing/PricingSection.tsx "APPLYTICS pricing section"
[4]: https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper/blob/main/README.md "Scrapling Job Board Scraper README"
[5]: https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper/blob/main/main.py "Scrapling batch runner"
[6]: https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper/blob/main/pipeline/enricher.py "Scrapling enrichment pipeline"
[7]: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions "GitHub Actions billing"
[8]: https://docs.github.com/actions/using-workflows/events-that-trigger-workflows "GitHub Actions workflow events and schedules"
[9]: https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper/blob/main/services/supabase.py "Scrapling Supabase service"
[10]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/supabase/migrations/001_initial_schema.sql "APPLYTICS initial schema"
[11]: https://supabase.com/pricing "Supabase pricing and plan limits"
[12]: https://clerk.com/pricing "Clerk pricing and plan limits"
[13]: https://vercel.com/docs/plans/hobby "Vercel Hobby plan"
[14]: https://vercel.com/pricing "Vercel pricing and plan terms"
[15]: https://upstash.com/pricing/redis "Upstash Redis pricing and limits"
[16]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/components/pdf/ResumePDF.tsx "APPLYTICS PDF renderer"
[17]: https://github.com/mr-ahtashamulhaq/APPLYTICS/blob/main/app/app/generate/result/%5Bid%5D/page.tsx "APPLYTICS result and tracker flow"
