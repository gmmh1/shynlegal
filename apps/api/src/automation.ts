import { config } from "./config.js";
import { logAutomationEvent } from "./db.js";

// Sent via Resend's HTTP API rather than raw SMTP: many PaaS hosts (Railway
// included) block outbound SMTP (ports 465/587) at the platform level, so a
// direct connection to any mail server times out or gets refused. The HTTP
// API runs over normal HTTPS, which isn't blocked.
async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  if (!config.resendApiKey) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.resendApiKey}`,
    },
    body: JSON.stringify({
      from: `SHYN Legal <${config.smtpFrom ?? config.smtpUser ?? "info@shynlegal.co.uk"}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
}

// ── Shared HTML wrapper ──────────────────────────────────

function emailWrapper(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#132238 0%,#1f3857 60%,#8B6914 100%);padding:28px 32px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);">SHYN Legal</p>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">${title}</h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          ${bodyHtml}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8f8f8;border-top:1px solid #e8e8e8;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#888888;">
            SHYN Legal · 25 Cabot Square, London E14 4QA<br>
            <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;text-decoration:none;">info@shynlegal.co.uk</a> ·
            <a href="tel:02034887525" style="color:#C9A84C;text-decoration:none;">020 3488 7525</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function field(label: string, value: string): string {
  return `
  <table role="presentation" width="100%" style="margin-bottom:12px;background:#f9f9f9;border-radius:8px;border-left:3px solid #C9A84C;">
    <tr>
      <td style="padding:10px 14px;">
        <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#888888;">${label}</p>
        <p style="margin:0;font-size:15px;color:#132238;">${value.replace(/\n/g, "<br>")}</p>
      </td>
    </tr>
  </table>`;
}

// ── Contact form email to info@shynlegal.co.uk ───────────

export async function sendEnquiryNotification(data: {
  name: string;
  email: string;
  visaType: string;
  message: string;
  leadId?: string;
}) {
  const notifyTo = config.notifyEmail ?? "info@shynlegal.co.uk";

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:15px;color:#444444;">
      A new client enquiry has been submitted via the website contact form.
    </p>

    ${field("Full name", data.name)}
    ${field("Email address", data.email)}
    ${field("Visa type", data.visaType)}
    ${field("Message", data.message)}
    ${data.leadId ? field("Lead reference", data.leadId) : ""}

    <table role="presentation" width="100%" style="margin-top:24px;">
      <tr>
        <td>
          <a href="mailto:${data.email}?subject=Re: Your SHYN Legal Enquiry"
             style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
            Reply to ${data.name}
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-size:13px;color:#888888;">
      This email was sent automatically when the client submitted the contact form at shynlegal.co.uk.
    </p>`;

  const plainText = [
    "New client enquiry — SHYN Legal",
    "────────────────────────────────",
    `Name:       ${data.name}`,
    `Email:      ${data.email}`,
    `Visa type:  ${data.visaType}`,
    `Message:`,
    data.message,
    data.leadId ? `\nLead ID: ${data.leadId}` : "",
  ].join("\n");

  await sendMail({
    to: notifyTo,
    subject: `New Enquiry — ${data.name} (${data.visaType})`,
    text: plainText,
    html: emailWrapper("New Client Enquiry", bodyHtml),
    replyTo: data.email,
  });
}

// ── Auto-reply to the client ─────────────────────────────

export async function sendEnquiryAutoReply(data: {
  name: string;
  email: string;
  visaType: string;
}) {
  const firstName = data.name.split(" ")[0];

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#444444;">
      Dear ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;">
      Thank you for contacting SHYN Legal. We have received your enquiry regarding a
      <strong>${data.visaType}</strong> and will be in touch within <strong>24 hours</strong>.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#444444;">
      In the meantime, you can book a free 30-minute strategy call directly using the link below:
    </p>

    <table role="presentation" width="100%" style="margin:24px 0;">
      <tr>
        <td>
          <a href="https://www.shynlegal.co.uk/consultation"
             style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
            Book a Consultation
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:15px;color:#444444;">
      If you have any urgent questions, please contact us directly:
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:#444444;">
      📧 <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;">info@shynlegal.co.uk</a>
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#444444;">
      📞 <a href="tel:02034887525" style="color:#C9A84C;">020 3488 7525</a>
    </p>

    <p style="margin:0;font-size:15px;color:#444444;">
      Kind regards,<br>
      <strong>Reza Rahman</strong><br>
      SHYN Legal
    </p>`;

  const plainText = [
    `Dear ${firstName},`,
    "",
    `Thank you for contacting SHYN Legal. We have received your enquiry regarding a ${data.visaType} and will be in touch within 24 hours.`,
    "",
    "Book a consultation: https://www.shynlegal.co.uk/consultation",
    "",
    "Contact us directly:",
    "Email: info@shynlegal.co.uk",
    "Phone: 020 3488 7525",
    "",
    "Kind regards,",
    "Reza Rahman",
    "SHYN Legal",
  ].join("\n");

  await sendMail({
    to: data.email,
    subject: "We have received your enquiry — SHYN Legal",
    text: plainText,
    html: emailWrapper("Thank you for your enquiry", bodyHtml),
  });
}

// ── Webhook relay ────────────────────────────────────────

async function postWebhook(path: string, payload: unknown) {
  if (!config.n8nWebhookBaseUrl) return;

  const base = config.n8nWebhookBaseUrl.endsWith("/")
    ? config.n8nWebhookBaseUrl.slice(0, -1)
    : config.n8nWebhookBaseUrl;

  await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ── Telegram ─────────────────────────────────────────────

export async function sendTelegramMessage(chatId: string | number, message: string) {
  if (!config.telegramBotToken) return;

  await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });
}

