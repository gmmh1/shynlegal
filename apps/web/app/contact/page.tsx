"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const visaTypes = [
  "Spouse Visa",
  "Student Visa",
  "Skilled Worker Visa",
  "Visit Visa",
  "Citizenship",
  "Other",
];

const contactDetails = [
  { icon: "✉", label: "Email", value: "info@shynlegal.co.uk", href: "mailto:info@shynlegal.co.uk" },
  { icon: "✆", label: "Phone", value: "020 3488 7525", href: "tel:02034887525" },
  { icon: "◎", label: "Address", value: "25 Cabot Sq, London E14 4QA", href: "https://maps.google.com/?q=25+Cabot+Square+London+E14+4QA" },
  { icon: "◷", label: "Response time", value: "As soon as we can", href: null },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      visaType: String(formData.get("visaType") || ""),
      message: String(formData.get("message") || ""),
      acceptedTerms: formData.get("acceptedTerms") === "on",
      acceptedPrivacy: formData.get("acceptedPrivacy") === "on",
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("success");
      event.currentTarget.reset();
      return;
    }

    setStatus("error");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Contact Us</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Speak with our{" "}
          <span className="text-gold-gradient">immigration advisory team</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-(--ink-variant)">
          Submit your enquiry and we will review your case context, route type, and next-step requirements as soon as we can.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* ── Form ── */}
        <form onSubmit={onSubmit} className="surface-panel rounded-[1.75rem] p-6 sm:p-8">
          <p className="label-md text-[#C9A84C]">Send an enquiry</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Your details</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Full name
              <input
                required
                name="name"
                type="text"
                placeholder="Your full name"
                className="px-3 py-2.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              Email address
              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
                className="px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Visa type
            <select name="visaType" required className="px-3 py-2.5 text-sm">
              {visaTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Your message
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Share your situation, timeline, and any questions..."
              className="px-3 py-2.5 text-sm resize-none"
            />
          </label>

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
              <input type="checkbox" name="acceptedTerms" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
              <span className="group-hover:text-foreground transition-colors">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-[#C9A84C] underline underline-offset-2 hover:brightness-125">
                  Terms and Conditions
                </Link>.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-(--ink-variant) cursor-pointer group">
              <input type="checkbox" name="acceptedPrivacy" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]" />
              <span className="group-hover:text-foreground transition-colors">
                I agree to the{" "}
                <Link href="/privacy" target="_blank" className="text-[#C9A84C] underline underline-offset-2 hover:brightness-125">
                  Privacy Policy
                </Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-gold mt-6 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending…" : "Submit Enquiry"}
          </button>

          {status === "success" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
              <span>✓</span> Thanks — your enquiry was submitted successfully.
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
              <span>✕</span> Could not submit your enquiry. Please check required fields.
            </div>
          )}
        </form>

        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-4">
          {contactDetails.map((item) => (
            <div key={item.label} className="surface-card p-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl text-[#C9A84C]">{item.icon}</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--ink-variant)">{item.label}</p>
              </div>
              {item.href ? (
                <a href={item.href} className="mt-2 block text-sm font-medium text-foreground hover:text-[#C9A84C] transition-colors">
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
              )}
            </div>
          ))}

          {/* Alternative CTA */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.13) 0%, rgba(13,30,56,0.9) 100%)",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            <p className="text-sm font-semibold text-foreground">Prefer to speak directly?</p>
            <p className="mt-2 text-sm text-(--ink-variant) leading-6">Book a consultation and speak directly with our immigration advisor.</p>
            <a href="/consultation" className="btn-gold mt-4 w-full text-center text-[13px]">
              Book Consultation
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
