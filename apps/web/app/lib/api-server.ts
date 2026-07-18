import { NextResponse } from "next/server";

const nodeApiBase = (
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

const wpBase = (process.env.WORDPRESS_URL ?? "http://localhost:8080").replace(
  /\/$/,
  "",
);

export function apiUrl(path: string): string {
  return `${nodeApiBase}${path}`;
}

export function wpRestUrl(path: string): string {
  // /api/ai/assess  →  /wp-json/shyn/v1/ai/assess
  // /api/reviews    →  /wp-json/shyn/v1/reviews
  const stripped = path.replace(/^\/api/, "");
  return `${wpBase}/wp-json/shyn/v1${stripped}`;
}

/**
 * Try the Node.js API first, fall back to the WordPress REST relay.
 * Throws only if both fail.
 */
export async function proxyJson(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const shared: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  };

  // 1. Try Node.js backend directly
  try {
    const res = await fetch(apiUrl(path), shared);
    if (res.ok) return res;
  } catch {
    // Node.js unreachable — try WordPress relay
  }

  // 2. Try WordPress REST relay
  return fetch(wpRestUrl(path), shared);
}

export async function asJsonResponse(response: Response) {
  const text = await response.text();

  try {
    const parsed = text ? JSON.parse(text) : {};
    return NextResponse.json(parsed, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: text || "Unexpected upstream response" },
      { status: response.status },
    );
  }
}
