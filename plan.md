# APPLYTICS Production Refactor Plan

**Status:** Phase 1 scraper setup is operational for Mustakbil and the main repository bootstrap is complete. Ingestion health records, scheduled-run verification, and the remaining product refactor are pending.

## Repository rules

- Push all main application work to `mr-ahtashamulhaq/applytics-manus`.
- Do not push changes to the original `APPLYTICS` repository.
- Commit every meaningful change.
- Use commit messages with no more than three words and no punctuation.
- Mark each completed task in this file immediately after completion.
- Record the commit hash beside each completed task.
- Keep all project documents in GitHub.

## Phases

### Phase 1: Set up and operationalize applytics-job-scraper

- [x] Clone the upstream scraper locally.
- [x] Create the `applytics-job-scraper` repository privately.
- [x] Add the upstream scraper source with attribution and license preservation.
- [x] Add `DESIGN.md`, `videcodingsecurity.txt`, and `CLAUDE.md` to the project workspace.
- [x] Force-add and verify `DESIGN.md`, `CLAUDE.md`, and `.agents/` on the public remote. Commit `4608b45`.
- [x] Confirm the `agents.zip` installation plan and add applicable skills.
- [x] Define the Applytics job output contract.
- [x] Add dry-run support.
- [x] Add parser fixtures and enrichment tests.
- [x] Add the Applytics catalog schema mapping in the scraper repository. See scraper commit `c4a56a6`.
- [x] Add the first Applytics `jobs` catalog migration file. See commit `557edb0`.
- [x] Apply and verify the `jobs` migration in Supabase. Applied `jobs_catalog` to project `ndcchdxnjdcowyocmcyo`; verified the table, columns, indexes, constraints, and RLS. Mustakbil run `32735373095` then wrote and verified five active rows.
- [x] Add ingestion run records. Migration `003_ingestion_health.sql` and worker reporting are live; reporting run `32736499139` verified five scraped, five enriched, and five upserted jobs with zero errors.
- [x] Configure safe GitHub Actions schedules and manual dispatch.
- [x] Add scraper README and operations documentation.
- [ ] Run and verify the first scheduled scrape. Mustakbil manual runs `32735373095`, `32736499139`, and `32737220376` wrote and rechecked active catalog rows and protected run records. The automatic schedule now targets Mustakbil only; the first real scheduled event still needs verification.

### Phase 2: Create and migrate the main application repository

- [x] Copy the current APPLYTICS source into this repository.
- [x] Create the public `applytics-manus` repository.
- [ ] Scan files and history for secrets.
- [ ] Protect the default branch and configure repository checks.
- [ ] Add the new repository to the existing Vercel project through a preview deployment.
- [ ] Create a rollback tag and migration note.

### Phase 3: Establish the database source of truth

- [ ] Add the canonical data dictionary.
- [ ] Reconcile migration history with the live Supabase schema.
- [ ] Add the normalized job catalog schema.
- [x] Add ingestion run and ingestion error tables. Applied as `ingestion_health` in Supabase and verified through an Actions run.
- [ ] Add saved jobs, recommendation events, and usage events.
- [ ] Test RLS policies, indexes, constraints, and ownership rules.

### Phase 4: Repair the application foundation

- [ ] Repair authentication and ownership checks.
- [ ] Add server-side schemas and validation.
- [ ] Add safe error handling and structured logging.
- [ ] Repair environment validation.
- [ ] Add unit, integration, and end-to-end tests.

### Phase 5: Build job ingestion and catalog operations

- [x] Define the scraper-to-catalog mapping contract in `supabase/migrations/002_jobs_catalog.sql`.
- [x] Apply and verify the migration before enabling production writes. Supabase project has the verified `public.jobs` table, and Mustakbil run `32735373095` wrote five active records.
- [ ] Add freshness, stale, expired, and source-status rules. The worker currently deletes records older than the configured threshold and records source names in ingestion health data.
- [ ] Add pagination and server-side filtering.
- [x] Add protected ingestion diagnostics in the worker. Main-application diagnostic views remain pending.

### Phase 6: Build discovery and recommendations

- [ ] Build `/app/jobs`.
- [ ] Build `/app/jobs/[id]`.
- [ ] Build `/app/saved-jobs`.
- [ ] Build `/app/recommendations`.
- [ ] Add explainable deterministic ranking.
- [ ] Add recommendation event tracking.

### Phase 7: Improve resume generation and PDF output

