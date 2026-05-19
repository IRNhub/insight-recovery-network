import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import craigImg from "@assets/craig-bilton-founder-crop-4x5_1779191279403.jpg";
import heroImg from "@assets/About_US_Hero_1779191456783.png";

const trustPoints = [
  "20+ years' international addiction treatment experience",
  "UK-based, online-first recovery support",
  "Private treatment placement guidance",
  "Family intervention and relapse prevention planning",
];

const whatWeHelpWith = [
  { label: "Alcohol and drug addiction concerns", href: "/assessments/alcohol-use" },
  { label: "Cocaine and stimulant use", href: "/assessments/drug-use" },
  { label: "Private rehab and detox decisions", href: "/treatment-placement" },
  { label: "Treatment placement in the UK and internationally", href: "/treatment-placement" },
  { label: "Family intervention and crisis guidance", href: "/what-we-offer" },
  { label: "Online addiction recovery support", href: "/online-programme" },
  { label: "Relapse prevention and aftercare planning", href: "/online-programme" },
  { label: "Mental health and dual-diagnosis considerations", href: "/assessments/anxiety" },
];

const howWeWork = [
  {
    n: "1",
    title: "Confidential consultation",
    body: "You speak with us in complete confidence. There is no pressure, no obligation, and no need to have everything worked out before making contact.",
  },
  {
    n: "2",
    title: "Clinical picture and needs assessment",
    body: "We take time to understand the full picture — substance use, mental health, history, risk, family context, and practical circumstances — before making any recommendation.",
  },
  {
    n: "3",
    title: "Treatment or support recommendation",
    body: "Based on what we learn, we make a clear, honest recommendation about the most appropriate level and type of support — whether that is online recovery, residential treatment, or family guidance.",
  },
  {
    n: "4",
    title: "Ongoing recovery planning",
    body: "We look beyond the immediate step. Recovery requires continuity, and we help plan the structure, tools, and support needed to protect long-term progress.",
  },
];

