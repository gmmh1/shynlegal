param(
  [string]$ContainerName = "shyn-postgres",
  [string]$DatabaseName = "shynlegal",
  [string]$OutputDir = "infra/backups"
)

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputFile = Join-Path $OutputDir "shynlegal-$timestamp.sql"

Write-Host "Creating backup to $outputFile"
docker exec $ContainerName pg_dump -U postgres -d $DatabaseName > $outputFile
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Backup completed."
