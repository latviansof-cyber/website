# Latvians of Darwin — SonicJS evaluation

A headless CMS built with [SonicJS](https://sonicjs.com) on Cloudflare Workers. Deploys independently as the `latviansof-sonicjs` Worker with its own D1 database, R2 media bucket, and KV namespace.

## Setup

`.env.local` is a symlink to `_Payload/.env.local` (repo root) and holds the Cloudflare API token wrangler uses for deployment and remote database operations — see the "Wrangler Access" section in the repository root `README.md`.

## Content & Architecture

The Worker serves the bilingual (EN/LV) public site edge-rendered with Hono plus the stock SonicJS admin (`/admin`), media management (`/admin/media`), auth (`/auth/login`) and REST API (`/api/content/*`).

### Content Collections

Code-first collections in `src/collections/`:

- **pages** — fixed + news pages (home, about, history, community, membership, culture, contact, donate, privacy, terms, eula) + current news. Template field selects public rendering.
- **events** — community events
- **navigation, footer, site-settings** — header menu, footer, and global settings (bilingual donation/bank details)

Only documents with `status = 'published'` appear on the public site.

### Seeding from Payload

Populate this evaluation database with published content from production Payload:

```bash
# Local database (uses wrangler dev state)
npx tsx scripts/migrate-from-payload.ts

# Remote evaluation D1 (requires .env.local token)
npx tsx scripts/migrate-from-payload.ts --remote
```

The script mirrors images to the `latviansof-sonicjs-media` R2 bucket and idempotently upserts content (safe to re-run).

Create/update the admin user:

```bash
npx tsx scripts/seed-admin.ts            # local (uses .dev.vars)
npx tsx scripts/seed-admin.ts --remote   # remote evaluation
```

### Deploy to Cloudflare

```bash
npm run db:migrate        # Apply D1 migrations
npm run deploy:worker     # Deploy the Worker
```

Uses dedicated resources: D1 (`latviansof-sonicjs`), R2 bucket (`latviansof-sonicjs-media`), and KV namespace (`latviansof-sonicjs-kv`). Production Payload data is never modified.
