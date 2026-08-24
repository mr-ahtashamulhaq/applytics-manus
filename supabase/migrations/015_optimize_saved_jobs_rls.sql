-- Evaluate auth.jwt() once per statement for saved-job ownership policies.

DROP POLICY IF EXISTS "saved_jobs_select_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_select_own" ON public.saved_jobs
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_insert_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_insert_own" ON public.saved_jobs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_update_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_update_own" ON public.saved_jobs
  FOR UPDATE USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')))
  WITH CHECK (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "saved_jobs_delete_own" ON public.saved_jobs;
CREATE POLICY "saved_jobs_delete_own" ON public.saved_jobs
  FOR DELETE USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));
