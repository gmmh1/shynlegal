# Shyn Legal API

## Core endpoints

- `GET /health`
- `GET /api/services`
- `GET /api/reviews`
- `POST /api/ai/assess`
- `POST /api/contact`

## Booking endpoints

- `POST /api/appointments/create`
- `POST /api/appointments/reschedule`
- `POST /api/appointments/cancel`
- `POST /api/appointments/suggest`

## Admin endpoints (header: `x-admin-key`)

- `GET /api/admin/analytics`
- `GET /api/admin/leads`
- `GET /api/admin/conversations`
- `GET /api/admin/appointments`
- `GET /api/admin/reviews`
- `POST /api/telegram/command`

## Review ingest endpoint

- `POST /api/reviews/cache`

## Notes

- Set `ADMIN_API_KEY` to enforce admin route protection.
- Set `N8N_WEBHOOK_BASE_URL` to emit automation events.
- Set SMTP and Telegram env vars to enable notifications.
- Set `CALCOM_API_KEY` to enable booking operations.
