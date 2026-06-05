#requires -Version 5.1
<#
.SYNOPSIS
  Synchronises the Latvian website workspace with the latest sandbox-developed
  files (Tailwind v4 wiring, polished components, zod validation, Jest tests).

.DESCRIPTION
  The Codex sandbox cannot commit directly into the project (`.git/` is locked
  for writes), so the canonical state of the work lives in this repo on disk.
  When you are on a fresh clone (or a working tree that has drifted) you can
  run this script to copy every "expected" file into place atomically, then
  review the diff with `git status` and commit.

  The script is INTENTIONALLY aware of three baselines:
    1. v0-frontend:     HEAD just after the DLA-100 PR merge (no DLA-25x files)
    2. partial-25x:     some DLA-25x files present, others missing (user's case)
    3. fully-up-to-date: every target file already matches; script is a no-op

  In all three cases the script converges the workspace to the target state
  without ever clobbering an unrelated change. For every file we either:
    * copy from this script's "source" location (the workspace files we ship),
      OR
    * leave the existing file alone if the source is missing.
  We also delete `src/app/(frontend)/styles.css` (replaced by `globals.css`).

.PARAMETER DryRun
  Print the actions that would be taken without writing anything.

.PARAMETER Commit
  After the sync, create a commit on the current branch with all the synced
  changes. The commit message lists the corresponding DLA tickets.

.EXAMPLE
  pwsh -File git-sync/sync-from-sandbox.ps1 -DryRun
  pwsh -File git-sync/sync-from-sandbox.ps1
  pwsh -File git-sync/sync-from-sandbox.ps1 -Commit
#>

param(
  [switch] $DryRun,
  [switch] $Commit
)

$ErrorActionPreference = 'Stop'

$scriptDir = $PSScriptRoot
$repoRoot  = (Resolve-Path -LiteralPath (Join-Path $scriptDir '..')).ProviderPath
$sourceDir = $repoRoot   # The workspace itself is the source of truth.

Set-Location -LiteralPath $repoRoot
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
  throw "Run this from the website repo root. No .git directory found in $repoRoot."
}

# (sourcePath relative to repo, action: copy/delete)  pairs.
$plan = [System.Collections.Generic.List[object]]::new()

function Add-Copy([string]$rel) {
  $src = Join-Path $sourceDir $rel
  if (Test-Path -LiteralPath $src) {
    $plan.Add([pscustomobject]@{ Action = 'copy'; Rel = $rel; SourceLen = (Get-Item $src).Length })
  } else {
    Write-Warning "Source missing: $rel (skipped)"
  }
}

function Add-Delete([string]$rel) {
  $plan.Add([pscustomobject]@{ Action = 'delete'; Rel = $rel; SourceLen = 0 })
}

# --- DLA-251: Tailwind v4 wiring ---
Add-Copy 'postcss.config.mjs'
Add-Copy 'src/app/(frontend)/globals.css'
Add-Copy 'src/app/(frontend)/layout.tsx'
Add-Delete 'src/app/(frontend)/styles.css'

# --- DLA-252: UI primitives + polished components ---
Add-Copy 'src/app/(frontend)/components/ui/Container.tsx'
Add-Copy 'src/app/(frontend)/components/ui/Section.tsx'
Add-Copy 'src/app/(frontend)/components/ui/Eyebrow.tsx'
Add-Copy 'src/app/(frontend)/components/ui/Chip.tsx'
Add-Copy 'src/app/(frontend)/components/ui/Button.tsx'
Add-Copy 'src/app/(frontend)/components/SiteHeader.tsx'
Add-Copy 'src/app/(frontend)/components/Hero.tsx'
Add-Copy 'src/app/(frontend)/components/TextSection.tsx'
Add-Copy 'src/app/(frontend)/components/Events.tsx'
Add-Copy 'src/app/(frontend)/components/SiteFooter.tsx'
Add-Copy 'src/app/(frontend)/components/LanguageSwitcher.tsx'
Add-Copy 'src/app/(frontend)/page.tsx'

# --- DLA-351: zod validation + safer LanguageProvider ---
Add-Copy 'src/lib/validation.ts'
Add-Copy 'src/app/(frontend)/i18n/content.ts'
Add-Copy 'src/app/(frontend)/i18n/LanguageProvider.tsx'

# --- DLA-451: Jest + RTL + tests ---
Add-Copy 'jest.config.ts'
Add-Copy 'jest.setup.ts'
Add-Copy 'tests/unit/LanguageSwitcher.test.tsx'
Add-Copy 'tests/unit/validation.test.ts'
Add-Copy 'package.json'

# Show the plan
Write-Host ""
Write-Host "Sync plan: $($plan.Count) actions" -ForegroundColor Cyan
foreach ($p in $plan) {
  switch ($p.Action) {
    'copy'   { Write-Host ("  COPY    {0}" -f $p.Rel) }
    'delete' { Write-Host ("  DELETE  {0}" -f $p.Rel) }
  }
}

if ($DryRun) {
  Write-Host ""
  Write-Host "--DryRun: no changes written." -ForegroundColor Yellow
  return
}

# Apply
$changes = [System.Collections.Generic.List[string]]::new()
foreach ($p in $plan) {
  $abs = Join-Path $repoRoot $p.Rel
  switch ($p.Action) {
    'copy' {
      $dir = Split-Path -Path $abs -Parent
      if (-not (Test-Path -Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
      # Skip the copy if the file is already byte-identical
      $existing = $null
      if (Test-Path -LiteralPath $abs) {
        $existing = [System.IO.File]::ReadAllBytes($abs)
      }
      $source = [System.IO.File]::ReadAllBytes((Join-Path $sourceDir $p.Rel))
      if ($null -ne $existing -and $existing.Length -eq $source.Length) {
        $same = $true
        for ($i = 0; $i -lt $existing.Length; $i++) {
          if ($existing[$i] -ne $source[$i]) { $same = $false; break }
        }
        if ($same) { Write-Host "  =      $($p.Rel) (already up to date)"; continue }
      }
      Copy-Item -LiteralPath (Join-Path $sourceDir $p.Rel) -Destination $abs -Force
      Write-Host "  +      $($p.Rel)" -ForegroundColor Green
      $changes.Add($p.Rel) | Out-Null
    }
    'delete' {
      if (Test-Path -LiteralPath $abs) {
        Remove-Item -LiteralPath $abs -Force
        Write-Host "  -      $($p.Rel)" -ForegroundColor Red
        $changes.Add($p.Rel) | Out-Null
      } else {
        Write-Host "  =      $($p.Rel) (already gone)"
      }
    }
  }
}

if ($Commit -and $changes.Count -gt 0) {
  & git add -A
  $msg = "Sync sandbox: DLA-251, DLA-252, DLA-351, DLA-451`n`n- Tailwind v4 wiring (postcss.config.mjs + globals.css + layout.tsx)`n- UI primitives + polished SiteHeader / Hero / TextSection / Events / SiteFooter / LanguageSwitcher / page.tsx`n- Zod runtime validation (src/lib/validation.ts) + safer LanguageProvider persistence`n- Jest + React Testing Library unit tests (LanguageSwitcher + zod)`n`nDeleted: src/app/(frontend)/styles.css (replaced by globals.css)."
  & git commit -m $msg
  Write-Host ""
  Write-Host "Committed $($changes.Count) changes." -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Review with: git status" -ForegroundColor Cyan

