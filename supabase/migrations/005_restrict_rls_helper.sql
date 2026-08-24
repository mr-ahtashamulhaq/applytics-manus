-- The RLS helper is an internal database function.
-- Public API roles must not execute it through PostgREST.

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
