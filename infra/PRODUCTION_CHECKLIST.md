# Production Activation Checklist

## 1. Secrets

Set real values in `.env` and remove live secrets from `.env.example`.

Required:

- `DATABASE_URL`
- `CALCOM_API_KEY`
- `ADMIN_API_KEY`
- `N8N_WEBHOOK_BASE_URL`

Optional but recommended:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NOTIFY_EMAIL`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`

## 2. Infrastructure

Start the stack:

```bash
cd infra
docker compose up -d
```

Or from repo root on Windows PowerShell:

```powershell
./infra/scripts/activate-local.ps1
```

Services expected:

- Postgres
- n8n
- WordPress
- MariaDB
- Ollama

## 3. Database bootstrap

Ensure `infra/db/schema.sql` has been applied.

## 4. Ollama

Pull the configured model inside the Ollama environment.
Example:

```bash
ollama pull llama3
```

## 5. API and web

From repo root:

```bash
npm install
npm run dev:api
npm run dev:web
```

## 6. WordPress control center

- Activate `Shyn Control Center`
- Set API base URL
- Set admin API key

## 7. n8n

Import workflows from:

- `infra/n8n/workflows/lead-created.json`
- `infra/n8n/workflows/booking-event.json`
- `infra/n8n/workflows/review-alert.json`
- `infra/n8n/workflows/daily-dashboard-digest.json`

## 8. Reviews

Send provider payloads to `POST /api/reviews/sync`.
Use `infra/reviews/provider-sync.example.json` as the starting format.

## 9. Smoke test

- Submit AI assessment
- Submit contact form
- Create booking
- Reschedule booking
- Cancel booking
- Review WordPress dashboard data
- Check automation logs

Automated helper:

```powershell
./infra/scripts/smoke-test.ps1 -AdminApiKey "YOUR_ADMIN_API_KEY"
```

## 10. Hardening follow-up

- Rotate any secrets that were placed in tracked files
- Put the API behind TLS
- Restrict WordPress and API admin access
- Add external monitoring and backups

## 11. Backup and recovery

Backup:

```powershell
./infra/scripts/backup-postgres.ps1
```

Restore:

```powershell
./infra/scripts/restore-postgres.ps1 -BackupFile "infra/backups/shynlegal-YYYYMMDD-HHMMSS.sql"
```

## 12. Audit review

- Check `GET /api/admin/audit-logs` for admin prompt and review sync changes
- Check `GET /api/admin/automation-logs` for webhook/email workflow activity
