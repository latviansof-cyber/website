#requires -Version 5.1
# Generates a single .patch file from a list of file additions/modifications.
# Usage:
#   pwsh -File build-patch.ps1 -OutFile dla-101.patch -Ticket DLA-101 -Title "Create BACKLOG.md" -Body "..." -Files @(@{Kind="add"; GitPath="BACKLOG.md"; Path="C:\Projects\latvian-website\BACKLOG.md"})

param(
  [Parameter(Mandatory)] [string] $OutFile,
  [Parameter(Mandatory)] [string] $Ticket,
  [Parameter(Mandatory)] [string] $Title,
  [Parameter(Mandatory)] [string] $Body,
  [Parameter(Mandatory)] [hashtable[]] $Files
)

$date = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("From $Ticket $date")
[void]$sb.AppendLine("Subject: [$Ticket] $Title")
[void]$sb.AppendLine("")
[void]$sb.AppendLine($Body)
[void]$sb.AppendLine("")

foreach ($f in $Files) {
  if ($f.Kind -notin @('add','modify')) { continue }
  $text = Get-Content -Raw -LiteralPath $f.Path
  if ($null -eq $text) { $text = "" }
  $lineCount = ($text -split "`r?`n").Count
  if ($text.Length -gt 0 -and $text.EndsWith("`n")) {
    $lineCount = $lineCount - 1  # trailing newline does not introduce a new line
  }
  if ($lineCount -lt 1) { $lineCount = 1 }
  [void]$sb.AppendLine("diff --git a/$($f.GitPath) b/$($f.GitPath)")
  if ($f.Kind -eq 'add') {
    [void]$sb.AppendLine("new file mode 100644")
    [void]$sb.AppendLine("--- /dev/null")
  } else {
    [void]$sb.AppendLine("--- a/$($f.GitPath)")
  }
  [void]$sb.AppendLine("+++ b/$($f.GitPath)")
  [void]$sb.AppendLine("@@ -0,0 +1,$lineCount @@")
  [void]$sb.Append($text)
  if (-not $text.EndsWith("`n")) { [void]$sb.Append("`n") }
}

[System.IO.File]::WriteAllText((Resolve-Path -LiteralPath (Split-Path $OutFile -Parent)).Path + [System.IO.Path]::DirectorySeparatorChar + (Split-Path $OutFile -Leaf), $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
Write-Host "Wrote $OutFile"
