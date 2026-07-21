import "dotenv/config";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { buildSummary, reviews, services } from "./data.js";
import { config } from "./config.js";
import {
  createAppointment,
  createConversation,
  createLead,
  createReviewCache,
  getSettingValue,
  getDashboardMetrics,
  healthcheckDb,
  listAdminAuditLogs,
  listAppointments,
  listAutomationLogs,
  listConversations,
  listLeads,
  listPublishedReviews,
  listReviews,
  listSettings,
  logAdminAudit,
  logAutomationEvent,
  upsertExternalReview,
  upsertSettingValue,
  updateAppointmentStatus,
  deleteReviewCache,
} from "./db.js";
import {
  fetchGoogleReviews,
  fetchFacebookReviews,
  type ExternalReview,
} from "./reviews.js";
import {
  emitBookingEvent,
  emitLeadCreated,
  emitReviewAlert,
  sendTelegramMessage,
} from "./automation.js";
import {
  cancelCalcomBooking,
  createCalcomBooking,
  listCalcomSlots,
  rescheduleCalcomBooking,
} from "./calcom.js";
import { requireAdmin } from "./auth.js";
import { generateOllamaSummary, generateReviewReplyDraft } from "./ai.js";
import { applySecurityHeaders, createRateLimiter } from "./security.js";
import type { VisaType } from "./types.js";

const app = express();
const port = config.port;

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(applySecurityHeaders);

const publicWriteLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 20,
  keyPrefix: "public-write",
});

const adminLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 60,
  keyPrefix: "admin",
});

function getAdminActor(req: express.Request) {
  const actor = req.header("x-admin-actor");
  return actor && actor.trim().length > 0 ? actor.trim() : "admin";
}

function hasAdminOverride(req: express.Request) {
  if (!config.adminApiKey) {
    return true;
  }

  return req.header("x-admin-key") === config.adminApiKey;
}

async function getAutomationControlSettings() {
  const [
    calendarAiRaw,
    telegramRaw,
    adminOverrideRaw,
    calBookingUrlRaw,
    calEventTypeIdRaw,
    timezoneRaw,
  ] = await Promise.all([
    getSettingValue<boolean>("calendar_ai_manager_enabled"),
    getSettingValue<boolean>("telegram_bot_enabled"),
    getSettingValue<boolean>("admin_override_enabled"),
    getSettingValue<string>("cal_booking_url"),
    getSettingValue<number | string>("cal_event_type_id"),
    getSettingValue<string>("ai_booking_timezone"),
  ]);

  const parsedEventTypeId =
    typeof calEventTypeIdRaw === "number"
      ? calEventTypeIdRaw
      : typeof calEventTypeIdRaw === "string" &&
          calEventTypeIdRaw.trim().length > 0
        ? Number(calEventTypeIdRaw)
        : undefined;

  return {
    calendarAiManagerEnabled: calendarAiRaw ?? true,
    telegramBotEnabled: telegramRaw ?? true,
    adminOverrideEnabled: adminOverrideRaw ?? true,
    calBookingUrl:
      typeof calBookingUrlRaw === "string" && calBookingUrlRaw.trim().length > 0
        ? calBookingUrlRaw
        : null,
    calEventTypeId:
      parsedEventTypeId && Number.isFinite(parsedEventTypeId)
        ? parsedEventTypeId
        : null,
    aiBookingTimezone:
      typeof timezoneRaw === "string" && timezoneRaw.trim().length > 0
        ? timezoneRaw
        : "Europe/London",
  };
}

function mapTelegramVisaType(input: string): VisaType {
  const normalized = input.trim().toLowerCase();

  const visaMap: Record<string, VisaType> = {
    spouse: "Spouse Visa",
    "spouse visa": "Spouse Visa",
    student: "Student Visa",
    "student visa": "Student Visa",
    skilled: "Skilled Worker Visa",
    "skilled worker": "Skilled Worker Visa",
    "skilled worker visa": "Skilled Worker Visa",
    visit: "Visit Visa",
    "visit visa": "Visit Visa",
    citizenship: "Citizenship",
    naturalisation: "Citizenship",
    naturalization: "Citizenship",
    other: "Other",
  };

  return visaMap[normalized] ?? "Other";
}

