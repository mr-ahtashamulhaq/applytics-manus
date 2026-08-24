-- ============================================================
-- APPLYTICS — Link catalog jobs to resume and tracker workflows
-- ============================================================

ALTER TABLE job_inputs
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;

ALTER TABLE generated_resumes
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS generated_resume_id UUID REFERENCES generated_resumes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_job_inputs_job_id
  ON job_inputs(job_id);

CREATE INDEX IF NOT EXISTS idx_generated_resumes_job_id
  ON generated_resumes(job_id);

CREATE INDEX IF NOT EXISTS idx_applications_job_id
  ON applications(job_id);

CREATE INDEX IF NOT EXISTS idx_applications_generated_resume_id
  ON applications(generated_resume_id);
