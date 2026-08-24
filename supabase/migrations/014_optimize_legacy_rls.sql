-- Evaluate auth.jwt() once per statement for legacy ownership policies.

DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (clerk_user_id = ((SELECT auth.jwt()) ->> 'sub'));

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "job_inputs_select_own" ON public.job_inputs;
CREATE POLICY "job_inputs_select_own" ON public.job_inputs
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "job_inputs_insert_own" ON public.job_inputs;
CREATE POLICY "job_inputs_insert_own" ON public.job_inputs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "generated_resumes_select_own" ON public.generated_resumes;
CREATE POLICY "generated_resumes_select_own" ON public.generated_resumes
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "applications_select_own" ON public.applications;
CREATE POLICY "applications_select_own" ON public.applications
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "applications_insert_own" ON public.applications;
CREATE POLICY "applications_insert_own" ON public.applications
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "applications_update_own" ON public.applications;
CREATE POLICY "applications_update_own" ON public.applications
  FOR UPDATE USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));

DROP POLICY IF EXISTS "applications_delete_own" ON public.applications;
CREATE POLICY "applications_delete_own" ON public.applications
  FOR DELETE USING (user_id = (SELECT id FROM public.users WHERE clerk_user_id = ((SELECT auth.jwt()) ->> 'sub')));