type AgentCommandContext = {
  source: "admin" | "telegram";
  allowOverride: boolean;
};

async function executeAgentCommand(
  rawCommand: string,
  context: AgentCommandContext,
) {
  const command = rawCommand.trim();
  const controls = await getAutomationControlSettings();

  const canOverride = context.allowOverride && controls.adminOverrideEnabled;
  const calendarAllowed = controls.calendarAiManagerEnabled || canOverride;
  const telegramAllowed = controls.telegramBotEnabled || canOverride;

  if (context.source === "telegram" && !telegramAllowed) {
    return {
      action: "telegram_disabled",
      message:
        "Telegram automation is currently disabled by admin. Please contact support.",
    };
  }

  const lower = command.toLowerCase();

  if (lower === "/help" || lower === "help") {
    return {
      action: "help",
      message:
        "Commands: /today, /slots <eventTypeId> <startISO> <endISO> [timeZone], /book <eventTypeId> <startISO> <endISO> <name>|<email>|<notes>, /reschedule <bookingId> <startISO> <endISO>, /cancel <bookingId> [reason], /assess <visaType> | <details>",
    };
  }

  if (lower === "/today" || lower === "today") {
    const appointments = await listAppointments(50);
    const today = new Date().toISOString().slice(0, 10);
    const schedule = appointments.filter(
      (item) =>
        typeof item.starts_at === "string" && item.starts_at.startsWith(today),
    );

    if (schedule.length === 0) {
      return {
        action: "show_schedule",
        message: "No appointments scheduled for today.",
      };
    }

    const lines = schedule
      .slice(0, 10)
      .map(
        (item) =>
          `- ${item.starts_at ?? "unknown"} | ${item.status ?? "unknown"} | ${item.provider_event_id ?? "n/a"}`,
      )
      .join("\n");

    return {
      action: "show_schedule",
      message: `Today's appointments:\n${lines}`,
    };
  }

  if (lower.startsWith("/assess ")) {
    const match = command.match(/^\/assess\s+(.+?)\s*\|\s*(.+)$/i);

    if (!match) {
      return {
        action: "invalid_command",
        message: "Format: /assess <visaType> | <case details>",
      };
    }

    const visaType = mapTelegramVisaType(match[1]);
    const details = match[2].trim();

    const promptOverride = await getSettingValue<string>("ai_system_prompt");
    const summary =
      (await generateOllamaSummary({
        visaType,
        details,
        promptOverride: promptOverride ?? undefined,
      })) ?? buildSummary(visaType, details);

    const lead = await createLead({
      name: "Telegram user",
      email: undefined,
      visaType,
      status:
        summary.recommendation === "Book consultation" ? "qualified" : "new",
      score: summary.risk === "high" ? 35 : summary.risk === "medium" ? 70 : 90,
    });

    const conversation = await createConversation({
      leadId: lead.id,
      visaType,
      summary: summary.summary,
      risk: summary.risk,
      missingInfo: summary.missing_info,
      transcript: [{ role: "user", message: details }],
    });

    await emitLeadCreated({
      source: "telegram_ai",
      leadId: lead.id,
      conversationId: conversation.id,
      visaType,
      recommendation: summary.recommendation,
    });

    return {
      action: "assess",
      message: `Visa: ${summary.visa_type}\nRisk: ${summary.risk}\nSummary: ${summary.summary}\nMissing: ${summary.missing_info.join(", ")}\nRecommendation: ${summary.recommendation}`,
    };
  }

  if (!calendarAllowed) {
    return {
      action: "calendar_disabled",
      message:
        "AI calendar manager is disabled. Admin can override from the control center.",
    };
  }

  if (lower.startsWith("/slots ")) {
    const match = command.match(
      /^\/slots\s+(\d+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?$/i,
    );

    if (!match) {
      return {
        action: "invalid_command",
        message: "Format: /slots <eventTypeId> <startISO> <endISO> [timeZone]",
      };
    }

    const slots = await listCalcomSlots(
      Number(match[1]),
      match[2],
      match[3],
      match[4] ?? controls.aiBookingTimezone,
    );

    const days = Object.keys((slots as Record<string, unknown>) ?? {});
    return {
      action: "slots",
      message:
        days.length > 0
          ? `Slots available on: ${days.slice(0, 8).join(", ")}`
          : "No slots were returned for that time window.",
    };
  }

  if (lower.startsWith("/book ")) {
    const match = command.match(/^\/book\s+(\d+)\s+(\S+)\s+(\S+)\s+(.+)$/i);

    if (!match) {
      return {
        action: "invalid_command",
        message:
          "Format: /book <eventTypeId> <startISO> <endISO> <name>|<email>|<notes>",
      };
    }

    const personParts = match[4].split("|").map((part) => part.trim());
    if (personParts.length < 2) {
      return {
        action: "invalid_command",
        message:
          "Booking details must include name and email separated by '|'.",
      };
    }

    const [name, email, notes] = personParts;
    const booking = await createCalcomBooking({
      eventTypeId: Number(match[1]),
      start: match[2],
      end: match[3],
      name,
      email,
      notes,
      timeZone: controls.aiBookingTimezone,
    });

    const bookingId = String(
      (booking as any)?.data?.id ?? (booking as any)?.id ?? "",
    );

    const appointment = await createAppointment({
      provider: "calcom",
      providerEventId: bookingId || undefined,
      status: "scheduled",
      startsAt: match[2],
    });

    await emitBookingEvent({
      action: "created",
      source: `agent_${context.source}`,
      appointmentId: appointment.id,
      calcomBookingId: bookingId,
    });

    return {
      action: "book",
      message: `Booking created. Appointment: ${appointment.id}. Cal.com booking: ${bookingId || "n/a"}`,
    };
  }

  if (lower.startsWith("/reschedule ")) {
    const match = command.match(/^\/reschedule\s+(\S+)\s+(\S+)\s+(\S+)$/i);

    if (!match) {
      return {
        action: "invalid_command",
        message: "Format: /reschedule <bookingId> <startISO> <endISO>",
      };
    }

    await rescheduleCalcomBooking(match[1], match[2], match[3]);
    await updateAppointmentStatus({
      providerEventId: match[1],
      status: "rescheduled",
      startsAt: match[2],
    });

    await emitBookingEvent({
      action: "rescheduled",
      source: `agent_${context.source}`,
      bookingId: match[1],
    });

    return {
      action: "reschedule",
      message: `Booking ${match[1]} rescheduled successfully.`,
    };
  }

  if (lower.startsWith("/cancel ")) {
    const match = command.match(/^\/cancel\s+(\S+)(?:\s+(.+))?$/i);

    if (!match) {
      return {
        action: "invalid_command",
        message: "Format: /cancel <bookingId> [reason]",
      };
    }

    await cancelCalcomBooking(match[1], match[2]);
    await updateAppointmentStatus({
      providerEventId: match[1],
      status: "cancelled",
    });

    await emitBookingEvent({
      action: "cancelled",
      source: `agent_${context.source}`,
      bookingId: match[1],
      reason: match[2],
    });

    return {
      action: "cancel",
      message: `Booking ${match[1]} cancelled successfully.`,
    };
  }

  return {
    action: "unhandled_command",
    message: "Unknown command. Use /help to view supported actions.",
  };
}

app.get("/health", async (_req, res) => {
  try {
    const dbNow = await healthcheckDb();
    res.json({
      status: "ok",
      service: "shynlegal-api",
      db: "connected",
      dbNow,
    });
  } catch {
    res.status(503).json({
      status: "degraded",
      service: "shynlegal-api",
      db: "disconnected",
    });
  }
});

app.get("/api/services", (_req, res) => {
  res.json({ services });
});

app.get("/api/reviews", async (_req, res) => {
  try {
    const cachedReviews = await listPublishedReviews(30);
    res.json({ reviews: cachedReviews.length > 0 ? cachedReviews : reviews });
  } catch {
    res.json({ reviews });
  }
});

const conversationSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  visaType: z.enum([
    "Spouse Visa",
    "Student Visa",
    "Skilled Worker Visa",
    "Visit Visa",
    "Citizenship",
    "Other",
  ]),
  details: z.string().min(10),
});

