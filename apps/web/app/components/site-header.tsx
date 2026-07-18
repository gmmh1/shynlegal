"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(201,168,76,0.15)] bg-[#010610]/95 backdrop-blur-xl">
      {/* Gold accent line */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#C9A84C] to-transparent opacity-50" />

      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.png"
              alt="SHYN Legal"
              width={36}
              height={43}
              loading="eager"
              priority
              className="drop-shadow-[0_0_8px_rgba(201,168,76,0.4)] transition group-hover:drop-shadow-[0_0_14px_rgba(201,168,76,0.65)]"
            />
            <span className="text-[15px] font-semibold tracking-tight text-foreground transition group-hover:text-[#C9A84C]">
              SHYN Legal
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-[rgba(201,168,76,0.13)] text-[#C9A84C]"
                      : "text-(--ink-variant) hover:bg-[rgba(201,168,76,0.07)] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/consultation" className="btn-gold hidden sm:inline-flex text-[13px]">
              Book Consultation
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.25 w-10 h-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.22)] transition hover:bg-[rgba(201,168,76,0.07)]"
            >
              <span className={`h-[1.5px] w-5 bg-[#C9A84C] rounded transition-all origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-[#C9A84C] rounded transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-[#C9A84C] rounded transition-all origin-center ${menuOpen ? "-rotate-45 translate-y-[-6.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(201,168,76,0.12)] bg-[#010610]/98 backdrop-blur-xl">
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[rgba(201,168,76,0.13)] text-[#C9A84C]"
                      : "text-(--ink-variant) hover:bg-[rgba(201,168,76,0.07)] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/consultation"
              onClick={() => setMenuOpen(false)}
              className="btn-gold mt-2 w-full text-center"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
