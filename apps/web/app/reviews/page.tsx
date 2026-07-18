import Link from "next/link";
import { reviews } from "../lib/domain";
import { ReviewCard } from "./ReviewCard";

interface ReviewItem {
  source: string;
  rating: number;
  author?: string;
  content: string;
  ai_reply_draft?: string;
}

async function loadReviews(): Promise<ReviewItem[]> {
  try {
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
    const response = await fetch(`${appBaseUrl}/api/reviews`, { cache: "no-store" });
    if (!response.ok) return reviews;
    const data = (await response.json()) as { reviews?: ReviewItem[] };
    return Array.isArray(data.reviews) && data.reviews.length > 0 ? data.reviews : reviews;
  } catch {
    return reviews;
  }
}

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

const sourceStyle: Record<string, { badge: string; logo: string }> = {
  Google:     { badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",       logo: "G" },
  Facebook:   { badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20", logo: "f" },
  Trustpilot: { badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", logo: "T" },
};

export default async function ReviewsPage() {
  const reviewList = await loadReviews();
  const avgRating = (reviewList.reduce((s, r) => s + r.rating, 0) / reviewList.length).toFixed(1);

  // Marquee: 4 copies doubled = 8 copies total for seamless loop
  const half = [...reviewList, ...reviewList, ...reviewList, ...reviewList];
  const marqueeItems = [...half, ...half];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Client Reviews</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Feedback from clients who{" "}
          <span className="text-gold-gradient">trusted us</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-(--ink-variant)">
          Every review below is real, unedited, and left by a client whose immigration journey we helped navigate.
        </p>

        <div className="mt-7 flex flex-wrap gap-4">
          <div className="surface-card px-5 py-3 flex items-center gap-3">
            <span className="text-3xl font-bold text-gold-gradient">{avgRating}</span>
            <div>
              <Stars rating={Math.round(Number(avgRating))} />
              <p className="mt-0.5 text-xs text-(--ink-variant)">Average rating</p>
            </div>
          </div>
          <div className="surface-card px-5 py-3 flex items-center gap-3">
            <span className="text-3xl font-bold text-gold-gradient">{reviewList.length}</span>
            <div>
              <p className="text-sm font-medium text-foreground">Verified reviews</p>
              <p className="text-xs text-(--ink-variant)">Google &amp; Facebook</p>
            </div>
          </div>
          {["Google", "Facebook"].map((src) => {
            const count = reviewList.filter((r) => r.source === src).length;
            const s = sourceStyle[src];
            return (
              <div key={src} className={`surface-card px-4 py-3 flex items-center gap-2 rounded-xl border ${s.badge}`}>
                <span className="font-bold text-base">{s.logo}</span>
                <span className="text-sm font-semibold">{count} reviews</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-md text-[#C9A84C]">What clients say</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Live testimonials</h2>
          </div>
          <p className="hidden text-xs text-(--ink-variant) sm:block">Hover to pause</p>
        </div>

        <div className="marquee-outer mt-5">
          <div className="marquee-track">
            {marqueeItems.map((review, idx) => (
              <ReviewCard key={idx} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Source note ── */}
      <div className="mt-4 surface-card px-5 py-3 flex flex-wrap items-center gap-4">
        <p className="text-xs text-(--ink-variant)">Reviews sourced from:</p>
        {["Google", "Facebook"].map((src) => {
          const s = sourceStyle[src];
          return (
            <span key={src} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.badge}`}>
              <span className="font-bold">{s.logo}</span> {src}
            </span>
          );
        })}
        <p className="text-xs text-(--ink-variant) sm:ml-auto">All reviews are real and unedited.</p>
      </div>

      {/* ── CTA ── */}
      <section
        className="mt-12 rounded-[1.75rem] px-6 py-10 sm:px-10 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(13,30,56,0.9) 100%)",
          border: "1px solid rgba(201,168,76,0.22)",
        }}
      >
        <p className="label-md text-[#C9A84C]">Join our clients</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Ready to start your immigration journey?
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-(--ink-variant)">
          Book a consultation with our advisor and experience the SHYN Legal difference.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/consultation" className="btn-gold">Book Consultation</Link>
          <Link href="/contact" className="btn-ghost">Send an Enquiry</Link>
        </div>
      </section>
    </main>
  );
}
