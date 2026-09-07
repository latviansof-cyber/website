# FlareCMS

FlareCMS is a free and open source content management system with Cloudflare Pages, D1 and R2.

## Cloudflare deployment (evaluation)

This evaluation deploys independently as `latviansof-flare` and is a copy of the
current Payload site (latviansofdarwin.org.au) for customer evaluation. Payload
production resources are never touched.

1. Install dependencies with `npm install`.
2. Create a D1 database named `latviansof-flare` and an R2 bucket named
   `latviansof-flare-media`:
   `npx wrangler@4.128.0 d1 create latviansof-flare` and
   `npx wrangler@4.128.0 r2 bucket create latviansof-flare-media`.
3. Put the real D1 database id into `database_id` in `wrangler.jsonc`
   (currently `48860e0b-f07d-4491-bb7c-26aefdb7e65b`).
4. Create the Pages project and store the production secret
   (`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` come from `.env.local`):

   ```bash
   set -a; source .env.local; set +a
   npx wrangler@4.128.0 pages project create latviansof-flare --production-branch main
   npx wrangler@4.128.0 pages secret put SECRET --project-name latviansof-flare
   ```

5. Run `npm run deploy`. The script builds the site, applies remote D1
   migrations, and deploys the Pages project.

### First-run admin install (remote D1)

The remote D1 is empty after the initial migration, so the admin must be
installed before content can be managed:

```bash
curl -fsS -X POST https://latviansof-flare.pages.dev/api/install \
  -H 'content-type: application/json' \
  -d '{"blogName":"Latvian Association of Darwin","adminUsername":"admin","adminPassword":"secret123"}'
```

Evaluation credentials: username `admin`, password `secret123`.

### Content migration from the live Payload site

`scripts/migrate-payload-content.ts` copies the live site content (globals +
pages + special-pages + events + media) into the FlareCMS evaluation database
and uploads referenced images to the R2 bucket through the FlareCMS assets API.
It is idempotent: every run deletes the existing `page` rows and media rows and
re-inserts fresh content.

```bash
# Local evaluation D1/R2 (wrangler pages dev must be running):
npx tsx scripts/migrate-payload-content.ts \
  --payload-dir /tmp/flare-migrate --base http://localhost:8788 \
  --admin admin --pass secret123

# Remote evaluation resources (D1 id + token required):
set -a; source .env.local; set +a
npx tsx scripts/migrate-payload-content.ts \
  --payload-dir /tmp/flare-migrate --base https://latviansof-flare.pages.dev \
  --admin admin --pass secret123 --remote
```

The payload snapshots under `--payload-dir` are REST dumps taken from
`latviansofdarwin.org.au` (see the script header for the URL list).

### Evaluation notes / known deviations from the Payload site

- Route map: `/` redirects to `/en`; `/:lang` serves home, `/:lang/donate`,
  `/:lang/events/:slug` and `/:lang/:slug`; `/donate` and `/events/:slug`
  redirect to the English route; unknown paths render a styled 404 (SPA
  fallback returns HTTP 200).
- Body content: Payload stores event/page bodies as rich HTML or plain text;
  the migration converts HTML to Markdown. Event/accent data and media are
  copied verbatim.
- Donation bank details mirror production, including the `Not configured`
  PayID placeholder — replace it with the verified value before accepting
  donations.
- The homepage layout matches the Payload homepage global fields; the Payload
  homepage news-story strip is not part of the FlareCMS content model, so those
  pages are reachable only by direct slug.
