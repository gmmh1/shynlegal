const defaultBaseUrl =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000";

function getBaseUrl() {
  return defaultBaseUrl.endsWith("/")
    ? defaultBaseUrl.slice(0, -1)
    : defaultBaseUrl;
}

export async function fetchAdminJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    cache: "no-store",
    headers: {
      "x-admin-key": process.env.ADMIN_API_KEY ?? "",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Admin request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
