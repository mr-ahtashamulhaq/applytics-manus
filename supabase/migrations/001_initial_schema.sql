-- ============================================================
-- APPLYTICS MVP — Supabase Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users
-- Synced from Clerk via webhook on first login
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id   TEXT UNIQUE NOT NULL,
  name            TEXT,
  email           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: profiles
-- One profile per user — master source of truth for resume gen
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone               TEXT,
  city                TEXT,
  degree              TEXT,
  university          TEXT,
  graduation_status   TEXT,  -- 'graduated' | 'in_progress' | 'expected_YYYY'
  skills              TEXT[], -- array of skill tags
  experience_text     TEXT,  -- raw textarea from user
  projects_text       TEXT,  -- raw textarea from user
  resume_file_url     TEXT,  -- Supabase Storage URL of uploaded PDF
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: job_inputs
-- Manually pasted job descriptions from the user
-- ============================================================
CREATE TABLE IF NOT EXISTS job_inputs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_title         TEXT NOT NULL,
  company_name      TEXT NOT NULL,
  job_description   TEXT NOT NULL,
  required_skills   TEXT,  -- optional additional skills field
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: generated_resumes
-- Output of the AI pipeline for each job input
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_resumes (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_input_id        UUID REFERENCES job_inputs(id) ON DELETE SET NULL,
  match_score         INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  missing_keywords    TEXT[],
  suggested_keywords  TEXT[],
  output_pdf_url      TEXT,  -- Supabase Storage URL for generated PDF
  output_tex_url      TEXT,  -- Supabase Storage URL for raw .tex file
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: applications
-- User's manually tracked job applications
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  role_title      TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Draft'
                  CHECK (status IN ('Draft', 'Applied', 'Interview', 'Rejected', 'Accepted')),
  applied_date    DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only access their own data
-- ============================================================
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_inputs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications     ENABLE ROW LEVEL SECURITY;

-- users table — users can only read their own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

-- profiles — full CRUD on own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- job_inputs — full CRUD on own records
CREATE POLICY "job_inputs_select_own" ON job_inputs
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "job_inputs_insert_own" ON job_inputs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- generated_resumes — select own only
CREATE POLICY "generated_resumes_select_own" ON generated_resumes
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- applications — full CRUD on own records
CREATE POLICY "applications_select_own" ON applications
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "applications_insert_own" ON applications
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "applications_update_own" ON applications
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "applications_delete_own" ON applications
  FOR DELETE USING (user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STORAGE BUCKETS (run after creating buckets in dashboard)
-- Or create these via Supabase Dashboard → Storage
-- ============================================================
-- Bucket: resumes     (private) — user uploaded PDFs
-- Bucket: generated   (private) — AI generated PDFs + .tex files
-- ============================================================
