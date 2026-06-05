#requires -Version 5.1
<#
.SYNOPSIS
  Applies the DLA-501 audit patch on top of the merged DLA-260 main.

.DESCRIPTION
  The DLA-501 patch contains four intentional post-merge fixes:
    1. jest.config.ts:  setupFilesAfterEach -> setupFilesAfterEnv
       (so @testing-library/jest-dom matchers actually load)
    2. tests/unit/LanguageSwitcher.test.tsx:  drop unused `within` import
    3. 4x TODO(DLA-...) comments in SiteHeader / Events / LanguageProvider / page.tsx

  The patch is intentionally separate from DLA-260 so it can be reviewed
  and applied independently.

.PARAMETER Branch
  Branch name to create from main. Defaults to `codex/dla-501-audit`.
#>

param(
  [string] $Branch = 'codex/dla-501-audit'
)

$ErrorActionPreference = 'Continue'

$repoRoot = (Get-Location).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
  throw "Run this from the website repo root. No .git directory found in $repoRoot."
}

function Run-Git([string[]]$Arguments) {
  $output = & git @Arguments 2>&1
  return [pscustomobject]@{ Code = $LASTEXITCODE; Output = ($output | Out-String) }
}

$status = Run-Git @('status', '--porcelain')
if ($status.Output.Trim().Length -gt 0) {
  throw "Working tree is dirty. Commit or stash first.`n$($status.Output)"
}

Write-Host "Creating branch $Branch from main..." -ForegroundColor Cyan
$result = Run-Git @('checkout', '-b', $Branch)
Write-Host $result.Output
if ($result.Code -ne 0) { throw "Failed to create branch" }

$patch = Join-Path $PSScriptRoot 'sync-audit.patch'
if (-not (Test-Path -LiteralPath $patch)) {
  throw "Missing patch: $patch"
}

Write-Host ""
Write-Host "Applying DLA-501 audit patch..." -ForegroundColor Yellow
$result = Run-Git @('am', $patch)
Write-Host $result.Output
if ($result.Code -ne 0) {
  Write-Host "git am failed. Run 'git am --abort' to clean up." -ForegroundColor Red
  throw "Patch did not apply"
}

Write-Host ""
Write-Host "Audit patch applied:" -ForegroundColor Green
& git log --oneline $Branch | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. pnpm install"
Write-Host "  2. pnpm test:unit        # 13 passing tests (4 LanguageSwitcher + 9 validation)"
Write-Host "  3. pnpm dev              # confirm UI still renders"
Write-Host "  4. git push -u origin $Branch"
