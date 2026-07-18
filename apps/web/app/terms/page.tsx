export const metadata = {
  title: "Terms and Conditions — SHYN Legal",
  description: "Terms and conditions governing the use of SHYN Legal's immigration advisory services.",
};

const lastUpdated = "3 July 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">Legal</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Terms and <span className="text-gold-gradient">Conditions</span>
        </h1>
        <p className="mt-4 text-sm text-(--ink-variant)">
          Last updated: {lastUpdated}
        </p>
        <p className="mt-3 text-base leading-7 text-(--ink-variant)">
          Please read these Terms and Conditions carefully before using our website or engaging our services. By using our website or instructing us, you agree to be bound by these terms.
        </p>
      </section>

      {/* ── Content ── */}
      <div className="mt-8 space-y-6">

        <Section title="1. Who We Are">
          <p>
            SHYN Legal (<strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;us&rdquo;</strong>, <strong>&ldquo;our&rdquo;</strong>) is an immigration advisory firm operating from 25 Cabot Square, London E14 4QA. We provide immigration advice and related services in accordance with the Immigration Act 1971 and relevant UK immigration legislation.
          </p>
          <p className="mt-3">
            Contact: <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">info@shynlegal.co.uk</a> | <a href="tel:02034887525" className="text-[#C9A84C] hover:underline">020 3488 7525</a>
          </p>
        </Section>

        <Section title="2. Scope of Services">
          <p>Our services include but are not limited to:</p>
          <ul className="mt-3 space-y-1.5 list-none">
            {[
              "UK spouse, fiancé, and unmarried partner visa applications",
              "Student visa applications",
              "Skilled worker and health & care worker visa applications",
              "Visit visa applications",
              "Naturalisation and citizenship applications",
              "EU Settlement Scheme and EEA-related matters",
              "Ancestry visa and e-visa transition support",
              "AI-assisted case screening and eligibility assessment (indicative only)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                <span className="mt-1 shrink-0 text-[#C9A84C] text-xs">◆</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-(--ink-variant)">
            Our AI assessment tool provides indicative guidance only and does not constitute regulated immigration advice. You should always seek a formal consultation before making any application.
          </p>
        </Section>

        <Section title="3. Engagement and Instructions">
          <p>A formal advisory relationship begins only when we have confirmed acceptance of your instructions in writing. Submitting an enquiry or using our AI tool does not in itself create a client relationship.</p>
          <p className="mt-3">You agree to:</p>
          <ul className="mt-2 space-y-1.5 list-none">
            {[
              "Provide accurate, complete, and up-to-date information",
              "Disclose all relevant facts that may affect your application",
              "Notify us promptly of any changes to your circumstances",
              "Not knowingly provide false or misleading documents or information",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                <span className="mt-1 shrink-0 text-[#C9A84C] text-xs">◆</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-(--ink-variant)">
            We reserve the right to refuse or terminate an engagement if we believe instructions are being given in bad faith, or if providing further assistance would compromise our professional obligations.
          </p>
        </Section>

        <Section title="4. Fees and Payment">
          <p>
            Our fees are set out in the engagement letter provided at the outset of each matter. Fees are due in accordance with the payment schedule agreed in writing. We reserve the right to suspend services in the event of non-payment.
          </p>
          <p className="mt-3">
            All fees are stated in pounds sterling (GBP) and are inclusive of VAT where applicable. Disbursements (such as Home Office application fees, courier costs, or translation fees) are charged separately at cost.
          </p>
          <p className="mt-3">
            We do not guarantee the outcome of any visa application. Fees paid for services rendered are non-refundable unless otherwise agreed in writing.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, SHYN Legal shall not be liable for any indirect, consequential, or special loss arising out of or in connection with our services, including but not limited to refusal of a visa application by the Home Office or any other immigration authority.
          </p>
          <p className="mt-3">
            Our total liability to you in respect of any matter shall not exceed the total fees paid by you for the specific matter to which the claim relates.
          </p>
          <p className="mt-3">
            Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other matter for which it would be unlawful to limit or exclude liability.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content on this website, including text, graphics, logos, and AI-generated outputs provided to you in reports, is the intellectual property of SHYN Legal or our licensors. You may not reproduce, distribute, or commercially exploit any content without our prior written consent.
          </p>
        </Section>

        <Section title="7. Website Use">
          <p>You agree not to:</p>
          <ul className="mt-2 space-y-1.5 list-none">
            {[
              "Use the website in any unlawful manner or for any unlawful purpose",
              "Transmit any unsolicited or unauthorised advertising or promotional material",
              "Attempt to gain unauthorised access to any part of the website or its related systems",
              "Engage in any conduct that restricts or inhibits use of the website by others",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-(--ink-variant)">
                <span className="mt-1 shrink-0 text-[#C9A84C] text-xs">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="8. Data Protection">
          <p>
            We are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Please read our{" "}
            <a href="/privacy" className="text-[#C9A84C] hover:underline">Privacy Policy</a>{" "}
            for full details of how we collect, use, and protect your personal information.
          </p>
          <p className="mt-3">
            By submitting your personal data through our website or engagement forms, you acknowledge that we will process it in accordance with our Privacy Policy.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>
            We may revise these Terms and Conditions at any time. The date of the most recent revision is shown at the top of this page. Continued use of our website or services after any changes constitutes your acceptance of the new terms.
          </p>
        </Section>

        <Section title="11. Governing Law and Jurisdiction">
          <p>
            These Terms and Conditions are governed by the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
          <p className="mt-3">
            If you have a complaint about our services, please contact us at{" "}
            <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">info@shynlegal.co.uk</a>. We aim to resolve all complaints promptly and fairly.
          </p>
        </Section>

        <Section title="12. Contact">
          <div className="space-y-2 text-sm text-(--ink-variant)">
            <p><strong className="text-foreground">SHYN Legal</strong></p>
            <p>25 Cabot Square, London E14 4QA</p>
            <p>
              Email:{" "}
              <a href="mailto:info@shynlegal.co.uk" className="text-[#C9A84C] hover:underline">
                info@shynlegal.co.uk
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:02034887525" className="text-[#C9A84C] hover:underline">
                020 3488 7525
              </a>
            </p>
          </div>
        </Section>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="surface-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-(--ink-variant)">{children}</div>
    </article>
  );
}
