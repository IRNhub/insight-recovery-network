import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { getOgConfig, ogImageUrl } from "@/config/og-pages";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, User, Shield, CalendarCheck, Laptop, HeartHandshake } from "lucide-react";

import heroImg from "@/assets/op-hero.webp";
import oneToOneImg from "@/assets/op-one-to-one.webp";

const whoFor = [
  {
    title: "You need structure but cannot step away from work or family",
    body: "The online programme provides a clinical rhythm of support without requiring you to leave your responsibilities behind.",
  },
  {
    title: "You have completed treatment and need strong aftercare",
    body: "The transition out of residential care is high-risk. Structured online support reduces the likelihood of relapse in the critical early months.",
  },
  {
    title: "You are relapsing despite trying to manage alone",
    body: "Willpower alone rarely sustains recovery. Structured professional support, accountability, and relapse prevention tools make a measurable difference.",
  },
  {
    title: "You want professional guidance without entering rehab",
    body: "For those who are not yet at a point requiring residential care, the online programme provides a serious clinical alternative.",
  },
  {
    title: "You need accountability, education, and relapse prevention tools",
    body: "The programme gives you frameworks, worksheets, and professional oversight to make recovery an active daily practice.",
  },
  {
    title: "You are supporting a loved one and need a structured pathway",
    body: "We can help you understand whether this level of support is appropriate and coordinate a structured response for the person you are supporting.",
  },
];

const included = [
  {
    Icon: Users,
    title: "Live Group Support",
    body: "Facilitated recovery groups providing education, reflection, accountability, and shared experience.",
  },
  {
    Icon: User,
    title: "One-to-One Therapy",
    body: "Individual sessions focused on underlying patterns, emotional regulation, relapse risk, and recovery planning.",
  },
  {
    Icon: Shield,
    title: "Relapse Prevention Planning",
    body: "A structured plan to identify warning signs, triggers, high-risk situations, and practical intervention steps.",
  },
  {
    Icon: CalendarCheck,
    title: "Daily Recovery Structure",
    body: "Worksheets, reflection tasks, planning tools, and behavioural commitments to keep recovery active between sessions.",
  },
  {
    Icon: Laptop,
    title: "Insight OS Access",
    body: "Digital tools for journaling, check-ins, tracking, recovery planning, and AI-assisted guidance through Anchor.",
  },
  {
    Icon: HeartHandshake,
    title: "Family and Professional Coordination",
    body: "Where appropriate, support communication with families, employers, or other professionals involved in care.",
  },
];

const steps = [
  {
    n: "1",
    title: "Initial consultation",
    body: "We understand your current situation, risks, history, goals, and support needs.",
  },
  {
    n: "2",
    title: "Programme recommendation",
    body: "We identify whether the online programme is appropriate, or whether a higher level of care may be needed.",
  },
  {
    n: "3",
    title: "Structured weekly support",
    body: "You join a rhythm of group work, individual sessions, recovery assignments, and digital support.",
  },
  {
    n: "4",
    title: "Ongoing review",
    body: "Progress, risks, relapse warning signs, and recovery goals are reviewed as the programme develops.",
  },
];

const moreThanBullets = [
  "Structured programme rhythm",
  "Practical worksheets and recovery tasks",
  "Clinical relapse prevention focus",
  "Access to Insight OS",
  "Support between sessions",
  "Clear accountability and review",
];

const onlineProgrammeFaqs: FAQItem[] = [
  {
    question: "Who is the online recovery programme for?",
    answer: "It is designed for adults who are medically stable and want structured support, accountability and relapse-prevention work without entering residential treatment. A confidential conversation helps establish whether this level of support fits the person's circumstances.",
  },
  {
    question: "Does the online programme provide detox or emergency support?",
    answer: "No. Insight Recovery Network does not provide medical detox, diagnosis, prescribing or emergency care. Anyone experiencing withdrawal symptoms or immediate risk should seek urgent medical advice; call 999 in an emergency.",
  },
  {
    question: "Can online support be used after residential rehab?",
    answer: "Yes. Structured online support can provide continuity, routine and relapse-prevention planning after discharge. The timing and level of support should reflect the person's discharge plan and current needs.",
  },
];

