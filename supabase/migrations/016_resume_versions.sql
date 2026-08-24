-- User-authored resume versions remain separate from generated_resumes.ai_output.

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  generated_resume_id uuid not null references public.generated_resumes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  version integer not null check (version >= 1),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resume_versions_resume_version_unique unique (generated_resume_id, version)
);

create index if not exists resume_versions_user_created_at_idx
  on public.resume_versions (user_id, created_at desc);

create index if not exists resume_versions_resume_version_idx
  on public.resume_versions (generated_resume_id, version desc);

alter table public.resume_versions enable row level security;
revoke all on table public.resume_versions from anon, authenticated;

create policy resume_versions_deny_public
  on public.resume_versions
  for all
  to anon, authenticated
  using (false)
  with check (false);

DROP TRIGGER IF EXISTS set_resume_versions_updated_at ON public.resume_versions;
CREATE TRIGGER set_resume_versions_updated_at
  BEFORE UPDATE ON public.resume_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
