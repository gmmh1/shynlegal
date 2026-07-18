import { NextResponse } from "next/server";
import { services } from "@/app/lib/domain";
import { asJsonResponse, proxyJson } from "@/app/lib/api-server";

export async function GET() {
  const upstream = await proxyJson("/api/services");

  if (upstream.ok) {
    return asJsonResponse(upstream);
  }

  return NextResponse.json({ services });
}
