-- Durable abuse controls for public feedback and authenticated AI operations.
-- The service role is the only application actor that can call these helpers.

create table if not exists public.operation_flags (
  key text primary key check (key = lower(key) and key ~ '^[a-z0-9_:-]{1,80}$'),
  enabled boolean not null default true,
  note text,
  updated_at timestamptz not null default now()
);

insert into public.operation_flags (key, enabled, note)
values
  ('ai_generation', true, 'Resume generation kill switch'),
  ('public_suggestions', true, 'Public suggestion form kill switch')
on conflict (key) do nothing;

create table if not exists public.rate_limit_buckets (
  bucket_key text not null check (char_length(bucket_key) between 1 and 200),
  window_started_at timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  expires_at timestamptz not null,
  primary key (bucket_key, window_started_at)
);

create index if not exists rate_limit_buckets_expires_at_idx
  on public.rate_limit_buckets (expires_at);

alter table public.operation_flags enable row level security;
alter table public.rate_limit_buckets enable row level security;

revoke all on table public.operation_flags from anon, authenticated;
revoke all on table public.rate_limit_buckets from anon, authenticated;

create or replace function public.is_operation_enabled(p_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select enabled from public.operation_flags where key = lower(p_key)),
    false
  );
$$;

create or replace function public.consume_rate_limit(
  p_bucket_key text,
  p_window_seconds integer,
  p_max_requests integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_started_at timestamptz;
  v_expires_at timestamptz;
begin
  if p_bucket_key is null or char_length(p_bucket_key) < 1 or char_length(p_bucket_key) > 200 then
    raise exception 'invalid bucket key';
  end if;
  if p_window_seconds < 1 or p_window_seconds > 2592000 then
    raise exception 'invalid window';
  end if;
  if p_max_requests < 1 or p_max_requests > 10000 then
    raise exception 'invalid limit';
  end if;

  v_window_started_at := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );
  v_expires_at := v_window_started_at + make_interval(secs => p_window_seconds);

  delete from public.rate_limit_buckets
  where expires_at < clock_timestamp() - interval '1 day';

  insert into public.rate_limit_buckets (
    bucket_key,
    window_started_at,
    request_count,
    expires_at
  )
  values (p_bucket_key, v_window_started_at, 1, v_expires_at)
  on conflict (bucket_key, window_started_at)
  do update set request_count = public.rate_limit_buckets.request_count + 1
  where public.rate_limit_buckets.request_count < p_max_requests;

  return found;
end;
$$;

revoke all on function public.is_operation_enabled(text) from public, anon, authenticated;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.is_operation_enabled(text) to service_role;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
