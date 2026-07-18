import Image from "next/image";
import Link from "next/link";

const serviceLinks = [
  "Spouse & Family Visas",
  "Student Visas",
  "Skilled Worker Visas",
  "Visit Visas",
  "Naturalisation & Citizenship",
  "EU Settlement Scheme",
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/reviews", label: "Client Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/consultation", label: "Book Consultation" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(201,168,76,0.12)]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-8 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="SHYN Legal" width={32} height={38} />
              <span className="text-[15px] font-semibold text-foreground">SHYN Legal</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-(--ink-variant)">
              Trusted UK immigration advisory support for families, professionals, and students. Evidence-led, client-focused, regulatory-first.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="mailto:info@shynlegal.co.uk"
                className="inline-flex items-center gap-2 text-xs text-(--ink-variant) hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-[#C9A84C]">✉</span>
                info@shynlegal.co.uk
              </a>
              <a
                href="tel:02034887525"
                className="inline-flex items-center gap-2 text-xs text-(--ink-variant) hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-[#C9A84C]">✆</span>
                020 3488 7525
              </a>
              <p className="inline-flex items-start gap-2 text-xs text-(--ink-variant)">
                <span className="text-[#C9A84C] mt-px">◎</span>
                25 Cabot Sq, London E14 4QA
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="label-md text-[#C9A84C]">Services</p>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((name) => (
                <li key={name}>
                  <Link href="/services" className="text-sm text-(--ink-variant) hover:text-[#C9A84C] transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label-md text-[#C9A84C]">Company</p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-(--ink-variant) hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-10" />

        <div className="mt-6 flex flex-col gap-3 text-xs text-(--ink-variant) sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SHYN Legal. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-[#C9A84C] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-[#C9A84C] transition-colors">
              Privacy Policy
            </Link>
            <span className="font-mono-ui tracking-[0.06em] text-[10px]">
              Regulatory-first · Evidence-led
            </span>
            <Image src="/IAA-logo.png" alt="IAA" width={60} height={30} className="opacity-80" />
          </div>
        </div>
      </div>
    </footer>
  );
}
