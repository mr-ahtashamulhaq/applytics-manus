-- Run this in Supabase SQL Editor
-- Creates the suggestions table for the landing page feedback form

create table if not exists public.suggestions (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  suggestion  text not null,
  created_at  timestamptz not null default now()
);

-- No RLS needed — public submissions (no auth)
alter table public.suggestions enable row level security;

-- Allow anyone to insert (no login required)
create policy "Anyone can submit a suggestion"
  on public.suggestions
  for insert
  with check (true);

-- Only service_role (admin) can read suggestions
create policy "Only admin can read suggestions"
  on public.suggestions
  for select
  using (false);
