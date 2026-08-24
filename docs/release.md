# Applytics release runbook

This runbook describes the release checks for the early-access SaaS. It does not authorize a Vercel integration change. The historical `APPLYTICS` repository remains unchanged.

## Before release

Make sure that the main repository is clean and pushed:

```bash
git status --short
git log -1 --oneline
git remote -v
```

Run the application checks:

```bash
./node_modules/.bin/tsc --noEmit
npm run lint
npm run build
```

Lint currently exits with zero errors and 140 existing warnings. A new lint error is a release blocker. A changed UI surface also needs an Impeccable detector pass.

Review the public product claims. The product is free during early access. Do not publish numeric pricing, quotas, guaranteed ATS results, guaranteed interviews, or unsupported source coverage.

Review the current source health. Mustakbil is verified. LinkedIn, Indeed, and Rozee remain outside the automatic schedule until their access and parsing are verified.

## Database gate

Apply ordered migrations to the target Supabase project. Confirm that the target contains the current live columns for users, profiles, jobs, job inputs, generated resumes, saved jobs, applications, ingestion runs, and ingestion errors.

Run read-only checks for the new tables and indexes. Confirm that user-owned tables have ownership policies and that protected ingestion tables deny access to public API roles. Do not expose the service-role key to client code.

## Application gate

Check the following flows in an authenticated preview:

1. Create or update a profile.
2. Browse the active catalog and open a listing.
3. Save and remove a listing.
4. Open recommendations with skills and city present.
5. Open recommendations with no profile signals.
6. Tailor a resume from a catalog job.
7. Review the resume and download its PDF.
8. Create a linked tracker application.
9. Edit deadline, follow-up date, outcome, and notes.
10. Change status and delete the application.

Check that another user cannot read or modify the first user's rows. Check that a missing job stops new resume or tracker links. Check that invalid UUIDs, dates, URLs, long text, and malformed AI JSON return safe errors.

## Worker gate

The normal GitHub Actions path needs only these repository secrets:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The service-role key must exist only in the private worker repository's GitHub Actions secrets. The scheduled workflow must run Mustakbil only until source verification changes the gate.

Do not mark automatic scheduling as verified until all of these facts are recorded:

1. A run was triggered by the `schedule` event after the source-gate commit.
2. The workflow completed and its logs show the intended source list.
3. The logs show scrape, enrichment, upsert, and error counts.
4. The matching `ingestion_runs` row contains the workflow run ID and final status.
5. No secret or candidate content appears in logs or artifacts.

## Preview and rollback

Do not switch the current Vercel Git integration during a code-only change. First create a preview deployment from the new repository, verify all environment variables, and test the authenticated flows.

Create a release tag only after the preview gate passes:

```bash
git tag -a v0.1.0-early-access -m "Early access"
git push origin v0.1.0-early-access
```

If the preview fails, keep the current Vercel project on the historical repository. If a released deployment fails, redeploy the last known-good commit or tag. Record the incident, affected route, database migration state, and recovery action before retrying.

Database migrations are forward-only in this project. Do not run an ad hoc destructive rollback against production. Write a new corrective migration after reviewing the data impact.

## Release record

Record these values in the release issue or deployment note:

| Item | Value |
|---|---|
| Main commit | Fill after release |
| Scraper commit | Fill after release |
| Supabase migration | `009_tracker_followups` and any later migration |
| Vercel preview URL | Fill after preview |
| Schedule verification run | Pending until the first post-gate schedule event |
| Legal review | Required before commercial launch |

## After release

Monitor application errors, PDF failures, AI schema rejections, job freshness, worker run status, and source changes. Review the scraper at least weekly while source coverage is limited. Update `plan.md` after each meaningful change.
