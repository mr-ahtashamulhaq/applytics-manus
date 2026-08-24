# Server action audit

This audit covers the server actions and route loaders in the early-access app. The app uses a server-only Supabase service-role client. Each action must enforce the checks that Row Level Security cannot enforce for that client.

| Action | Authentication | Validation | Ownership or scope check | Response handling |
|---|---|---|---|---|
| `loadDashboard` | Clerk session and local user bootstrap | No user form input | User id on every user-table query | Returns a small dashboard shape or `null` |
| `generateResume` | Clerk session and local user bootstrap | Bounded job input and strict AI output schema | Profile, user inputs, and generated resume use the resolved user id; catalog job is resolved server-side | Supabase operation flag plus hashed-IP hourly and user daily limits run before the AI call; returns a bounded status and user-safe message |
| `loadJobs` and `loadJob` | Clerk session | Bounded filters and UUID job id | Catalog is limited to allowed status values | Returns selected catalog fields only |
| `saveProfile` | Clerk session and local user bootstrap | Bounded profile schema and URL checks | Writes only the resolved user profile | Returns a bounded status and user-safe message |
| `loadRecommendations` | Clerk session and local user lookup | No user form input | Reads the resolved profile and active catalog rows | Returns evidence reasons and no zero-signal listing |
| `loadSavedJobs` | Clerk session and local user lookup | No user form input | Reads saved rows for the resolved user | Returns selected saved-job and catalog fields |
| `saveJob` and `removeSavedJob` | Clerk session and local user lookup | UUID and saved-job schemas | Job availability and saved-row ownership are checked server-side | Returns a bounded status and user-safe message |
| `addApplication` | Clerk session and local user lookup | Tracker schema, date validation, and outcome vocabulary | Linked job availability, resume ownership, and job/resume consistency are checked | Returns a bounded status and user-safe message |
| `updateApplicationStatus` | Clerk session and local user lookup | UUID and status schemas | Update includes the resolved user id | Returns a bounded status and user-safe message |
| `updateApplicationDetails` | Clerk session and local user lookup | Date, outcome, notes, and UUID schemas | Update includes the resolved user id | Returns a bounded status and user-safe message |
| `deleteApplication` | Clerk session and local user lookup | UUID schema | Delete includes the resolved user id | Returns a bounded status and user-safe message |
| `submitSuggestion` | Public action | Bounded suggestion schema | No account ownership applies | Honeypot submissions are dropped; Supabase operation flag plus hashed-IP hourly limit run before insert; database errors are bounded |
| `GET /api/pdf/[id]` | Clerk session | UUID and stored resume schema | Resume query includes the resolved user id | Returns PDF bytes or a bounded HTTP error |

## Query rules

The server uses Supabase query builders. User input is passed as values, not SQL fragments. Catalog filters use an allow-listed field and status vocabulary. User-facing loaders select only the fields needed by the page.

## Remaining gaps

The app now uses the `rate_limit_buckets` table and atomic `consume_rate_limit` function for hashed-IP and user limits. The `operation_flags` table and `is_operation_enabled` function provide a fail-closed kill switch for AI generation and public suggestions. Counters are intentionally conservative fixed windows; operations are denied if the control schema is unavailable.

Upload controls are not in the current product. Future upload work must add file type, extension, size, storage, and ownership checks. The app still needs automated ownership tests for a second user and deployed-header verification. These are release gates, not reasons to expose service-role access to the browser.
