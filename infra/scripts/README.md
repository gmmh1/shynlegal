# Infrastructure Scripts

## Local activation

```powershell
./infra/scripts/activate-local.ps1
```

## Smoke test

```powershell
./infra/scripts/smoke-test.ps1 -AdminApiKey "YOUR_ADMIN_API_KEY"
```

## Backup Postgres

```powershell
./infra/scripts/backup-postgres.ps1
```

## Restore Postgres

```powershell
./infra/scripts/restore-postgres.ps1 -BackupFile "infra/backups/shynlegal-YYYYMMDD-HHMMSS.sql"
```
