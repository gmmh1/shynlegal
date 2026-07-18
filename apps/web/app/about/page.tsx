const pillars = [
  {
    icon: "♥",
    title: "Compassionate guidance",
    text: "Empathetic support for partner and family migration routes, treating every case with care.",
  },
  {
    icon: "◎",
    title: "Meticulous preparation",
    text: "Detailed case preparation aligned precisely to UK immigration requirements and UKVI standards.",
  },
  {
    icon: "◈",
    title: "Personalised strategy",
    text: "Legal strategy designed around each applicant's unique goals, circumstances, and evidence.",
  },
  {
    icon: "★",
    title: "Risk reduction",
    text: "Risk minimisation through evidence-focused advisory support before every submission.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">

      {/* ── Hero ── */}
      <section className="hero-panel rounded-[1.75rem] px-5 py-12 sm:px-10">
        <p className="label-md text-[#C9A84C]">About Us</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          SHYN Legal — your trusted{" "}
          <span className="text-gold-gradient">immigration advisory firm</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-(--ink-variant) sm:text-lg">
          We specialise in UK visa and immigration services, providing expert assistance in navigating the complex immigration process with confidence and clarity.
        </p>
      </section>

      {/* ── Who we are ── */}
      <section className="mt-8 surface-panel rounded-[1.25rem] p-6 sm:p-10">
        <p className="label-md text-[#C9A84C]">Who we are</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          A dedicated UK immigration firm
        </h2>
        <div className="mt-6 space-y-5 text-sm leading-8 text-(--ink-variant) sm:text-base">
          <p>
            We are a dedicated immigration firm specialising in a wide range of UK visa and immigration services. Our expertise lies in handling UK spouse visas, fiancé visas, and unmarried partner visas, providing compassionate and professional guidance for individuals seeking to reunite with their loved ones. With a deep understanding of the complexities involved, we work tirelessly to ensure your application is prepared to the highest standard, giving you the best chance of success.
          </p>
          <p>
            In addition to family-related visas, we have extensive experience with student visas, skilled worker visas, and health and care worker visas, assisting individuals and professionals in building their futures in the UK. Our services also extend to visit visas, naturalisation, citizenship applications, ancestry visas, EEA migrants, and e-visas. Whatever your immigration needs, our team brings detailed knowledge, precision, and a personalised approach to every case.
          </p>
          <p>
            We take pride in delivering meticulous, client-focused service, ensuring that your portfolio of evidence meets the strict requirements of UK immigration rules. By carefully tailoring our advice to your unique circumstances, we aim to minimise risks and guide you through the immigration process with confidence and clarity.
          </p>
          <p>
            At the core of our mission is a commitment to empowering our clients, protecting their rights, and achieving their immigration goals. Whether you are pursuing a family visa, planning to study or work in the UK, or looking to secure your citizenship, we are here to provide you with the expertise, dedication, and support you need every step of the way.
          </p>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="mt-8">
        <p className="label-md text-[#C9A84C]">Our values</p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          What sets us apart
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="surface-card flex gap-4 p-5">
              <span className="mt-0.5 text-xl text-[#C9A84C] shrink-0">{pillar.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{pillar.title}</p>
                <p className="mt-2 text-sm leading-6 text-(--ink-variant)">{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="mt-10 rounded-3xl px-6 py-9 sm:px-10"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(13,30,56,0.8) 100%)",
          border: "1px solid rgba(201,168,76,0.22)",
        }}
      >
        <p className="label-md text-[#C9A84C]">Start your journey</p>
        <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
          Ready to discuss your case?
        </h2>
        <p className="mt-3 text-sm leading-7 text-(--ink-variant)">
          Book a consultation or send us an enquiry and we will be in touch as soon as we can.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/consultation" className="btn-gold">Book Consultation</a>
          <a href="/contact" className="btn-ghost">Send an Enquiry</a>
        </div>
      </section>
    </main>
  );
}
