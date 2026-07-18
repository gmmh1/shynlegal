// Sent via Brevo's HTTP API rather than raw SMTP: Railway blocks outbound
// SMTP (ports 465/587) at the platform level, so a direct connection to any
// mail server — including well-known ones like Gmail/Outlook — times out or
// gets refused. The HTTP API runs over normal HTTPS, which isn't blocked.
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "info@shynlegal.co.uk";
const FROM_NAME = "SHYN Legal";
const NOTIFY = process.env.NOTIFY_EMAIL ?? "info@shynlegal.co.uk";

async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!BREVO_API_KEY) return;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${body}`);
  }
}

function wrap(title: string, body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#132238 0%,#1f3857 60%,#8B6914 100%);padding:28px 32px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);">SHYN Legal</p>
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;">${title}</h1>
  </td></tr>
  <tr><td style="padding:32px;">${body}</td></tr>
  <tr><td style="background:#f8f8f8;border-top:1px solid #e8e8e8;padding:20px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#888;">
      SHYN Legal · 25 Cabot Square, London E14 4QA<br>
      <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;text-decoration:none;">info@shynlegal.co.uk</a> ·
      <a href="tel:02034887525" style="color:#C9A84C;text-decoration:none;">020 3488 7525</a>
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function row(label: string, value: string) {
  return `<table role="presentation" width="100%" style="margin-bottom:12px;background:#f9f9f9;border-radius:8px;border-left:3px solid #C9A84C;">
  <tr><td style="padding:10px 14px;">
    <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;">${label}</p>
    <p style="margin:0;font-size:15px;color:#132238;">${value.replace(/\n/g, "<br>")}</p>
  </td></tr>
