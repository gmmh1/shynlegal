import { Pool } from "pg";
import { config } from "./config.js";

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

export async function healthcheckDb() {
  const result = await pool.query("SELECT NOW() AS now");
  return result.rows[0]?.now;
}

interface UpsertLeadInput {
  name?: string;
  email?: string;
  visaType: string;
  status?: string;
  score?: number;
}

export async function createLead(input: UpsertLeadInput) {
  const result = await pool.query(
    `INSERT INTO leads (name, email, visa_type, status, score)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      input.name ?? null,
      input.email ?? null,
      input.visaType,
      input.status ?? "new",
      input.score ?? 0,
    ],
  );

  return result.rows[0];
}

export async function createConversation(input: {
  leadId?: string;
  visaType: string;
  summary: string;
  risk: string;
  missingInfo: string[];
  transcript: unknown[];
}) {
  const result = await pool.query(
    `INSERT INTO conversations (lead_id, visa_type, summary, risk, missing_info, transcript)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
     RETURNING *`,
    [
      input.leadId ?? null,
      input.visaType,
      input.summary,
      input.risk,
      JSON.stringify(input.missingInfo),
      JSON.stringify(input.transcript),
    ],
  );

  return result.rows[0];
}

export async function createAppointment(input: {
  leadId?: string;
  provider?: string;
  providerEventId?: string;
  status?: string;
  startsAt?: string;
}) {
  const result = await pool.query(
    `INSERT INTO appointments (lead_id, provider, provider_event_id, status, starts_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      input.leadId ?? null,
      input.provider ?? "calcom",
      input.providerEventId ?? null,
      input.status ?? "scheduled",
      input.startsAt ?? null,
    ],
  );

  return result.rows[0];
}

export async function updateAppointmentStatus(input: {
  providerEventId?: string;
  id?: string;
  status: string;
  startsAt?: string;
}) {
  const hasProvider = Boolean(input.providerEventId);

  const result = hasProvider
    ? await pool.query(
        `UPDATE appointments
         SET status = $1, starts_at = COALESCE($2, starts_at)
         WHERE provider_event_id = $3
         RETURNING *`,
        [input.status, input.startsAt ?? null, input.providerEventId],
      )
    : await pool.query(
        `UPDATE appointments
         SET status = $1, starts_at = COALESCE($2, starts_at)
         WHERE id = $3
         RETURNING *`,
        [input.status, input.startsAt ?? null, input.id],
      );

  return result.rows[0] ?? null;
}

