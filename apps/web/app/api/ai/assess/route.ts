import { NextRequest, NextResponse } from "next/server";
import { buildSummary, VisaType } from "@/app/lib/domain";
import { asJsonResponse, proxyJson } from "@/app/lib/api-server";

const visaOptions = new Set<VisaType>([
  "Spouse Visa",
  "Student Visa",
  "Skilled Worker Visa",
  "Visit Visa",
  "Citizenship",
  "Other",
]);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const visaType = body?.visaType as VisaType;
  const details = String(body?.details || "");

  if (!visaOptions.has(visaType) || details.trim().length < 10) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const upstream = await proxyJson("/api/ai/assess", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (upstream.ok) {
      return asJsonResponse(upstream);
    }
  } catch {
    // backend unreachable — fall through to local summary
  }

  return NextResponse.json(buildSummary(visaType, details));
}
