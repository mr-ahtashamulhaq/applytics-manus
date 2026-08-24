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
- [x] Scan files and history for secrets. No real credential matches were found; historical matches were credential-shaped README placeholders and are documented in `docs/security-scan.md`.
- [ ] Protect the default branch and configure repository checks.
- [ ] Add the new repository to the existing Vercel project through a preview deployment.
- [ ] Create a rollback tag and migration note.

### Phase 3: Establish the database source of truth

- [x] Add the canonical data dictionary. Added `docs/data-dictionary.md` with live table, column, ownership, link, and migration definitions.
- [ ] Reconcile migration history with the live Supabase schema. The new catalog, ingestion, workflow-link, saved-job, and tracker migrations are applied; legacy drift review remains.
- [x] Add backward-compatible `job_id` links to job inputs and generated resumes, plus `job_id` and `generated_resume_id` links to applications; applied as `link_catalog_workflows` and verified live.
- [ ] Add the normalized job catalog schema.
- [x] Add ingestion run and ingestion error tables. Applied as `ingestion_health` in Supabase and verified through an Actions run.
- [ ] Add saved jobs, recommendation events, and usage events.
- [ ] Test RLS policies, indexes, constraints, and ownership rules. The security advisor is clean after ingestion-table hardening; performance advisories remain for legacy foreign-key indexes, repeated auth-policy evaluation, and unused indexes on newly created tables.

### Phase 4: Repair the application foundation

- [x] Resolve the existing Clerk appearance typecheck errors on sign-in and sign-up pages.
- [x] Update handwritten TypeScript types for the live users, profiles, generated-resumes, jobs, ingestion-runs, and ingestion-errors tables.
- [x] Defer server Supabase client creation until request time and fail clearly when server environment variables are missing; TypeScript and production build pass.
- [x] Preserve and strengthen tracker ownership filters; invalid IDs and unauthorized rows now return safe no-row errors.
- [x] Add server-side Zod schemas for tracker inputs, statuses, dates, notes, and UUIDs.
- [x] Return bounded, user-safe tracker errors instead of raw database messages.
- [x] Clear the two baseline lint errors in the research chart and liquid button; the lint check now has zero errors, with existing warnings documented for later cleanup.
- [ ] Repair authentication and ownership checks across all server actions. Profile, catalog, recommendations, saved jobs, tracker, and generation paths now enforce authenticated server-side access; remaining review is still required for every route consumer.
- [x] Add server-side schemas and validation to the remaining server actions. Profile and public suggestion inputs now use bounded Zod schemas; raw database messages are no longer returned.
- [ ] Add structured logging.

Action-audit validation: TypeScript and production build passed; lint remains 0 errors with the existing 140 warnings.
- [ ] Repair environment validation.
- [ ] Add unit, integration, and end-to-end tests.

### Phase 5: Build job ingestion and catalog operations

- [x] Add an authenticated, paginated jobs loader with bounded filters and a safe selected-field response.
- [x] Define the scraper-to-catalog mapping contract in `supabase/migrations/002_jobs_catalog.sql`.
- [x] Apply and verify the migration before enabling production writes. Supabase project has the verified `public.jobs` table, and Mustakbil run `32735373095` wrote five active records.
- [ ] Add freshness, stale, expired, and source-status rules. The worker currently deletes records older than the configured threshold and records source names in ingestion health data.
- [x] Add pagination and server-side filtering in the authenticated server loader; UI controls remain pending.
- [x] Add protected ingestion diagnostics in the worker. Main-application diagnostic views remain pending.

### Phase 6: Build discovery and recommendations

- [x] Build `/app/jobs`. Added server-loaded filters, source health messaging, job cards, direct source links, resume handoff links, pagination, loading skeletons, and an accessible empty state. Design direction is documented in `design-system/applytics/pages/jobs.md`.

- [x] Build `/app/jobs/[id]`. Added full description, source metadata, skills, source link, tailoring action, and tracker action with safe not-found handling.
- [x] Build `/app/saved-jobs`. Added migration `008_saved_jobs.sql`, ownership-protected save/remove actions, catalog/detail toggles, and a truthful saved-jobs route. Live schema inspection confirms the table, job/user foreign keys, and RLS are present.
- [x] Build `/app/recommendations`. Added profile-based deterministic ranking using stored skills and city.
- [x] Add explainable deterministic ranking. The UI shows matched skills or location evidence, excludes zero-signal listings, and does not invent a match when profile data is missing.
- [ ] Add recommendation event tracking.

