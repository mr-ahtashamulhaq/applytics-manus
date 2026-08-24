-- Support cascade deletes and ownership-filtered reads on legacy user-owned tables.

create index if not exists applications_user_id_idx
  on public.applications (user_id);

create index if not exists generated_resumes_user_id_idx
  on public.generated_resumes (user_id);

create index if not exists generated_resumes_job_input_id_idx
  on public.generated_resumes (job_input_id);

create index if not exists job_inputs_user_id_idx
  on public.job_inputs (user_id);
