param(
  [string]$EnvFile = ".env"
)

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path $EnvFile)) {
  Write-Error "Missing $EnvFile. Copy .env.example to .env and fill required values first."
  exit 1
}

Write-Host "Starting infrastructure stack..."
docker compose -f infra/docker-compose.yml up -d
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Starting API and web guidance:"
Write-Host "Run in separate terminals:"
Write-Host "  npm run dev:api"
Write-Host "  npm run dev:web"

Write-Host "Activation bootstrap complete."
