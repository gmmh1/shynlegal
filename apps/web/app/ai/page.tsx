"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { AISummary, VisaType } from "../lib/domain";

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

const visaOptions: VisaType[] = [
  "Spouse Visa",
  "Student Visa",
  "Skilled Worker Visa",
  "Visit Visa",
  "Citizenship",
  "Other",
];

const riskConfig = {
  low: { label: "Low Risk", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  medium: { label: "Medium Risk", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/20" },
  high: { label: "High Risk", color: "text-red-300", bg: "bg-red-500/10 border-red-500/20" },
};

export default function AIPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visaType, setVisaType] = useState<VisaType>("Spouse Visa");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const canSubmit = useMemo(() => details.trim().length >= 10, [details]);

  function startVoiceCapture() {
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser.");
      return;
    }

    setVoiceError("");
    setVoiceActive(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results[0]?.[0]?.transcript ?? "";
      if (spoken) setDetails((c) => c ? `${c} ${spoken}` : spoken);
      setVoiceActive(false);
    };

    recognition.onerror = (event) => {
      setVoiceError(`Voice input failed: ${event.error}`);
      setVoiceActive(false);
    };

    recognition.start();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    setSubmitError("");

    try {
      const response = await fetch("/api/ai/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, visaType, details }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data?.error ?? `Request failed (${response.status})`);
        return;
      }

      setResult(data as AISummary);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const risk = result ? riskConfig[result.risk] : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">AI Intake Assistant</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Instant{" "}
          <span className="text-gold-gradient">immigration case screening</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-(--ink-variant)">
          Share your case details and receive an instant summary with risk level, missing evidence indicators, and a recommended next step.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* ── Form ── */}
        <form onSubmit={onSubmit} className="surface-panel rounded-[1.75rem] p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <p className="label-md text-[#C9A84C]">Your information</p>
            <p className="mt-1 text-xs text-(--ink-variant)">All fields are optional except case details.</p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Name (optional)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2.5 text-sm"
              placeholder="Your name"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Email (optional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2.5 text-sm"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Visa type
            <select
              value={visaType}
              onChange={(e) => setVisaType(e.target.value as VisaType)}
              className="px-3 py-2.5 text-sm"
            >
              {visaOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Your case details
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="px-3 py-2.5 text-sm resize-none"
              placeholder="Share your timeline, current visa status, relationship details, employment, and key concerns…"
            />
            <span className={`text-xs ${canSubmit ? "text-emerald-400" : "text-(--ink-variant)"}`}>
              {details.trim().length} / 10+ characters required
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startVoiceCapture}
              disabled={voiceActive}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                voiceActive
                  ? "border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C] animate-pulse"
                  : "border-[rgba(201,168,76,0.25)] text-(--ink-variant) hover:border-[rgba(201,168,76,0.5)] hover:text-foreground"
              }`}
            >
              <span className="text-base">◎</span>
              {voiceActive ? "Listening…" : "Voice Input"}
            </button>
            {voiceError && <p className="text-xs text-red-400">{voiceError}</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Assessing…
              </span>
            ) : "Run AI Assessment"}
          </button>
        </form>

        {/* ── Result panel ── */}
        <section className="surface-panel rounded-[1.75rem] p-6 sm:p-8">
          <p className="label-md text-[#C9A84C]">Structured summary</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Your case assessment</h2>

          {submitError && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
              ✕ {submitError}
            </div>
          )}

          {!result ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-(--ink-variant)">Complete the form on the left to generate your case summary.</p>
              <p className="text-sm font-medium text-foreground mt-4">The report includes:</p>
              {[
                "Visa route context and eligibility notes",
                "Risk level indicator — low, medium, or high",
                "Missing evidence checklist for your route",
                "Recommendation to book consultation or send enquiry",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-(--ink-variant)">
                  <span className="mt-0.5 shrink-0 text-[#C9A84C]">◆</span>
                  {item}
                </div>
              ))}
              <div className="mt-6 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-xs text-(--ink-variant)">
                ◎ This AI screening is indicative only — it does not constitute legal advice.
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {/* Risk badge */}
              {risk && (
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${risk.bg} ${risk.color}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {risk.label}
                </div>
              )}

              <div className="surface-card p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-(--ink-variant)">Visa type</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{result.visa_type}</p>
                </div>
                <div className="divider-gold" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-(--ink-variant)">Summary</p>
                  <p className="mt-1 text-sm leading-6 text-(--ink-variant)">{result.summary}</p>
                </div>
              </div>

              <div className="surface-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-(--ink-variant)">Missing information</p>
                <ul className="mt-3 space-y-2">
                  {result.missing_info.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                      <span className="mt-0.5 shrink-0 text-[#C9A84C] text-xs">▷</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,30,56,0.9) 100%)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-(--ink-variant)">Recommendation</p>
                <p className="mt-2 text-sm font-semibold text-[#C9A84C]">{result.recommendation}</p>
              </div>

              <Link href="/consultation" className="btn-gold w-full text-center">
                Book Consultation
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
