# APPLYTICS Complete Production Refactoring Plan

**Document status:** Planning only. No code, database, deployment, or GitHub repository changes are authorized by this document.  
**Plan owner:** APPLYTICS team.  
**Prepared by:** Manus AI.  
**Primary website:** `https://applytics.online`  
**Current Supabase project:** `APPLYTICS`, ref `ndcchdxnjdcowyocmcyo`.  
**Current Vercel project:** `applytics`, connected to `mr-ahtashamulhaq/APPLYTICS`.

## 0. Current product and new aim

### What APPLYTICS is now

APPLYTICS is a Next.js SaaS MVP for Pakistani students, fresh graduates, and early-career job seekers. It uses Clerk for authentication and Supabase for data storage. The current application has these main product areas:

| Area | Current implementation |
|---|---|
| Authentication | Clerk protects `/app` routes. |
| User profile | Users can save contact, education, skills, experience, projects, and links. |
| Resume tailoring | Users enter a target job and call a Groq-backed generation flow. |
| PDF output | The app renders a generated resume as a PDF. |
| Application tracker | Users can create and update manual application records. |
| Landing page | The site presents the Applytics idea, features, research claims, and pricing. |
| Research page | The site presents product research and market claims. |
| Database | The live Supabase database has `users`, `profiles`, `job_inputs`, `generated_resumes`, `applications`, and `suggestions`. All inspected public tables have RLS enabled. |

The current MVP does not yet have a job catalog, a production job-ingestion system, recommendation ranking, linked job-to-application records, reliable usage controls, operational monitoring, or a production-grade resume editor.

The existing code also has known schema and quality problems. The live database now contains `generated_resumes.ai_output`, `profiles.linkedin_url`, `profiles.portfolio_url`, and `users.updated_at`, but these fields were not present in the first committed migration. The migration history and the live schema must be reconciled before new features are added.

### What we aim to build now

The aim is to turn APPLYTICS into a real production SaaS for real users. The first version must make a small set of promises and keep them reliable:

> Help a job seeker find a relevant job, prepare a better application, and track the result.

The production product must include these core functions:

| Production function | Required result |
|---|---|
| Job ingestion | Collect and normalize jobs from supported sources. |
| Job catalog | Show fresh jobs with source, date, location, skills, experience, and URL. |
| Recommendation | Match jobs to a user profile with clear reasons. |
| AI resume tailoring | Create a role-specific resume with good content and reliable layout. |
| Application workflow | Link a job, a resume version, and an application record. |
| Tracking dashboard | Show status, dates, follow-ups, notes, and outcomes. |
| Trust and safety | Protect user data, limit abuse, and show honest product claims. |
| Operations | Show feed freshness, scraper failures, AI usage, and user-visible errors. |

The business-plan document supplies product direction. Its numbers and survey data are not verified. The PDF and the current research page contain different respondent counts and percentages. We must not publish those numbers as facts until one verified dataset exists.

The public site must not show fixed prices at this stage. It must say that Applytics is free during early access and that paid plans are coming later. Internal usage tracking must still start early.

## 1. Rules for the whole project

### 1.1 Repository rules

Create these repositories under the GitHub account `mr-ahtashamulhaq`:

| Repository | Visibility | Purpose |
|---|---|---|
| `applytics-manus` | Public, as requested | The new main Applytics application repository. |
| `applytics-job-scraper` | Private if GitHub Actions and repository access work within the account limits. | The copied and modified job-scraper repository. |

The original `APPLYTICS` repository must remain unchanged. We must not push production changes to it.

The original scraper repository belongs to another GitHub account. We must clone it as a starting point, preserve its MIT license and attribution, and push our modified copy to `applytics-job-scraper`.

The new main repository must contain the current APPLYTICS source, the `.agents` skill directory, `DESIGN.md`, the security checklist, the complete refactoring plan, and all project documentation.

The scraper repository must contain its own README and deployment documentation. It must link to the main Applytics repository without copying Applytics user tables into the scraper.

### 1.2 Commit rules

Use a commit after every meaningful completed point. Each commit message must satisfy all of these rules:

| Rule | Requirement |
|---|---|
| Length | No more than three words. |
| Punctuation | No punctuation. |
| Style | Use short imperative or descriptive words. |
| Examples | `Fix schema`, `Add job catalog`, `Improve PDF`, `Update README`. |

