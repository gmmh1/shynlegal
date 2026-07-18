param(
  [Parameter(Mandatory=$true)][string]$BackupFile,
  [string]$ContainerName = "shyn-postgres",
  [string]$DatabaseName = "shynlegal"
)

if (-not (Test-Path $BackupFile)) {
  Write-Error "Backup file not found: $BackupFile"
  exit 1
}

Write-Host "Restoring $BackupFile into $DatabaseName on $ContainerName"
Get-Content $BackupFile | docker exec -i $ContainerName psql -U postgres -d $DatabaseName
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Restore completed."
