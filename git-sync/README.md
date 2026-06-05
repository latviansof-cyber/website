# Smart Git sync – DLA series

This folder is a **portable patch series** that recreates the work done for the
DLA-25x / 35x / 45x epics as a single composite commit on top of the DLA-100
merge. It exists because the Codex sandbox used to draft these changes cannot
write to the project''s `.git` directory (DENY ACL) or push to GitHub, so we
ship the commit as a `git am`-compatible mbox patch instead of pushing directly.

## Files

| Patch | Tickets | Adds / Changes |
| --- | --- | --- |
| `DLA-260-sync-target.patch` | DLA-251, DLA-252, DLA-351, DLA-451 | `postcss.config.mjs`, `src/app/(frontend)/globals.css`, `layout.tsx`, `components/ui/*`, polished SiteHeader/Hero/TextSection/Events/SiteFooter/LanguageSwitcher/page.tsx, `src/lib/validation.ts`, `i18n/content.ts`, `i18n/LanguageProvider.tsx`, `jest.config.ts`, `jest.setup.ts`, `tests/unit/*`, `package.json` (zod + jest deps). Deletes `src/app/(frontend)/styles.css`. |

`build-patch.ps1` is the generator used inside the sandbox. `apply.ps1` runs
`git am` against the patch in a fresh feature branch. `sync-from-sandbox.ps1`
is a smart file-level copier for users whose working tree is already partially
updated (no git, no commits — just file system).

## Apply locally (PowerShell)

```pwsh
git clone git@github.com:latviansof-cyber/website.git dla-site
cd dla-site
git config --global user.name  "EsegyCode"
git config --global user.email "nickofffffff@gmail.com"
pwsh -File git-sync/apply.ps1 -Branch codex/dla-200-300-400
```

If your working tree is dirty (e.g. from a previous partial apply), `apply.ps1`
will refuse and point you to `sync-from-sandbox.ps1`.

## Apply with a dirty working tree

```pwsh
pwsh -File git-sync/sync-from-sandbox.ps1 -DryRun    # preview
pwsh -File git-sync/sync-from-sandbox.ps1            # copy files
pwsh -File git-sync/sync-from-sandbox.ps1 -Commit    # copy + commit
```

`sync-from-sandbox.ps1` performs a file-level sync: it walks the canonical
"expected" set of files, copies each one from this folder (skipping
byte-identical copies), and deletes `src/app/(frontend)/styles.css`. Use
`-Commit` to create a single commit afterwards.

## Apply manually (any shell)

```bash
git checkout -b codex/dla-200-300-400
git am git-sync/DLA-260-sync-target.patch
git log --oneline codex/dla-200-300-400
git push -u origin codex/dla-200-300-400
```

## Why not a real git workflow?

The Codex sandbox denies writes to `.git/{objects,refs,index}` for the
`CodexSandboxUsers` group, and it also cannot reach `github.com` (no SSH key,
HTTPS port 443 is blocked). The patch series + the smart sync script are the
only ways to ship reviewable commits until the host machine (with full git +
GitHub access) runs them.

## Verification

After applying, run:

```pwsh
pnpm install
pnpm test:unit
```

You should see 6 passing tests (4 LanguageSwitcher + 2 zod). If `pnpm dev`
shows raw HTML, double-check that `postcss.config.mjs` is present and that
`@tailwindcss/postcss` is in `devDependencies` (the patch updates
`package.json` accordingly).