app.post("/api/ai/assess", publicWriteLimiter, (req, res) => {
  const parsed = conversationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid assessment payload",
      issues: parsed.error.issues,
    });
  }

  const { visaType, details, name, email } = parsed.data;

  return (async () => {
    const promptOverride = await getSettingValue<string>("ai_system_prompt");
    const summary =
      (await generateOllamaSummary({
        visaType,
        details,
        promptOverride: promptOverride ?? undefined,
      })) ?? buildSummary(visaType, details);
    const lead = await createLead({
      name,
      email,
      visaType,
      status:
        summary.recommendation === "Book consultation" ? "qualified" : "new",
      score: summary.risk === "high" ? 35 : summary.risk === "medium" ? 70 : 90,
    });

    const conversation = await createConversation({
      leadId: lead.id,
      visaType,
      summary: summary.summary,
      risk: summary.risk,
      missingInfo: summary.missing_info,
      transcript: [{ role: "user", message: details }],
    });

    await emitLeadCreated({
      source: "ai_assessment",
      leadId: lead.id,
      conversationId: conversation.id,
      visaType,
      risk: summary.risk,
      recommendation: summary.recommendation,
    });

    return res.json({
      ...summary,
      lead_id: lead.id,
      conversation_id: conversation.id,
    });
  })().catch((error: unknown) => {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: "AI assessment persistence failed", detail });
  });
});

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  visaType: z.string().min(2),
  message: z.string().min(10),
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true),
});