export async function notifyTelegram(message: string) {
  if (!config.telegramBotToken || !config.telegramChatId) return;
  await sendTelegramMessage(config.telegramChatId, message);
}

// ── Generic notify email (used by other events) ──────────

export async function notifyEmail(subject: string, text: string) {
  if (!config.notifyEmail) return;

  const html = emailWrapper(
    subject,
    `<pre style="font-size:13px;color:#444;white-space:pre-wrap;word-break:break-word;">${text}</pre>`,
  );

  await sendMail({ to: config.notifyEmail, subject, text, html });
}

// ── Automation events ────────────────────────────────────

export async function emitLeadCreated(payload: Record<string, unknown>) {
  await logAutomationEvent({ eventType: "lead_created", status: "queued", payload });

  const tasks: Promise<unknown>[] = [
    postWebhook("/lead-created", payload),
    notifyTelegram(`New SHYN lead: ${payload["name"] ?? "unknown"} — ${payload["visaType"] ?? ""}`),
  ];

  // If this came from the contact form, send rich emails
  if (
    payload["source"] === "contact_form" &&
    typeof payload["name"] === "string" &&
    typeof payload["email"] === "string" &&
    typeof payload["visaType"] === "string" &&
    typeof payload["message"] === "string"
  ) {
    tasks.push(
      sendEnquiryNotification({
        name: payload["name"],
        email: payload["email"],
        visaType: payload["visaType"],
        message: payload["message"],
        leadId: typeof payload["leadId"] === "string" ? payload["leadId"] : undefined,
      }),
    );
    tasks.push(
      sendEnquiryAutoReply({
        name: payload["name"],
        email: payload["email"],
        visaType: payload["visaType"],
      }),
    );
  } else {
    // Non-form source — plain notification
    tasks.push(
      notifyEmail(
        `New lead — ${payload["source"] ?? "unknown"}`,
        JSON.stringify(payload, null, 2),
      ),
    );
  }

  await Promise.allSettled(tasks);
  await logAutomationEvent({ eventType: "lead_created", status: "completed", payload });
}

export async function emitBookingEvent(payload: unknown) {
  await logAutomationEvent({ eventType: "booking_event", status: "queued", payload });

  await Promise.allSettled([
    postWebhook("/booking-event", payload),
    notifyTelegram(`Booking update: ${JSON.stringify(payload)}`),
    notifyEmail("Booking update — SHYN Legal", JSON.stringify(payload, null, 2)),
  ]);

  await logAutomationEvent({ eventType: "booking_event", status: "completed", payload });
}

export async function emitReviewAlert(payload: unknown) {
  await logAutomationEvent({ eventType: "review_alert", status: "queued", payload });

  await Promise.allSettled([
    postWebhook("/review-alert", payload),
    notifyTelegram(`Review alert: ${JSON.stringify(payload)}`),
    notifyEmail("Review alert — SHYN Legal", JSON.stringify(payload, null, 2)),
  ]);

  await logAutomationEvent({ eventType: "review_alert", status: "completed", payload });
}
