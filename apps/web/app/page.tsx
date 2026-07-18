"use client";

import Link from "next/link";
import { CSSProperties, MouseEvent, useEffect, useMemo, useState } from "react";
import { serviceCards } from "./lib/domain";

type Slide = {
  image: string;
  strap: string;
  title: string;
  emphasis: string;
  description: string;
};

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=80",
    strap: "Beside You Every Step",
    title: "Your Rights, Our",
    emphasis: "Commitment",
    description:
      "At SHYN Legal we safeguard your immigration journey with unwavering dedication and the highest professional standards.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1800&q=80",
    strap: "Trusted UK Immigration Advisors",
    title: "Turning Complexity Into",
    emphasis: "Clarity",
    description:
      "We understand immigration law can feel overwhelming. Our team transforms complexity into a clear strategy and practical next steps.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1800&q=80",
    strap: "Evidence-Led · Regulatory-First",
    title: "Finest UK",
    emphasis: "Immigration Services",
    description:
      "We only proceed when your evidence portfolio is complete, coherent, and positioned to meet UK immigration requirements.",
  },
];

const stats = [
  { value: "500+", label: "Cases handled" },
  { value: "5★", label: "Average rating" },
  { value: "27+", label: "Verified reviews" },
  { value: "98%", label: "Client satisfaction" },
];

const serviceIcons: Record<string, string> = {
  "Spouse, fiance, and unmarried partner visas": "♥",
  "Student visas": "◎",
  "Skilled worker and health & care worker visas": "◈",
  "Visit visas": "✦",
  "Naturalisation and citizenship": "★",
  "Ancestry, EEA, e-visa and other complex routes": "◉",
};

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardStyles, setCardStyles] = useState<Record<string, CSSProperties>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((p) => (p + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const current = useMemo(() => slides[activeSlide], [activeSlide]);

  function goNext() { setActiveSlide((p) => (p + 1) % slides.length); }
  function goPrev() { setActiveSlide((p) => (p - 1 + slides.length) % slides.length); }

  function onCardMove(e: MouseEvent<HTMLElement>, key: string) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rX = (0.5 - y) * 6;
    const rY = (x - 0.5) * 6;
    const gX = clamp(x * 100, 8, 92);
    const gY = clamp(y * 100, 8, 92);
    setCardStyles((p) => ({
      ...p,
      [key]: {
        transform: `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`,
        backgroundImage: `radial-gradient(circle at ${gX}% ${gY}%, rgba(201,168,76,0.22), rgba(15,30,58,0.96) 45%), linear-gradient(155deg, var(--surface-card) 0%, var(--surface-container-high) 100%)`,
        borderColor: "rgba(201,168,76,0.38)",
        boxShadow: "0 8px 40px rgba(201,168,76,0.1)",
      },
    }));
  }

  function resetCard(key: string) {
    setCardStyles((p) => ({
      ...p,
      [key]: {
        transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)",
        backgroundImage: "linear-gradient(155deg, var(--surface-card) 0%, var(--surface-container-high) 100%)",
        borderColor: "rgba(201,168,76,0.13)",
        boxShadow: "none",
      },
    }));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">

      {/* ── Hero Slider ── */}
      <section
        className="mt-6 overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.2)] shadow-[0_0_80px_rgba(201,168,76,0.06)]"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(1,6,16,0.92) 0%, rgba(7,18,36,0.70) 45%, rgba(7,18,36,0.40) 100%), url(${current.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.6s ease",
        }}
      >
        <div className="grid gap-6 px-5 py-12 sm:px-9 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="label-md text-[#C9A84C]">{current.strap}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {current.title}{" "}
              <span className="text-gold-gradient">{current.emphasis}</span>
            </h1>
            <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
              {current.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/services" className="btn-gold">
                Our Services
              </Link>
              <Link href="/consultation" className="btn-ghost">
                Book Consultation
              </Link>
            </div>
          </div>

          {/* Slide controls */}
          <div className="flex flex-row gap-3 self-center md:flex-col">
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.1)] text-xl text-[#C9A84C] transition hover:bg-[rgba(201,168,76,0.2)]"
            >
              ›
            </button>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.1)] text-xl text-[#C9A84C] transition hover:bg-[rgba(201,168,76,0.2)]"
            >
              ‹
            </button>
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex gap-2 px-5 pb-6 sm:px-9">
          {slides.map((slide, idx) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeSlide
                  ? "w-8 bg-[#C9A84C]"
                  : "w-4 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="surface-card flex flex-col items-center py-5 px-3 text-center"
          >
            <p className="text-2xl font-bold text-gold-gradient sm:text-3xl">{stat.value}</p>
            <p className="mt-1.5 text-xs text-(--ink-variant)">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ── Services ── */}
      <section className="mt-14">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-md text-[#C9A84C]">What we do</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Immigration services we support
            </h2>
          </div>
          <p className="hidden text-xs text-(--ink-variant) sm:block">
            Hover cards for interactive details
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((service) => {
            const style = cardStyles[service.title] ?? {
              transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)",
            };
            return (
              <article
                key={service.title}
                className="surface-card p-5 transition-all duration-200"
                style={style}
                onMouseMove={(e) => onCardMove(e, service.title)}
                onMouseLeave={() => resetCard(service.title)}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl text-[#C9A84C] opacity-75">
                    {serviceIcons[service.title] ?? "◆"}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-(--ink-variant)">
                      {service.summary}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-(--ink-variant)">
                      {service.detail}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mt-14">
        <div>
          <p className="label-md text-[#C9A84C]">Our process</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            How SHYN Legal works
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "01", text: "Send us your enquiry or book a consultation directly through our website" },
            { step: "02", text: "We review your case details and assess your eligibility and route options" },
            { step: "03", text: "Build a route-specific evidence plan with our legal advisory team" },
            { step: "04", text: "Proceed confidently with guided consultation and submission support" },
          ].map(({ step, text }) => (
            <article
              key={step}
              className="surface-card group p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.38)]"
            >
              <p className="font-mono-ui text-2xl font-bold text-[rgba(201,168,76,0.35)] group-hover:text-[rgba(201,168,76,0.6)] transition-colors">
                {step}
              </p>
              <p className="mt-3 text-sm leading-6 text-(--ink-variant)">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="mt-14 mb-2 rounded-[1.75rem] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,30,56,0.9) 50%, rgba(107,159,212,0.08) 100%)",
          border: "1px solid rgba(201,168,76,0.25)",
        }}
      >
        <div className="px-6 py-10 sm:px-10">
          <p className="label-md text-[#C9A84C]">Ready to start?</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Move your case forward today
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-(--ink-variant) sm:text-base">
            Book a consultation directly for one-to-one advisory support, or send us an enquiry and we will be in touch as soon as we can.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/consultation" className="btn-gold">
              Book Consultation
            </Link>
            <Link href="/contact" className="btn-ghost">
              Send an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
