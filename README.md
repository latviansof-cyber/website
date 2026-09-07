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

`wrangler` authenticates using a Cloudflare API token stored in `.env.local`. Ensure this file is properly configured before running deployment commands or accessing remote Cloudflare resources like D1.