app.post("/api/contact", publicWriteLimiter, (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid enquiry payload",
      issues: parsed.error.issues,
    });
  }

  return (async () => {
    const lead = await createLead({
      name: parsed.data.name,
      email: parsed.data.email,
      visaType: parsed.data.visaType,
      status: "new",
      score: 55,
    });

    await emitLeadCreated({
      source: "contact_form",
      leadId: lead.id,
      name: parsed.data.name,
      email: parsed.data.email,
      visaType: parsed.data.visaType,
      message: parsed.data.message,
    });

    return res.status(201).json({
      status: "received",
      next: "Admin notified via automation layer",
      enquiry: {
        ...parsed.data,
        leadId: lead.id,
        createdAt: new Date().toISOString(),
      },
    });
  })().catch((error: unknown) => {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Failed to store enquiry", detail });
  });
});

const bookingCreateSchema = z.object({
  leadId: z.string().uuid().optional(),
  eventTypeId: z.number().int().positive(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  name: z.string().min(2),
  email: z.string().email(),
  notes: z.string().optional(),
  timeZone: z.string().optional(),
});

app.post("/api/appointments/create", publicWriteLimiter, async (req, res) => {
  const parsed = bookingCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid booking payload", issues: parsed.error.issues });
  }

  const controls = await getAutomationControlSettings();
  if (!controls.calendarAiManagerEnabled && !hasAdminOverride(req)) {
    return res.status(409).json({
      error: "Calendar manager is AI-controlled only",
      detail:
        "Public booking API is disabled. Use Cal.com widget or admin override.",
    });
  }

  try {
    const booking = await createCalcomBooking(parsed.data);
    const bookingId = String(
      (booking as any)?.data?.id ?? (booking as any)?.id ?? "",
    );
    const appointment = await createAppointment({
      leadId: parsed.data.leadId,
      provider: "calcom",
      providerEventId: bookingId || undefined,
      status: "scheduled",
      startsAt: parsed.data.start,
    });

    await emitBookingEvent({
      action: "created",
      appointmentId: appointment.id,
      calcomBookingId: bookingId,
    });
    return res.status(201).json({ appointment, booking });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Booking create failed", detail });
  }
});

