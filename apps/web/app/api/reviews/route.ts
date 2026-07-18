import { NextResponse } from "next/server";
import { reviews } from "@/app/lib/domain";
import { asJsonResponse, proxyJson } from "@/app/lib/api-server";

export async function GET() {
  const upstream = await proxyJson("/api/reviews");

  if (upstream.ok) {
    return asJsonResponse(upstream);
  }

  return NextResponse.json({ reviews });
}
