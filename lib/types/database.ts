// ============================================================
// APPLYTICS — Database TypeScript Types
// Mirrors the live Supabase schema represented by migrations.
// ============================================================

export interface User {
  id: string
  clerk_user_id: string
  name: string | null
  email: string | null
  created_at: string
  updated_at: string | null
}

export interface Profile {
  id: string
  user_id: string
  phone: string | null
  city: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  degree: string | null
  university: string | null
  graduation_status: string | null
  skills: string[] | null
  experience_text: string | null
  projects_text: string | null
  resume_file_url: string | null
  created_at: string
  updated_at: string
}

export interface JobInput {
  id: string
  user_id: string
  job_title: string
  company_name: string
  job_description: string
  required_skills: string | null
  created_at: string
}

export interface GeneratedResume {
  id: string
  user_id: string
  job_input_id: string | null
  match_score: number | null
  missing_keywords: string[] | null
  suggested_keywords: string[] | null
  output_pdf_url: string | null
  output_tex_url: string | null
  ai_output: Record<string, unknown> | null
  created_at: string
}

export type JobSourceBoard = 'linkedin' | 'indeed' | 'rozee' | 'mustakbil'
export type JobStatus = 'active' | 'stale' | 'expired' | 'blocked' | 'archived'
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'temporary'
  | 'other'

export interface Job {
  id: string
  source_job_id: string
  job_fingerprint: string
  title: string
  company: string
  location: string
  source_url: string
  source_board: JobSourceBoard
  description: string | null
  skills_required: string[]
  experience_required: string | null
  experience_min_years: number | null
  experience_max_years: number | null
  education_required: string | null
  employment_type: EmploymentType | string
  industry: string | null
  salary_text: string | null
  salary_currency: string | null
  salary_min: number | null
  salary_max: number | null
  salary_period: string | null
  posted_at: string | null
  first_seen_at: string
  last_seen_at: string
  last_checked_at: string
  parser_version: string
  enricher_version: string
  enrichment_confidence: number
  status: JobStatus
  created_at: string
  updated_at: string
}

export type IngestionRunStatus = 'running' | 'succeeded' | 'partial' | 'failed'

export interface IngestionRun {
  id: string
  status: IngestionRunStatus
  trigger_type: string
  workflow_run_id: number | null
  source_commit_sha: string | null
  source_boards: JobSourceBoard[]
  roles_requested: number
  jobs_scraped: number
  jobs_enriched: number
  jobs_upserted: number
  failed_roles: number
  error_count: number
  started_at: string
  finished_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface IngestionError {
  id: string
  run_id: string
  source_board: JobSourceBoard | null
  role_name: string | null
  stage: string
  error_type: string
  error_message: string
  context: Record<string, unknown>
  created_at: string
}

export type ApplicationStatus = 'Draft' | 'Applied' | 'Interview' | 'Rejected' | 'Accepted'

export interface Application {
  id: string
  user_id: string
  company_name: string
  role_title: string
  status: ApplicationStatus
  applied_date: string | null
  notes: string | null
  job_id: string | null
  generated_resume_id: string | null
  created_at: string
  updated_at: string
}