Do not combine unrelated work in one commit. Before each commit, run the required checks for the affected area.

### 1.3 Plan tracking rules

Create and keep `plan.md` in `applytics-manus`. Create a matching `plan.md` in `applytics-job-scraper` for scraper-specific work.

Update the correct `plan.md` immediately after each meaningful task. Mark a task done as soon as it is complete. Add the commit hash beside the completed task. Keep blockers and decisions in the plan.

Every document created before or during refactoring must be committed and pushed to the correct GitHub repository. This includes plans, data dictionaries, runbooks, security notes, test reports, deployment notes, and legal documents.

### 1.4 Skill and instruction rules

Before writing code:

1. Recover and inspect the missing `agents.zip` and `DESIGN.md` attachments.
2. Extract the supplied `.agents` directory into `applytics-manus`.
3. Install or register all supplied skills in the project as instructed by the archive.
4. Read each supplied skill that applies to the current task.
5. Download the requested Karpathy coding rules into `CLAUDE.md` using the approved source after inspecting the file.
6. Read `CLAUDE.md` before every coding phase that uses it.
7. Read and follow `DESIGN.md` before every UI or UX change.
8. Keep the security checklist in the repository and use it as a release gate.

The current workspace contains `videcodingsecurity.txt`, but it does not contain `agents.zip` or `DESIGN.md`. These files are required before Phase 1 can be completed. We must not claim that all supplied skills or the design system were installed until the missing files are available.

## 2. Phase 1: Complete job-scraper setup

This is the first implementation phase. It must be completed before work on the main application.

### 2.1 Create the scraper repository

Clone `https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper`. Create `mr-ahtashamulhaq/applytics-job-scraper` as a private repository first. Push the copied source to that repository.

If private repository Actions limits prevent the required schedule from running, record the limit and ask before changing the repository to public. Do not make the repository public silently.

Preserve the original MIT license and add an attribution section to the README. State which code was copied, which code was changed, and which repository is the upstream source.

### 2.2 Install and test the scraper locally

Install Python 3.12 dependencies with `uv`. Install the browser dependencies required by Scrapling and Playwright. Do not run a real high-volume scrape during setup.

Add a safe dry-run mode. The dry run must test URL creation, parser loading, role filtering, enrichment, database mapping, and workflow configuration without sending a large number of requests.

Add parser fixture tests for LinkedIn, Indeed, Rozee, and Mustakbil. Store sanitized HTML fixtures in the repository. Do not store user data, cookies, session tokens, or private job-board credentials.

### 2.3 Define the scraper output contract

Create `docs/job-schema.md` in the scraper repository. Define every output field, its type, whether it is required, its source, and its cleaning rule.

The scraper must produce a canonical record with these types of data:

| Group | Data |
|---|---|
| Identity | Stable fingerprint, source board, source job ID, canonical URL. |
| Role | Title, company, location, industry, employment type. |
| Content | Clean description, raw description only where lawful and needed, section data. |
| Requirements | Skills, education, experience, salary. |
| Time | Source posted date, first seen date, last seen date, last checked date. |
| Quality | Parser version, enrichment version, confidence, source status. |

Do not use the scraper’s old user and application tables. The worker must write only catalog and ingestion records.

### 2.4 Reduce the first schedule

Start with one or two runs per day. Use a small set of roles, one page per board, and a low job limit. Increase the limits only after we measure runtime, failures, database growth, and service usage.

Use database uniqueness on the canonical job fingerprint. Keep Redis optional during the first implementation. Add Redis only when a real queue or higher volume requires it.

### 2.5 Add the GitHub Actions workflow

Configure `workflow_dispatch` for manual tests. Configure a scheduled workflow for the first small production schedule.

Store all credentials in GitHub Actions Secrets. Never place `SUPABASE_SERVICE_ROLE_KEY` in source code, workflow output, a browser bundle, or a public issue.

The workflow must:

1. Install the pinned Python environment.
2. Install the required browser binary.
3. Load the selected board and role set.
4. Run the safe scraper command.
5. Write the run result to Supabase.
6. Fail clearly when the run cannot write data.
7. Retain enough logs for diagnosis.

Add concurrency control so two scheduled runs cannot process the same role set at the same time. Add timeouts and a clear failure summary.

### 2.6 Complete scraper operations

