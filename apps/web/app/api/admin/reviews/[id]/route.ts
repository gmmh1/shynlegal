import { NextRequest, NextResponse } from "next/server";

const apiBase =
  (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const upstream = await fetch(`${apiBase}/api/admin/reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "x-admin-key": process.env.ADMIN_API_KEY ?? "",
    },
  });

  const data = await upstream.json();

  return NextResponse.json(data, { status: upstream.status });
}
