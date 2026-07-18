# n8n Workflows (Starter)

Create these workflows first:

1. New lead alert

- Trigger: Webhook `/lead-created`
- Actions: Telegram message + email to admin
- Source events:
  - `POST /api/ai/assess`
  - `POST /api/contact`

2. Booking notifications

- Trigger: Cal.com booking webhook
- Actions: update `appointments` + send confirmation
- Source events:
  - `POST /api/appointments/create`
  - `POST /api/appointments/reschedule`
  - `POST /api/appointments/cancel`

3. Review risk workflow

- Trigger: New review with rating <= 3
- Actions: alert admin + generate AI reply draft
- Source event:
  - `POST /api/reviews/cache`
  - `POST /api/reviews/sync`

4. Daily dashboard digest

- Trigger: Cron daily at 08:00 UK
- Actions: send summary of leads, bookings, and high-risk cases
- Source endpoint:
  - `GET /api/admin/analytics`

5. Review provider sync

- Trigger: Scheduled import or HTTP trigger from review provider bridge
- Action: send provider payload to `POST /api/reviews/sync`
- Providers currently supported in payload contract:
  - `google`
  - `facebook`

6. Admin observability

- Source endpoint:
  - `GET /api/admin/automation-logs`
- Purpose:
  - confirm webhook/email flows are firing
  - review failed or partial workflow runs

## Required environment

- `N8N_WEBHOOK_BASE_URL` in API service should point to your n8n webhook base
- Example: `http://localhost:5678/webhook`

## Suggested webhook paths

- `/lead-created`
- `/booking-event`
- `/review-alert`