Saved jobs validation: production build passed, TypeScript passed, lint passed with 0 errors and the existing 140 warnings, the Impeccable detector returned `[]` for changed UI targets, and the post-migration Supabase security advisor returned zero lints.

### Phase 7: Improve resume generation and PDF output

- [x] Connect `/app/jobs` to `/app/generate?jobId=...`; resolve the catalog record server-side, prefill the form, and persist `job_id` on job inputs and generated resumes.
- [x] Validate generation input bounds and catalog-job IDs server-side.
- [x] Improve generation input and review flow. The result route validates UUIDs, verifies ownership, and rejects malformed stored AI output before rendering or linking.

Resume validation: TypeScript and production build passed; lint remains 0 errors with the existing 140 warnings.

PDF endpoint validation: TypeScript and production build passed; lint remains 0 errors with the existing 140 warnings.

Resume result validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the result route detector returned `[]`.
- [x] Add strict AI output validation. Added a strict Zod schema for all nested fields, array sizes, text bounds, score range, and unknown-key rejection.
- [x] Prevent invented resume content. Added prompt constraints and a server-side evidence check for profile-supported skills, roles, companies, projects, dates, and numbers; unsupported model output is rejected before persistence.
- [ ] Add resume editing and version history.
- [ ] Redesign PDF output using DESIGN.md.
- [ ] Test PDF layout with short and long content.
- [x] Harden the PDF download boundary. UUIDs, ownership, strict stored-AI output validation, safe filenames, and bounded render failures are enforced in `/api/pdf/[id]`.

### Phase 8: Build the linked application tracker

- [x] Link applications to catalog jobs. The live schema has `applications.job_id`, and the result-to-tracker handoff carries it through server validation.
- [x] Link applications to resume versions. The live schema has `applications.generated_resume_id`, and the tracker checks resume ownership before inserting the link.
- [x] Surface linked job and resume in tracker rows. Tracker rows show an internal catalog link, stale state, and an attached-resume indicator; summaries load with ownership filters.

- [x] Add deadlines and follow-up dates. Migration `009_tracker_followups.sql` added nullable `deadline` and `follow_up_date` fields, indexes, validated creation, and authenticated editing; live schema verification confirmed both columns as nullable dates.
- [x] Add outcomes and status definitions. Added constrained outcome values (`offer`, `rejected`, `withdrawn`, `no_response`, `hired`, `other`) with UI labels and safe updates; live schema verification confirmed the nullable outcome column.
- [x] Add mobile, loading, empty, and error states. The tracker keeps a horizontally scrollable mobile table, existing empty state, loading skeleton, and new retry-focused route error boundary. Rollback behavior remains documented in the release runbook.

Tracker follow-up validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the Impeccable detector returned `[]` for `TrackerTable.tsx`.

Tracker linkage validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the tracker UI detector returned `[]`.

Tracker resilience validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the detector returned `[]` for tracker loading, error, and table files.

### Phase 9: Apply DESIGN.md and improve UX

- [ ] Read and apply DESIGN.md before each UI task.
- [ ] Apply the color, typography, spacing, radius, and motion tokens.
- [ ] Improve onboarding and empty states.
- [ ] Add responsive layouts and mobile CTA behavior.
- [ ] Run the required critical UI audit before each UI commit.

### Phase 10: Complete SEO and public-site requirements

- [x] Add custom 404 page. Added a branded recovery page with a direct homepage link.
- [x] Add unique title and meta description for every route. Added root defaults and route-specific metadata for the current public and authenticated pages.
- [x] Add Open Graph metadata, robots.txt, sitemap, and canonical URLs. Root metadata now uses a configurable site URL, while robots and sitemap expose public pages only.
- [ ] Add internal links and breadcrumbs.
- [x] Add a five-item FAQ. Added current-scope answers for verified sources, recommendations, resume review, tracker links, and free early access.
- [ ] Add a real conversion thank-you page.
- [ ] Add approved local structured data.
- [ ] Add analytics only after consent and privacy review.
- [x] Remove unsupported price and feature claims. The landing page now uses free early-access copy, verified Mustakbil coverage, review-first resume language, and no fake survey, match-score, response-rate, timing, pricing, or outcome promises.
- [x] Review public authentication and research copy. Sign-in, sign-up, research, mission, audience, platform, and roadmap surfaces now match the current product scope.
- [x] Remove public analytics until consent and privacy review. The unconditional root analytics script was removed.

SEO and public-copy validation: TypeScript and production build passed after changing the server-rendered pricing icon to the SSR-safe entrypoint. Lint remains 0 errors with the existing 140 warnings, and the Impeccable detector returned `[]` for changed public UI files.

