-- Applytics job catalog
-- This table stores shared public job listings collected by the scraper.
-- It does not store user-owned data.

CREATE TABLE IF NOT EXISTS jobs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_job_id         TEXT NOT NULL,
  job_fingerprint       TEXT NOT NULL UNIQUE,
  title                 TEXT NOT NULL,
  company               TEXT NOT NULL,
  location              TEXT NOT NULL,
  source_url            TEXT NOT NULL,
  source_board          TEXT NOT NULL,
  description           TEXT,
  skills_required       TEXT[] NOT NULL DEFAULT '{}',
  experience_required   TEXT,
  experience_min_years  NUMERIC CHECK (experience_min_years >= 0),
  experience_max_years  NUMERIC CHECK (experience_max_years >= 0),
  education_required    TEXT,
  employment_type       TEXT NOT NULL DEFAULT 'other',
  industry              TEXT,
  salary_text           TEXT,
  salary_currency       TEXT,
  salary_min            NUMERIC CHECK (salary_min >= 0),
  salary_max            NUMERIC CHECK (salary_max >= 0),
  salary_period         TEXT,
  posted_at             TIMESTAMPTZ,
  first_seen_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_checked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parser_version        TEXT NOT NULL DEFAULT 'unknown',
  enricher_version      TEXT NOT NULL DEFAULT 'unknown',
  enrichment_confidence NUMERIC(4,3) NOT NULL DEFAULT 0
                        CHECK (enrichment_confidence >= 0 AND enrichment_confidence <= 1),
  status                TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'stale', 'expired', 'blocked', 'archived')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT jobs_salary_range_valid
    CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min),
  CONSTRAINT jobs_experience_range_valid
    CHECK (experience_max_years IS NULL OR experience_min_years IS NULL
      OR experience_max_years >= experience_min_years),
  CONSTRAINT jobs_source_url_valid
    CHECK (source_url ~ '^https?://'),
  CONSTRAINT jobs_source_board_valid
    CHECK (source_board IN ('linkedin', 'indeed', 'rozee', 'mustakbil'))
);

CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_source_board_idx ON jobs(source_board);
CREATE INDEX IF NOT EXISTS jobs_posted_at_idx ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS jobs_last_seen_at_idx ON jobs(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS jobs_title_search_idx ON jobs USING gin (to_tsvector('simple', title));

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP POLICY IF EXISTS jobs_authenticated_read ON jobs;
CREATE POLICY jobs_authenticated_read ON jobs
  FOR SELECT
  TO authenticated
  USING (status NOT IN ('blocked', 'archived'));

DROP TRIGGER IF EXISTS set_jobs_updated_at ON jobs;
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE jobs IS 'Shared job catalog populated by the Applytics scraper worker.';
COMMENT ON COLUMN jobs.job_fingerprint IS 'Versioned SHA-256 identity from the scraper output contract.';
COMMENT ON COLUMN jobs.source_url IS 'Canonical URL to the original job listing.';