const bookingRescheduleSchema = z.object({
  bookingId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
});

app.post(
  "/api/appointments/reschedule",
  publicWriteLimiter,
  async (req, res) => {
    const parsed = bookingRescheduleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid reschedule payload",
        issues: parsed.error.issues,
      });
    }

    const controls = await getAutomationControlSettings();
    if (!controls.calendarAiManagerEnabled && !hasAdminOverride(req)) {
      return res.status(409).json({
        error: "Calendar manager is AI-controlled only",
        detail: "Reschedule API requires admin override while AI mode is off.",
      });
    }

    try {
      const booking = await rescheduleCalcomBooking(
        parsed.data.bookingId,
        parsed.data.start,
        parsed.data.end,
      );
      const appointment = await updateAppointmentStatus({
        providerEventId: parsed.data.bookingId,
        status: "rescheduled",
        startsAt: parsed.data.start,
      });

      await emitBookingEvent({
        action: "rescheduled",
        bookingId: parsed.data.bookingId,
      });
      return res.json({ appointment, booking });
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ error: "Booking reschedule failed", detail });
    }
  },
);

const bookingCancelSchema = z.object({
  bookingId: z.string().min(1),
  reason: z.string().optional(),
});

app.post("/api/appointments/cancel", publicWriteLimiter, async (req, res) => {
  const parsed = bookingCancelSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid cancel payload", issues: parsed.error.issues });
  }

  const controls = await getAutomationControlSettings();
  if (!controls.calendarAiManagerEnabled && !hasAdminOverride(req)) {
    return res.status(409).json({
      error: "Calendar manager is AI-controlled only",
      detail: "Cancel API requires admin override while AI mode is off.",
    });
  }

  try {
    const booking = await cancelCalcomBooking(
      parsed.data.bookingId,
      parsed.data.reason,
    );
    const appointment = await updateAppointmentStatus({
      providerEventId: parsed.data.bookingId,
      status: "cancelled",
    });

    await emitBookingEvent({
      action: "cancelled",
      bookingId: parsed.data.bookingId,
      reason: parsed.data.reason,
    });
    return res.json({ appointment, booking });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Booking cancel failed", detail });
  }
});

const slotSuggestSchema = z.object({
  eventTypeId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  timeZone: z.string().optional(),
});

app.post("/api/appointments/suggest", publicWriteLimiter, async (req, res) => {
  const parsed = slotSuggestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid slot lookup payload",
      issues: parsed.error.issues,
    });
  }

  const controls = await getAutomationControlSettings();
  if (!controls.calendarAiManagerEnabled && !hasAdminOverride(req)) {
    return res.status(409).json({
      error: "Calendar manager is AI-controlled only",
      detail: "Slot lookup requires admin override while AI mode is off.",
    });
  }

  try {
    const slots = await listCalcomSlots(
      parsed.data.eventTypeId,
      parsed.data.startTime,
      parsed.data.endTime,
      parsed.data.timeZone,
    );

    return res.json({ slots });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Slot lookup failed", detail });
  }
});

const reviewSchema = z.object({
  source: z.string().min(2),
  author: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(3),
  aiReplyDraft: z.string().optional(),
  approved: z.boolean().optional(),
});

const reviewSyncSchema = z.object({
  provider: z.enum(["google", "facebook"]),
  reviews: z
    .array(
      z.object({
        author: z.string().optional(),
        rating: z.number().int().min(1).max(5),
        content: z.string().min(3),
        approved: z.boolean().optional(),
      }),
    )
    .min(1),
});

