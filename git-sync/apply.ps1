#requires -Version 5.1
<#
.SYNOPSIS
  Applies the DLA-200/300/400 patch series to a clone of the website repo.

.DESCRIPTION
  The repo at github.com/latviansof-cyber/website has a merged DLA-100 PR on main
  (commit fbf3af9). This script creates a new branch off main and applies the
  DLA-260 composite patch, which lands every DLA-25x / 35x / 45x change as a
  single commit on top.

  Requires: git on PATH; user.name + user.email configured globally or via
  environment variables (GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL, GIT_COMMITTER_NAME,
  GIT_COMMITTER_EMAIL).

.PARAMETER Branch
  Branch name to create from main. Defaults to `codex/dla-200-300-400`.

.EXAMPLE
  pwsh -File git-sync/apply.ps1
  pwsh -File git-sync/apply.ps1 -Branch codex/dla-200-300-400
#>

param(
  [string] $Branch = 'codex/dla-200-300-400'
)

$ErrorActionPreference = 'Continue'

$repoRoot = (Get-Location).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
  throw "Run this from the website repo root. No .git directory found in $repoRoot."
}

function Run-Git([string[]]$Arguments) {
  $output = & git @Arguments 2>&1
  $code = $LASTEXITCODE
  return [pscustomobject]@{ Code = $code; Output = ($output | Out-String) }
}

Write-Host "Repo: $repoRoot" -ForegroundColor Cyan

# Detect a "dirty" working tree (uncommitted v2 files from a previous attempt)
$status = Run-Git @('status', '--porcelain')
$dirty = $status.Output.Trim().Length -gt 0
if ($dirty) {
  Write-Host ""
  Write-Host "Your working tree has uncommitted changes." -ForegroundColor Yellow
  Write-Host "  - Run 'git checkout -- .' to discard them and 'rm src/app/(frontend)/styles.css'" -ForegroundColor Yellow
  Write-Host "  - Then re-run this script." -ForegroundColor Yellow
  Write-Host "  - Or use 'git-sync/sync-from-sandbox.ps1' which is smart about partial updates." -ForegroundColor Yellow
  throw "Refusing to apply patches on a dirty working tree."
}

Write-Host "Creating branch $Branch from main..." -ForegroundColor Cyan
$result = Run-Git @('checkout', '-b', $Branch)
Write-Host $result.Output
if ($result.Code -ne 0) { throw "Failed to create branch $Branch" }

$patches = Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.patch' | Sort-Object Name
if ($patches.Count -eq 0) { throw "No .patch files found in $PSScriptRoot" }

foreach ($p in $patches) {
  Write-Host ""
  Write-Host "Applying $($p.Name)..." -ForegroundColor Yellow
  $result = Run-Git @('am', $p.FullName)
  Write-Host $result.Output
  if ($result.Code -ne 0) {
    Write-Host "git am failed for $($p.Name). Run 'git am --abort' to clean up." -ForegroundColor Red
    throw "Patch $($p.Name) did not apply (exit code $($result.Code))"
  }
}

Write-Host ""
Write-Host "All patches applied successfully:" -ForegroundColor Green
& git log --oneline $Branch | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. pnpm install"
Write-Host "  2. pnpm test:unit        # runs the new Jest suite (LanguageSwitcher + zod)"
Write-Host "  3. pnpm dev              # confirm Tailwind v4 compiles and the UI is styled"
Write-Host "  4. git push -u origin $Branch"
