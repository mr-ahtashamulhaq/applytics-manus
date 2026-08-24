-- Remove direct PostgREST execution grants from public API roles.
-- Keep service-role execution for internal administration only.

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
