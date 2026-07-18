"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

/* ── Cal iframe URL ─────────────────────────────────────── */
const CAL_URL = process.env.NEXT_PUBLIC_CAL_BOOKING_URL ?? "";

function calIframeUrl(baseUrl: string): string {
  if (!baseUrl) return "";
  const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
  url.searchParams.set("embed", "true");
  url.searchParams.set("theme", "dark");
  url.searchParams.set("brandColor", "#C9A84C");
  url.searchParams.set("layout", "month_view");
  return url.toString();
}

/* ── Static data ─────────────────────────────────────────── */
const visaTypes = [
  "Spouse Visa",
  "Fiancé Visa",
  "Unmarried Partner Visa",
  "Student Visa",
  "Skilled Worker Visa",
  "Health & Care Worker Visa",
  "Visit Visa",
  "Naturalisation & Citizenship",
  "EU Settlement Scheme",
  "Ancestry Visa",
  "Other / Not Sure",
];

const timeSlots = [
  "09:00 – 09:30", "09:30 – 10:00",
  "10:00 – 10:30", "10:30 – 11:00",
  "11:00 – 11:30", "11:30 – 12:00",
  "12:00 – 12:30", "12:30 – 13:00",
  "14:00 – 14:30", "14:30 – 15:00",
  "15:00 – 15:30", "15:30 – 16:00",
  "16:00 – 16:30", "16:30 – 17:00",
];