FAQ validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the Impeccable detector returned `[]` for the homepage and FAQ component.

### Phase 11: Implement security and privacy controls

- [ ] Complete every applicable item in videcodingsecurity.txt. Supabase security advisors report no current lints after migrations `004_lock_ingestion_health` and `005_restrict_rls_helper` and explicit role revocation in `006_revoke_rls_helper_roles`.
- [x] Scan files and history for secrets. No real credential matches were found; historical matches were credential-shaped README placeholders and are documented in `docs/security-scan.md`.
- [x] Test RLS and ownership boundaries. Live read-only checks confirmed RLS is enabled on `saved_jobs`, `ingestion_runs`, and `ingestion_errors`; saved-job policies are user-owned, and ingestion tables deny all `anon` and `authenticated` operations.
- [x] Review upload validation and safe storage scope. The current app has no browser file input or upload endpoint; `resume_file_url` is not written by the current UI. Any future upload must validate MIME type, extension, size, ownership, and non-executable storage before release.
- [x] Add basic bot protection. The public suggestion form includes a visually hidden honeypot and the server silently drops bot-filled submissions.
- [ ] Add durable rate limiting for public feedback and AI operations.
- [x] Add security headers and HTTPS checks. `next.config.ts` adds CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy; production responses add HSTS and `upgrade-insecure-requests`.
- [x] Run dependency security scans. Updated Next.js and its ESLint config to `16.3.2`, removed unused `lucide-react` and `shadcn` dependencies, removed the obsolete stylesheet import, and verified `npm audit --omit=dev` reports zero vulnerabilities.
- [x] Create a threat model and incident runbook. Added `docs/threat-model.md` and `docs/security-incident-runbook.md` with trust boundaries, residual risks, containment steps, recovery checks, and communication fields.

RLS validation: live policy and RLS-enabled queries passed against Supabase project `ndcchdxnjdcowyocmcyo`.

Security documentation validation: threat boundaries, residual risks, credential rotation, data-exposure response, AI-abuse response, scraper containment, and rollback checks are documented in the security runbooks.

Security-header validation: TypeScript and production build passed; lint remains 0 errors with the existing 140 warnings.

Dependency and usage validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the production dependency audit reports zero vulnerabilities.

Bot-protection validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the Impeccable detector returned `[]` for the feedback form.

### Phase 12: Add free-tier controls and operations

- [ ] Add AI, PDF, scraper, storage, and analytics usage events.
- [x] Add a per-user generation guard. Resume generation applies a temporary server-side daily fair-use guard before the AI call; the limit is not advertised as a product quota.
- [ ] Add per-IP limits. A shared durable store is still required for reliable limits across serverless instances.
- [ ] Add expensive-operation kill switches.
- [ ] Add scraper health and freshness monitoring.
- [ ] Add cost and capacity alerts.
- [ ] Document free-tier limits and upgrade triggers.

### Phase 13: Update project documentation

- [x] Rewrite the main README. Removed stale MVP claims, numeric or unsupported promises, emoji headings, and outdated table counts; documented the current early-access product and source health.
- [x] Add architecture documentation. Added `docs/architecture.md` for the app, worker, database boundary, user flow, and failure behavior.
- [x] Add data dictionary and migration notes. Added `docs/data-dictionary.md` and listed migrations `001` through `009`.
- [x] Add local development instructions. The README now documents environment placeholders, migration order, and local checks.
- [x] Add testing and release documentation. Added `docs/release.md` with application and worker gates.
- [x] Add deployment and rollback documentation. The runbook documents preview verification, the untouched Vercel integration, forward-only migrations, and rollback handling.
- [ ] Add decision records.
- [x] Push every document to GitHub after each meaningful documentation subphase.

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

- [x] Rewrite the Privacy Policy professionally. Replaced stale provider, analytics, retention, and deletion claims with an early-access draft that matches the current service.
- [x] Rewrite the Terms of Use professionally. Added the actual catalog, AI, PDF, tracker, acceptable-use, third-party, and early-access conditions.
- [x] Add data retention, AI processing, user rights, acceptable use, disclaimers, and contact details. Both pages identify the remaining legal decisions and require qualified legal review before publication.
- [ ] Obtain qualified legal review before commercial launch. This remains a release gate.

Legal-document validation: TypeScript and production build passed, lint remains 0 errors with the existing 140 warnings, and the Impeccable detector returned `[]` for the changed legal and footer files.

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
