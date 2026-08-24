-- Minimal operational telemetry for product reliability and capacity review.
-- No prompts, resume text, source-page content, or IP addresses are stored.

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_name text not null check (event_name in (
    'recommendations_viewed',
    'saved_job_added',
    'saved_job_removed',
    'ai_generation_started',
    'pdf_downloaded'
  )),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists usage_events_user_created_at_idx
  on public.usage_events (user_id, created_at desc);

create index if not exists usage_events_name_created_at_idx
  on public.usage_events (event_name, created_at desc);

alter table public.usage_events enable row level security;
revoke all on table public.usage_events from anon, authenticated;

create policy usage_events_deny_public
  on public.usage_events
  for all
  to anon, authenticated
  using (false)
  with check (false);