const onlineProgrammeOg = getOgConfig("/online-programme")!;

export default function OnlineProgramme() {
  return (
    <Layout>
      <SEO
        title="Online Recovery Programme Options and Pricing"
        fullTitle="Online Recovery Programme Options and Pricing | Insight Recovery Network"
        description="Compare Insight Recovery Network's structured online recovery programme options, pricing, session levels, Insight OS access, relapse prevention planning and confidential enquiry route."
        canonical="/online-programme"
        ogImage={ogImageUrl(onlineProgrammeOg.file)}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Insight Recovery Network Online Programme Options",
            "description": "Commercial programme page for Insight Recovery Network's online recovery support options, including monthly support levels, one-to-one sessions, group work, relapse prevention planning, and Insight OS access.",
            "provider": { "@type": "Organization", "name": "Insight Recovery Network", "url": "https://www.insightrecoverynetwork.com" },
            "serviceType": "Online Addiction Recovery Programme",
            "url": "https://www.insightrecoverynetwork.com/online-programme",
          })}
        </script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background py-8 md:py-14">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left: text */}
            <div className="lg:col-span-6 flex flex-col gap-5 md:gap-6">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/80">
                Programme Options
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif text-primary leading-[1.08] tracking-tight">
                Online Recovery Programme Options and Pricing
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                Choose the level of structured online recovery support that fits your situation, from essential monthly support through to enhanced clinical input, with Insight OS access included.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                {[
                  "No need to step away from work or family",
                  "Clinical structure, not isolated counselling",
                  "Flexible, available from anywhere",
                  "Three monthly support levels from £950",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13px] text-muted-foreground/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/contact">
                  <Button size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base shadow-sm w-full sm:w-auto">
                    Book a confidential call
                  </Button>
                </Link>
                <Link href="/assessments">
                  <Button variant="outline" size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                    Take a free assessment
                  </Button>
                </Link>
              </div>
              <p className="text-[11.5px] text-muted-foreground/55 font-light tracking-wide">
                Private, structured, non-judgemental support.
              </p>
              <p className="text-[12px] text-muted-foreground/60 font-light leading-relaxed">
                Not sure if this programme is right for you? Read the{" "}
                <Link
                  href="/resources/online-recovery-programmes"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  evidence and safety guide to online addiction recovery
                </Link>
                {" "}or use our{" "}
                <Link
                  href="/assessments/alcohol-use"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  Alcohol
                </Link>
                {", "}
                <Link
                  href="/assessments/drug-use"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  drug use
                </Link>
                {", "}
                <Link
                  href="/assessments/anxiety"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  anxiety
                </Link>
                {" and "}
                <Link
                  href="/assessments/depression"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  depression
                </Link>
                {" assessments are available free and confidentially."}
              </p>
            </div>

            {/* Right: image */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              <div className="relative" style={{ paddingBottom: "68%" }}>
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-5 md:translate-y-5 rounded-xl"
                  style={{
                    background: "rgba(201,169,110,0.11)",
                    border: "1px solid rgba(201,169,110,0.22)",
                  }}
                />
                <img
                  src={heroImg}
                  alt="Person working through online recovery programme at home"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 20%" }}
                  fetchPriority="high"
                  loading="eager"
                />
                <div
                  className="absolute bottom-4 left-4 z-20 px-3.5 py-2.5 rounded-lg"
                  style={{ background: "rgba(22,43,59,0.82)", backdropFilter: "blur(8px)" }}
                >
                  <p className="font-serif text-white text-[12px] leading-tight">Structured weekly support</p>
                  <p className="text-white/55 text-[10.5px] font-light">Group · 1:1 · Insight OS · Relapse Prevention</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ServiceSummary
        who="Adults who are medically stable and want structured recovery support while remaining at home, at work or with family."
        problem="Provides routine, accountability, practical recovery work and relapse-prevention support in everyday life."
        applies="Delivered online across the UK and internationally; detox and emergency care are not provided."
      />

      {/* ── Who this programme is for ── */}
      <section className="py-7 md:py-10" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-5 md:mb-7">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Who this is for
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight max-w-2xl">
              For when residential care is not the right fit.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {whoFor.map((item, i) => (
              <div
                key={item.title}
                className="flex gap-4 bg-white border border-border/30 rounded-xl p-5"
                style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.04)" }}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <span className="font-serif text-[10.5px]" style={{ color: "rgba(201,169,110,0.85)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="w-4 h-px mb-2.5" style={{ background: "rgba(201,169,110,0.5)" }} />
                  <h3 className="font-serif text-primary text-[15px] leading-snug mb-2">{item.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground/70 font-light leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section id="whats-included" className="py-7 md:py-10 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-5 md:mb-7">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Programme components
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              What's included.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {included.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col bg-white border border-border/35 rounded-xl hover:border-primary/15 transition-all duration-300 p-5"
                style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 5px 20px -4px rgba(22,43,59,0.10)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(22,43,59,0.05)")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(246,244,240,1)", border: "1px solid rgba(201,169,110,0.25)" }}
                  >
                    <item.Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="w-4 h-px" style={{ background: "rgba(201,169,110,0.5)" }} />
                </div>
                <h3 className="font-serif text-primary text-[16px] leading-snug mb-1.5">{item.title}</h3>
                <p className="text-[12.5px] text-muted-foreground/70 font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the programme works ── */}
      <section className="py-7 md:py-10" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-5 md:mb-7">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              The process
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              How the programme works.
            </h2>
          </div>

          <div className="relative">
            <div
              className="hidden md:block absolute top-[1.625rem] left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px pointer-events-none"
              style={{ background: "rgba(201,169,110,0.25)" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center text-center bg-white border border-border/30 rounded-xl px-4 pt-5 pb-5 md:px-5 md:pt-6 md:pb-6"
                  style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center font-serif text-base mb-4 relative z-10"
                    style={{
                      background: "rgba(246,244,240,1)",
                      border: "1px solid rgba(201,169,110,0.50)",
                      color: "rgba(22,43,59,0.88)",
                      borderRadius: "50%",
                    }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-serif text-primary text-[15px] leading-snug mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground/65 font-light leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── More than online counselling, split layout ── */}
      <section className="py-7 md:py-10 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: "72%" }}>
                <div
                  className="absolute inset-0 -translate-x-4 translate-y-4 md:-translate-x-5 md:translate-y-5 rounded-xl"
                  style={{
                    background: "rgba(201,169,110,0.09)",
                    border: "1px solid rgba(201,169,110,0.20)",
                  }}
                />
                <img
                  src={oneToOneImg}
                  alt="One-to-one online therapy session with recovery worksheets"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 20%" }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-5 order-1 lg:order-2">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                Why it is different
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                More than online counselling.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Many people receive isolated therapy sessions without a wider recovery structure. Our online programme combines therapeutic support with practical education, group accountability, daily reflection, relapse prevention planning, and digital recovery tools.
              </p>
              <div className="flex flex-col gap-2.5 mt-1">
                {moreThanBullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13.5px] text-primary/75 font-light">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Clinically guided, not 12-step dependent ── */}
      <section className="py-7 md:py-10" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div
            className="max-w-4xl mx-auto rounded-xl border border-border/30 p-8 md:p-12 bg-white"
            style={{ boxShadow: "0 1px 6px rgba(22,43,59,0.06)" }}
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ background: "rgba(246,244,240,1)", border: "1px solid rgba(201,169,110,0.3)" }}
                >
                  <Shield className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                  Clinical approach
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-primary leading-tight">
                  Clinically guided, not 12-step dependent.
                </h2>
                <p className="text-[14.5px] text-muted-foreground/80 font-light leading-relaxed">
                  The programme is not a 12-step programme. It is structured around psychoeducation, relapse prevention, emotional regulation, accountability, behavioural change, and practical recovery planning.
                </p>
                <p className="text-[14.5px] text-muted-foreground/80 font-light leading-relaxed">
                  Some clients may choose to use 12-step support alongside the programme, but it is not required. The clinical framework stands independently and is designed to work for a wide range of individuals, backgrounds, and beliefs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme Options (Pricing) ── */}
      <section className="py-7 md:py-10 bg-background">
        <div className="container mx-auto px-6 md:px-12">

          {/* Heading */}
          <div className="mb-5 md:mb-7 max-w-3xl">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Programme Options
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight mb-4">
              Three levels of support.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/80 font-light leading-relaxed">
              Our online programme is available in three levels of support. Each option includes structured recovery tasks, group support, relapse prevention work, Insight OS access, and ongoing accountability. The appropriate level of support is confirmed after a confidential consultation.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">

            {/* Essential Support */}
            <div
              className="flex flex-col bg-white border border-border/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/15"
              style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px -4px rgba(22,43,59,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(22,43,59,0.05)")}
            >
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="mb-5">
                  <span
                    className="inline-block text-[9px] font-semibold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{ background: "rgba(201,169,110,0.10)", color: "rgba(201,169,110,0.85)", border: "1px solid rgba(201,169,110,0.25)" }}
                  >
                    Bronze
                  </span>
                  <h3 className="font-serif text-primary text-xl leading-snug mb-1">Essential Support</h3>
                  <div className="w-6 h-px mt-2 mb-4" style={{ background: "rgba(201,169,110,0.45)" }} />
                  <div className="mb-3">
                    <span className="font-serif text-primary text-3xl tracking-tight">£950</span>
                    <span className="text-muted-foreground/60 text-[13px] font-light ml-1.5">per month</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed">
                    For clients who need structured online recovery support with regular individual input and full programme access.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                  {[
                    "4 individual sessions per month",
                    "Access to the online group programme",
                    "Full Insight OS access",
                    "Daily digital check-ins",
                    "Recovery worksheets",
                    "Programme accountability",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-px flex-shrink-0 mt-[9px]" style={{ background: "rgba(201,169,110,0.55)" }} />
                      <span className="text-[13px] text-primary/70 font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <button
                    className="w-full text-[13px] font-medium tracking-wide py-3 px-5 rounded-none border transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                    style={{ border: "1px solid rgba(22,43,59,0.25)", color: "rgba(22,43,59,0.80)" }}
                  >
                    Book a confidential call
                  </button>
                </Link>
              </div>
            </div>

            {/* Structured Support, highlighted */}
            <div
              className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 relative"
              style={{
                background: "rgba(22,43,59,1)",
                border: "1px solid rgba(201,169,110,0.35)",
                boxShadow: "0 4px 20px -4px rgba(22,43,59,0.22)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 36px -6px rgba(22,43,59,0.32)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px -4px rgba(22,43,59,0.22)")}
            >
              {/* Top accent line */}
              <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.60), transparent)" }} />

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block text-[9px] font-semibold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(201,169,110,0.15)", color: "rgba(201,169,110,0.90)", border: "1px solid rgba(201,169,110,0.30)" }}
                    >
                      Silver
                    </span>
                    <span
                      className="inline-block text-[9px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(201,169,110,0.12)", color: "rgba(201,169,110,0.80)", border: "1px solid rgba(201,169,110,0.20)" }}
                    >
                      Most balanced
                    </span>
                  </div>
                  <h3 className="font-serif text-white text-xl leading-snug mb-1">Structured Support</h3>
                  <div className="w-6 h-px mt-2 mb-4" style={{ background: "rgba(201,169,110,0.50)" }} />
                  <div className="mb-3">
                    <span className="font-serif text-white text-3xl tracking-tight">£1,250</span>
                    <span className="text-white/45 text-[13px] font-light ml-1.5">per month</span>
                  </div>
                  <p className="text-[13px] text-white/60 font-light leading-relaxed">
                    For clients who need a higher level of therapeutic contact, family involvement where appropriate, and regular recovery review.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                  {[
                    "8 individual sessions per month",
                    "Everything in Essential Support",
                    "Family support where appropriate",
                    "Enhanced recovery planning",
                    "Regular progress review",
                    "Increased accountability",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-px flex-shrink-0 mt-[9px]" style={{ background: "rgba(201,169,110,0.50)" }} />
                      <span className="text-[13px] text-white/65 font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <button
                    className="w-full text-[13px] font-medium tracking-wide py-3 px-5 rounded-none transition-all duration-200"
                    style={{
                      background: "rgba(201,169,110,0.15)",
                      border: "1px solid rgba(201,169,110,0.40)",
                      color: "rgba(201,169,110,0.90)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.15)";
                    }}
                  >
                    Book a confidential call
                  </button>
                </Link>
              </div>
            </div>

            {/* Enhanced Clinical Support */}
            <div
              className="flex flex-col bg-white border border-border/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/15"
              style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px -4px rgba(22,43,59,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(22,43,59,0.05)")}
            >
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="mb-5">
                  <span
                    className="inline-block text-[9px] font-semibold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{ background: "rgba(201,169,110,0.10)", color: "rgba(201,169,110,0.85)", border: "1px solid rgba(201,169,110,0.25)" }}
                  >
                    Gold
                  </span>
                  <h3 className="font-serif text-primary text-xl leading-snug mb-1">Enhanced Clinical Support</h3>
                  <div className="w-6 h-px mt-2 mb-4" style={{ background: "rgba(201,169,110,0.45)" }} />
                  <div className="mb-3">
                    <span className="font-serif text-primary text-3xl tracking-tight">£1,950</span>
                    <span className="text-muted-foreground/60 text-[13px] font-light ml-1.5">per month</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed">
                    For clients requiring intensive support, greater availability, and closer case management.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                  {[
                    "12 individual sessions per month",
                    "Everything in Structured Support",
                    "Priority support access",
                    "Enhanced case management",
                    "Crisis planning support",
                    "Extended care coordination",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-4 h-px flex-shrink-0 mt-[9px]" style={{ background: "rgba(201,169,110,0.55)" }} />
                      <span className="text-[13px] text-primary/70 font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <button
                    className="w-full text-[13px] font-medium tracking-wide py-3 px-5 rounded-none border transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                    style={{ border: "1px solid rgba(22,43,59,0.25)", color: "rgba(22,43,59,0.80)" }}
                  >
                    Book a confidential call
                  </button>
                </Link>
              </div>
            </div>

          </div>

          {/* Clinical notes */}
          <div className="mt-8 md:mt-10 max-w-3xl mx-auto flex flex-col gap-3">
            <div className="w-8 h-px mx-auto" style={{ background: "rgba(201,169,110,0.40)" }} />
            <p className="text-[13px] text-muted-foreground/65 font-light leading-relaxed text-center">
              All programme options begin with a confidential consultation to ensure the level of support is clinically appropriate. If detox, residential treatment, or a higher level of care is indicated, we will advise this clearly.
            </p>
            <p className="text-[12px] text-muted-foreground/45 font-light leading-relaxed text-center">
              Programme structure may be adapted depending on clinical need, availability, risk, and agreed care boundaries.
            </p>
          </div>

        </div>
      </section>

      <RelatedServiceLinks
        links={[
          { title: "Private Rehab Alternative UK", description: "Compare online support with residential and community options.", href: "/private-rehab-alternative-uk" },
          { title: "Treatment Placement", description: "Explore a higher level of care when detox or residential support may be required.", href: "/treatment-placement" },
          { title: "Private Rehab UK", description: "Understand when UK residential treatment may be appropriate.", href: "/private-rehab-uk" },
          { title: "Family Guidance", description: "Help for families supporting someone through addiction or recovery.", href: "/what-we-offer#family-guidance" },
          { title: "Detox Suitability Assessment", description: "Consider withdrawal risk before attempting to stop alcohol or drugs.", href: "/assessments/detox" },
        ]}
      />

      <FAQSection items={onlineProgrammeFaqs} />

      {/* ── CTA ── */}
      <CTASection
        heading="Ready to build recovery with structure?"
        description="Start with a confidential consultation. We will help you understand whether the online programme is the right level of support for your situation."
        primaryCta={{ label: "Book a confidential call", href: "/contact" }}
        secondaryCta={{ label: "Take a free assessment", href: "/assessments" }}
      />
    </Layout>
  );
}
