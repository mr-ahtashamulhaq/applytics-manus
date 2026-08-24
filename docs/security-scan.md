# Security Scan Record

## Date

2026-08-24 UTC

## Scope

The scan covered the tracked working tree and every commit in the new `applytics-manus` repository. It searched for common OpenAI, Groq, Clerk, Supabase, Google, Slack, GitHub, JWT, and private-key patterns.

The scan also checked for local `.env` and `.env.local` files. No such files are tracked or present in the repository root.

## Result

The working tree has no credential matches. Git history has no real credential match.

The historical scan found only documentation examples in `README.md`. These examples used `sk_test_...` and `gsk_...` placeholders. They are not credentials. The current README uses explicit angle-bracket placeholders to prevent secret-shaped examples.

Supabase security advisors report no lints after the ingestion-table policies and RLS helper privilege migrations. Performance advisors still report legacy foreign-key index gaps, repeated authentication-policy evaluation, and unused indexes. These items remain in the database hardening plan.

## Limits

This scan uses pattern matching. It does not prove that a credential never existed outside the scanned Git history. Rotate any credential that appears in logs, tickets, browser history, or external systems.
