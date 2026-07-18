export const metadata = {
  title: "Privacy Policy — SHYN Legal",
  description: "How SHYN Legal collects, uses, and protects your personal data under UK GDPR and the Data Protection Act 2018.",
};

const lastUpdated = "3 July 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Legal</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Privacy <span className="text-gold-gradient">Policy</span>
        </h1>
        <p className="mt-4 text-sm text-(--ink-variant)">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-3 text-base leading-7 text-(--ink-variant)">
          SHYN Legal is committed to protecting your privacy and personal data. This policy explains how we collect, use, store, and share your information in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
      </section>

      {/* ── Quick reference ── */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "◎", title: "Data Controller", text: "SHYN Legal, 25 Cabot Sq, London E14 4QA" },
          { icon: "✉", title: "Data Enquiries", text: "info@shynlegal.co.uk" },
          { icon: "★", title: "Supervisory Authority", text: "Information Commissioner's Office (ICO)" },
        ].map((item) => (
          <div key={item.title} className="surface-card flex gap-3 p-4">
            <span className="mt-0.5 shrink-0 text-xl text-[#C9A84C]">{item.icon}</span>
            <div>
              <p className="text-xs font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs text-(--ink-variant) leading-5">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Content ── */}
      <div className="mt-6 space-y-5">

        <Section title="1. Who We Are (Data Controller)">
          <p>
            The data controller responsible for your personal data is:
          </p>
          <div className="mt-3 surface-card p-4 text-sm text-(--ink-variant) space-y-1">
            <p><strong className="text-foreground">SHYN Legal</strong></p>
            <p>25 Cabot Square, London E14 4QA, United Kingdom</p>
            <p>Email: <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">info@shynlegal.co.uk</a></p>
            <p>Phone: <a href="tel:02034887525" className="text-[#C9A84C] hover:underline">020 3488 7525</a></p>
          </div>
        </Section>

        <Section title="2. Personal Data We Collect">
          <p>Depending on how you interact with us, we may collect the following categories of personal data:</p>

          <div className="mt-4 space-y-3">
            <DataCategory
              title="Identity data"
              items={["Full name", "Date of birth (where required for immigration purposes)", "Nationality and immigration status"]}
            />
            <DataCategory
              title="Contact data"
              items={["Email address", "Phone number", "Postal address"]}
            />
            <DataCategory
              title="Case and immigration data"
              items={["Visa type and immigration history", "Passport and travel document details", "Relationship and employment evidence submitted as part of an application"]}
            />
            <DataCategory
              title="Technical data"
              items={["IP address", "Browser type and version", "Pages visited and time spent on the website", "Device identifiers"]}
            />
            <DataCategory
              title="AI assessment data"
              items={["Case details submitted through the AI intake tool", "Visa type selected", "Free-text description of your circumstances"]}
            />
            <DataCategory
              title="Communications data"
              items={["Email and message content sent to us", "Enquiry form submissions", "Records of telephone conversations (where noted)"]}
            />
          </div>

          <p className="mt-4 text-sm text-(--ink-variant)">
            We do not intentionally collect special category data (e.g. health, biometric, or racial/ethnic data) except where strictly necessary for the immigration application you instruct us to assist with, and only with your explicit consent.
          </p>
        </Section>

        <Section title="3. How We Collect Your Data">
          <ul className="space-y-2 list-none">
            {[
              "Directly from you — via our contact form, AI assessment tool, telephone, email, or in-person",
              "Automatically — through cookies and analytics tools when you visit our website",
              "From third parties — from review platforms (Google, Facebook) where you have left a public review of our services",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                <span className="mt-1 shrink-0 text-[#C9A84C] text-xs">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4. Legal Basis for Processing (UK GDPR Article 6)">
          <p className="mb-3">We only process your personal data where we have a lawful basis to do so:</p>
          <div className="space-y-3">
            {[
              {
                basis: "Contract performance (Art. 6(1)(b))",
                use: "To provide immigration advisory services you have instructed us to carry out.",
              },
              {
                basis: "Legitimate interests (Art. 6(1)(f))",
                use: "To operate and improve our website, prevent fraud, manage our business, and send service-related communications.",
              },
              {
                basis: "Legal obligation (Art. 6(1)(c))",
                use: "To comply with anti-money laundering regulations, HMRC requirements, and other statutory obligations.",
              },
              {
                basis: "Consent (Art. 6(1)(a))",
                use: "For marketing communications, optional cookies, and processing special category data (where required). You may withdraw consent at any time.",
              },
            ].map((item) => (
              <div key={item.basis} className="surface-card p-4 text-sm">
                <p className="font-semibold text-[#C9A84C]">{item.basis}</p>
                <p className="mt-1 text-(--ink-variant) leading-6">{item.use}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="5. How We Use Your Data">
          <ul className="space-y-2 list-none">
            {[
              "To respond to enquiries and provide immigration advice and representation",
              "To prepare and submit visa applications on your behalf",
              "To manage your case and maintain accurate records",
              "To send appointment confirmations and case updates",
              "To conduct AI-assisted eligibility screening (indicative only)",
              "To comply with our legal and regulatory obligations",
              "To manage, improve, and secure our website and systems",
              "To generate anonymised analytics for business purposes",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                <span className="mt-1 shrink-0 text-[#C9A84C] text-xs">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="6. Sharing Your Personal Data">
          <p>We do not sell your personal data. We may share it with:</p>
          <div className="mt-3 space-y-3">
            {[
              {
                party: "Home Office / UKVI",
                reason: "As required to submit your visa application.",
              },
              {
                party: "Technology service providers",
                reason: "Cloud hosting, database, email, and scheduling tools (all bound by data processing agreements).",
              },
              {
                party: "AI processing services",
                reason: "Our self-hosted AI system processes case descriptions locally. Where third-party AI tools are used, they are bound by data processing agreements.",
              },
              {
                party: "Professional advisors",
                reason: "Accountants, legal counsel, or insurers, where necessary and under strict confidentiality.",
              },
              {
                party: "Regulatory bodies",
                reason: "ICO, HMRC, or law enforcement where we are legally obliged to disclose.",
              },
            ].map((item) => (
              <div key={item.party} className="surface-card p-4 text-sm">
                <p className="font-semibold text-foreground">{item.party}</p>
                <p className="mt-1 text-(--ink-variant) leading-6">{item.reason}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="7. International Transfers">
          <p>
            We primarily process your data within the United Kingdom. Where data is transferred outside the UK, we ensure appropriate safeguards are in place, such as UK adequacy regulations or standard contractual clauses approved by the ICO, in compliance with UK GDPR Chapter V.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>We retain your personal data only for as long as necessary for the purposes set out in this policy:</p>
          <div className="mt-3 space-y-2">
            {[
              { category: "Client case files", period: "6 years from the conclusion of the matter (to comply with limitation periods)" },
              { category: "Enquiry and contact form data", period: "2 years from date of submission" },
              { category: "AI assessment data", period: "12 months from submission" },
              { category: "Website analytics data", period: "26 months (standard analytics retention)" },
              { category: "Financial and billing records", period: "7 years (HMRC requirement)" },
            ].map((item) => (
              <div key={item.category} className="surface-card flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-foreground">{item.category}</span>
                <span className="text-(--ink-variant) text-xs sm:text-right">{item.period}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="9. Your Rights Under UK GDPR">
          <p className="mb-3">You have the following rights regarding your personal data:</p>
          <div className="space-y-3">
            {[
              { right: "Right of access (Art. 15)", desc: "You may request a copy of the personal data we hold about you (a Subject Access Request)." },
              { right: "Right to rectification (Art. 16)", desc: "You may ask us to correct inaccurate or incomplete personal data." },
              { right: "Right to erasure (Art. 17)", desc: "You may ask us to delete your data where there is no longer a legal or legitimate basis for processing it." },
              { right: "Right to restriction of processing (Art. 18)", desc: "You may ask us to pause processing your data in certain circumstances." },
              { right: "Right to data portability (Art. 20)", desc: "You may request your data in a structured, machine-readable format where processing is based on consent or contract." },
              { right: "Right to object (Art. 21)", desc: "You may object to processing based on legitimate interests or for direct marketing." },
              { right: "Rights related to automated decision-making (Art. 22)", desc: "You have the right not to be subject to decisions based solely on automated processing that produce legal or similarly significant effects. Our AI tool is indicative only and does not make binding decisions." },
              { right: "Right to withdraw consent", desc: "Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of processing before withdrawal." },
            ].map((item) => (
              <div key={item.right} className="surface-card p-4 text-sm">
                <p className="font-semibold text-[#C9A84C]">{item.right}</p>
                <p className="mt-1 text-(--ink-variant) leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-(--ink-variant)">
            To exercise any of these rights, please email us at{" "}
            <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">info@shynlegal.co.uk</a>.
            We will respond within one month of receipt. We may need to verify your identity before fulfilling a request.
          </p>
        </Section>

        <Section title="10. Cookies">
          <p>
            Our website uses cookies to improve your experience and analyse traffic. Cookies are small text files placed on your device.
          </p>
          <div className="mt-3 space-y-2">
            {[
              { type: "Strictly necessary cookies", desc: "Required for the website to function. These cannot be disabled." },
              { type: "Analytics cookies", desc: "Help us understand how visitors use our website. These are only set with your consent." },
              { type: "Functional cookies", desc: "Remember your preferences such as language or region settings." },
            ].map((item) => (
              <div key={item.type} className="surface-card p-4 text-sm">
                <p className="font-semibold text-foreground">{item.type}</p>
                <p className="mt-1 text-(--ink-variant) leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-(--ink-variant)">
            You can manage your cookie preferences in your browser settings. Blocking certain cookies may affect website functionality.
          </p>
        </Section>

        <Section title="11. Right to Lodge a Complaint">
          <p>
            If you believe we have not handled your personal data lawfully, you have the right to lodge a complaint with the UK supervisory authority:
          </p>
          <div className="mt-3 surface-card p-4 text-sm text-(--ink-variant) space-y-1">
            <p><strong className="text-foreground">Information Commissioner&apos;s Office (ICO)</strong></p>
            <p>Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
            <p>Website: <span className="text-[#C9A84C]">ico.org.uk</span></p>
            <p>Helpline: 0303 123 1113</p>
          </div>
          <p className="mt-3 text-sm text-(--ink-variant)">
            We would, however, appreciate the opportunity to address your concerns before you contact the ICO. Please contact us first at{" "}
            <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">info@shynlegal.co.uk</a>.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. The date of the most recent revision appears at the top of this page. We encourage you to review this page periodically. Continued use of our website or services after any changes constitutes acknowledgement of the updated policy.
          </p>
        </Section>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="surface-panel rounded-[1.25rem] p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-(--ink-variant)">{children}</div>
    </article>
  );
}

function DataCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-card p-4">
      <p className="text-sm font-semibold text-foreground capitalize">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
            <span className="mt-1 shrink-0 text-[#C9A84C] text-[10px]">▷</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