app.post("/api/reviews/cache", adminLimiter, async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid review payload", issues: parsed.error.issues });
  }

  try {
    const review = await createReviewCache(parsed.data);
    if (review.rating <= 3) {
      await emitReviewAlert(review);
    }
    return res.status(201).json({ review });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Review cache failed", detail });
  }
});

app.post("/api/reviews/sync", adminLimiter, requireAdmin, async (req, res) => {
  const parsed = reviewSyncSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid review sync payload",
      issues: parsed.error.issues,
    });
  }

  try {
    const inserted = [];

    for (const item of parsed.data.reviews) {
      const aiReplyDraft = await generateReviewReplyDraft({
        source: parsed.data.provider,
        author: item.author,
        rating: item.rating,
        content: item.content,
      });

      const review = await createReviewCache({
        source: parsed.data.provider,
        author: item.author,
        rating: item.rating,
        content: item.content,
        aiReplyDraft,
        approved: item.approved ?? item.rating >= 4,
      });

      inserted.push(review);

      if (review.rating <= 3) {
        await emitReviewAlert(review);
      }
    }

    await logAutomationEvent({
      eventType: "review_sync",
      status: "completed",
      payload: { provider: parsed.data.provider, count: inserted.length },
    });

    await logAdminAudit({
      actor: getAdminActor(req),
      action: "sync",
      resource: "reviews",
      payload: { provider: parsed.data.provider, count: inserted.length },
    });

    return res.status(201).json({ inserted });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Review sync failed", detail });
  }
});

app.get(
  "/api/admin/analytics",
  adminLimiter,
  requireAdmin,
  async (_req, res) => {
    try {
      const metrics = await getDashboardMetrics();
      return res.json(metrics);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ error: "Failed to load analytics", detail });
    }
  },
);

app.get("/api/admin/leads", adminLimiter, requireAdmin, async (req, res) => {
  const limit = Number(req.query.limit ?? 100);
  const leads = await listLeads(limit);
  return res.json({ leads });
});

app.get(
  "/api/admin/conversations",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const conversations = await listConversations(limit);
    return res.json({ conversations });
  },
);

app.get(
  "/api/admin/appointments",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const appointments = await listAppointments(limit);
    return res.json({ appointments });
  },
);

app.get("/api/admin/reviews", adminLimiter, requireAdmin, async (req, res) => {
  const limit = Number(req.query.limit ?? 100);
  const reviewsCache = await listReviews(limit);
  return res.json({ reviews: reviewsCache });
});

app.delete(
  "/api/admin/reviews/:id",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await deleteReviewCache(id);

    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }

    await logAdminAudit({
      actor: getAdminActor(req),
      action: "delete",
      resource: "reviews",
      payload: { id: deleted.id, source: deleted.source, author: deleted.author },
    });

    return res.json({ review: deleted });
  },
);

app.get(
  "/api/admin/automation-logs",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const logs = await listAutomationLogs(limit);
    return res.json({ logs });
  },
);

app.get(
  "/api/admin/audit-logs",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const logs = await listAdminAuditLogs(limit);
    return res.json({ logs });
  },
);

app.get(
  "/api/admin/settings",
  adminLimiter,
  requireAdmin,
  async (_req, res) => {
    const settings = await listSettings();
    return res.json({ settings });
  },
);

app.get(
  "/api/admin/ai-prompt",
  adminLimiter,
  requireAdmin,
  async (_req, res) => {
    const value = await getSettingValue<string>("ai_system_prompt");
    return res.json({ key: "ai_system_prompt", value: value ?? null });
  },
);

const aiPromptSchema = z.object({
  value: z.string().min(10),
});

