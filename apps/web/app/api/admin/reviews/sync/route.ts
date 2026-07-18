import { NextRequest, NextResponse } from "next/server";

const apiBase =
  (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${apiBase}/api/admin/reviews/fetch-external`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": process.env.ADMIN_API_KEY ?? "",
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();

  return NextResponse.json(data, { status: upstream.status });
}
