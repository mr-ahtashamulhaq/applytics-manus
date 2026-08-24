-- APPLYTICS — Tracker follow-up and outcome fields
-- ============================================================

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS deadline DATE,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS outcome TEXT
    CHECK (outcome IS NULL OR outcome IN ('offer', 'rejected', 'withdrawn', 'no_response', 'hired', 'other'));

CREATE INDEX IF NOT EXISTS idx_applications_user_follow_up
  ON applications(user_id, follow_up_date)
  WHERE follow_up_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_applications_user_deadline
  ON applications(user_id, deadline)
  WHERE deadline IS NOT NULL;
