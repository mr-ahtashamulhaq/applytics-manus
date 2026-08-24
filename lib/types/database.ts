// ============================================================
// APPLYTICS — Database TypeScript Types
// Matches the Supabase schema in migrations/001_initial_schema.sql
// ============================================================

export interface User {
  id: string
  clerk_user_id: string
  name: string | null
  email: string | null
  created_at: string
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
  created_at: string
  updated_at: string
}