app.post(
  "/api/admin/ai-prompt",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const parsed = aiPromptSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid prompt payload", issues: parsed.error.issues });
    }

    const saved = await upsertSettingValue(
      "ai_system_prompt",
      parsed.data.value,
    );
    await logAdminAudit({
      actor: getAdminActor(req),
      action: "update",
      resource: "ai_system_prompt",
      payload: { key: saved.key },
    });
    await logAutomationEvent({
      eventType: "ai_prompt_updated",
      status: "completed",
      payload: { key: saved.key },
    });

    return res.status(201).json({ setting: saved });
  },
);

app.get(
  "/api/admin/automation/control",
  adminLimiter,
  requireAdmin,
  async (_req, res) => {
    const controls = await getAutomationControlSettings();
    return res.json({ controls });
  },
);

const adminAutomationUpdateSchema = z
  .object({
    calendarAiManagerEnabled: z.boolean().optional(),
    telegramBotEnabled: z.boolean().optional(),
    adminOverrideEnabled: z.boolean().optional(),
    calBookingUrl: z.string().url().optional(),
    calEventTypeId: z.number().int().positive().optional(),
    aiBookingTimezone: z.string().min(2).max(80).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one setting must be provided",
  });

app.post(
  "/api/admin/automation/control",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const parsed = adminAutomationUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid automation control payload",
        issues: parsed.error.issues,
      });
    }

    const actor = getAdminActor(req);
    const updates = parsed.data;

    if (updates.calendarAiManagerEnabled !== undefined) {
      await upsertSettingValue(
        "calendar_ai_manager_enabled",
        updates.calendarAiManagerEnabled,
      );
    }

    if (updates.telegramBotEnabled !== undefined) {
      await upsertSettingValue(
        "telegram_bot_enabled",
        updates.telegramBotEnabled,
      );
    }

    if (updates.adminOverrideEnabled !== undefined) {
      await upsertSettingValue(
        "admin_override_enabled",
        updates.adminOverrideEnabled,
      );
    }

    if (updates.calBookingUrl !== undefined) {
      await upsertSettingValue("cal_booking_url", updates.calBookingUrl);
    }

    if (updates.calEventTypeId !== undefined) {
      await upsertSettingValue("cal_event_type_id", updates.calEventTypeId);
    }

    if (updates.aiBookingTimezone !== undefined) {
      await upsertSettingValue(
        "ai_booking_timezone",
        updates.aiBookingTimezone,
      );
    }

    await logAdminAudit({
      actor,
      action: "update",
      resource: "automation_control",
      payload: updates,
    });

    await logAutomationEvent({
      eventType: "automation_control_updated",
      status: "completed",
      payload: updates,
    });

    const controls = await getAutomationControlSettings();
    return res.json({ ok: true, controls });
  },
);

const adminAgentCommandSchema = z.object({
  command: z.string().min(2),
  chatId: z.string().optional(),
});

app.post(
  "/api/admin/automation/command",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const parsed = adminAgentCommandSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid automation command payload",
        issues: parsed.error.issues,
      });
    }

    const actor = getAdminActor(req);
    const result = await executeAgentCommand(parsed.data.command, {
      source: "admin",
      allowOverride: true,
    });

    await logAdminAudit({
      actor,
      action: "execute",
      resource: "automation_command",
      payload: {
        command: parsed.data.command,
        resultAction: result.action,
      },
    });

    const destinationChatId = parsed.data.chatId ?? config.telegramChatId;
    if (destinationChatId) {
      await sendTelegramMessage(
        destinationChatId,
        `Admin command result:\n${result.message}`,
      );
    }

    return res.json({ ok: true, ...result });
  },
);

const telegramCommandSchema = z.object({
  command: z.string().min(2),
  chatId: z.string().optional(),
  forceAdminOverride: z.boolean().optional(),
});

app.post("/api/telegram/command", requireAdmin, async (req, res) => {
  const parsed = telegramCommandSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid command payload", issues: parsed.error.issues });
  }

  const result = await executeAgentCommand(parsed.data.command, {
    source: "admin",
    allowOverride: parsed.data.forceAdminOverride ?? true,
  });

  if (parsed.data.chatId) {
    await sendTelegramMessage(parsed.data.chatId, result.message);
  }

  return res.json(result);
});

