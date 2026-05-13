import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Activity,
  BookOpen,
  Shield,
  Wrench,
  BarChart2,
  Lightbulb,
  RefreshCw,
  Users,
  ArrowRight,
  Anchor,
  CheckCircle2,
} from "lucide-react";

import heroMockupImg from "@/assets/ios-hero-mockup.png";
import phoneCheckinImg from "@/assets/ios-phone-checkin.png";
import anchorGuidanceImg from "@/assets/ios-anchor-guidance.png";
import recoveryToolsImg from "@/assets/ios-recovery-tools.png";

const features = [
  {
    Icon: CalendarCheck,
    title: "Daily Check-ins",
    body: "Build consistency through simple daily reflection. A structured check-in takes under two minutes and builds awareness over time.",
  },
  {
    Icon: Activity,
    title: "Mood & Trigger Tracking",
    body: "Notice emotional and behavioural patterns before they escalate. Tracking creates visibility — and visibility creates choice.",
  },
  {
    Icon: BookOpen,
    title: "Guided Journaling",
    body: "Turn thoughts and experiences into insight and action. Structured prompts guide reflection beyond what unstructured writing typically reaches.",
  },
  {
    Icon: Shield,
    title: "Relapse Prevention Planning",
    body: "Create a practical plan for warning signs, triggers, and high-risk situations. A plan that exists is a plan that can be used.",
  },
  {
    Icon: Wrench,
    title: "Recovery Tools",
    body: "Access grounding, breathing, and reflection tools when support is needed. Practical techniques, available at the moment that matters.",
  },
  {
    Icon: BarChart2,
    title: "Progress & Insight",
    body: "Review patterns, wins, and areas needing attention. Progress reviewed regularly is progress sustained.",
  },
];

const anchorBullets = [
  "Guided reflection",
  "Trigger support",
  "Recovery planning prompts",
  "Daily motivation",
  "Worksheet support",
  "Progress insights",
];

const outcomes = [
  {
    Icon: Lightbulb,
    title: "Recognise risk earlier",
    body: "Daily tracking surfaces patterns that are easy to miss. Earlier recognition creates earlier intervention.",
  },
  {
    Icon: CalendarCheck,
    title: "Build recovery consistency",
    body: "Small daily actions, done consistently, create the foundation long-term recovery is built on.",
  },
  {
    Icon: CheckCircle2,
    title: "Strengthen accountability",
    body: "A structured digital record creates honest visibility for both the individual and their support network.",
  },
  {
    Icon: ArrowRight,
    title: "Turn insight into action",
    body: "Understanding patterns is only useful if it leads to change. The platform bridges insight and practical next steps.",
  },
  {
    Icon: Users,
    title: "Stay connected to support",
    body: "Between sessions, groups, and appointments — Insight OS keeps recovery active and supported.",
  },
  {
    Icon: RefreshCw,
    title: "Maintain progress after treatment",
    body: "The post-treatment period is high-risk. Structured digital support reduces the likelihood of relapse in the critical early months.",
  },
];

const pathways = [
  {
    label: "Online Programme",
    href: "/online-programme",
    body: "Insight OS is integrated into the online programme, giving clients a structured digital space to continue the work between group sessions and one-to-one appointments.",
  },
  {
    label: "Aftercare Support",
    href: "/what-we-offer",
    body: "Following residential treatment or intensive support, Insight OS provides a structured daily rhythm to sustain recovery gains through the high-risk transition period.",
  },
  {
    label: "Relapse Prevention Planning",
    href: "/what-we-offer",
    body: "The relapse prevention tools inside Insight OS make abstract plans concrete — accessible in real time, updated as recovery develops.",
  },
];