</table>`;
}

export async function sendEnquiryToOffice(data: {
  name: string;
  email: string;
  visaType: string;
  message: string;
}) {
  const html = wrap(
    "New Client Enquiry",
    `<p style="margin:0 0 20px;font-size:15px;color:#444;">A new enquiry was submitted via the website contact form.</p>
    ${row("Full name", data.name)}
    ${row("Email address", data.email)}
    ${row("Visa type", data.visaType)}
    ${row("Message", data.message)}
    <table role="presentation" width="100%" style="margin-top:24px;"><tr><td>
      <a href="mailto:${data.email}?subject=Re: Your SHYN Legal Enquiry"
         style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
        Reply to ${data.name}
      </a>
    </td></tr></table>`,
  );

  const text = [
    "New client enquiry — SHYN Legal",
    "─────────────────────────────────",
    `Name:      ${data.name}`,
    `Email:     ${data.email}`,
    `Visa type: ${data.visaType}`,
    `Message:`,
    data.message,
  ].join("\n");

  await sendMail({
    to: NOTIFY,
    subject: `New Enquiry — ${data.name} (${data.visaType})`,
    text,
    html,
  });
}

export async function sendBookingToOffice(data: {
  name: string;
  email: string;
  phone: string;
  visaType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}) {
  const dateLabel = data.preferredDate
    ? new Date(data.preferredDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Not specified";

  const html = wrap(
    "New Consultation Booking Request",
    `<p style="margin:0 0 20px;font-size:15px;color:#444;">A new consultation request was submitted via the website booking form.</p>
    ${row("Full name", data.name)}
    ${row("Email address", data.email)}
    ${data.phone ? row("Phone number", data.phone) : ""}
    ${row("Visa type", data.visaType)}
    ${row("Preferred date", dateLabel)}
    ${row("Preferred time", data.preferredTime)}
    ${row("Case details", data.message)}
    <table role="presentation" width="100%" style="margin-top:24px;"><tr><td>
      <a href="mailto:${data.email}?subject=Re: Your SHYN Legal Consultation Request"
         style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
        Reply to ${data.name}
      </a>
    </td></tr></table>`,
  );

  const text = [
    "New Consultation Booking Request — SHYN Legal",
    "──────────────────────────────────────────────",
    `Name:           ${data.name}`,
    `Email:          ${data.email}`,
    `Phone:          ${data.phone || "Not provided"}`,
    `Visa type:      ${data.visaType}`,
    `Preferred date: ${dateLabel}`,
    `Preferred time: ${data.preferredTime}`,
    `Case details:`,
    data.message,
  ].join("\n");

  await sendMail({
    to: NOTIFY,
    subject: `New Consultation Request — ${data.name} (${data.visaType}) — ${data.preferredTime} ${dateLabel}`,
    text,
    html,
  });
}

export async function sendBookingAutoReply(data: {
  name: string;
  email: string;
  visaType: string;
  preferredDate: string;
  preferredTime: string;
}) {
  const firstName = data.name.split(" ")[0];
  const dateLabel = data.preferredDate
    ? new Date(data.preferredDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "your selected date";

  const html = wrap(
    "Your consultation request is confirmed",
    `<p style="margin:0 0 16px;font-size:15px;color:#444;">Dear ${firstName},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Thank you for booking a consultation with SHYN Legal. We have received your request regarding a
      <strong>${data.visaType}</strong>.
    </p>
    <table role="presentation" width="100%" style="margin-bottom:20px;background:#f9f9f9;border-radius:8px;border-left:3px solid #C9A84C;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0 0 6px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.06em;">Your requested slot</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#132238;">${dateLabel}</p>
        <p style="margin:4px 0 0;font-size:15px;color:#132238;">${data.preferredTime}</p>
      </td></tr>
    </table>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Our advisor will review your request and send you a <strong>confirmation with a meeting link as soon as we can</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:14px;color:#444;">If you need to reach us sooner:</p>
    <p style="margin:0 0 4px;font-size:14px;color:#444;">📧 <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;">info@shynlegal.co.uk</a></p>
    <p style="margin:0 0 24px;font-size:14px;color:#444;">📞 <a href="tel:02034887525" style="color:#C9A84C;">020 3488 7525</a></p>
    <p style="margin:0;font-size:15px;color:#444;">Kind regards,<br><strong>Reza Rahman</strong><br>SHYN Legal</p>`,
  );

  const text = [
    `Dear ${firstName},`,
    "",
    `Thank you for booking a consultation with SHYN Legal.`,
    "",
    `Your requested slot: ${data.preferredTime}, ${dateLabel}`,
    "",
    "We will confirm your appointment with a meeting link as soon as we can.",
    "",
    "Email: info@shynlegal.co.uk",
    "Phone: 020 3488 7525",
    "",
    "Kind regards,",
    "Reza Rahman — SHYN Legal",
  ].join("\n");

  await sendMail({
    to: data.email,
    subject: "Your consultation request — SHYN Legal",
    text,
    html,
  });
}

// ── Cal.com confirmed booking emails ────────────────────

function formatConfirmedTime(isoString: string): string {
  if (!isoString) return "Time to be confirmed";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  });
}

export async function sendConfirmedBookingToOffice(data: {
  name: string;
  email: string;
  phone: string;
  visaType: string;
  message: string;
  startTime: string;
  calBookingUid: string;
}) {
  const timeLabel = formatConfirmedTime(data.startTime);

  const html = wrap(
    "Consultation Booking Confirmed",
    `<p style="margin:0 0 20px;font-size:15px;color:#444;">A client has confirmed a consultation via the website booking form.</p>
    ${row("Client name", data.name)}
    ${row("Email address", data.email)}
    ${data.phone ? row("Phone number", data.phone) : ""}
    ${data.visaType ? row("Visa type", data.visaType) : ""}
    ${row("Confirmed time", timeLabel)}
    ${data.calBookingUid ? row("Cal.com booking ID", data.calBookingUid) : ""}
    ${data.message ? row("Case details", data.message) : ""}
    <table role="presentation" width="100%" style="margin-top:24px;"><tr><td>
      <a href="mailto:${data.email}?subject=Your SHYN Legal Consultation — ${timeLabel}"
         style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
        Email ${data.name}
      </a>
    </td></tr></table>`,
  );

  const text = [
    "Consultation Booking Confirmed — SHYN Legal",
    "─────────────────────────────────────────────",
    `Name:       ${data.name}`,
    `Email:      ${data.email}`,
    `Phone:      ${data.phone || "Not provided"}`,
    `Visa type:  ${data.visaType || "Not specified"}`,
    `Time:       ${timeLabel}`,
    `Booking ID: ${data.calBookingUid || "N/A"}`,
    data.message ? `\nCase details:\n${data.message}` : "",
  ].join("\n");

  await sendMail({
    to: NOTIFY,
    subject: `Booking Confirmed — ${data.name} — ${timeLabel}`,
    text,
    html,
  });
}

export async function sendConfirmedBookingAutoReply(data: {
  name: string;
  email: string;
  visaType: string;
  startTime: string;
}) {
  const firstName = data.name.split(" ")[0];
  const timeLabel = formatConfirmedTime(data.startTime);

  const html = wrap(
    "Your consultation is confirmed",
    `<p style="margin:0 0 16px;font-size:15px;color:#444;">Dear ${firstName},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Your consultation with SHYN Legal is confirmed. We look forward to speaking with you.
    </p>
    <table role="presentation" width="100%" style="margin-bottom:20px;background:#f9f9f9;border-radius:8px;border-left:3px solid #C9A84C;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.06em;">Confirmed time</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#132238;">${timeLabel}</p>
      </td></tr>
    </table>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      A calendar invite and meeting link have been sent to this address. If you need to reschedule or cancel, please contact us directly.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:#444;">📧 <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;">info@shynlegal.co.uk</a></p>
    <p style="margin:0 0 24px;font-size:14px;color:#444;">📞 <a href="tel:02034887525" style="color:#C9A84C;">020 3488 7525</a></p>
    <p style="margin:0;font-size:15px;color:#444;">Kind regards,<br><strong>Reza Rahman</strong><br>SHYN Legal</p>`,
  );

  const text = [
    `Dear ${firstName},`,
    "",
    "Your consultation with SHYN Legal is confirmed.",
    "",
    `Time: ${timeLabel}`,
    "",
    "A calendar invite and meeting link have been sent to this address.",
    "To reschedule: info@shynlegal.co.uk | 020 3488 7525",
    "",
    "Kind regards,",
    "Reza Rahman — SHYN Legal",
  ].join("\n");

  await sendMail({
    to: data.email,
    subject: "Your consultation is confirmed — SHYN Legal",
    text,
    html,
  });
}

export async function sendAutoReply(data: {
  name: string;
  email: string;
  visaType: string;
}) {
  const firstName = data.name.split(" ")[0];

  const html = wrap(
    "Thank you for your enquiry",
    `<p style="margin:0 0 16px;font-size:15px;color:#444;">Dear ${firstName},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#444;">
      Thank you for contacting SHYN Legal. We have received your enquiry regarding a
      <strong>${data.visaType}</strong> and will be in touch within <strong>24 hours</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#444;">
      You can also book a consultation directly:
    </p>
    <table role="presentation" width="100%" style="margin-bottom:24px;"><tr><td>
      <a href="https://www.shynlegal.co.uk/consultation"
         style="display:inline-block;background:#C9A84C;color:#132238;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
        Book a Consultation
      </a>
    </td></tr></table>
    <p style="margin:0 0 4px;font-size:14px;color:#444;">📧 <a href="mailto:info@shynlegal.co.uk" style="color:#C9A84C;">info@shynlegal.co.uk</a></p>
    <p style="margin:0 0 24px;font-size:14px;color:#444;">📞 <a href="tel:02034887525" style="color:#C9A84C;">020 3488 7525</a></p>
    <p style="margin:0;font-size:15px;color:#444;">Kind regards,<br><strong>Reza Rahman</strong><br>SHYN Legal</p>`,
  );

  const text = [
    `Dear ${firstName},`,
    "",
    `Thank you for contacting SHYN Legal. We have received your ${data.visaType} enquiry and will be in touch as soon as we can.`,
    "",
    "Book a consultation: https://www.shynlegal.co.uk/consultation",
    "",
    "Email: info@shynlegal.co.uk",
    "Phone: 020 3488 7525",
    "",
    "Kind regards,",
    "Reza Rahman — SHYN Legal",
  ].join("\n");

  await sendMail({
    to: data.email,
    subject: "We have received your enquiry — SHYN Legal",
    text,
    html,
  });
}