/* ── Success screen ─────────────────────────────────────── */
function SuccessScreen() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">
      <section
        className="rounded-[1.75rem] px-6 py-16 sm:px-12 text-center"
        style={{
          background: "linear-gradient(135deg,rgba(201,168,76,0.12) 0%,rgba(13,30,56,0.95) 100%)",
          border: "1px solid rgba(201,168,76,0.3)",
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(201,168,76,0.15)] text-3xl text-[#C9A84C]">✓</div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground sm:text-3xl">Consultation booked!</h1>
        <p className="mt-4 max-w-lg mx-auto text-sm leading-7 text-(--ink-variant)">
          Your slot is confirmed. Check your inbox for a calendar invite and meeting link. We look forward to speaking with you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">Return Home</Link>
          <Link href="/contact" className="btn-ghost">Send an Enquiry</Link>
        </div>
      </section>
    </main>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside className="flex flex-col gap-4">
      <div className="surface-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">What happens next</p>
        <div className="mt-4 space-y-4">
          {[
            { n: "1", t: "Fill in your details",   d: "Name, email, visa type and a bit about your case." },
            { n: "2", t: "Pick a live slot",        d: "Only Reza's genuinely available times are shown." },
            { n: "3", t: "Instant confirmation",    d: "You'll get a calendar invite and meeting link by email." },
          ].map((s) => (
            <div key={s.n} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.15)] text-[11px] font-bold text-[#C9A84C]">{s.n}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.t}</p>
                <p className="mt-0.5 text-xs leading-5 text-(--ink-variant)">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">Contact us directly</p>
        <div className="mt-3 space-y-2.5">
          <a href="mailto:info@shynlegal.co.uk" className="flex items-center gap-2 text-sm text-(--ink-variant) hover:text-[#C9A84C] transition-colors">
            <span className="text-[#C9A84C]">✉</span> info@shynlegal.co.uk
          </a>
          <a href="tel:02034887525" className="flex items-center gap-2 text-sm text-(--ink-variant) hover:text-[#C9A84C] transition-colors">
            <span className="text-[#C9A84C]">✆</span> 020 3488 7525
          </a>
          <p className="flex items-start gap-2 text-sm text-(--ink-variant)">
            <span className="text-[#C9A84C] mt-0.5">◎</span> 25 Cabot Sq, London E14 4QA
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.1) 0%,rgba(13,30,56,0.9) 100%)", border: "1px solid rgba(201,168,76,0.22)" }}>
        <p className="text-sm font-semibold text-foreground">Prefer to write in?</p>
        <p className="mt-2 text-xs leading-5 text-(--ink-variant)">Send a general enquiry and we will get back to you as soon as we can.</p>
        <Link href="/contact" className="btn-ghost mt-4 w-full text-center text-[13px]">Send an Enquiry</Link>
      </div>
    </aside>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function ConsultationPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [visaType, setVisaType] = useState("");
  const [message, setMessage]   = useState("");
  const [terms, setTerms]       = useState(false);
  const [privacy, setPrivacy]   = useState(false);

  const [booked, setBooked]         = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  // Fallback manual form
  const [fbStatus, setFbStatus] = useState<"idle" | "loading" | "error">("idle");

  // Store Cal booking payload from postMessage
  const bookingPayload = useRef<Record<string, unknown>>({});

  // Latest form values accessible in event callbacks
  const formRef = useRef({ name, email, phone, visaType, message, terms, privacy });
  useEffect(() => {
    formRef.current = { name, email, phone, visaType, message, terms, privacy };
  }, [name, email, phone, visaType, message, terms, privacy]);

  /* ── Listen for Cal.eu booking confirmation via postMessage ── */
  useEffect(() => {
    if (!CAL_URL) return;

    function handleMessage(ev: MessageEvent) {
      // Cal.eu/com sends messages from its iframe domain
      const raw = ev.data;
      let parsed: Record<string, unknown> = {};

      if (typeof raw === "string") {
        try { parsed = JSON.parse(raw); } catch { return; }
      } else if (raw && typeof raw === "object") {
        parsed = raw as Record<string, unknown>;
      } else {
        return;
      }

      // Match both Cal.com and Cal.eu event formats
      const action =
        String(parsed.action ?? parsed.type ?? "")
          .replace(/^CAL:/i, "")
          .toLowerCase();

      if (action === "bookingsuccessful" || action === "booking_successful") {
        bookingPayload.current = (parsed.data ?? parsed) as Record<string, unknown>;
        setBooked(true);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /* ── Submit: validate + POST to confirm endpoint ── */
  async function handleSubmit() {
    setError("");

    if (!name.trim())           { setError("Please enter your full name."); return; }
    if (!email.includes("@"))   { setError("Please enter a valid email address."); return; }
    if (!visaType)              { setError("Please select a visa type."); return; }
    if (!terms || !privacy)     { setError("Please accept the Terms and Privacy Policy."); return; }
    if (!booked)                { setError("Please select a time from the calendar above to complete your booking."); return; }

    setSubmitting(true);

    const bd = bookingPayload.current;
    const attendees = Array.isArray(bd?.attendees)
      ? (bd.attendees as Array<Record<string, unknown>>)
      : [];

    try {
      await fetch("/api/consultation/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bd,
          clientName:  name.trim()  || String(attendees[0]?.name  ?? ""),
          clientEmail: email.trim() || String(attendees[0]?.email ?? ""),
          phone:       phone.trim(),
          visaType,
          message:     message.trim(),
        }),
      });
    } catch {
      // emails still fire server-side
    }

    setSubmitting(false);
    setDone(true);
  }

  /* ── Fallback submit (no Cal.eu URL) ── */
  async function handleFallbackSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFbStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:            String(fd.get("name") ?? "").trim(),
          email:           String(fd.get("email") ?? "").trim(),
          phone:           String(fd.get("phone") ?? "").trim(),
          visaType:        String(fd.get("visaType") ?? "").trim(),
          preferredDate:   String(fd.get("preferredDate") ?? "").trim(),
          preferredTime:   String(fd.get("preferredTime") ?? "").trim(),
          message:         String(fd.get("message") ?? "").trim(),
          acceptedTerms:   fd.get("acceptedTerms") === "on",
          acceptedPrivacy: fd.get("acceptedPrivacy") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error ?? "Something went wrong."); setFbStatus("error"); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setFbStatus("error");
    }
  }

  if (done) return <SuccessScreen />;

  const iframeUrl = calIframeUrl(CAL_URL);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8">

      {/* Hero */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Book a Consultation</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Start your <span className="text-gold-gradient">immigration journey</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-(--ink-variant)">
          {CAL_URL
            ? "Fill in your details and select a live time slot — only Reza's genuinely available slots are shown."
            : "Fill in your details and we will confirm your preferred time as soon as we can."}
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* ── Cal.eu integrated form ── */}
        {CAL_URL ? (
          <div className="surface-panel rounded-[1.75rem] p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <p className="label-md text-[#C9A84C]">Your details</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Book your consultation</h2>
              <p className="mt-1 text-sm text-(--ink-variant)">Fill in your details then pick an available time below.</p>
            </div>

            {/* Name + Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Full name
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your full name" className="px-3 py-2.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Email address
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="px-3 py-2.5 text-sm" />
              </label>
            </div>

            {/* Phone + Visa */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Phone number
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+44 (optional)" className="px-3 py-2.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Visa type
                <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="px-3 py-2.5 text-sm">
                  <option value="">Select visa type…</option>
                  {visaTypes.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>

            {/* Cal.eu iframe — always rendered, no JS init needed */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Select a time</p>
              <div className="rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.18)] bg-[#0b1220]">
                <iframe
                  src={iframeUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Book a consultation — live availability"
                  allow="payment"
                  style={{ display: "block" }}
                />
              </div>
              {booked && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-300">
                  ✓ Time slot selected — click &ldquo;Request Consultation&rdquo; below to confirm.
                </div>
              )}
            </div>

            {/* Message */}
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Tell us about your case
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Share your current immigration situation, visa history, and what you need help with…"
                className="px-3 py-2.5 text-sm resize-none"
              />
            </label>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
                <span className="group-hover:text-foreground transition-colors">
                  I agree to the <Link href="/terms" target="_blank" className="text-[#C9A84C] underline underline-offset-2">Terms and Conditions</Link>.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
                <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
                <span className="group-hover:text-foreground transition-colors">
                  I agree to the <Link href="/privacy" target="_blank" className="text-[#C9A84C] underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
                ✕ {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Confirming…
                </span>
              ) : "Request Consultation"}
            </button>
          </div>
        ) : (

          /* ── Fallback form (no Cal.eu URL) ── */
          <form onSubmit={handleFallbackSubmit} className="surface-panel rounded-[1.75rem] p-6 sm:p-8">
            <p className="label-md text-[#C9A84C]">Your details</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Book your consultation</h2>
            <p className="mt-1 text-sm text-(--ink-variant)">We will confirm your preferred slot as soon as we can.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Full name
                <input name="name" type="text" required placeholder="Your full name" className="px-3 py-2.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Email address
                <input name="email" type="email" required placeholder="you@example.com" className="px-3 py-2.5 text-sm" />
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Phone number
                <input name="phone" type="tel" placeholder="+44 (optional)" className="px-3 py-2.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Visa type
                <select name="visaType" required className="px-3 py-2.5 text-sm">
                  <option value="">Select visa type…</option>
                  {visaTypes.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Preferred date
                <input name="preferredDate" type="date" required min={new Date().toISOString().split("T")[0]} className="px-3 py-2.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Preferred time
                <select name="preferredTime" required className="px-3 py-2.5 text-sm">
                  <option value="">Select a time slot…</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Tell us about your case
              <textarea name="message" required rows={5} placeholder="Share your current situation, visa history, and what you need help with…" className="px-3 py-2.5 text-sm resize-none" />
            </label>
            <div className="mt-5 space-y-3">
              <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
                <input type="checkbox" name="acceptedTerms" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
                <span className="group-hover:text-foreground transition-colors">I agree to the <Link href="/terms" target="_blank" className="text-[#C9A84C] underline underline-offset-2">Terms and Conditions</Link>.</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
                <input type="checkbox" name="acceptedPrivacy" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
                <span className="group-hover:text-foreground transition-colors">I agree to the <Link href="/privacy" target="_blank" className="text-[#C9A84C] underline underline-offset-2">Privacy Policy</Link>.</span>
              </label>
            </div>
            {error && <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">✕ {error}</div>}
            <button
              type="submit"
              disabled={fbStatus === "loading"}
              className="btn-gold mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {fbStatus === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Sending…
                </span>
              ) : "Request Consultation"}
            </button>
          </form>
        )}

        <Sidebar />
      </div>
    </main>
  );
}