Add an `ingestion_runs` record for every run. Record the run status, source, roles, start time, end time, pages attempted, jobs found, jobs saved, duplicates, parser errors, and error text.

Add a freshness rule. A job must show when it was last seen and when it was last checked. Do not delete a job only because one scrape failed.

Add a manual recovery path. A user with repository access must be able to rerun one board and one role set without changing source code.

### 2.7 Scraper documentation

Update the scraper README with:

- Product purpose and system boundary.
- Upstream attribution and MIT license information.
- Local installation steps.
- Environment variables.
- Dry-run command.
- Manual GitHub Actions command.
- Automatic schedule description in UTC and PKT.
- Database schema link.
- Failure and recovery steps.
- Source access and compliance notes.
- Known parser limitations.
- How to add a new board safely.

Add `docs/operations.md`, `docs/job-schema.md`, `docs/boards.md`, `docs/testing.md`, and `docs/decisions.md`.

### 2.8 Phase 1 acceptance criteria

Phase 1 is complete only when:

| Check | Required result |
|---|---|
| Repository | `applytics-job-scraper` exists under the user’s GitHub account. |
| Visibility | Private repository works with the intended Actions schedule, or the user approves a public fallback. |
| Local setup | Install and dry run work from a clean checkout. |
| Tests | All parser fixtures and enrichment tests pass. |
| Secrets | No credentials appear in tracked files or logs. |
| Workflow | Manual workflow execution succeeds. |
| Schedule | Automatic workflow is configured and documented. |
| Database | The worker writes only the approved catalog schema. |
| Observability | Every run creates a status record. |
| Documentation | README and all scraper documents are committed and pushed. |
| Plan | Scraper `plan.md` marks all completed tasks with commit hashes. |

## 3. Phase 2: Create and migrate the main repository

### 3.1 Create `applytics-manus`

Create `mr-ahtashamulhaq/applytics-manus` as a public repository. Clone it locally. Copy the current APPLYTICS source into it. Do not copy `.env` files, service keys, browser data, build output, or personal files.

Add the current project documentation, `videcodingsecurity.txt`, `agents.zip` contents, `.agents`, `DESIGN.md`, `CLAUDE.md`, and the complete plan.

Add a migration note that links the new repository to the original `APPLYTICS` repository. Keep the original repository as a historical reference and do not alter it.

### 3.2 Protect the migration

Before the first push:

1. Search the entire working tree for secrets.
2. Review `.gitignore`.
3. Review all Git history copied into the new repository.
4. Remove secrets from tracked files and history if any exist.
5. Add secret scanning and dependency scanning to GitHub Actions.
6. Protect the default branch.
7. Require checks before merging.
8. Keep a rollback tag for the migrated baseline.

### 3.3 Connect the new repository to Vercel

The current Vercel project is named `applytics`. It uses Next.js, has a Hobby plan, is connected to the old `mr-ahtashamulhaq/APPLYTICS` repository, and has the `applytics.online` domains attached. Its latest production deployment is marked `READY`. The project data also reports `live: false`, which must be verified before changing the production connection.

Create or update the Vercel Git connection to `mr-ahtashamulhaq/applytics-manus` only after the new repository is ready. Do not delete the old connection until the new repository has a successful preview deployment and the domain has a tested rollback path.

Keep the current production domain attached to the existing project during migration. Use preview deployments for testing. Change the production branch only after approval and verification.

## 4. Phase 3: Establish the database source of truth

### 4.1 Audit the live Supabase project

The live project is `APPLYTICS` with ref `ndcchdxnjdcowyocmcyo`. It is in `ACTIVE_HEALTHY` status. The public tables currently include:

| Table | Main fields | RLS |
|---|---|---|
| `users` | `id`, `clerk_user_id`, `name`, `email`, timestamps. | Enabled. |
| `profiles` | Contact, education, skills, experience, projects, resume file, links, timestamps. | Enabled. |
| `job_inputs` | User, job title, company, job description, skills, timestamp. | Enabled. |
| `generated_resumes` | User, job input, scores, keywords, output URLs, `ai_output`, timestamp. | Enabled. |
| `applications` | User, company, role, status, applied date, notes, timestamps. | Enabled. |
| `suggestions` | Name, email, suggestion, timestamp. | Enabled. |

Review all live RLS policies, indexes, foreign keys, triggers, extensions, migrations, and advisor results. Fix performance warnings such as repeated `auth.uid()` evaluation in RLS policies when the change is safe.

