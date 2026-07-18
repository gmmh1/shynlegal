import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "@/app/lib/api-server";
import { sendConfirmedBookingToOffice, sendConfirmedBookingAutoReply } from "@/app/lib/mailer";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Cal.com booking data is nested inside body.booking or at root level
  const booking = (body?.booking ?? body) as Record<string, unknown>;

  const attendees = Array.isArray(booking?.attendees) ? booking.attendees as Array<Record<string, unknown>> : [];
  const clientName  = String(body?.clientName  ?? attendees[0]?.name  ?? "").trim();
  const clientEmail = String(body?.clientEmail  ?? attendees[0]?.email ?? "").trim();
  const phone       = String(body?.phone  ?? "").trim();
  const visaType    = String(body?.visaType ?? "").trim();
  const message     = String(body?.message  ?? "").trim();
  const startTime   = String(booking?.startTime ?? body?.startTime ?? "").trim();
  const calBookingUid = String(booking?.uid ?? body?.uid ?? "").trim();

  if (!clientEmail.includes("@")) {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }

  // Fire both emails immediately
  await Promise.allSettled([
    sendConfirmedBookingToOffice({
      name: clientName,
      email: clientEmail,
      phone,
      visaType,
      message,
      startTime,
      calBookingUid,
    }),
    sendConfirmedBookingAutoReply({
      name: clientName,
      email: clientEmail,
      visaType,
      startTime,
    }),
  ]);

  // Save lead to backend DB (fire-and-forget)
  proxyJson("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name:            clientName,
      email:           clientEmail,
      visaType:        visaType || "Consultation booking",
      message:         `[Cal.com booking confirmed — ${startTime}]\n\n${message}`,
      acceptedTerms:   true,
      acceptedPrivacy: true,
    }),
  }).catch(() => {});

  return NextResponse.json({ status: "confirmed" }, { status: 201 });
}
