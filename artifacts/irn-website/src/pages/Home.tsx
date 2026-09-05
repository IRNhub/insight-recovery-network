import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { RouteSchemas } from "@/components/RouteSchemas";
import { getRouteParity } from "@/data/route-parity";
import craigImage from "@/assets/craig-bilton.jpg";
import familyImage from "@/assets/hero-family-guidance.webp";
import onlineImage from "@/assets/hero-online-programme.webp";
import treatmentImage from "@/assets/hero-treatment-placement.webp";
import digitalToolsImage from "@/assets/hero-digital-tools.webp";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const parity = getRouteParity("/");

const pathways = [
  {
    title: "I need help for myself",
    description:
      "Understand whether online support, detox or residential treatment is the safest next step.",
    href: "/treatment-placement",
    linkLabel: "Explore my options",
  },
  {
    title: "I am worried about someone",
    description:
      "Get a family plan even if your loved one denies the problem or is refusing treatment.",
    href: "/family-addiction-intervention-uk",
    linkLabel: "Get family guidance",
  },
  {
    title: "I need discreet professional help",
    description:
      "Compare private treatment and online support around work, family and confidentiality.",
    href: "/confidential-addiction-help-professionals",
    linkLabel: "View confidential support",
  },
  {
    title: "I am comparing rehab costs",
    description:
      "See realistic UK and international cost ranges and what should be included.",
    href: "/how-much-does-rehab-cost-uk",
    linkLabel: "Compare rehab costs",
  },
];

const services = [
  {
    image: treatmentImage,
    imageAlt:
      "Private residential treatment setting used to illustrate treatment placement",
    title: "Private treatment placement",
    body: "Clarify detox needs, compare suitable private rehab options and coordinate the move into treatment in the UK or selected international destinations.",
    href: "/treatment-placement",
    cta: "Compare treatment options",
  },
  {
    image: familyImage,
    imageAlt: "Private family consultation for addiction support",
    title: "Family consultation and intervention",
    body: "Create a calm, practical plan for risk, communication, boundaries and treatment, even before your loved one agrees to help.",
    href: "/family-addiction-intervention-uk",
    cta: "Get family guidance",
  },
  {
    image: onlineImage,
    imageAlt: "Person accessing structured online addiction recovery support",
    title: "Structured online recovery support",
    body: "A private, structured route for medically stable people who need recovery support around work, family or aftercare responsibilities.",
    href: "/online-programme",
    cta: "Check online suitability",
  },
  {
    image: digitalToolsImage,
    imageAlt: "Insight OS digital recovery planning and check-in tools",
    title: "Insight OS recovery tools",
    body: "Daily check-ins, journalling, recovery planning and pattern tracking that help turn a treatment plan into repeatable everyday actions.",
    href: "/insight-os",
    cta: "Explore Insight OS",
  },
];

const destinations = [
  ["United Kingdom", "/private-rehab-uk"],
  ["South Africa", "/private-rehab-south-africa"],
  ["Thailand", "/private-rehab-thailand"],
  ["Spain", "/private-rehab-spain"],
  ["Sri Lanka", "/private-rehab-sri-lanka"],
] as const;

