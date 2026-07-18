import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "@/app/lib/api-server";
import { sendAutoReply, sendEnquiryToOffice } from "@/app/lib/mailer";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const payload = {
    name: String(body?.name || "").trim(),
    email: String(body?.email || "").trim(),
    visaType: String(body?.visaType || "").trim(),
    message: String(body?.message || "").trim(),
    acceptedTerms: Boolean(body?.acceptedTerms),
    acceptedPrivacy: Boolean(body?.acceptedPrivacy),
  };

  if (
    payload.name.length < 2 ||
    !payload.email.includes("@") ||
    payload.visaType.length < 2 ||
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
    sendEnquiryToOffice({
      name: payload.name,
      email: payload.email,
      visaType: payload.visaType,
      message: payload.message,
    }),
    sendAutoReply({
      name: payload.name,
      email: payload.email,
      visaType: payload.visaType,
    }),
  ]);

  if (officeResult.status === "rejected") {
    console.error("Failed to send office notification email:", officeResult.reason);
  }
  if (autoReplyResult.status === "rejected") {
    console.error("Failed to send client auto-reply email:", autoReplyResult.reason);
  }

  // ── Also save to backend DB if available (non-blocking) ──
  proxyJson("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  }).catch(() => {
    // backend unavailable — email already sent above
  });

  return NextResponse.json(
    {
      status: "received",
      message: "Your enquiry has been submitted. We will contact you as soon as we can.",
    },
    { status: 201 },
  );
}
