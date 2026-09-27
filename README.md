# Latvians of Darwin website

This repository contains the production SonicJS implementation for the Latvian Association of Darwin.

- `_SonicJS/latviansofdarwin.com.au/` — production site and admin (`latviansof-sonicjs` Worker)
- `_SonicJS/darwin-sonicjs/` — custom SonicJS fork used by the production app

Run commands from the app directory for local development, database migrations, and deploys.

## Production site

- Public site: https://latviansofdarwin.org.au/
- Admin: https://latviansofdarwin.org.au/admin

## Wrangler access

Cloudflare credentials live in the app directory as `.env.local` and are loaded automatically when `wrangler` is run from there:

```bash
cd _SonicJS/latviansofdarwin.com.au
npx wrangler whoami
```

If you run `wrangler` from another directory, export the file first:

```bash
set -a; source _SonicJS/latviansofdarwin.com.au/.env.local; set +a
```

The expected variables are:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Keep the token private and do not print it in logs or issues.

Important note: discover surf cli by running "surf --llm-context" or "surf --help-full"