const values = [
  {
    title: "Confidentiality",
    body: "We protect privacy fiercely, ensuring that individuals and families can seek help safely and without fear of disclosure.",
  },
  {
    title: "Dignity",
    body: "We treat every individual with profound respect, regardless of the severity or nature of their situation.",
  },
  {
    title: "Clarity",
    body: "We provide clear, honest guidance devoid of false promises, jargon, or unnecessary complexity.",
  },
  {
    title: "Continuity",
    body: "We look beyond acute intervention, focusing on sustainable, long-term recovery support and aftercare.",
  },
  {
    title: "Practical Support",
    body: "We offer tangible tools and structured guidance — not just abstract concepts or generic advice.",
  },
];

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Insight Recovery Network"
        fullTitle="About Insight Recovery Network | Private Addiction Recovery Support"
        description="Learn about Insight Recovery Network, founded by Craig Bilton, providing discreet addiction recovery support, treatment placement guidance, family intervention, and online recovery programmes."
        canonical="/about"
      />

      {/* ── Hero — two-column ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.18)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22,43,59,0.055) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.45) 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14 py-12 md:py-16 lg:py-20">

            {/* Left — copy */}
            <div className="lg:w-[52%]">
              <span className="text-[9.5px] font-semibold tracking-[0.22em] uppercase text-accent/70 font-sans block mb-5">
                About Insight Recovery Network
              </span>
              <h1
                className="font-serif text-primary leading-[1.08] tracking-tight mb-5"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.6rem)" }}
              >
                Discreet addiction recovery support for individuals and families navigating complex treatment decisions.
              </h1>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Insight Recovery Network provides confidential guidance for people facing addiction, mental health, treatment placement, relapse risk, and family crisis situations. We help individuals and families understand the options, make informed decisions, and access the right level of support.
              </p>
            </div>

            {/* Right — consultation image */}
            <div className="lg:flex-1 min-w-0">
              <div
                className="relative w-full overflow-hidden rounded-xl"
                style={{
                  aspectRatio: "4/3",
                  boxShadow: "0 12px 40px -8px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                }}
              >
                <img
                  src={heroImg}
                  alt="A calm private consultation setting with a notebook, pen, and glass of water on a warm neutral desk"
                  className="w-full h-full object-cover object-center"
                  fetchPriority="high"
                  loading="eager"
                />
                {/* Subtle warm vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(242,237,227,0.12) 0%, transparent 50%)",
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Credibility strip ── */}
      <section className="border-b border-border/30 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/25">
            {trustPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-4 px-0 sm:px-6 first:sm:pl-0 last:sm:pr-0"
              >
                <div
                  className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A96E" }} />
                </div>
                <p className="text-[13px] text-primary/75 font-light leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why IRN exists ── */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-5">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-3">
                Why we exist
              </span>
              <h2 className="font-serif text-primary text-[1.75rem] md:text-[2rem] leading-tight">
                Why Insight Recovery Network exists
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-4">
                Addiction and mental health crises rarely arrive neatly. Families are often left trying to make urgent decisions while overwhelmed, frightened, or unsure who to trust. Insight Recovery Network was created to bring clarity, dignity, and clinical judgement into that process.
              </p>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                We help people understand what level of support is needed, whether that means structured online recovery support, private detox, residential treatment, family intervention, relapse prevention planning, or longer-term recovery guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clinical approach ── */}
      <section
        className="py-10 md:py-14"
        style={{ background: "rgba(246,244,240,0.6)", borderTop: "1px solid rgba(201,169,110,0.10)", borderBottom: "1px solid rgba(201,169,110,0.10)" }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="w-8 h-px mb-5" style={{ background: "#C9A96E" }} />
              <h2 className="font-serif text-primary text-[1.75rem] md:text-[2rem] leading-tight">
                A Clinical and Recovery-Informed Approach
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Our work sits at the intersection of clinical best practice, lived recovery understanding, and practical treatment navigation. We do not apply a one-size-fits-all model. Every recommendation is considered in relation to the person's substance use, mental health, risk, family context, motivation, history, and recovery environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we help with ── */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-3">
                Areas of support
              </span>
              <h2 className="font-serif text-primary text-[1.75rem] md:text-[2rem] leading-tight">
                What we help with
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {whatWeHelpWith.map(({ label, href }) => (
                <Link href={href} key={label}>
                  <div
                    className="group flex items-center gap-4 border border-border/35 bg-white px-5 py-3.5 hover:border-accent/45 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.05)" }}
                  >
                    <div
                      className="flex-shrink-0 w-1 self-stretch"
                      style={{ background: "rgba(201,169,110,0.55)" }}
                    />
                    <p className="text-[13.5px] text-primary/80 font-light leading-snug flex-1">{label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder profile ── */}
      <section
        className="py-12 md:py-16"
        style={{
          background: "rgba(246,244,240,0.55)",
          borderTop: "1px solid rgba(201,169,110,0.12)",
          borderBottom: "1px solid rgba(201,169,110,0.12)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">

              {/* Craig Bilton image — new filming/editorial shot */}
              <div className="md:col-span-4">
                <div
                  className="relative w-full max-w-[280px] mx-auto md:mx-0"
                  style={{ aspectRatio: "4/5" }}
                >
                  <img
                    src={craigImg}
                    alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network."
                    className="w-full h-full object-cover object-center"
                    style={{
                      boxShadow: "0 8px 32px -4px rgba(22,43,59,0.16), 0 0 0 1px rgba(22,43,59,0.06)",
                    }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: "1px solid rgba(201,169,110,0.22)", margin: "8px" }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-8 flex flex-col justify-start">
                <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent font-sans block mb-3">
                  Founder &amp; Clinical Director
                </span>
                <h2 className="font-serif text-primary text-[1.9rem] md:text-[2.2rem] leading-tight mb-5">
                  Craig Bilton
                </h2>

                <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-3.5">
                  Craig Bilton is the Founder and Clinical Director of Insight Recovery Network. With more than 20 years' experience across addiction treatment, mental health support, programme leadership, intervention work, and international treatment placement, Craig has worked with individuals and families navigating some of the most complex stages of addiction and recovery.
                </p>
                <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-3.5">
                  His work has included senior clinical and operational roles across treatment settings in the UK and internationally, including residential rehabilitation, structured outpatient programmes, family support, relapse prevention, and long-term recovery planning.
                </p>
                <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-7">
                  Insight Recovery Network was created to offer families and individuals a more joined-up, discreet, and clinically informed route into support, whether that means finding the right treatment environment, accessing structured online recovery support, or receiving guidance during a crisis point.
                </p>

                <div>
                  <Link href="/contact">
                    <Button className="rounded-none h-11 px-7 text-sm">
                      Speak Confidentially
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── How we work ── */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-7 text-center">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-3">
                The process
              </span>
              <h2 className="font-serif text-primary text-[1.75rem] md:text-[2rem] leading-tight">
                How we work
              </h2>
            </div>

            <div className="relative">
              <div
                className="hidden md:block absolute top-[2.375rem] left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px"
                style={{ background: "rgba(201,169,110,0.28)" }}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                {howWeWork.map(({ n, title, body }) => (
                  <div
                    key={n}
                    className="flex flex-col items-center text-center bg-white border border-border/30 px-4 pt-5 pb-5 md:px-5"
                    style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
                  >
                    <div
                      className="w-12 h-12 flex items-center justify-center font-serif text-base mb-3.5 relative z-10"
                      style={{
                        background: "rgba(246,244,240,1)",
                        border: "1px solid rgba(201,169,110,0.50)",
                        color: "rgba(22,43,59,0.88)",
                      }}
                    >
                      {n}
                    </div>
                    <h3 className="text-[13.5px] font-serif text-primary mb-2 leading-snug">{title}</h3>
                    <p className="text-[12.5px] text-muted-foreground font-light leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="py-10 md:py-14"
        style={{ background: "rgba(246,244,240,0.5)", borderTop: "1px solid rgba(201,169,110,0.10)" }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-7">
              <div className="w-8 h-px mb-5" style={{ background: "#C9A96E" }} />
              <h2 className="font-serif text-primary text-[1.75rem] md:text-[2rem] leading-tight">
                Our values
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map(({ title, body }) => (
                <div key={title} className="border-l-2 border-accent/60 pl-5 py-1">
                  <h3 className="font-serif text-[1.05rem] text-primary mb-1.5 leading-snug">{title}</h3>
                  <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        heading="Speak confidentially about your situation."
        description="There is no pressure, no obligation, and no need to have everything worked out. A private conversation can help clarify the most appropriate next step for you or your family."
        primaryCta={{ label: "Arrange a confidential consultation", href: "/contact" }}
      />
    </Layout>
  );
}
