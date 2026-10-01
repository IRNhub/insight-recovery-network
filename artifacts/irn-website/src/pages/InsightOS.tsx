import { useEffect } from "react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { getOgConfig, ogImageUrl } from "@/config/og-pages";
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

import heroMockupImg from "@/assets/ios-hero-mockup.webp";
import phoneCheckinImg from "@/assets/ios-phone-checkin.webp";
import anchorGuidanceImg from "@/assets/ios-anchor-guidance.webp";
import recoveryToolsImg from "@/assets/ios-recovery-tools.webp";

const APP_STORE_URL = "https://apps.apple.com/gb/app/insightos/id6807662315";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.insightrecoverynetwork.insightrecovery";
const launchDescription = "InsightOS by Insight Recovery Network brings daily check-ins, private journalling, mood and trigger tracking, recovery planning and guided programmes together on iPhone, Android and the web.";

function StoreDownloadLinks() {
  return (
    <div className="flex flex-wrap items-center gap-6 py-3" aria-label="Download InsightOS">
      <a href={APP_STORE_URL} rel="noreferrer" className="inline-flex shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        <img src="/store-badges/app-store-en.svg" alt="Download on the App Store" width="144" height="48" className="block h-12 w-auto" />
      </a>
      <a href={GOOGLE_PLAY_URL} rel="noreferrer" className="inline-flex shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        <img src="/store-badges/google-play-en.svg" alt="Get it on Google Play" width="162" height="48" className="block h-12 w-auto" />
      </a>
    </div>
  );
}

const features = [
  {
    Icon: CalendarCheck,
    title: "Daily Check-ins",
    body: "Build consistency through simple daily reflection. Use a structured check-in to reflect on today and notice patterns over time.",
  },
  {
    Icon: Activity,
    title: "Mood & Trigger Tracking",
    body: "Notice emotional and behavioural patterns before they escalate. Tracking creates visibility, and visibility creates choice.",
  },
  {
    Icon: BookOpen,
    title: "Guided Journaling",
    body: "Turn thoughts and experiences into insight and action. Use structured prompts or write about what matters to you.",
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
    body: "Review patterns, wins, and areas needing attention. Keep a record you can return to and reflect on.",
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
    body: "Record patterns and warning signs that you may want to discuss with your support network.",
  },
  {
    Icon: CalendarCheck,
    title: "Build recovery consistency",
    body: "Small daily actions, done consistently, create the foundation long-term recovery is built on.",
  },
  {
    Icon: CheckCircle2,
    title: "Strengthen accountability",
    body: "Keep a private record of your recovery work. Sharing is a deliberate choice, not automatic monitoring.",
  },
  {
    Icon: ArrowRight,
    title: "Turn insight into action",
    body: "Understanding patterns is only useful if it leads to change. The platform bridges insight and practical next steps.",
  },
  {
    Icon: Users,
    title: "Stay connected to support",
    body: "Between sessions, groups, and appointments, Insight OS keeps recovery active and supported.",
  },
  {
    Icon: RefreshCw,
    title: "Maintain progress after treatment",
    body: "Keep check-ins, reflection and practical plans together as you return to everyday life after treatment.",
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
    body: "The relapse prevention tools inside Insight OS make abstract plans concrete, accessible in real time, updated as recovery develops.",
  },
];

const insightOsOg = getOgConfig("/insight-os")!;