Do not run destructive SQL against production during planning. Use migrations and a Supabase branch or a controlled test project for changes.

### 4.2 Create a canonical data dictionary

Add `docs/data-dictionary.md` to `applytics-manus`. Define names and meanings for users, profiles, jobs, job sources, resumes, applications, ingestion runs, usage events, and analytics events.

The dictionary must resolve differences between the scraper fields and the current Applytics fields. It must define the source of truth for every field.

### 4.3 Add the catalog schema

Create migrations for these logical tables:

| Table | Purpose |
|---|---|
| `job_sources` | One record for each supported board or source. |
| `jobs` | One canonical shared record for each job. |
| `job_versions` | Optional history for meaningful source changes. |
| `ingestion_runs` | Status and metrics for each scraper run. |
| `ingestion_errors` | Board and parser errors for diagnosis. |
| `saved_jobs` | User bookmarks. |
| `recommendation_events` | Why a job was shown or selected. |
| `usage_events` | AI, PDF, and other resource use. |

Use stable fingerprints and source IDs. Add indexes for recency, source, location, title, employment type, experience, and skills.

Add RLS policies for shared catalog reads and user-owned records. Keep write access to ingestion tables limited to the service role or a protected server path.

### 4.4 Repair the existing schema

Create safe migrations for the fields already required by code. Reconcile the migration history with the live schema.

Resolve the conflict between optional job description input and `job_inputs.job_description NOT NULL`. Choose one product rule and enforce it in the UI, server validation, and database.

Add explicit foreign keys between applications, jobs, job inputs, and generated resume versions. Preserve old records during migration.

## 5. Phase 4: Repair the application foundation

### 5.1 Authentication and ownership

Use Clerk as the identity provider. Keep `clerk_user_id` as the external identity key. Create or update the local `users` record through a controlled server-side path.

For every read and write, verify that the logged-in user owns the record. Do not trust a client-provided `user_id`. Do not return unnecessary database fields.

Review `proxy.ts`, protected routes, server actions, Supabase client creation, and all API handlers.

### 5.2 Server validation

Define schemas for profile data, job input, application data, resume output, and public suggestion forms. Validate all data on the server.

Treat user input as data. Parameterize database queries. Escape or safely render user content. Sanitize text before display and before inclusion in generated documents.

### 5.3 Environment and error handling

Add startup checks for required environment variables. Give users safe error messages. Send detailed error information only to protected logs.

Add structured server logs with request IDs. Do not log secrets, authentication tokens, full resumes, or private profile data.

### 5.4 Tests

Add unit, integration, and end-to-end tests for the current application. Start with schema validation, ownership checks, profile save/load, job-input save, generation response parsing, PDF generation, and tracker mutations.

Run TypeScript, lint, tests, and production build checks before each meaningful commit.

## 6. Phase 5: Build job ingestion and catalog operations

Connect the scraper to the Applytics `jobs` and `ingestion_runs` schema. Do not connect it to user-owned tables.

Add an ingestion adapter that maps scraper records to the canonical Applytics schema. Reject invalid records. Record parser version and source metadata.

Implement stale-job handling without deleting jobs after one failed run. Mark jobs as active, stale, expired, or hidden according to documented rules.

Build an internal admin view or protected diagnostic page for run status. Show the last successful update, source health, job counts, and error counts.

Add pagination and server-side filtering. Do not load the full catalog into the browser.

## 7. Phase 6: Build job discovery and recommendation

Create these user-facing routes:

| Route | Function |
|---|---|
| `/app/jobs` | Search and filter the job catalog. |
| `/app/jobs/[id]` | Show job details and source link. |
| `/app/saved-jobs` | Show bookmarked jobs. |
| `/app/recommendations` | Show matched jobs with reasons. |

Start with explainable scoring:

| Signal | Example use |
|---|---|
| Skills | Match profile skills to required skills. |
| Title | Match target roles and related titles. |
| Location | Match city, remote status, and user preference. |
| Experience | Match years and level. |
| Recency | Prefer fresh jobs. |
| User actions | Improve ranking from saves and dismissals. |

Show users why a job matches. Add AI ranking only after deterministic ranking has useful measurement data.

Track impressions, opens, saves, dismissals, application starts, and completed applications. Do not use sensitive user data for ranking without a clear product reason and privacy notice.

