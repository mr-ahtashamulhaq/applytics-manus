# Applytics architecture

Applytics has two repositories. The public main repository contains the authenticated SaaS. The private scraper repository contains the scheduled ingestion worker. Supabase is the shared data boundary.

## System boundaries

```text
Verified job boards
        |
        v
Private GitHub Actions worker
        |
        | SUPABASE_URL + service role key
        v
Supabase PostgreSQL
  jobs, ingestion_runs, ingestion_errors
        |
        | server-side reads
        v
Public Next.js application
  Clerk auth + server actions + protected routes
        |
        +--> Groq-compatible AI provider
        |
        +--> Resume PDF response
        |
        +--> User tracker
```

The browser does not receive the Supabase service-role key or the AI provider key. The worker does not receive Clerk credentials. The worker writes shared catalog and operational records. The application writes user-owned workflow records.

## Ingestion flow

The private worker runs from GitHub Actions. The normal scheduled path runs Mustakbil only because it is the first source verified end-to-end. The workflow has a concurrency guard, a bounded runtime, read-only repository contents permission, and artifact retention for investigation.

For each run, the worker creates an `ingestion_runs` record. It fetches configured role pages, parses source cards, enriches supported fields, deduplicates by `job_fingerprint`, and upserts catalog records. It records failed roles in `ingestion_errors`, finishes the run with counters, and marks records that are no longer seen according to the worker freshness policy.

LinkedIn, Indeed, and Rozee remain available for manual recovery tests. They are not part of the automatic schedule until controlled runs produce trustworthy listing records.

## Authenticated application flow

Clerk authenticates the user and supplies the identity subject. A server action maps that subject to the internal `users.id`. The action validates request input with Zod, applies an ownership filter, performs the minimum required database selection, and maps database failures to safe user-facing messages.

The `/app/jobs` route loads active catalog records with bounded filters and pagination. The job detail route permits active and stale records so a user can review a listing that needs attention. The saved-jobs route reads only rows owned by the current user and hides catalog records that are no longer available.

The recommendations route reads profile city and skills. It compares these values with catalog fields. It returns only listings with a positive evidence signal and explains the matched skill or location. It does not claim a match when no profile data supports one.

## Resume flow

The user can start from a catalog job or enter a manual job description. For a catalog request, the server resolves the supplied `job_id` and replaces client-provided catalog fields with the live job record. The server loads the current user profile and builds a prompt with explicit no-invention rules.

The AI provider must return JSON. The server parses the response with a strict Zod schema. The schema limits strings, arrays, nested entries, score range, and unknown keys. A second evidence check rejects unsupported skills, roles, companies, projects, and numbers before the result is stored in `generated_resumes.ai_output`.

The result page verifies resume ownership. It renders the validated result, provides PDF generation, and carries the resume and optional catalog job IDs into the tracker.

## Tracker flow

Applications are user-owned. Manual entries remain supported. Catalog and resume links are nullable so older rows remain valid. A server action checks that a linked job is active or stale, that a linked resume belongs to the current user, and that linked job and resume IDs agree.

The tracker stores status, applied date, deadline, follow-up date, outcome, notes, and optional workflow links. Status and outcome values use constrained vocabularies. Rows provide a small editor for follow-up details and preserve manual tracker use.

## Failure behavior

| Failure | User-visible behavior | Operational behavior |
|---|---|---|
| No authenticated session | Protected action returns an authentication error | No user data query runs |
| Invalid input | Form or action returns a bounded validation message | No write occurs |
| Missing user row | Action returns a safe account message | User bootstrap is attempted where supported |
| Job disappears | Resume or tracker creation stops with an availability message | No stale client payload is persisted as catalog truth |
| AI returns invalid JSON | Generation stops with a retry message | Schema failure count is logged without resume content |
| AI claims unsupported facts | Generation stops before persistence | Only a bounded reason is logged |
| Worker role fails | Catalog run continues for other roles | `ingestion_errors` records the role failure |
| Source access is blocked | Source remains outside automatic schedule | Manual recovery documentation records the state |

## Deployment boundary

The application is intended for Vercel. The current Vercel project still points to the historical repository and must not be switched until a preview deployment, environment verification, rollback tag, and user-facing deployment decision are complete.

The scraper is deployed through GitHub Actions in its private repository. It uses free-tier services where practical. The scheduled path does not require Redis.
