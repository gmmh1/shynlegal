import Link from "next/link";
import { serviceCards } from "../lib/domain";

const icons: Record<string, string> = {
  "Spouse, fiance, and unmarried partner visas": "♥",
  "Student visas": "◎",
  "Skilled worker and health & care worker visas": "◈",
  "Visit visas": "✦",
  "Naturalisation and citizenship": "★",
  "Ancestry, EEA, e-visa and other complex routes": "◉",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Our Services</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Strategic immigration support across{" "}
          <span className="text-gold-gradient">major UK visa routes</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-(--ink-variant) sm:text-lg">
          From partner and family applications to skilled migration and citizenship pathways, we offer detailed advisory support built around your circumstances and evidence profile.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/consultation" className="btn-gold">Book Consultation</Link>
          <Link href="/contact" className="btn-ghost">Send an Enquiry</Link>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCards.map((service, idx) => (
          <article
            key={service.title}
            className="surface-card group flex flex-col p-6"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Icon + number */}
            <div className="flex items-center justify-between">
              <span className="text-2xl text-[#C9A84C] opacity-80 group-hover:opacity-100 transition-opacity">
                {icons[service.title] ?? "◆"}
              </span>
              <span className="font-mono-ui text-xs text-[rgba(201,168,76,0.35)] group-hover:text-[rgba(201,168,76,0.6)] transition-colors">
                0{idx + 1}
              </span>
            </div>

            <h2 className="mt-4 text-base font-semibold text-foreground group-hover:text-[#C9A84C] transition-colors">
              {service.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-(--ink-variant) flex-1">
              {service.summary}
            </p>
            <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
              {service.detail}
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Get route guidance
              <span className="text-base leading-none">→</span>
            </Link>
          </article>
        ))}
      </section>

      {/* ── Why us ── */}
      <section className="mt-12 surface-panel rounded-[1.75rem] p-6 sm:p-10">
        <p className="label-md text-[#C9A84C]">Why SHYN Legal</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          Evidence-first. Client-focused. Regulatory-compliant.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { icon: "◎", title: "Complete evidence portfolios", text: "We only proceed when your evidence is complete, coherent, and positioned to meet UKVI requirements." },
            { icon: "◈", title: "Route-specific strategy", text: "Every application is built around your individual route, timeline, and personal circumstances." },
            { icon: "★", title: "Risk-aware advisory", text: "We identify and address risk factors before submission — minimising avoidable refusals." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-xl text-[#C9A84C]">{item.icon}</span>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-(--ink-variant)">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="mt-8 rounded-3xl px-6 py-9 sm:px-10"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(13,30,56,0.85) 100%)",
          border: "1px solid rgba(201,168,76,0.22)",
        }}
      >
        <p className="label-md text-[#C9A84C]">Ready to begin?</p>
        <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
          Not sure which route applies to you?
        </h2>
        <p className="mt-3 text-sm leading-7 text-(--ink-variant)">
          Use our AI assessment tool for an instant eligibility snapshot, or book a consultation to speak directly with our advisory team.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/consultation" className="btn-gold">Book Consultation</Link>
          <Link href="/contact" className="btn-ghost">Send an Enquiry</Link>
        </div>
      </section>
    </main>
  );
}
