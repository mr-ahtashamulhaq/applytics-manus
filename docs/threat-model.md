# Applytics threat model

## Scope

This document covers the early-access web app, the private job scraper, Supabase, Clerk, Groq, and the PDF download route. It covers user data and service credentials.

## Trust boundaries

| Boundary | Data that crosses it | Main control |
|---|---|---|
| Browser to Next.js | Forms, route requests, session cookie | Clerk middleware, server validation, ownership checks |
| Next.js to Supabase | Profiles, jobs, resumes, applications, saved jobs | Server-only service-role client, explicit user filters, RLS on exposed tables |
| Next.js to Groq | Profile and selected-job context | Server action, bounded input, strict output schema, evidence checks |
| Scraper to Supabase | Public job records and ingestion counters | Private GitHub Actions, service-role secret, source gate, protected ingestion tables |
| Browser to PDF route | Resume identifier | Clerk session, UUID validation, user ownership query |
| External job boards to scraper | Listing HTML and source URLs | Source-specific parsers, sanitised catalog fields, controlled source schedule |

## Protected assets

The main assets are profile details, uploaded resume references, generated resume content, application records, saved jobs, Supabase credentials, Clerk credentials, and the Groq credential. Job listings are public catalog data, but source URLs and freshness state must remain truthful.

## Main threats and controls

| Threat | Control in the current system | Residual risk |
|---|---|---|
| A user reads another user record | Authenticated server actions filter by the resolved Supabase user id. Tracker updates and deletes include ownership filters. | Every new action needs the same review. |
| A client changes a protected field | Server actions parse input and build database payloads. Linked jobs and resumes are checked server-side. | A future action can reintroduce a gap if it accepts a full database object. |
| A malicious request submits unsafe text | Zod bounds text fields. React renders user text as text. The AI prompt treats profile content as data. | Text can still be harmful or misleading if a user publishes it elsewhere. |
| A model invents candidate evidence | The resume output uses a strict schema and checks skills, roles, companies, projects, dates, and numbers against profile evidence. | Semantic claims can still require human review. |
| An attacker spends AI resources | Resume generation checks a Supabase operation flag, a hashed-IP hourly limit, and the authenticated daily fair-use limit before the model call. | Limits are fixed-window and conservative; deployed monitoring and secret rotation still need verification. |
| A user downloads another resume | The PDF route validates the UUID and filters the resume by the authenticated user id. | Credentials and session compromise remain outside the app boundary. |
| A scraper imports unsafe or false source data | Scheduled ingestion uses only the verified Mustakbil source. Other boards are manual recovery tests. | Source markup and source availability can change. |
| A public client reads ingestion errors | RLS is enabled. `anon` and `authenticated` receive explicit deny policies. | Service-role credentials must never reach the browser. |
| A bot floods public feedback | The form has a honeypot. A Supabase operation flag and hashed-IP hourly limit run before insert. | Fixed-window counters need operational review and cleanup monitoring. |
| A dependency contains a known production issue | Next.js was updated to 16.3.2. Unused runtime packages were removed. The production audit reports zero vulnerabilities. | Re-run the audit before each release. |
| The app is embedded in another site | CSP `frame-ancestors` and `X-Frame-Options: DENY` block framing. | Verify headers on the deployed domain. |

## Security assumptions

Applytics uses Clerk for identity. The server maps the Clerk subject to the local `users` row before reading or writing user data. Supabase service-role access bypasses RLS, so the server code must keep ownership filters on every user-data query.

The private scraper uses a service-role credential. The credential must exist only in GitHub Actions secrets and approved server environments. It must not appear in logs, artifacts, client bundles, or committed files.

## Open risks before public release

The product still needs upload validation review for all resume paths, deployed-header verification, a tested secret-rotation procedure, durable usage monitoring, deletion/export flows, and legal review. The Supabase-backed per-IP controls and shared operation flags are implemented, but they must be exercised in preview and monitored after release.
