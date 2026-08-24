-- Protect ingestion health tables from public API roles.
-- The scraper uses the Supabase service role, which bypasses these policies.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS ingestion_runs_deny_public ON public.ingestion_runs;
CREATE POLICY ingestion_runs_deny_public ON public.ingestion_runs
  FOR ALL
  TO anon, authenticated
  USING (FALSE)
  WITH CHECK (FALSE);

DROP POLICY IF EXISTS ingestion_errors_deny_public ON public.ingestion_errors;
CREATE POLICY ingestion_errors_deny_public ON public.ingestion_errors
  FOR ALL
  TO anon, authenticated
  USING (FALSE)
  WITH CHECK (FALSE);