export async function createReviewCache(input: {
  source: string;
  author?: string;
  rating: number;
  content: string;
  aiReplyDraft?: string;
  approved?: boolean;
}) {
  const result = await pool.query(
    `INSERT INTO reviews_cache (source, author, rating, content, ai_reply_draft, approved)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.source,
      input.author ?? null,
      input.rating,
      input.content,
      input.aiReplyDraft ?? null,
      input.approved ?? false,
    ],
  );

  return result.rows[0];
}

export async function getDashboardMetrics() {
  const [leadTotal, bookingToday, aiConversations, highRisk, conversionRate] =
    await Promise.all([
      pool.query("SELECT COUNT(*)::int AS value FROM leads"),
      pool.query(
        "SELECT COUNT(*)::int AS value FROM appointments WHERE starts_at::date = CURRENT_DATE",
      ),
      pool.query("SELECT COUNT(*)::int AS value FROM conversations"),
      pool.query(
        "SELECT COUNT(*)::int AS value FROM conversations WHERE risk = 'high'",
      ),
      pool.query(
        `SELECT
         CASE WHEN l.count_value = 0 THEN 0
         ELSE ROUND((a.count_value::decimal / l.count_value::decimal) * 100, 2)
         END AS value
       FROM
         (SELECT COUNT(*)::int AS count_value FROM leads) l,
         (SELECT COUNT(*)::int AS count_value FROM appointments) a`,
      ),
    ]);

  return {
    totalLeads: leadTotal.rows[0]?.value ?? 0,
    bookingsToday: bookingToday.rows[0]?.value ?? 0,
    aiConversations: aiConversations.rows[0]?.value ?? 0,
    highRiskCases: highRisk.rows[0]?.value ?? 0,
    conversionRate: Number(conversionRate.rows[0]?.value ?? 0),
  };
}

export async function listLeads(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM leads ORDER BY created_at DESC LIMIT $1",
    [limit],
  );
  return result.rows;
}

export async function listConversations(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM conversations ORDER BY created_at DESC LIMIT $1",
    [limit],
  );
  return result.rows;
}

export async function listAppointments(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM appointments ORDER BY created_at DESC LIMIT $1",
    [limit],
  );
  return result.rows;
}

export async function listReviews(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM reviews_cache ORDER BY synced_at DESC LIMIT $1",
    [limit],
  );
  return result.rows;
}

export async function listPublishedReviews(limit = 50) {
  const result = await pool.query(
    `SELECT *
     FROM reviews_cache
     WHERE approved = TRUE OR rating >= 4
     ORDER BY synced_at DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows;
}

export async function upsertExternalReview(input: {
  source: string;
  author?: string;
  rating: number;
  content: string;
  aiReplyDraft?: string;
  approved?: boolean;
}): Promise<{ row: Record<string, unknown>; isNew: boolean }> {
  const existing = await pool.query(
    `SELECT id FROM reviews_cache WHERE source = $1 AND content = $2 LIMIT 1`,
    [input.source, input.content],
  );

  if (existing.rows.length > 0) {
    const result = await pool.query(
      `UPDATE reviews_cache
       SET rating = $1, author = $2, synced_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [input.rating, input.author ?? null, existing.rows[0].id],
    );
    return { row: result.rows[0], isNew: false };
  }

  const result = await pool.query(
    `INSERT INTO reviews_cache (source, author, rating, content, ai_reply_draft, approved)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.source,
      input.author ?? null,
      input.rating,
      input.content,
      input.aiReplyDraft ?? null,
      input.approved ?? false,
    ],
  );
  return { row: result.rows[0], isNew: true };
}

export async function logAutomationEvent(input: {
  eventType: string;
  status: string;
  payload?: unknown;
  detail?: string;
}) {
  const result = await pool.query(
    `INSERT INTO automation_logs (event_type, status, payload, detail)
     VALUES ($1, $2, $3::jsonb, $4)
     RETURNING *`,
    [
      input.eventType,
      input.status,
      JSON.stringify(input.payload ?? {}),
      input.detail ?? null,
    ],
  );

  return result.rows[0];
}

export async function listAutomationLogs(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM automation_logs ORDER BY created_at DESC LIMIT $1",
    [limit],
  );

  return result.rows;
}

export async function getSettingValue<T = unknown>(
  key: string,
): Promise<T | null> {
  const result = await pool.query(
    "SELECT value FROM app_settings WHERE key = $1",
    [key],
  );

  return (result.rows[0]?.value as T | undefined) ?? null;
}

export async function upsertSettingValue(key: string, value: unknown) {
  const result = await pool.query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key)
     DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING *`,
    [key, JSON.stringify(value)],
  );

  return result.rows[0];
}

export async function listSettings() {
  const result = await pool.query(
    "SELECT key, value, updated_at FROM app_settings ORDER BY key ASC",
  );

  return result.rows;
}

export async function logAdminAudit(input: {
  actor: string;
  action: string;
  resource: string;
  payload?: unknown;
}) {
  const result = await pool.query(
    `INSERT INTO admin_audit_logs (actor, action, resource, payload)
     VALUES ($1, $2, $3, $4::jsonb)
     RETURNING *`,
    [
      input.actor,
      input.action,
      input.resource,
      JSON.stringify(input.payload ?? {}),
    ],
  );

  return result.rows[0];
}

export async function listAdminAuditLogs(limit = 100) {
  const result = await pool.query(
    "SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT $1",
    [limit],
  );

  return result.rows;
}
