"use client";

import { useState } from "react";

interface ReviewItem {
  source: string;
  rating: number;
  author?: string;
  content: string;
}

const sourceStyle: Record<string, { badge: string; logo: string }> = {
  Google:     { badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",       logo: "G" },
  Facebook:   { badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20", logo: "f" },
  Trustpilot: { badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", logo: "T" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-[#C9A84C]" : "text-[rgba(201,168,76,0.2)]"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: ReviewItem }) {
  const [expanded, setExpanded] = useState(false);

  const src = sourceStyle[review.source] ?? {
    badge: "bg-[rgba(201,168,76,0.1)] text-[#C9A84C] border-[rgba(201,168,76,0.2)]",
    logo: review.source[0],
  };

  return (
    <article
      className="surface-card w-72 shrink-0 flex flex-col p-5 cursor-pointer"
      style={{
        borderColor: expanded ? "rgba(201,168,76,0.5)" : undefined,
        boxShadow: expanded ? "0 8px 40px rgba(201,168,76,0.18)" : undefined,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Source + stars */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${src.badge}`}>
            {src.logo}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${src.badge}`}>
            {review.source}
          </span>
        </div>
        <Stars rating={review.rating} />
      </div>

      {/* Author */}
      <p className="mt-3 text-sm font-semibold text-foreground">
        {review.author ?? "Anonymous"}
      </p>

      {/* Opening quote */}
      <p className="mt-1 text-xl leading-none text-[rgba(201,168,76,0.28)] font-serif select-none">&ldquo;</p>

      {/* Review text — truncated by default, full on expand */}
      <div
        style={{
          maxHeight: expanded ? "600px" : "5.5rem",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        <p className="text-sm leading-6 text-(--ink-variant)">
          {review.content}
        </p>
      </div>

      {/* Hint */}
      <p
        className="mt-2 text-[11px] text-[#C9A84C]"
        style={{
          opacity: expanded ? 0 : 0.6,
          transition: "opacity 0.3s ease",
          height: expanded ? 0 : "auto",
          overflow: "hidden",
        }}
      >
        Hover or tap to read full review
      </p>
    </article>
  );
}
