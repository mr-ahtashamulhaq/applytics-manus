# Applytics security incident runbook

## Purpose

Use this runbook when a person reports a security event or monitoring shows unusual access, data exposure, abuse, or service failure.

## Incident classes

| Class | Example | First owner |
|---|---|---|
| Credential exposure | A Supabase, Clerk, or Groq secret appears in a log or repository | Application owner |
| User-data exposure | A user can see another user profile, resume, or application | Application owner |
| AI abuse | Repeated generation requests consume the service budget | Application owner |
| Scraper incident | A source parser imports bad data or a scheduled run fails | Worker owner |
| Availability incident | The app, PDF route, or database is unavailable | Application owner |

## Immediate actions

1. Record the time, reporter, affected route, run id, user id, and observed behavior.
2. Do not copy secrets or private user content into an issue, chat, or ticket.
3. If a secret is exposed, rotate it in the provider console before investigating further.
4. If user data is exposed, stop the affected action or route.
5. If the scraper is unsafe, pause the GitHub Actions workflow and keep automatic source gates closed.
6. Preserve relevant logs, deployment ids, workflow artifacts, and database timestamps.

## Credential exposure

If a Supabase service-role key is exposed, rotate it in Supabase and update only approved server environments. Check GitHub Actions secrets, Vercel environment variables, local files, logs, and artifacts. Run the repository secret scan after rotation.

If a Clerk or Groq key is exposed, rotate it in its provider console. Check the same storage locations. Invalidate sessions when the provider supports that action and the incident involves identity data.

Do not commit a replacement secret to the repository. Do not print the new secret during recovery.

## User-data exposure

1. Reproduce the access with a test account, not with a real user record.
2. Identify the exact action, query, route, or policy that crossed the ownership boundary.
3. Disable the affected route or action if the exposure continues.
4. Add server-side validation and an ownership filter before restoring access.
5. Review related tables for the same missing filter.
6. Record the affected data class and the exposure window.
7. Notify affected users when required by applicable law and the final legal review.

## AI abuse

1. Check generation counts and recent application logs.
2. Keep the per-user fair-use guard active.
3. Disable generation if the provider cost or abuse continues.
4. Review authentication events and account creation patterns.
5. Add or tighten per-IP limits and bot protection before re-enabling broad access.

## Scraper incident

1. Pause the workflow if records are incorrect, unsafe, or sourced from an unverified board.
2. Record the workflow run id, commit SHA, board, role, and ingestion run id.
3. Mark affected catalog records inactive or blocked through an approved migration or worker fix.
4. Do not delete evidence before the incident record is complete.
5. Repair the parser or source gate in the private scraper repository.
6. Run a controlled manual test before restoring the schedule.
7. Confirm the ingestion counters and errors after the next scheduled run.

## Recovery checks

Restore a route only after these checks pass:

- The source of the incident is identified.
- The affected secret is rotated, if applicable.
- The ownership test passes for an owner and a different user.
- Input validation rejects the reported payload.
- TypeScript, production build, lint, dependency audit, and focused tests pass.
- The deployment has a known rollback target.
- The incident record includes the remaining risk.

## Communication record

Keep a short record with these fields:

| Field | Value |
|---|---|
| Incident id | Assigned by the owner |
| Start time | UTC timestamp |
| Detection source | Report, log, audit, or workflow |
| Affected systems | App, database, worker, provider |
| Data involved | Data class only, not private values |
| Containment | Action and time |
| Recovery | Fix, deployment, and verification |
| Follow-up | Owner and due date |

This runbook does not replace legal advice or provider-specific incident duties.
