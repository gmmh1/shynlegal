import { config } from "./config.js";

export interface ExternalReview {
  author?: string;
  rating: number;
  content: string;
  publishedAt?: string;
}

export async function fetchGoogleReviews(): Promise<ExternalReview[]> {
  const { googlePlacesApiKey, googlePlaceId } = config;

  if (!googlePlacesApiKey || !googlePlaceId) {
    throw new Error(
      "GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID must be set in .env",
    );
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(googlePlaceId)}` +
    `&fields=reviews` +
    `&language=en` +
    `&reviews_sort=newest` +
    `&key=${encodeURIComponent(googlePlacesApiKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Places API HTTP error: ${res.status}`);
  }

  const data = (await res.json()) as {
    status?: string;
    error_message?: string;
    result?: {
      reviews?: Array<{
        author_name?: string;
        rating?: number;
        text?: string;
        time?: number;
      }>;
    };
  };

  if (data.status !== "OK") {
    throw new Error(
      `Google Places API: ${data.status ?? "unknown status"}. ${data.error_message ?? ""}`.trim(),
    );
  }

  return (data.result?.reviews ?? [])
    .filter((r) => r.text && r.text.trim().length > 0)
    .map((r) => ({
      author: r.author_name ?? undefined,
      rating: r.rating ?? 5,
      content: r.text!.trim(),
      publishedAt: r.time ? new Date(r.time * 1000).toISOString() : undefined,
    }));
}

export async function fetchFacebookReviews(): Promise<ExternalReview[]> {
  const { facebookPageId, facebookPageToken } = config;

  if (!facebookPageId || !facebookPageToken) {
    throw new Error(
      "FACEBOOK_PAGE_ID and FACEBOOK_PAGE_TOKEN must be set in .env",
    );
  }

  const url =
    `https://graph.facebook.com/v19.0/${encodeURIComponent(facebookPageId)}/ratings` +
    `?fields=reviewer{name},rating,review_text,created_time` +
    `&limit=50` +
    `&access_token=${encodeURIComponent(facebookPageToken)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Facebook Graph API HTTP error: ${res.status} — ${body}`);
  }

  const data = (await res.json()) as {
    data?: Array<{
      reviewer?: { name?: string };
      rating?: number;
      review_text?: string;
      created_time?: string;
    }>;
    error?: { message: string; type?: string };
  };

  if (data.error) {
    throw new Error(
      `Facebook API error (${data.error.type ?? "unknown"}): ${data.error.message}`,
    );
  }

  return (data.data ?? [])
    .filter((r) => r.review_text && r.review_text.trim().length > 0)
    .map((r) => ({
      author: r.reviewer?.name ?? undefined,
      rating: r.rating ?? 5,
      content: r.review_text!.trim(),
      publishedAt: r.created_time,
    }));
}
