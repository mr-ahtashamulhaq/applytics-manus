# Original repository and Vercel handoff

This repository is the verified source for the APPLYTICS early-access refactor. It is public at `mr-ahtashamulhaq/applytics-manus`. The historical `mr-ahtashamulhaq/APPLYTICS` repository and its Vercel project named `applytics` were not changed by this work.

## Recommended local replacement

Use a separate temporary directory for the new checkout. Do not copy its `.git` directory into the original checkout.

```bash
gh repo clone mr-ahtashamulhaq/applytics-manus ~/applytics-manus-handoff
cd ~/applytics-manus-handoff
npm ci
npm test
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

Stop if any check fails. Copy the tracked source files into the existing local clone of `APPLYTICS`, while preserving that clone's `.git` directory and its original `origin` remote. On Linux or macOS, run the copy from the new checkout as follows, replacing the destination with the actual path of the original local clone:

```bash
rsync -a --delete --exclude='.git/' --exclude='node_modules/' --exclude='.next/' ~/applytics-manus-handoff/ ~/APPLYTICS/
cd ~/APPLYTICS
git remote -v
git status --short
```

Review the status carefully. The `origin` URL must still point to `https://github.com/mr-ahtashamulhaq/APPLYTICS.git`. Then commit the replacement in the original repository and push it through the user's own account:

```bash
git add -A
git commit -m "Complete refactor"
git push origin main
```

If the original branch has a different name, use that branch instead of `main`. Do not force-push unless the user has separately decided to replace the original repository history and has made a backup.

## Vercel sequence

The existing Vercel project named `applytics` should remain linked to the original `APPLYTICS` repository. After the user's push, Vercel should deploy from that original repository using its existing project settings. The first deployment should be treated as a release candidate, not as an unreviewed public launch.

A separate Vercel project named `applytics-manus` was created only to verify that the pushed source builds. It is not the production project and has not been configured with the user's application secrets. Do not use it for the public launch; it can be ignored or removed later from Vercel by the account owner.

Before pushing, verify the existing Vercel environment contains the server and public variables required by the current app, including Clerk, Supabase, and Groq configuration. Never commit these values or place them in this repository. The public build can compile without server secrets, but authenticated and AI flows require the corresponding Vercel environment configuration.

After deployment, verify the public home page, sign-in and sign-up routes, security headers, one authenticated account, a second-account ownership boundary, catalog loading, resume generation, PDF download, tracker linking, account export, and the typed-confirmation deletion flow. Keep the rollback option available by recording the previous production deployment before promoting the new one.

## Worker repository

The private scraper remains separate at `mr-ahtashamulhaq/applytics-job-scraper`. Its scheduled GitHub Actions workflow uses the configured Mustakbil-only automatic path. It requires only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the normal scheduled run. Redis is not required. Do not dispatch a manual run as a substitute for the first post-gate scheduled-run verification.

## Current pushed source

| Repository | Latest commit | State |
|---|---|---|
| `mr-ahtashamulhaq/applytics-manus` | `1d34f85` | Clean public source checkout |
| `mr-ahtashamulhaq/applytics-job-scraper` | `0916187` | Clean private worker checkout |

The release remains subject to legal review, the first real post-gate scheduled worker event, environment verification in the original Vercel project, and protected-route checks after the user's own push.
