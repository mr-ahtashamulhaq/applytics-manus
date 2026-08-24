-- APPLYTICS — User-owned saved jobs
-- ============================================================

CREATE TABLE IF NOT EXISTS saved_jobs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id     UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  note       TEXT CHECK (note IS NULL OR char_length(note) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT saved_jobs_user_job_unique UNIQUE (user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_created
  ON saved_jobs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id
  ON saved_jobs(job_id);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_jobs_select_own" ON saved_jobs;
CREATE POLICY "saved_jobs_select_own" ON saved_jobs
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE clerk_user_id = (SELECT auth.jwt() ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_insert_own" ON saved_jobs;
CREATE POLICY "saved_jobs_insert_own" ON saved_jobs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = (SELECT auth.jwt() ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_update_own" ON saved_jobs;
CREATE POLICY "saved_jobs_update_own" ON saved_jobs
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE clerk_user_id = (SELECT auth.jwt() ->> 'sub')))
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_user_id = (SELECT auth.jwt() ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_delete_own" ON saved_jobs;
CREATE POLICY "saved_jobs_delete_own" ON saved_jobs
  FOR DELETE USING (user_id = (SELECT id FROM users WHERE clerk_user_id = (SELECT auth.jwt() ->> 'sub')));

DROP TRIGGER IF EXISTS set_saved_jobs_updated_at ON saved_jobs;
CREATE TRIGGER set_saved_jobs_updated_at
  BEFORE UPDATE ON saved_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
