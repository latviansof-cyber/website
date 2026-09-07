# Latvians of Darwin website experiments

This repository contains three independently deployable implementations:

- [`_Payload/`](./_Payload/) — **current production** Payload CMS website (`latviansof` Worker)
- [`_SonicJS/latviansof/`](./_SonicJS/latviansof/) — SonicJS experiment (`latviansof-sonicjs` Worker)
- [`_FlareCMS/`](./_FlareCMS/) — **next generation** FlareCMS implementation (`latviansof-flare` Pages project) — to replace `_Payload/`

Each directory owns its dependencies, Cloudflare configuration, and deployment commands. Run commands from the relevant directory.

## Comparing Implementations

Use `surf --llm-context` to open and compare different front-end implementations deployed to Cloudflare:
- Production site: **https://latviansofdarwin.org.au/** (deployed with Sonic and Flare versions)

## Wrangler Access

Cloudflare credentials live in a single gitignored file, `_Payload/.env.local` (mode `0600`). The other projects symlink it so one token serves every implementation:

- `_SonicJS/latviansof/.env.local` → `../../_Payload/.env.local`
- `_FlareCMS/.env.local` → `../_Payload/.env.local`

Required variables:

- `CLOUDFLARE_API_TOKEN` — Account API token that authenticates `wrangler`
- `CLOUDFLARE_ACCOUNT_ID` — the target Cloudflare account

Wrangler auto-loads `.env.local` from the directory it runs in, so deploy and remote commands work as-is from each project directory:

```bash
npx wrangler whoami   # verify auth — run from any project directory
```

`deploy.sh` in `_SonicJS/` and `_FlareCMS/` also `source .env.local` defensively before invoking wrangler. If you run wrangler from elsewhere, export the file first: `set -a; source .env.local; set +a`.

Notes:

- `wrangler dev` is fully local and needs no token; only deploys and `--remote` commands (D1, R2, KV, Pages) reach the account.
- Treat the token as a secret: the file is never committed, and its contents should not be printed or pasted into logs/issues.
- Remote database inspection examples live in `AGENTS.md` (Diagnosing production admin problems).
