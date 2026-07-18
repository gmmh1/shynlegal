import { NextRequest } from "next/server";
import { asJsonResponse, proxyJson } from "@/app/lib/api-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await proxyJson("/api/appointments/create", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return asJsonResponse(response);
}
