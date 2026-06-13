import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { getOgConfig, ogImageUrl } from "@/config/og-pages";
import { PathwayCard } from "@/components/ui/pathway-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CTASection } from "@/components/ui/cta-section";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Shield, BookOpen, Map, Monitor, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import treatmentImg from "@/assets/hero-treatment-placement.webp";
import onlineProgrammeImg from "@/assets/hero-online-programme.webp";
import digitalToolsImg from "@/assets/hero-digital-tools.webp";
import familyImg from "@/assets/hero-family-guidance.webp";

const trustPoints = [
  "Private guidance",
  "Structured support",
  "Digital recovery tools",
  "Treatment pathways",
];

const pillars = [
  {
    title: "Online Recovery Programme",
    desc: "Groups, one-to-one support and relapse prevention planning.",
    href: "/online-programme",
  },
  {
    title: "Insight OS Digital Recovery Tools",
    desc: "Daily structure, journaling, check-ins and Anchor guidance.",
    href: "/insight-os",
  },
  {
    title: "Treatment Placement",
    desc: "Confidential guidance for detox, residential rehab and continuing care.",
    href: "/treatment-placement",
  },
];

const homeOg = getOgConfig("/")!;

export default function Home() {
  return (
    <Layout>
      <SEO
        title={homeOg.seoTitle ?? homeOg.title}
        description="Insight Recovery Network provides private addiction and mental health recovery support, led by Craig Bilton. Based in Newquay, Cornwall, we offer online recovery programmes, private rehab placement, family intervention guidance, and relapse prevention — available across the UK and internationally."
        canonical="/"
        ogImage={ogImageUrl(homeOg.file)}
      />

      {/* ── Hero — premium three-pillar two-zone composition ── */}
      {/*
        NOTE: Layout <main> already has pt-[88px] for the fixed navbar.
        Hero padding here is ADDITIONAL space below that offset.
        Keep it small — 8-14 is enough for breathing room.
      */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 40%, #EEE9DF 100%)",
          borderTop: "1px solid rgba(201,169,110,0.22)",
          borderBottom: "1px solid rgba(201,169,110,0.14)",
        }}
      >
        {/* ── Visible background depth ── */}

        {/* Large blurred champagne oval — left text zone glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-10%", left: "-8%",
            width: "58%", height: "130%",
            background: "radial-gradient(ellipse at 35% 45%, rgba(201,169,110,0.22) 0%, rgba(201,169,110,0.08) 40%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />

        {/* Warm navy ambient behind image cluster */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "0%", right: "-4%",
            width: "62%", height: "100%",
            background: "radial-gradient(ellipse at 55% 42%, rgba(201,169,110,0.18) 0%, rgba(22,43,59,0.04) 50%, transparent 80%)",
            filter: "blur(32px)",
          }}
        />

        {/* Oversized faint editorial circles — centred on image/text boundary */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            top: "50%", left: "48%",
            transform: "translate(-50%, -50%)",
            width: "660px", height: "660px",
            borderRadius: "50%",
            border: "1px solid rgba(201,169,110,0.13)",
          }}
        />
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            top: "50%", left: "48%",
            transform: "translate(-50%, -50%)",
            width: "440px", height: "440px",
            borderRadius: "50%",
            border: "1px solid rgba(201,169,110,0.09)",
          }}
        />

        {/* Barely-visible dot grid — fades at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22,43,59,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-6 md:px-12 pt-8 md:pt-10 lg:pt-12 pb-8 md:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-10 xl:gap-14">

            {/* ══ LEFT ZONE: copy + CTAs + trust + pillar summary ══ */}
            <div className="lg:w-[44%] xl:w-[42%] flex flex-col gap-0">

              {/* Eyebrow */}
              <span
                className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-5"
                data-testid="text-hero-eyebrow"
              >
                Private support for addiction and mental health — online programmes, assessments and treatment placement
              </span>

              {/* Headline */}
              <h1
                className="font-serif text-primary leading-[1.07] tracking-tight mb-5"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                data-testid="text-hero-heading"
              >
                Private Addiction and Mental Health Support, Online and Abroad
              </h1>

              {/* Subheading */}
              <p
                className="text-[15px] text-muted-foreground leading-relaxed font-light mb-7 max-w-[480px]"
                data-testid="text-hero-description"
              >
                Expert support for alcohol and drug addiction, mental health challenges and co-occurring conditions — combining online recovery programmes, clinical assessments, treatment placement guidance and Insight OS digital recovery tools.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="/contact" data-testid="button-hero-primary">
                  <Button className="rounded-none h-12 px-7 text-sm">
                    Speak Confidentially
                  </Button>
                </Link>
                <Link href="/what-we-offer" data-testid="button-hero-secondary">
                  <Button variant="outline" className="rounded-none h-12 px-7 text-sm border-primary/20 hover:bg-primary/5">
                    Explore Support Options
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-y-1 mb-5 md:mb-8 pb-5 md:pb-8 border-b border-border/30">
                {trustPoints.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span className="mx-2.5 text-border/40 text-xs select-none">·</span>
                    )}
                    <span className="text-[10.5px] text-muted-foreground/60 tracking-wide">{item}</span>
                  </Fragment>
                ))}
              </div>

              {/* Mobile: horizontal swipeable image strip — hidden md+ */}
              <div
                className="md:hidden -mx-6 px-6 overflow-x-auto snap-x snap-mandatory scroll-pl-6 flex gap-3 pb-3 scrollbar-hide"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {[
                  {
                    img: onlineProgrammeImg,
                    alt: "A person taking part in a structured online alcohol and drug recovery programme from home via laptop",
                    title: "Online Recovery Programme",
                    desc: "Structured support from wherever you are.",
                    objPos: "center",
                    eager: true,
                  },
                  {
                    img: digitalToolsImg,
                    alt: "Insight OS digital recovery tools app showing daily check-ins and recovery planning on a phone",
                    title: "Insight OS Digital Recovery Tools",
                    desc: "Insight OS for daily recovery structure.",
                    objPos: "center 20%",
                    eager: false,
                  },
                  {
                    img: treatmentImg,
                    alt: "A calm, private residential treatment facility for addiction rehabilitation and detox",
                    title: "Treatment Placement",
                    desc: "Private guidance when residential care is needed.",
                    objPos: "center",
                    eager: false,
                  },
                ].map((panel) => (
                  <div
                    key={panel.title}
                    className="snap-start flex-shrink-0 relative rounded-xl overflow-hidden"
                    style={{
                      width: "72vw",
                      maxWidth: "260px",
                      height: "200px",
                      boxShadow: "0 4px 16px -4px rgba(22,43,59,0.16), 0 0 0 1px rgba(22,43,59,0.06)",
                    }}
                  >
                    <img
                      src={panel.img}
                      alt={panel.alt}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: panel.objPos }}
                      loading={panel.eager ? "eager" : "lazy"}
                      fetchPriority={panel.eager ? "high" : "auto"}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 px-4 py-3"
                      style={{ background: "linear-gradient(to top, rgba(22,43,59,0.85) 0%, transparent 100%)" }}
                    >
                      <div className="w-4 h-px mb-1.5" style={{ background: "rgba(201,169,110,0.8)" }} />
                      <p className="font-serif text-white text-[12px] leading-tight">{panel.title}</p>
                      <p className="text-white/55 text-[10.5px] font-light">{panel.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Three-pillar compact summary — tablet and desktop only */}
              <div className="hidden md:flex flex-col gap-5">
                {pillars.map((p, i) => (
                  <div key={p.title} className="flex gap-4 items-start group">
                    {/* Champagne index */}
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-0.5">
                      <span
                        className="font-serif text-[11px] font-medium"
                        style={{ color: "rgba(201,169,110,0.85)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <Link href={p.href}>
                        <p className="font-serif text-primary text-[13px] leading-tight mb-1 group-hover:text-primary/70 transition-colors">
                          {p.title}
                        </p>
                      </Link>
                      <p className="text-muted-foreground/65 text-[12px] leading-snug font-light">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ══ RIGHT ZONE: premium staggered image mosaic — hidden on mobile, images shown inline above ══ */}
            <div className="hidden md:block lg:flex-1 min-w-0">

              {/* Desktop mosaic */}
              <div className="hidden md:block relative" style={{ height: "580px" }}>

                {/* Gap constants: left col = 56%, gap = 3%, right col = 41% */}

                {/* Online Recovery Programme — tall dominant left panel */}
                <div
                  className="absolute top-0 left-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "56%", height: "100%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={onlineProgrammeImg}
                    alt="A person attending a structured online alcohol and drug recovery programme from home via laptop"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    fetchPriority="high"
                    loading="eager"
                  />
                  {/* Label overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-5 py-4"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.60) 60%, transparent 100%)" }}
                  >
                    <div className="w-5 h-px mb-2" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[13px] leading-tight mb-0.5">
                      Online Recovery Programme
                    </p>
                    <p className="text-white/55 text-[11px] font-light leading-snug">
                      Structured support from wherever you are.
                    </p>
                  </div>
                </div>

                {/* Digital Recovery Tools — top-right, secondary prominent */}
                <div
                  className="absolute top-0 right-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "41%", height: "57%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={digitalToolsImg}
                    alt="Insight OS digital recovery tools app on a phone showing daily check-in and progress tracking"
                    className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3.5"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.55) 65%, transparent 100%)" }}
                  >
                    <div className="w-4 h-px mb-1.5" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[12px] leading-tight mb-0.5">
                      Digital Recovery Tools
                    </p>
                    <p className="text-white/55 text-[10.5px] font-light leading-snug">
                      Insight OS for daily recovery structure.
                    </p>
                  </div>
                </div>

                {/* Treatment Placement — bottom-right, supporting */}
                <div
                  className="absolute bottom-0 right-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "41%", height: "40%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={treatmentImg}
                    alt="A calm, private residential treatment setting surrounded by landscaped gardens"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.50) 65%, transparent 100%)" }}
                  >
                    <div className="w-4 h-px mb-1.5" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[12px] leading-tight mb-0.5">
                      Treatment Placement
                    </p>
                    <p className="text-white/55 text-[10.5px] font-light leading-snug">
                      Private guidance when residential care is needed.
                    </p>
                  </div>
                </div>

              </div>


            </div>

          </div>
        </div>
      </section>

      {/* ── Pathways ── */}
      <section className="py-6 md:py-10 lg:py-14 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader
            label="Where to start"
            heading="Find the right path"
            className="mb-5 md:mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            <PathwayCard
              title="I need help for myself"
              description="If things feel difficult to manage alone, we can help you understand the right next step."
              href="/contact"
              linkLabel="Explore support"
              delay={0}
            />
            <PathwayCard
              title="I need help for someone else"
              description="Speak confidentially about concerns for a family member, partner, friend or colleague."
              href="/contact"
              linkLabel="Get guidance"
              delay={100}
            />
            <PathwayCard
              title="I am a professional or organisation"
              description="Explore digital recovery tools, treatment pathways and partnership options."
              href="/contact"
              linkLabel="Work with us"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── Services — image-led 2×2 grid ── */}
      <section className="py-10 md:py-16 lg:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">

            {/* Left: heading + intro, sticky on desktop */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <SectionHeader
                label="Our services"
                heading="What We Offer"
                description="Comprehensive, discreet care for addiction, mental health and family recovery — tailored to the needs of each individual."
              />
            </div>

            {/* Right: 2×2 image-led cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  img: onlineProgrammeImg,
                  alt: "Online alcohol and drug recovery group session on a laptop",
                  title: "Online Recovery Programme",
                  copy: "Structured group support, one-to-one sessions and relapse prevention planning.",
                  href: "/online-programme",
                  objPos: "center",
                },
                {
                  img: digitalToolsImg,
                  alt: "Insight OS digital recovery tools app on a phone",
                  title: "Insight OS Digital Recovery Tools",
                  copy: "Daily structure, journaling, check-ins and Anchor guidance through Insight OS.",
                  href: "/insight-os",
                  objPos: "center 20%",
                },
                {
                  img: treatmentImg,
                  alt: "A private residential treatment facility for addiction rehabilitation and detox",
                  title: "Treatment Placement",
                  copy: "Confidential guidance for detox, residential rehab and continuing care.",
                  href: "/treatment-placement",
                  objPos: "center",
                },
                {
                  img: familyImg,
                  alt: "A private consultation for family addiction guidance and intervention support",
                  title: "Family & Intervention Guidance",
                  copy: "Support for families who are worried, overwhelmed or unsure how to help.",
                  href: "/what-we-offer",
                  objPos: "center top",
                },
              ].map((s) => (
                <Link href={s.href} key={s.title}>
                  <div className="group flex flex-col bg-white border border-border/40 rounded-xl overflow-hidden hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer" style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.06)" }}>
                    <div className="overflow-hidden" style={{ height: "176px" }}>
                      <img
                        src={s.img}
                        alt={s.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: s.objPos }}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="w-5 h-px mb-3" style={{ background: "rgba(201,169,110,0.9)" }} />
                      <h3 className="font-serif text-primary text-[15px] leading-snug mb-2">{s.title}</h3>
                      <p className="text-muted-foreground text-[13px] font-light leading-relaxed mb-4 flex-1">{s.copy}</p>
                      <span className="text-[11px] font-semibold tracking-wide uppercase text-accent group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
                        Learn more
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Why IRN (dark trust section) ── */}
      <section className="py-12 md:py-20 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">

        {/* Subtle corner linework */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trust-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trust-grid)" />
          </svg>
        </div>

        {/* Warm champagne glow — top right */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 85% 35%, rgba(201,169,110,0.10) 0%, transparent 60%)" }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">

          {/* Header row — text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-8 md:mb-14">
            <div className="lg:col-span-6">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/80 block mb-4">
                Why Insight Recovery Network
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-serif text-primary-foreground leading-tight mb-5">
                Private support with clinical depth.
              </h2>
              <p className="text-primary-foreground/65 leading-relaxed font-light max-w-lg text-[15px]">
                Led by Craig Bilton, we help individuals and families make sense of complex situations with calm, confidential and practical guidance — based in Newquay, Cornwall, and supporting clients across the UK and internationally.
              </p>
            </div>

            {/* Warm image panel — desktop only */}
            <div className="hidden lg:block lg:col-span-5 lg:col-start-8">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  height: "220px",
                  border: "1px solid rgba(201,169,110,0.18)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                }}
              >
                <img
                  src={familyImg}
                  alt="A calm, private consultation with a family and their advisor"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Four trust points with vertical dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            {[
              { Icon: Shield, testId: "trust-point-confidential", title: "Confidential guidance", body: "Private conversations for individuals and families navigating sensitive challenges." },
              { Icon: BookOpen, testId: "trust-point-approach", title: "Recovery-informed approach", body: "Support shaped by addiction, mental health and relapse prevention experience." },
              { Icon: Map, testId: "trust-point-pathways", title: "Treatment pathway knowledge", body: "Guidance across detox, residential rehab, online support and continuing care." },
              { Icon: Monitor, testId: "trust-point-digital", title: "Digital continuity", body: "Insight OS supports daily structure, reflection and long-term recovery management." },
            ].map(({ Icon, testId, title, body }, i) => (
              <div
                key={testId}
                data-testid={testId}
                className="flex flex-col gap-3 py-4 md:py-0 md:px-8 lg:px-7 first:md:pl-0 last:md:pr-0"
              >
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <div className="w-6 h-px bg-accent/35" />
                <h3 className="text-[15px] font-serif text-primary-foreground leading-snug">{title}</h3>
                <p className="text-primary-foreground/55 font-light text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-8 md:py-14 lg:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">

          {/* Centred heading + intro */}
          <div className="max-w-2xl mx-auto text-center mb-7 md:mb-12">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              The process
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">How it works</h2>
            <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
              You do not need to know exactly what support you need before getting in touch. We help you slow things down, understand the options and decide on the next step.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Champagne connector line — desktop */}
            <div
              className="hidden md:block absolute top-[2.375rem] left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px"
              style={{ background: "rgba(201,169,110,0.28)" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 lg:gap-6">
              {[
                {
                  n: "1",
                  title: "Tell us what is happening",
                  body: "Briefly share what you or someone close to you is facing. There is no need to have everything worked out.",
                },
                {
                  n: "2",
                  title: "Clarify the right level of support",
                  body: "We help you think through whether online support, treatment placement, family guidance or digital recovery tools are most appropriate.",
                },
                {
                  n: "3",
                  title: "Take the next step confidentially",
                  body: "We agree a practical next step and support you in moving forward with clarity.",
                },
              ].map(({ n, title, body }) => (
                <div
                  key={n}
                  className="flex flex-col items-center text-center bg-white border border-border/30 rounded-xl px-4 pt-5 pb-5 md:px-6 md:pt-6 md:pb-7"
                  style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.06)" }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center font-serif text-base mb-4 md:mb-5 relative z-10"
                    style={{
                      background: "rgba(246,244,240,1)",
                      border: "1px solid rgba(201,169,110,0.50)",
                      color: "rgba(22,43,59,0.88)",
                    }}
                    data-testid={`step-number-${n}`}
                  >
                    {n}
                  </div>
                  <h3 className="text-[15px] font-serif text-primary mb-3 leading-snug">{title}</h3>
                  <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Assessments promo ── */}
      <section
        className="py-14 md:py-20"
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 60%, #EEE9DF 100%)",
          borderTop: "1px solid rgba(201,169,110,0.18)",
          borderBottom: "1px solid rgba(201,169,110,0.14)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="w-8 h-px mb-7" style={{ background: "#C9A96E" }} />
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-4">
              Free Assessments
            </span>
            <h2 className="font-serif text-primary text-3xl md:text-4xl leading-tight mb-5">
              Addiction and Mental Health Assessments
            </h2>
            <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
              Not sure where to start? Take a free confidential assessment and receive personalised guidance based on your answers.
            </p>
            <Link href="/assessments">
              <button className="inline-flex items-center gap-3 px-7 h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                View Free Assessments
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Resources promo ── */}
      <section className="py-12 md:py-16 border-t border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-3">
                Clinical Resources
              </span>
              <h2 className="font-serif text-primary text-2xl md:text-3xl leading-tight mb-3">
                Addiction and recovery articles
              </h2>
              <p className="text-[14px] text-muted-foreground font-light leading-relaxed">
                Authoritative articles on addiction, recovery, treatment options and mental health — written by Craig Bilton to help individuals and families make informed decisions.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/resources">
                <button className="inline-flex items-center gap-3 px-7 h-12 text-sm font-medium border border-primary/25 text-primary hover:bg-primary/5 transition-colors">
                  Browse Resources
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <CTASection
        heading="Speak Confidentially"
        description="You do not need to have everything worked out before making contact. A private conversation can help clarify the most appropriate support for you or your family."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
      />
    </Layout>
  );
}