export default function InsightOS() {
  useEffect(() => {
    // The route loads lazily, so the browser can miss its initial fragment target.
    if (window.location.hash === "#download") {
      document.getElementById("download")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, []);

  return (
    <Layout>
      <SEO
        title={insightOsOg.seoTitle ?? insightOsOg.title}
        description={launchDescription}
        canonical="/insight-os"
        ogImage={ogImageUrl(insightOsOg.file)}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Insight OS",
            "description": launchDescription,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "iOS, Android, Web",
            "downloadUrl": [APP_STORE_URL, GOOGLE_PLAY_URL],
            "provider": { "@type": "Organization", "name": "Insight Recovery Network", "url": "https://www.insightrecoverynetwork.com" },
            "url": "https://www.insightrecoverynetwork.com/insight-os",
          })}
        </script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background py-8 md:py-12 lg:py-14">
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
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-primary/80">
                InsightOS by Insight Recovery Network
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif text-primary leading-[1.08] tracking-tight">
                InsightOS. Recovery, brought together.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                Bring daily check-ins, private journalling, mood and trigger tracking, and recovery planning together. InsightOS supports the day-to-day work of addiction recovery alongside appropriate human care.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                {[
                  "Daily structure between sessions and groups",
                  "Relapse prevention and trigger tracking",
                  "Optional Anchor AI for reflection",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13px] text-muted-foreground/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <div id="download" className="scroll-mt-24 space-y-3 pt-2">
                <StoreDownloadLinks />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Free to download. Foundation tools are free; Full Recovery is an optional auto-renewing subscription. For adults aged 18 and over.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  On Google Play, the app is listed as Insight Recovery by Insight Recovery Network.
                </p>
                <a href="https://irnonline.app" rel="noreferrer" className="inline-block text-sm text-primary underline underline-offset-4 py-2">
                  Prefer a browser? Open the web app
                </a>
              </div>
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
                <ResponsiveImage
                  src={heroMockupImg}
                  alt="Insight OS dashboard on laptop and phone"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 15%" }}
                  fetchPriority="high"
                  loading="eager"
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
      <section id="platform-features" className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Platform features
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight max-w-2xl">
              Built for the daily work of recovery.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/75 font-light leading-relaxed mt-4 max-w-2xl">
              Recovery is built through repeated daily actions, not only during therapy or treatment. Insight OS provides the tools to keep recovery active between every session, group, and appointment.
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
      <section className="py-12 md:py-20 bg-background">
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
                <ResponsiveImage
                  src={anchorGuidanceImg}
                  alt="Anchor guidance interface on laptop and phone showing recovery prompts"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 20%" }}
                  loading="lazy"
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
                Anchor offers optional AI-supported reflection and recovery prompts. The app explains what information will be sent to OpenAI and asks for your permission before each request.
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
                  AI responses can be inaccurate. Anchor is not medical advice, therapy, clinical monitoring or emergency support.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What Insight OS helps you do ── */}
      <section className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
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

      {/* ── Not just content, an active recovery system, split layout ── */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Text */}
            <div className="flex flex-col gap-5">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70">
                How it works
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Not just content, an active recovery system.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Insight OS is designed to help users <em>do</em> the work of recovery, not simply read about it. The platform combines daily engagement, structured reflection, tracking, planning, and guided support into a single connected experience.
              </p>
              <div className="flex flex-col gap-2.5 mt-1">
                {[
                  "Simple daily check-ins",
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
                <ResponsiveImage
                  src={phoneCheckinImg}
                  alt="Insight OS daily check-in screen on mobile phone"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 10%" }}
                  loading="lazy"
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
                <ResponsiveImage
                  src={recoveryToolsImg}
                  alt="Insight OS recovery tools, journaling, grounding, and reflection"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 25%" }}
                  loading="lazy"
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
                Insight OS includes grounding techniques, breathing exercises, guided reflection, and journaling tools, accessible in the moments where support is most needed.
              </p>
              <p className="text-[14px] text-muted-foreground/75 font-light leading-relaxed">
                Explore grounding, breathing and reflection exercises as part of your recovery routine. Choose tools that fit your needs and any guidance from your care team.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Included with our recovery pathways ── */}
      <section
        className="py-12 md:py-20 relative overflow-hidden"
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

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8">Start with Foundation. Explore Full Recovery.</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-primary/15 p-6">
              <h3 className="text-xl font-serif text-primary mb-3">Free Foundation</h3>
              <p className="text-muted-foreground leading-relaxed">Daily check-ins, private journalling, mood and trigger records, clean-time tracking and Recovery Wins help you keep your day-to-day recovery work in one place.</p>
            </div>
            <div className="border border-primary/15 p-6">
              <h3 className="text-xl font-serif text-primary mb-3">Full Recovery subscription</h3>
              <p className="text-muted-foreground leading-relaxed">Includes the guided 90-Day Programme and the separate 12-week Recovery Foundations course, plus weekly planning, relapse prevention planning, recovery reports and advanced tools.</p>
            </div>
          </div>
          <div className="space-y-5 text-sm text-muted-foreground leading-relaxed mb-10">
            <p><strong className="text-primary">How much does it cost?</strong> Foundation is free. Full Recovery has monthly and annual options. Your app store shows the current local price and renewal terms before you confirm. Human therapy and treatment are separate services.</p>
            <p><strong className="text-primary">How do I cancel?</strong> Manage or cancel your subscription in the Apple or Google account used to subscribe. Deleting your InsightOS account or uninstalling the app does not cancel store billing. Use Restore Purchases in the app to restore eligible access.</p>
            <p><strong className="text-primary">Is this clinical care?</strong> InsightOS is a recovery education and self-management app for adults. It does not replace medical care, therapy, supervised withdrawal or emergency support.</p>
          </div>
          <h2 className="text-3xl font-serif text-primary mb-4">Download InsightOS and begin with one check-in.</h2>
          <Button asChild size="lg" className="rounded-none">
            <a href="#download">Choose your app store <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">Google Play lists the app as Insight Recovery by Insight Recovery Network.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm">
            <a href="https://irnonline.app/app-support" rel="noreferrer" className="text-primary underline underline-offset-4">App support</a>
            <a href="https://irnonline.app/privacy-policy" rel="noreferrer" className="text-primary underline underline-offset-4">App privacy notice</a>
            <a href="https://irnonline.app/terms" rel="noreferrer" className="text-primary underline underline-offset-4">App terms</a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries and regions. App Store is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.</p>
        </div>
      </section>
    </Layout>
  );
}
