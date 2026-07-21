"use client";

import { useState } from "react";

type ReviewItem = {
  id: string;
  source: string;
  author?: string | null;
  rating: number;
  content: string;
  approved: boolean;
};

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (["completed", "approved", "connected", "published", "ok"].includes(normalized)) {
    return "bg-emerald-400/15 text-emerald-200";
  }
  if (["failed", "error", "high"].includes(normalized)) {
    return "bg-red-400/15 text-red-200";
  }
  return "bg-amber-400/15 text-amber-200";
}

export function ReviewsList({ initialReviews }: { initialReviews: ReviewItem[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(id: string) {
    setRemovingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Failed to remove review (${res.status})`);
        return;
      }

      setReviews((current) => current.filter((review) => review.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="mt-5 grid gap-3">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
          ✕ {error}
        </div>
      )}

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="surface-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {review.author ?? "Anonymous"}
                </p>
                <p className="mt-1 text-sm text-(--ink-variant)">
                  {review.source} · {"★".repeat(review.rating)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(review.approved ? "approved" : "pending")}`}
                >
                  {review.approved ? "Ready to share" : "Needs a reply"}
                </span>
                <button
                  type="button"
                  disabled={removingId === review.id}
                  onClick={() => handleRemove(review.id)}
                  className="rounded-full border border-red-500/25 px-3 py-1 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removingId === review.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-(--ink-variant)">
              {review.content}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-(--ink-variant)">
          No reviews have been pulled in yet.
        </p>
      )}
    </div>
  );
}
