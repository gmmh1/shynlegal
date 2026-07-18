import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "@/app/lib/api-server";
import { sendBookingAutoReply, sendBookingToOffice } from "@/app/lib/mailer";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const payload = {
    name:            String(body?.name ?? "").trim(),
    email:           String(body?.email ?? "").trim(),
    phone:           String(body?.phone ?? "").trim(),
    visaType:        String(body?.visaType ?? "").trim(),
    preferredDate:   String(body?.preferredDate ?? "").trim(),
    preferredTime:   String(body?.preferredTime ?? "").trim(),
    message:         String(body?.message ?? "").trim(),
    acceptedTerms:   Boolean(body?.acceptedTerms),
    acceptedPrivacy: Boolean(body?.acceptedPrivacy),
  };

  if (
    payload.name.length < 2 ||
    !payload.email.includes("@") ||
    payload.visaType.length < 2 ||
    !payload.preferredDate ||
    !payload.preferredTime ||
    payload.message.length < 10 ||
    !payload.acceptedTerms ||
    !payload.acceptedPrivacy
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  // ── Send emails immediately — independent of backend status ──
  const [officeResult, autoReplyResult] = await Promise.allSettled([
    sendBookingToOffice(payload),
    sendBookingAutoReply({
      name:          payload.name,
      email:         payload.email,
      visaType:      payload.visaType,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
    }),
  ]);

  if (officeResult.status === "rejected") {
    console.error("Failed to send office notification email:", officeResult.reason);
  }
  if (autoReplyResult.status === "rejected") {
    console.error("Failed to send client auto-reply email:", autoReplyResult.reason);
  }

  // ── Save to backend: create lead + appointment (non-blocking) ──
  proxyJson("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name:            payload.name,
      email:           payload.email,
      visaType:        payload.visaType,
      message:         `[Consultation request — ${payload.preferredTime} on ${payload.preferredDate}]\n\n${payload.message}`,
      acceptedTerms:   true,
      acceptedPrivacy: true,
    }),
  })
    .then((res) => {
      if (!res.ok) return;
      return res.json();
    })
    .catch(() => {
      // backend unavailable — emails already sent
    });

  return NextResponse.json(
    {
      status: "received",
      message:
        "Your consultation request has been received. We will confirm your appointment as soon as we can.",
    },
    { status: 201 },
  );
}
