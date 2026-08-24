# Applytics data dictionary

This document describes the live Applytics data contract. The database is Supabase PostgreSQL. The application uses a server-side Supabase service-role client and applies ownership checks in server actions. Public API roles remain protected by Row Level Security policies.

## Identity and candidate data

| Table | Column | Type | Meaning | Ownership |
|---|---|---|---|---|
| `users` | `id` | UUID | Internal user key | Internal |
| `users` | `clerk_user_id` | text | Clerk identity subject | Unique identity |
| `users` | `name` | text | Display name | User |
| `users` | `email` | text | Current account email | User |
| `profiles` | `user_id` | UUID | Owner reference | User |
| `profiles` | `city` | text | Candidate city | User |
| `profiles` | `skills` | text[] | Candidate skill tags | User |
| `profiles` | `experience_text` | text | Candidate work history | User |
| `profiles` | `projects_text` | text | Candidate project history | User |
| `profiles` | `linkedin_url` | text | Candidate LinkedIn URL | User |
| `profiles` | `portfolio_url` | text | Candidate portfolio URL | User |

Profile fields are candidate source data. Resume generation must not add unsupported facts to the candidate record.

## Shared job catalog

| Column | Type | Meaning |
|---|---|---|
| `id` | UUID | Internal catalog key |
| `source_job_id` | text | Identifier from the source board |
| `job_fingerprint` | text | Versioned deduplication identity |
| `title` | text | Job title |
| `company` | text | Employer name |
| `location` | text | Source location text |
| `source_url` | text | Original listing URL |
| `source_board` | text | `linkedin`, `indeed`, `rozee`, or `mustakbil` |
| `description` | text | Source description, when available |
| `skills_required` | text[] | Extracted skills |
| `experience_required` | text | Source experience text |
| `experience_min_years` | numeric | Parsed lower experience bound |
| `experience_max_years` | numeric | Parsed upper experience bound |
| `employment_type` | text | Normalized employment type |
| `salary_text` | text | Source salary text |
| `posted_at` | timestamptz | Source posting time, when available |
| `first_seen_at` | timestamptz | First worker observation |
| `last_seen_at` | timestamptz | Most recent worker observation |
| `last_checked_at` | timestamptz | Most recent source check |
| `status` | text | `active`, `stale`, `expired`, `blocked`, or `archived` |

The scraper owns catalog writes. The application exposes active records in the catalog and active or stale records for selected workflow reads. Blocked and archived records are not shown to normal users.

## Resume workflow

| Table | Important columns | Meaning |
|---|---|---|
| `job_inputs` | `user_id`, `job_id`, `job_title`, `company_name`, `job_description`, `required_skills` | Job context used for a generation request |
| `generated_resumes` | `user_id`, `job_input_id`, `job_id` | Ownership and optional catalog link |
| `generated_resumes` | `match_score`, `missing_keywords`, `suggested_keywords` | Validated result metadata |
| `generated_resumes` | `ai_output` | Strictly validated JSON resume payload |
| `generated_resumes` | `output_pdf_url`, `output_tex_url` | Optional generated file references |

`job_id` is nullable for backward compatibility with manual job descriptions. When present, the server resolves the catalog job and uses its source fields instead of trusting client-supplied catalog values.

## Saved jobs

| Column | Type | Meaning |
|---|---|---|
| `id` | UUID | Saved-row key |
| `user_id` | UUID | User owner |
| `job_id` | UUID | Shared catalog job |
| `note` | text | Optional user note, limited to 2,000 characters |
| `created_at` | timestamptz | Save time |
| `updated_at` | timestamptz | Last change time |

The pair `(user_id, job_id)` is unique. A user can save a catalog listing once. Deleting a catalog job removes its saved row through the foreign-key cascade.

## Applications

| Column | Type | Meaning |
|---|---|---|
| `user_id` | UUID | User owner |
| `company_name` | text | Employer name |
| `role_title` | text | Role name |
| `status` | text | `Draft`, `Applied`, `Interview`, `Rejected`, or `Accepted` |
| `applied_date` | date | Date submitted |
| `deadline` | date | Application deadline, when known |
| `follow_up_date` | date | Planned follow-up date |
| `outcome` | text | `offer`, `rejected`, `withdrawn`, `no_response`, `hired`, or `other` |
| `notes` | text | User notes |
| `job_id` | UUID | Optional shared catalog link |
| `generated_resume_id` | UUID | Optional owned resume link |

The server checks application ownership and checks that linked resumes belong to the current user. Linked catalog jobs must still be active or stale when a new application is created.

## Ingestion health

`ingestion_runs` stores non-sensitive worker status, source names, counters, workflow run IDs, and timestamps. `ingestion_errors` stores bounded source and role error records linked to a run. Both tables have RLS and explicit deny policies for the `anon` and `authenticated` roles. The worker service-role key is the only normal writer.

## Abuse controls

| Table | Column | Type | Meaning | Access |
|---|---|---|---|---|
| `operation_flags` | `key` | text | Lowercase operation identifier | Service role only |
| `operation_flags` | `enabled` | boolean | Whether the operation is available | Service role only |
| `operation_flags` | `note` | text | Operator-facing purpose | Service role only |
| `rate_limit_buckets` | `bucket_key` | text | Hashed operation and request scope | Service role only |
| `rate_limit_buckets` | `window_started_at` | timestamptz | Fixed-window start | Service role only |
| `rate_limit_buckets` | `request_count` | integer | Requests consumed in the window | Service role only |
| `rate_limit_buckets` | `expires_at` | timestamptz | Cleanup and window boundary | Service role only |

The application calls atomic, security-definer functions for these tables. IP values are hashed before storage. Public API roles cannot read or write the tables or execute the functions. A missing control record or database error fails closed for the protected operation.

## Migration record

| Migration | Scope |
|---|---|
| `001_initial_schema.sql` | Original identity, profile, resume, and tracker tables |
| `002_jobs_catalog.sql` | Shared job catalog |
| `003_ingestion_health.sql` | Worker run and error records |
| `004_lock_ingestion_health.sql` | Protected ingestion tables and trigger search path |
| `005_restrict_rls_helper.sql` | Initial restriction for the RLS helper |
| `006_revoke_rls_helper_roles.sql` | Effective role revocation for the RLS helper |
| `007_link_catalog_workflows.sql` | Nullable catalog links across resume and tracker tables |
| `008_saved_jobs.sql` | User-owned saved catalog jobs |
| `009_tracker_followups.sql` | Deadlines, follow-up dates, outcomes, and indexes |
| `010_abuse_controls.sql` | Protected operation flags and atomic fixed-window rate-limit counters |

Migration files are ordered. Apply them to a new environment in numeric order. The live schema contains a few fields that were added during earlier operation, so inspect the target schema before applying an older baseline to an existing project.