import { PlacementJourney } from "@/components/PlacementJourney";
import { placementChecks } from "@/data/placement-journey.js";
export default function Home() {
  return (
    <Layout>
      <SEO
        title={parity.title}
        fullTitle={parity.title}
        description={parity.description}
        canonical={parity.canonical}
        noIndex={!parity.indexable}
        ogImage={`${SITE_URL}/og-home-v2.png`}
      />
      <RouteSchemas route="/" />
      <section className="home-hero border-b border-border/70">
        <div className="container mx-auto grid items-center gap-9 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-5">
              Private rehab placement · UK & international
            </p>
            <h1 className="max-w-2xl font-serif text-[2.6rem] font-medium leading-[1.08] tracking-tight text-primary sm:text-5xl lg:text-[3.9rem]">
              {parity.h1}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {parity.heroIntro}
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-auto min-h-12 w-full whitespace-normal rounded-md px-6 py-3 sm:w-auto"
              >
                <Link
                  href={parity.primaryCta.href}
                  data-primary-commercial-cta="true"
                  data-analytics-event={parity.primaryCta.analyticsEvent}
                  data-source-page={parity.primaryCta.sourcePage}
                  data-service-interest={parity.primaryCta.serviceInterest}
                  data-cta-location={parity.primaryCta.location}
                >
                  {parity.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="tel:+447415994475"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                +44 7415 994475
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              A private conversation. No obligation to proceed.
            </p>
            <div className="mt-8 flex items-start gap-3 border-t border-primary/15 pt-6">
              <ShieldCheck
                className="mt-1 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                <strong className="font-semibold text-primary">
                  Speak directly with Craig Bilton.
                </strong>{" "}
                More than 20 years’ international experience in addiction
                treatment, family support and recovery programme management.
              </p>
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ResponsiveImage
              src={craigImage}
              alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network"
              width={1227}
              height={1536}
              sizes="(min-width: 1024px) 440px, (min-width: 640px) 448px, calc(100vw - 48px)"
              fetchPriority="high"
              loading="eager"
              className="hero-portrait w-full rounded-2xl object-cover object-top"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-xl bg-primary/95 p-5 text-white">
              <p className="font-serif text-xl">Craig Bilton</p>
              <p className="mt-1 text-sm text-white/85">
                Founder & Clinical Director
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="border-b border-border bg-white py-5">
        <div className="container mx-auto px-6 md:px-12">
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
            <strong className="text-primary">Need urgent medical help?</strong>{" "}
            IRN is not an emergency service. In immediate danger, call{" "}
            <a className="font-semibold underline" href="tel:999">
              999
            </a>{" "}
            or attend A&amp;E. For urgent non-emergency advice, use{" "}
            <a
              href="https://111.nhs.uk"
              className="font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NHS 111
            </a>
            .
          </p>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <p className="eyebrow mb-3">Start where you are</p>
          <h2 className="section-title max-w-2xl">
            You do not need to have the answers yet.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pathways.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="pathway-link group rounded-xl border border-border bg-white p-6 md:p-7"
              >
                <h3 className="font-serif text-2xl text-primary">{p.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {p.linkLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-14 text-white md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#dccaa3]">
            A considered treatment decision
          </p>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
            Understand the options before you commit.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-white/85">
            A suitable placement depends on the person, their needs and what is
            realistically possible. These are the questions we help you work
            through.
          </p>
          <div className="mt-9 grid gap-7 md:grid-cols-3">
            {placementChecks.map((p, i) => (
              <div key={p.title} className="border-t border-white/25 pt-5">
                <span className="text-sm text-[#dccaa3]">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold">
            <Link
              href="/treatment-placement"
              className="underline underline-offset-4"
            >
              How treatment placement works
            </Link>
            <Link
              href="/services-pricing-guide"
              className="underline underline-offset-4"
            >
              IRN services and fees
            </Link>
          </div>
        </div>
      </section>
      <PlacementJourney />
      <section className="border-y border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <p className="eyebrow mb-3">Support that fits the situation</p>
          <h2 className="section-title">
            Different needs. Practical routes forward.
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                href={s.href}
                key={s.href}
                className="group overflow-hidden rounded-xl border border-border"
              >
                <ResponsiveImage
                  src={s.image}
                  alt={s.imageAlt}
                  loading="lazy"
                  width={640}
                  height={400}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 48px)"
                  className="aspect-[8/5] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-serif text-xl text-primary">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {s.cta}
                    <ArrowRight
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <div className="container mx-auto grid gap-10 px-6 md:px-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">UK and international options</p>
            <h2 className="section-title">Compare the whole treatment plan.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Location is one part of the decision. Consider clinical
              suitability, total cost, travel, family involvement and support
              after treatment.
            </p>
            <Link
              href="/how-much-does-rehab-cost-uk"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
            >
              Compare rehab costs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border bg-white px-6">
            {destinations.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-16 items-center justify-between gap-4 py-4 text-primary hover:underline underline-offset-4"
              >
                Private rehab in {name}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        heading="A clearer next step starts with a conversation."
        description="Tell us what you need help with, in your own time and your own words. We will help you understand the options."
        primaryLabel="Talk through your options"
        primaryHref="/get-help"
        secondaryLabel="About Craig and IRN"
        secondaryHref="/about"
      />
    </Layout>
  );
}
