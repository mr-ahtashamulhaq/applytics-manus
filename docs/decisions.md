# Applytics decision records

## Use Mustakbil for the automatic feed

**Decision:** Run the automatic worker only for Mustakbil until other sources pass controlled verification.

**Reason:** Mustakbil has a verified parser, catalog write, source link, and ingestion-health record. Indeed returned bot detection. Rozee returned no usable listing cards. LinkedIn has no successful controlled write.

**Effect:** The catalog tells users that Mustakbil is the first verified live source. Manual dispatch remains available for source recovery tests.

## Keep Redis out of the scheduled worker

**Decision:** The scheduled bulk path uses local job-id deduplication and Supabase fingerprint upserts. It does not require Redis.

**Reason:** This reduces free-tier cost and removes one failure point from the scheduled path. Redis remains optional legacy support for the interactive scout path.

## Keep the scraper private

**Decision:** Keep `mr-ahtashamulhaq/applytics-job-scraper` private.

**Reason:** The worker contains operational code and uses a Supabase service-role secret. GitHub Actions already runs in the private repository.

## Keep service-role access server-side

**Decision:** Use the Supabase service-role client only in Next.js server code and the private worker.

**Reason:** The service role bypasses RLS. Browser code must use Clerk sessions and server actions instead of receiving this key.

## Offer free early access without public pricing

**Decision:** Do not publish numeric pricing, quota promises, or upgrade claims during early access.

**Reason:** The current product is still validating source coverage and workflow behavior. The public site must describe shipped behavior without unsupported commercial promises.

## Keep the original repository untouched

**Decision:** Push main application work only to `applytics-manus`. Do not modify the original `APPLYTICS` repository.

**Reason:** The new repository is the controlled refactor boundary. The original repository remains available as historical reference.

## Defer the Vercel Git migration

**Decision:** Do not change the existing Vercel Git integration until preview, environment, rollback, and user-facing deployment checks pass.

**Reason:** A repository switch can change production behavior. The current Vercel integration stays untouched during the refactor.