- [ ] Improve generation input and review flow.
- [ ] Add strict AI output validation.
- [ ] Prevent invented resume content.
- [ ] Add resume editing and version history.
- [ ] Redesign PDF output using DESIGN.md.
- [ ] Test PDF layout with short and long content.

### Phase 8: Build the linked application tracker

- [ ] Link applications to catalog jobs.
- [ ] Link applications to resume versions.
- [ ] Add deadlines and follow-up dates.
- [ ] Add outcomes and status definitions.
- [ ] Add mobile, loading, empty, error, and rollback states.

### Phase 9: Apply DESIGN.md and improve UX

- [ ] Read and apply DESIGN.md before each UI task.
- [ ] Apply the color, typography, spacing, radius, and motion tokens.
- [ ] Improve onboarding and empty states.
- [ ] Add responsive layouts and mobile CTA behavior.
- [ ] Run the required critical UI audit before each UI commit.

### Phase 10: Complete SEO and public-site requirements

- [ ] Add custom 404 page.
- [ ] Add unique title and meta description for every route.
- [ ] Add Open Graph metadata, robots.txt, sitemap, and canonical URLs.
- [ ] Add internal links and breadcrumbs.
- [ ] Add a five-item FAQ.
- [ ] Add a real conversion thank-you page.
- [ ] Add approved local structured data.
- [ ] Add analytics only after consent and privacy review.
- [ ] Remove unsupported price and feature claims.

### Phase 11: Implement security and privacy controls

- [ ] Complete every applicable item in videcodingsecurity.txt.
- [ ] Scan files and history for secrets.
- [ ] Test RLS and ownership boundaries.
- [ ] Add upload validation and safe storage.
- [ ] Add rate limiting and bot protection.
- [ ] Add security headers and HTTPS checks.
- [ ] Run dependency security scans.
- [ ] Create a threat model and incident runbook.

### Phase 12: Add free-tier controls and operations

- [ ] Add AI, PDF, scraper, storage, and analytics usage events.
- [ ] Add per-user and per-IP limits.
- [ ] Add expensive-operation kill switches.
- [ ] Add scraper health and freshness monitoring.
- [ ] Add cost and capacity alerts.
- [ ] Document free-tier limits and upgrade triggers.

### Phase 13: Update project documentation

- [ ] Rewrite the main README.
- [ ] Add architecture documentation.
- [ ] Add data dictionary and migration notes.
- [ ] Add local development instructions.
- [ ] Add testing and release documentation.
- [ ] Add deployment and rollback documentation.
- [ ] Add decision records.
- [ ] Push every document to GitHub.

### Phase 14: Verify and deploy

- [ ] Run TypeScript checks.
- [ ] Run lint and tests.
- [ ] Run production build.
- [ ] Review public and protected routes.
- [ ] Verify preview deployment.
- [ ] Verify the custom domain.
- [ ] Switch Vercel Git integration only after approval.
- [ ] Test rollback.

### Phase 15: Rewrite legal documents

- [ ] Rewrite the Privacy Policy professionally.
- [ ] Rewrite the Terms of Use professionally.
- [ ] Add data retention, AI processing, user rights, acceptable use, disclaimers, and contact details.
- [ ] Obtain qualified legal review before commercial launch.

### Phase 16: Final release and maintenance

- [ ] Complete the release checklist.
- [ ] Confirm all product claims match shipped behavior.
- [ ] Confirm the scraper schedule and run history.
- [ ] Confirm deletion, export, and privacy flows.
- [ ] Create the first release tag.
- [ ] Start weekly operational review.
- [ ] Update this plan after every meaningful change.

## Current completed bootstrap

**Bootstrap commit:** `4d5ea7e` (`Bootstrap Manus`)

**Required guidance files commit:** `4608b45` (`Track project guidance`)

- `applytics-manus` local workspace created.
- `applytics-job-scraper` local workspace created.
- `mr-ahtashamulhaq/applytics-manus` created as public.
- `mr-ahtashamulhaq/applytics-job-scraper` created as private.
- Current APPLYTICS source copied without `.git`, build output, dependencies, or environment secrets.
- Upstream scraper source copied without `.git`.
- `DESIGN.md` added.
- `videcodingsecurity.txt` added.
- `CLAUDE.md` added from the requested source.
- `.agents` archive extracted into the main project workspace.
- Detailed plan added as `APPLYTICS_REFACTOR_PLAN.md`.
- Simple-English review added as `APPLYTICS_PRODUCTION_DIRECTION_REVIEW_SIMPLE.md`.
