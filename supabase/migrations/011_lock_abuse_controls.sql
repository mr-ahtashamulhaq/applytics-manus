-- Make the intentional public-role denial explicit for Supabase security review.

create policy operation_flags_deny_public
  on public.operation_flags
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy rate_limit_buckets_deny_public
  on public.rate_limit_buckets
  for all
  to anon, authenticated
  using (false)
  with check (false);