## 8. Phase 7: Improve resume generation and PDF output

### 8.1 Input flow

Let users maintain a master profile. Let them select a catalog job or enter a job manually. Save the exact job description used for generation.

Show a clear preparation state. Display the job title and company before generation. Explain that AI output needs user review.

### 8.2 AI generation

Use a strict structured output schema. Validate every generated field on the server. Reject malformed output. Do not silently save partial or unsafe content.

Add prompt rules that prevent invented employers, dates, degrees, certifications, skills, or achievements. Mark inferred or suggested content clearly.

Add usage accounting and rate limits before opening the feature to real users.

### 8.3 Resume editor

Add an editor or review screen. Let users correct contact information, summaries, skills, experience, projects, education, and dates before PDF export.

Preserve original profile content and every generated version. Store the job input and generation metadata with each version.

### 8.4 PDF quality

Redesign `ResumePDF` using the supplied `DESIGN.md` rules. Control page width, margins, typography, section spacing, line wrapping, date formats, page breaks, links, and empty sections.

Test PDFs with short, normal, and very long content. Test missing optional fields and long company names. Add visual checks and text extraction checks.

Provide a download filename that does not expose sensitive data. Do not store generated files in an executable location. Check file type and size for all uploads.

## 9. Phase 8: Improve application tracking

Connect each application to a catalog job when available. Preserve manual applications for jobs entered outside the catalog.

Use a clear status model. The initial statuses can be Draft, Applied, Interview, Rejected, Accepted, and Withdrawn. Document each status.

Add these fields where useful:

| Field | Purpose |
|---|---|
| `job_id` | Links the application to the catalog. |
| `resume_version_id` | Records the resume used. |
| `applied_at` | Records the application time. |
| `next_follow_up_at` | Supports reminders. |
| `deadline_at` | Shows a known deadline. |
| `notes` | Stores user notes. |
| `source_url` | Preserves the external application URL. |
| `outcome_reason` | Supports later analytics. |

Add optimistic updates only with rollback on failure. Add empty states, loading states, error states, filters, sorting, and mobile support.

Add a job detail action that creates a linked application and selected resume version. Keep “Save to Tracker” working for manual applications.

## 10. Phase 9: Apply the design system and improve UX

Read `DESIGN.md` before any UI work. Use its colors, type scale, spacing, component rules, motion rules, and responsive guidance.

Audit all current routes. Remove inconsistent visual patterns. Keep one clear primary action on each page.

Complete these UX functions:

| Requirement | Planned work |
|---|---|
| Onboarding | Explain the value and guide users to complete a useful profile. |
| Empty states | Give a clear next action when no jobs, resumes, or applications exist. |
| Loading states | Show progress during scraping data loads, AI generation, and PDF creation. |
| Error states | Explain the problem and give a recovery action. |
| Mobile UX | Add responsive layouts and a sticky mobile CTA where appropriate. |
| Accessibility | Support keyboard navigation, focus states, labels, contrast, and screen readers. |
| Trust | Show source, freshness, AI limitations, and privacy information. |
| Navigation | Add internal links, breadcrumbs, and clear route titles. |

Do not create fake reviews, fake case studies, fake team photos, or fake customer results. Use real user feedback only after consent. Until then, use a product explanation or a clearly labeled pilot section.

## 11. Phase 10: SEO and public website requirements

Create a custom 404 page. Add unique titles and meta descriptions for every route. Add Open Graph metadata and a controlled social image.

Add `robots.txt`, a sitemap, canonical URLs, and structured data that matches the real business. Use local Schema.org data only for facts we can support.

Add internal links between the landing page, product explanation, research, privacy, terms, sign-in, and early-access conversion pages.

Add a five-item FAQ. Add a clear response-time promise only after the team can meet it.

Add a conversion thank-you page for a real form submission. Do not use it for false conversion counts.

Add maps and direct location links only where they help users understand supported job locations or the company’s real location. Do not embed unnecessary tracking or expose private addresses.

Add Google Analytics only after consent, privacy review, and a clear data-retention decision. Prefer privacy-conscious event tracking. Document every event.

Remove numeric prices from the landing page. Use early-access wording. Remove unsupported “unlimited,” “priority,” and feature-limit claims.

## 12. Phase 11: Complete the security checklist

Use `videcodingsecurity.txt` as a mandatory release checklist. Implement and verify every applicable item:

| Security requirement | Implementation and verification |
|---|---|
| Escape and sanitize user input | Sanitize before display, PDF rendering, logs, and public output. |
| Check file type and size | Validate MIME type, extension, size, and content. Reject unsafe files. |
| Non-executable file storage | Store uploads in private or non-executable storage. Use signed URLs. |
| Ownership checks | Check Clerk identity and database ownership on every read and write. |
| Parameterized queries | Use Supabase query builders or safe parameters. Review raw SQL. |
| Hide API keys | Keep all secrets in server-side environment variables or GitHub Secrets. |
| Purge secrets | Scan current files and Git history. Rotate any exposed key. |
| Public database keys | Use only publishable or anon keys in the browser, with RLS. |
| RLS | Keep RLS enabled and test every policy. |
| Encryption | Use HTTPS and provider encryption. Do not store plaintext secrets. |
| Server authentication | Protect every private route and server action. |
| Record access | Limit records by user ID and role. |
| Client tampering | Recalculate ownership and protected fields on the server. |
| Session cookies | Use Clerk’s secure session behavior and review cookie settings. |
| Password hashing | Keep password handling in Clerk. Do not implement a second password store. |
| Login rate limiting | Use Clerk protections and add limits around custom auth-related actions. |
| Bot protection | Protect public suggestions and early-access forms. |
| Server validation | Validate every form and API payload. |
| XSS protection | Escape user-generated content and set a CSP. |
| Upload restrictions | Limit file type, extension, size, and storage path. |
| Response minimization | Select only fields needed by each response. |
| Security headers | Add CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and suitable Permissions-Policy. |
| HTTPS | Force HTTPS and test all domain variants. |
| Dependency security | Run audits, update dependencies, and record exceptions. |

Add a threat model for authentication, resume files, AI prompts, job data, scraper secrets, and public forms. Add an incident response runbook and a key-rotation runbook.

## 13. Phase 12: Free-tier controls and cost safety

Keep the first release within free-tier limits where possible. Do not assume a free service provides a production SLA.

Add server-side usage accounting for:

- Resume generations.
- PDF exports.
- Job recommendations.
- Scraper runs.
- Database storage.
- File storage.
- Analytics events.

Add per-user and per-IP rate limits. Add a kill switch for expensive AI or scraper operations. Add alerts for unusual usage.

Keep the initial scraper schedule small. Use the database fingerprint before adding Redis. Use GitHub Actions for early public or approved private repository execution. Reassess the deployment after measuring real runtime.

Review Vercel Hobby terms before commercial operation. Review Supabase pause behavior and storage limits. Review Clerk retained-user limits. Review Upstash command limits if Redis remains enabled.

## 14. Phase 13: Privacy, data retention, and user controls

Document what Applytics collects, why it collects it, how long it keeps it, and which services process it.

Add user controls for account deletion, profile deletion, resume deletion, application deletion, and data export. Define what happens to shared job catalog records when a user deletes an account.

Do not send more profile data to an AI provider than the task requires. Do not include authentication tokens in AI prompts. Document the AI provider, processing purpose, and retention position.

Add consent for analytics, marketing messages, and optional public testimonials. Keep product operation separate from marketing consent.

## 15. Phase 14: Professional privacy policy and terms of use

Rewrite the privacy policy in professional language. It must cover:

| Topic | Required content |
|---|---|
| Data controller | The responsible Applytics entity and contact method. |
| Data collected | Account, profile, resume, job-input, application, usage, device, and analytics data. |
| Purpose | Authentication, resume generation, job discovery, tracking, security, and support. |
| Service providers | Clerk, Supabase, Vercel, AI provider, analytics, and scraper infrastructure. |
| AI processing | What data enters AI services and how users can limit or delete it. |
| Retention | Retention period or deletion rule for every major data type. |
| User rights | Access, correction, export, deletion, and consent withdrawal. |
| Security | Technical and organizational safeguards. |
| International transfers | Relevant transfer and service-provider information. |
| Children | Age requirement and handling of underage users. |
| Changes | Notice process for policy changes. |
| Contact | A working privacy contact. |

Rewrite the terms of use. They must cover:

| Topic | Required content |
|---|---|
| Eligibility | Minimum age and account accuracy. |
| Service scope | What Applytics does and does not promise. |
| User content | User ownership, license to operate the service, and prohibited content. |
| AI disclaimer | AI output can contain errors and requires user review. |
| Job data | Source links, freshness limits, third-party terms, and no guarantee of employment. |
| Acceptable use | No scraping abuse, impersonation, fraud, malware, or illegal use. |
| Accounts | Account security and suspension rules. |
| Availability | Maintenance, delays, and service limits. |
| Intellectual property | Applytics rights and third-party rights. |
| Liability | Appropriate limitation language reviewed by qualified counsel. |
| Governing law | The actual chosen jurisdiction. |
| Changes and termination | Notice, account closure, and data handling. |
| Contact | A working legal contact. |

These documents are product documents, not a substitute for legal advice. A qualified lawyer must review them before commercial launch.

## 16. Phase 15: Testing and release gates

Create a release checklist in `docs/release-checklist.md`. Do not deploy a production build until all required checks pass.

| Test area | Required checks |
|---|---|
| Type safety | `tsc --noEmit` passes. |
| Lint | Lint passes or every exception is recorded and approved. |
| Unit tests | Validation, scoring, transformations, and ownership tests pass. |
| Integration tests | Supabase and Clerk boundary tests pass. |
| End-to-end tests | Sign in, profile, generation, PDF, jobs, save, and tracker flows pass. |
| Visual tests | Main desktop and mobile routes are reviewed. |
| PDF tests | Text extraction, page count, overflow, links, and visual layout pass. |
| Security tests | RLS, ownership, upload, headers, rate limits, and secret scans pass. |
| Scraper tests | Fixtures, dry run, schema mapping, and workflow checks pass. |
| Performance | Main queries use indexes and pagination. |
| SEO | Metadata, sitemap, robots, canonical links, and 404 pass. |
| Privacy | Policies, consent, deletion, and export flows pass. |
| Deployment | Preview and production smoke tests pass. |
| Rollback | A previous working deployment can be restored. |

## 17. Phase 16: Deployment and maintenance

Deploy the new main repository to a Vercel preview. Test every protected and public route. Test `applytics.online` only after preview verification.

Keep the scraper deployment separate. Watch the first scheduled runs manually. Compare run records with visible catalog freshness.

Create a weekly maintenance procedure:

1. Review scraper run success and source health.
2. Review job freshness and duplicate counts.
3. Review AI and storage usage.
4. Review security alerts and dependency updates.
5. Review user errors and support requests.
6. Review product analytics and conversion events.
7. Update `plan.md` and relevant documentation.
8. Commit and push each meaningful change.

Create a monthly product review. Compare feature claims with shipped behavior. Remove claims that are not true. Record decisions in `docs/decisions.md`.

## 18. Final definition of done

The refactor is complete when the following statements are true:

- `applytics-manus` contains the main application and all required project documentation.
- `applytics-job-scraper` contains the separate scraper and its operating documentation.
- The scraper runs through the approved GitHub Actions schedule without daily manual action.
- The scraper writes to the Applytics catalog schema and records every run.
- The application shows fresh jobs and explains recommendation matches.
- Users can tailor, review, edit, download, and version resumes.
- Users can create linked applications and manage the tracker.
- All private data has tested ownership controls.
- The security checklist has been implemented and verified.
- The site has complete SEO, accessibility, error, loading, and mobile behavior.
- Public claims match real features.
- Public pricing numbers are removed until pricing is final.
- Privacy policy and terms of use are professional and reviewed.
- `README.md` and other GitHub documentation are current.
- `plan.md` records every completed task and commit.
- The production deployment has a tested rollback path.

## References

[1]: https://github.com/mr-ahtashamulhaq/APPLYTICS "Current APPLYTICS repository"
[2]: https://github.com/muhammadhaider02/Scrapling-Job-Boards-Scrapper "Upstream scraper repository"
[3]: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions "GitHub Actions billing"
[4]: https://docs.github.com/actions/using-workflows/events-that-trigger-workflows "GitHub Actions workflow events"
[5]: https://supabase.com/pricing "Supabase pricing"
[6]: https://clerk.com/pricing "Clerk pricing"
[7]: https://vercel.com/docs/plans/hobby "Vercel Hobby plan"
[8]: https://vercel.com/pricing "Vercel pricing"
[9]: https://upstash.com/pricing/redis "Upstash Redis pricing"
[10]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase Row Level Security"