export default function InsightOS() {
  return (
    <Layout>
      <SEO
        title="Insight OS — The Operating System for Your Recovery"
        description="Insight OS is a structured digital recovery platform with daily check-ins, mood tracking, guided journaling, relapse prevention tools, and Anchor recovery guidance."
        canonical="/insight-os"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background py-14 md:py-24 lg:py-28">
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
                Digital Recovery Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif text-primary leading-[1.08] tracking-tight">
                Insight OS: the operating system for your recovery.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                A structured digital recovery platform helping users build daily consistency, track progress, recognise risk, and stay connected to the tools that support long-term change.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                {[
                  "Daily structure between sessions and groups",
                  "Relapse prevention and trigger tracking",
                  "Anchor: your recovery guide",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13px] text-muted-foreground/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="https://irnonline.app" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base shadow-sm w-full sm:w-auto">
                    Open Insight OS
                  </Button>
                </a>
                <a href="#platform-features">
                  <Button variant="outline" size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                    Explore the Platform
                  </Button>
                </a>
              </div>
              <p className="text-[11.5px] text-muted-foreground/55 font-light tracking-wide">
                Private, structured, recovery-focused support.
              </p>
            </div>

            {/* Right: product mockup image */}
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
                  src={heroMockupImg}
                  alt="Insight OS dashboard on laptop and phone"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 15%" }}
                />
                <div
                  className="absolute bottom-4 left-4 z-20 px-3.5 py-2.5 rounded-lg"
                  style={{ background: "rgba(22,43,59,0.82)", backdropFilter: "blur(8px)" }}
                >
                  <p className="font-serif text-white text-[12px] leading-tight">Insight OS</p>
                  <p className="text-white/55 text-[10.5px] font-light">Check-in · Journal · Plan · Progress</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Built for the daily work of recovery ── */}
      <section id="platform-features" className="py-14 md:py-24" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Platform features
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight max-w-2xl">
              Built for the daily work of recovery.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/75 font-light leading-relaxed mt-4 max-w-2xl">
              Recovery is built through repeated daily actions — not only during therapy or treatment. Insight OS provides the tools to keep recovery active between every session, group, and appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="group flex flex-col bg-white border border-border/30 rounded-xl p-6 transition-all duration-300 hover:border-primary/15"
                style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 5px 20px -4px rgba(22,43,59,0.10)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(22,43,59,0.05)")}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(246,244,240,1)", border: "1px solid rgba(201,169,110,0.25)" }}
                  >
                    <item.Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-[10.5px]" style={{ color: "rgba(201,169,110,0.75)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="w-4 h-px mb-3" style={{ background: "rgba(201,169,110,0.45)" }} />
                <h3 className="font-serif text-primary text-[17px] leading-snug mb-2">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Anchor ── */}
      <section className="py-14 md:py-24 bg-background">
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
                  src={anchorGuidanceImg}
                  alt="Anchor guidance interface on laptop and phone showing recovery prompts"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 20%" }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-5 order-1 lg:order-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "rgba(246,244,240,1)", border: "1px solid rgba(201,169,110,0.28)" }}
                >
                  <Anchor className="w-4 h-4 text-accent" strokeWidth={1.5} />
                </div>
                <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                  Recovery guide
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Meet Anchor, your recovery guide.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Anchor provides reflective prompts, practical guidance, emotional check-ins, and recovery-focused support based on the tools and frameworks inside Insight OS.
              </p>
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                {anchorBullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2.5">
                    <div className="w-4 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.65)" }} />
                    <span className="text-[13px] text-primary/70 font-light">{bullet}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-2 rounded-xl p-4 md:p-5"
                style={{ background: "rgba(246,244,240,0.70)", border: "1px solid rgba(201,169,110,0.18)" }}
              >
                <p className="text-[12.5px] text-muted-foreground/70 font-light leading-relaxed">
                  Anchor does not replace therapy, emergency support, or clinical care, but it helps users stay engaged with recovery between sessions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What Insight OS helps you do ── */}
      <section className="py-14 md:py-24" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Outcomes
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight max-w-2xl">
              What Insight OS helps you do.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {outcomes.map((item, i) => (
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

      {/* ── Not just content, an active recovery system — split layout ── */}
      <section className="py-14 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Text */}
            <div className="flex flex-col gap-5">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                How it works
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Not just content — an active recovery system.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Insight OS is designed to help users <em>do</em> the work of recovery, not simply read about it. The platform combines daily engagement, structured reflection, tracking, planning, and guided support into a single connected experience.
              </p>
              <div className="flex flex-col gap-2.5 mt-1">
                {[
                  "Daily check-ins that take under two minutes",
                  "Structured prompts rather than blank pages",
                  "Plans that exist when they are needed most",
                  "Progress that can be reviewed and shared",
                  "Tools available in the moments that matter",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13.5px] text-primary/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: "72%" }}>
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-5 md:translate-y-5 rounded-xl"
                  style={{
                    background: "rgba(201,169,110,0.09)",
                    border: "1px solid rgba(201,169,110,0.20)",
                  }}
                />
                <img
                  src={phoneCheckinImg}
                  alt="Insight OS daily check-in screen on mobile phone"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 10%" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Recovery tools visual ── */}
      <section className="py-14 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
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
                  src={recoveryToolsImg}
                  alt="Insight OS recovery tools — journaling, grounding, and reflection"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-5 order-1 lg:order-2">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                Recovery tools
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Tools for the moments that matter.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Insight OS includes grounding techniques, breathing exercises, guided reflection, and journaling tools — accessible in the moments where support is most needed.
              </p>
              <p className="text-[14px] text-muted-foreground/75 font-light leading-relaxed">
                These are not passive resources. They are interactive, structured tools that guide users through evidence-based techniques in real time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Included with our recovery pathways ── */}
      <section
        className="py-14 md:py-24 relative overflow-hidden"
        style={{ background: "rgba(22,43,59,1)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#F6F4F0,#F6F4F0 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#F6F4F0,#F6F4F0 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase block mb-3" style={{ color: "rgba(201,169,110,0.75)" }}>
              Integration
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
              Included with our recovery pathways.
            </h2>
            <p className="text-[14.5px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
              Insight OS is integrated into our online programme and recovery support pathways, giving clients a structured digital space to continue the work between groups, one-to-one sessions, and relapse prevention planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {pathways.map((p) => (
              <Link key={p.label} href={p.href}>
                <div
                  className="group flex flex-col h-full rounded-xl p-6 md:p-7 cursor-pointer transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,169,110,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.18)";
                  }}
                >
                  <div className="w-5 h-px mb-4" style={{ background: "rgba(201,169,110,0.50)" }} />
                  <h3 className="font-serif text-white text-[17px] leading-snug mb-3">{p.label}</h3>
                  <p className="text-[13px] font-light leading-relaxed flex-grow" style={{ color: "rgba(255,255,255,0.55)" }}>{p.body}</p>
                  <div className="flex items-center gap-2 mt-4" style={{ color: "rgba(201,169,110,0.70)" }}>
                    <span className="text-[11.5px] font-medium tracking-wide">Learn more</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        heading="Ready to use Insight OS?"
        description="Access the platform or speak with us about how Insight OS can support your recovery pathway."
        primaryCta={{ label: "Open Insight OS", href: "https://irnonline.app" }}
        secondaryCta={{ label: "Speak Confidentially", href: "/contact" }}
        isExternal={true}
      />
    </Layout>
  );
}
