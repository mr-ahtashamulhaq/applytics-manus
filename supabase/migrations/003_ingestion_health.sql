-- Applytics ingestion health
-- These tables store worker run status and source errors.
-- They do not store user profiles, resumes, or applications.

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status             TEXT NOT NULL DEFAULT 'running'
                     CHECK (status IN ('running', 'succeeded', 'partial', 'failed')),
  trigger_type       TEXT NOT NULL DEFAULT 'github_actions',
  workflow_run_id    BIGINT UNIQUE,
  source_commit_sha  TEXT,
  source_boards      TEXT[] NOT NULL DEFAULT '{}',
  roles_requested    INTEGER NOT NULL DEFAULT 0 CHECK (roles_requested >= 0),
  jobs_scraped       INTEGER NOT NULL DEFAULT 0 CHECK (jobs_scraped >= 0),
  jobs_enriched      INTEGER NOT NULL DEFAULT 0 CHECK (jobs_enriched >= 0),
  jobs_upserted      INTEGER NOT NULL DEFAULT 0 CHECK (jobs_upserted >= 0),
  failed_roles       INTEGER NOT NULL DEFAULT 0 CHECK (failed_roles >= 0),
  error_count        INTEGER NOT NULL DEFAULT 0 CHECK (error_count >= 0),
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at        TIMESTAMPTZ,
  metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ingestion_runs_finish_after_start
    CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE IF NOT EXISTS ingestion_errors (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id         UUID NOT NULL REFERENCES ingestion_runs(id) ON DELETE CASCADE,
  source_board   TEXT,
  role_name      TEXT,
  stage          TEXT NOT NULL,
  error_type     TEXT NOT NULL,
  error_message  TEXT NOT NULL,
  context        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ingestion_runs_started_at_idx
  ON ingestion_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS ingestion_runs_status_idx
  ON ingestion_runs(status);
CREATE INDEX IF NOT EXISTS ingestion_errors_run_id_idx
  ON ingestion_errors(run_id);
CREATE INDEX IF NOT EXISTS ingestion_errors_created_at_idx
  ON ingestion_errors(created_at DESC);

ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_errors ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ingestion_runs IS 'Protected status records for Applytics job ingestion runs.';
COMMENT ON TABLE ingestion_errors IS 'Protected source and pipeline errors linked to an ingestion run.';
COMMENT ON COLUMN ingestion_runs.workflow_run_id IS 'Optional GitHub Actions run ID for operational traceability.';
COMMENT ON COLUMN ingestion_runs.metadata IS 'Non-sensitive operational metadata only.';
COMMENT ON COLUMN ingestion_errors.context IS 'Non-sensitive diagnostic context only.';