const telegramWebhookSchema = z.object({
  message: z
    .object({
      text: z.string().optional(),
      chat: z.object({ id: z.union([z.number(), z.string()]) }).optional(),
    })
    .optional(),
});

app.post("/api/telegram/webhook", async (req, res) => {
  const secret = req.header("x-telegram-bot-api-secret-token");
  if (config.telegramWebhookSecret && secret !== config.telegramWebhookSecret) {
    return res.status(403).json({ error: "Invalid webhook secret" });
  }

  const parsed = telegramWebhookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const text = parsed.data.message?.text?.trim();
  const chatIdRaw = parsed.data.message?.chat?.id;
  const chatId = typeof chatIdRaw === "number" ? String(chatIdRaw) : chatIdRaw;

  if (!text || !chatId) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  try {
    const result = await executeAgentCommand(text, {
      source: "telegram",
      allowOverride: false,
    });

    await sendTelegramMessage(chatId, result.message);
    await logAutomationEvent({
      eventType: "telegram_command_processed",
      status: "completed",
      payload: {
        chatId,
        command: text,
        action: result.action,
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    await logAutomationEvent({
      eventType: "telegram_command_processed",
      status: "failed",
      payload: {
        chatId,
        command: text,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    await sendTelegramMessage(
      chatId,
      "Sorry, I could not process that request right now. Please try again.",
    );
    return res.status(200).json({ ok: true });
  }
});

const reviewFetchSchema = z.object({
  provider: z.enum(["google", "facebook", "all"]),
});

app.post(
  "/api/admin/reviews/fetch-external",
  adminLimiter,
  requireAdmin,
  async (req, res) => {
    const parsed = reviewFetchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid payload", issues: parsed.error.issues });
    }

    const { provider } = parsed.data;
    const actor = getAdminActor(req);
    const results: {
      provider: string;
      fetched: number;
      synced: number;
      error?: string;
    }[] = [];

    const providers =
      provider === "all" ? (["google", "facebook"] as const) : [provider];

    for (const p of providers) {
      try {
        let externalReviews: ExternalReview[] = [];

        if (p === "google") {
          externalReviews = await fetchGoogleReviews();
        } else {
          externalReviews = await fetchFacebookReviews();
        }

        const sourceName = p === "google" ? "Google" : "Facebook";
        let synced = 0;

        for (const review of externalReviews) {
          const aiReplyDraft = await generateReviewReplyDraft({
            source: sourceName,
            author: review.author,
            rating: review.rating,
            content: review.content,
          });

          const { isNew } = await upsertExternalReview({
            source: sourceName,
            author: review.author,
            rating: review.rating,
            content: review.content,
            aiReplyDraft,
            approved: review.rating >= 4,
          });

          if (isNew) synced++;

          if (review.rating <= 3) {
            await emitReviewAlert({
              source: sourceName,
              author: review.author ?? null,
              rating: review.rating,
              content: review.content,
              ai_reply_draft: aiReplyDraft ?? null,
              approved: false,
            });
          }
        }

        results.push({ provider: p, fetched: externalReviews.length, synced });

        await logAutomationEvent({
          eventType: "review_sync_external",
          status: "completed",
          payload: {
            provider: p,
            fetched: externalReviews.length,
            synced,
          },
        });

        await logAdminAudit({
          actor,
          action: "fetch_external",
          resource: "reviews",
          payload: { provider: p, fetched: externalReviews.length, synced },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ provider: p, fetched: 0, synced: 0, error: message });

        await logAutomationEvent({
          eventType: "review_sync_external",
          status: "failed",
          payload: { provider: p, error: message },
        });
      }
    }

    return res.json({ ok: true, results });
  },
);

app.listen(port, () => {
  console.log(`Shyn Legal API running on http://localhost:${port}`);
});
