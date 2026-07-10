import { ArrowRight, Check, Clock3, HeartHandshake, MapPin, Phone, ShieldCheck, UserRoundCheck } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { PathwayCard } from "@/components/ui/pathway-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ServiceSummary } from "@/components/ui/service-summary";
import craigImage from "@/assets/craig-bilton.jpg";
import familyImage from "@/assets/hero-family-guidance.webp";
import onlineImage from "@/assets/hero-online-programme.webp";
import treatmentImage from "@/assets/hero-treatment-placement.webp";

const SITE_URL = "https://www.insightrecoverynetwork.com";

const pathways = [
  {
    title: "I need help for myself",
    description: "Understand whether online support, detox or residential treatment is the safest next step.",
    href: "/treatment-placement",
    linkLabel: "Explore my options",
  },
  {
    title: "I am worried about someone",
    description: "Get a family plan even if your loved one denies the problem or is refusing treatment.",
    href: "/family-addiction-intervention-uk",
    linkLabel: "Get family guidance",
  },
  {
    title: "I need discreet professional help",
    description: "Compare private treatment and online support around work, family and confidentiality.",
    href: "/confidential-addiction-help-professionals",
    linkLabel: "View confidential support",
  },
  {
    title: "I am comparing rehab costs",
    description: "See realistic UK and international cost ranges and what should be included.",
    href: "/how-much-does-rehab-cost-uk",
    linkLabel: "Compare rehab costs",
  },
];

const services = [
  {
    image: treatmentImage,
    title: "Private treatment placement",
    body: "Clarify detox needs, compare suitable private rehab options and coordinate the move into treatment in the UK or selected international destinations.",
    href: "/treatment-placement",
    cta: "Compare treatment options",
  },
  {
    image: familyImage,
    title: "Family consultation and intervention",
    body: "Create a calm, practical plan for risk, communication, boundaries and treatment, even before your loved one agrees to help.",
    href: "/family-addiction-intervention-uk",
    cta: "Get family guidance",
  },
  {
    image: onlineImage,
    title: "Structured online recovery support",
    body: "A private, structured route for medically stable people who need recovery support around work, family or aftercare responsibilities.",
    href: "/online-programme",
    cta: "Check online suitability",
  },
];

const destinations = [
  ["United Kingdom", "/private-rehab-uk"],
  ["South Africa", "/private-rehab-south-africa"],
  ["Thailand", "/private-rehab-thailand"],
  ["Spain", "/private-rehab-spain"],
  ["Sri Lanka", "/private-rehab-sri-lanka"],
] as const;

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Private Rehab Placement & Addiction Guidance UK"
        fullTitle="Private Rehab Placement & Addiction Guidance UK | Insight Recovery Network"
        description="Confidential help choosing private rehab, detox, family intervention or structured online addiction support. UK and selected international treatment guidance led by Craig Bilton."
        canonical="/"
        ogImage={`${SITE_URL}/og-home-v2.png`}
      />

      <section className="relative overflow-hidden border-y border-accent/15 bg-[linear-gradient(155deg,#F2EDE3_0%,#F8F6F1_54%,#ECE6DB_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(201,169,110,0.2),transparent_42%)]" />
        <div className="container relative mx-auto grid min-h-[650px] grid-cols-1 items-center gap-10 px-6 py-10 md:px-12 md:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
          <div className="lg:col-span-6">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Private rehab placement and addiction guidance for the UK and abroad
            </p>
            <h1 className="mb-6 max-w-2xl font-serif text-[2.55rem] font-medium leading-[1.04] tracking-tight text-primary md:text-6xl lg:text-[4rem]">
              Find the right rehab, detox or recovery support without guessing.
            </h1>
            <p className="mb-5 max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              Confidential guidance for individuals and families making urgent, expensive and deeply personal treatment decisions.
            </p>
            <p className="mb-8 max-w-xl leading-relaxed text-muted-foreground">
              Speak directly with Craig Bilton, drawing on more than 20 years of international addiction-treatment experience, and get a clear plan for what should happen next.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 w-full rounded-none px-7 text-sm sm:w-auto">
                  Discuss treatment options today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/family-addiction-intervention-uk">
                <Button variant="outline" className="h-12 w-full rounded-none border-primary/25 bg-white/40 px-7 text-sm hover:bg-white/70 sm:w-auto">
                  I am worried about someone
                </Button>
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-5">
              <a href="tel:+447415994475" className="inline-flex items-center font-medium text-primary hover:text-accent">
                <Phone className="mr-2 h-3.5 w-3.5 text-accent" />
                Call +44 7415 994475
              </a>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span>Confidential · No obligation · UK and international options</span>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-x-5 gap-y-3 border-t border-primary/10 pt-6 text-xs text-muted-foreground sm:grid-cols-4">
              {["Clinical fit", "Detox safety", "Budget and location", "Aftercare planning"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="absolute -inset-3 rounded-2xl border border-accent/20 bg-accent/10" />
            <img
              src={treatmentImage}
              alt="A calm private residential addiction treatment setting"
              className="relative aspect-[5/4] w-full rounded-xl object-cover shadow-2xl"
              width={1200}
              height={960}
              fetchPriority="high"
            />
            <div className="absolute -bottom-5 left-4 right-4 rounded-xl border border-white/20 bg-primary/95 p-5 text-primary-foreground shadow-xl backdrop-blur md:left-7 md:right-7">
              <div className="flex items-center gap-4">
                <img src={craigImage} alt="Craig Bilton, Founder of Insight Recovery Network" className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-accent/60" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base">Speak directly with Craig Bilton</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">Founder &amp; Clinical Director · 20+ years’ international experience</p>
                </div>
                <ShieldCheck className="hidden h-6 w-6 text-accent sm:block" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-amber-200/60 bg-amber-50/70">
        <div className="container mx-auto flex flex-col gap-2 px-6 py-4 text-sm leading-relaxed text-primary md:flex-row md:items-center md:justify-between md:px-12">
          <p><strong>Immediate danger or medical emergency?</strong> IRN is not a crisis service. Call 999 or attend A&amp;E.</p>
          <a href="https://111.nhs.uk" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">Urgent non-emergency help: NHS 111</a>
        </div>
      </div>

      <section className="bg-secondary/20 py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader label="Start with your situation" heading="You do not need to know which service you need." className="mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pathways.map((pathway, index) => (
              <PathwayCard key={pathway.title} {...pathway} delay={index * 75} />
            ))}
          </div>
        </div>
      </section>

      <ServiceSummary
        who="Individuals, families and professionals deciding between private rehab, detox, intervention and structured online recovery support."
        problem="Turns a confusing treatment search into a safer, clinically informed and financially clearer decision."
        applies="Across the UK, with selected treatment options in South Africa, Thailand, Spain and Sri Lanka."
        nextStep="Discuss treatment options today"
        updated="10 July 2026"
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">How we help</p>
              <h2 className="font-serif text-3xl leading-tight text-primary md:text-5xl">The right level of help, not the loudest sales promise.</h2>
            </div>
            <p className="leading-relaxed text-muted-foreground lg:col-span-5">
              Every route starts with understanding risk, substance use, mental health, previous treatment, family context, budget and what is realistically possible now.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.title} href={service.href}>
                <article className="group h-full overflow-hidden rounded-xl border border-border/40 bg-white transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                  <div className="h-52 overflow-hidden">
                    <img src={service.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 h-px w-7 bg-accent" />
                    <h3 className="font-serif text-2xl text-primary">{service.title}</h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{service.body}</p>
                    <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-accent group-hover:text-primary">
                      {service.cta}<ArrowRight className="ml-2 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-12 text-primary-foreground md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(201,169,110,0.12),transparent_42%)]" />
        <div className="container relative mx-auto grid items-center gap-10 px-6 md:px-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-white/10">
              <img src={craigImage} alt="Craig Bilton, Founder and Clinical Director" className="aspect-[4/5] w-full object-cover object-top" loading="lazy" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Experienced, direct and transparent</p>
            <h2 className="max-w-3xl font-serif text-3xl leading-tight text-primary-foreground md:text-5xl">A treatment decision should be based on fit, not fear, photographs or pressure.</h2>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-primary-foreground/70">
              Craig Bilton has worked across residential treatment, complex case management, family support and continuing care in the UK and internationally for more than two decades.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                { Icon: UserRoundCheck, title: "Direct access", body: "Know who you are speaking with and what happens next." },
                { Icon: ShieldCheck, title: "Clear boundaries", body: "IRN does not diagnose, prescribe or provide emergency care." },
                { Icon: HeartHandshake, title: "Transparent relationships", body: "Any relevant provider or commercial relationship should be explained before a decision." },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="border-t border-white/15 pt-5">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-4 font-serif text-lg text-primary-foreground">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{body}</p>
                </div>
              ))}
            </div>
            <Link href="/craig-bilton" className="mt-8 inline-flex items-center text-sm font-semibold text-accent hover:text-white">
              About Craig’s experience <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">What happens after you enquire</p>
            <h2 className="font-serif text-3xl text-primary md:text-4xl">A clear first conversation, with no obligation to proceed.</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              { Icon: Clock3, title: "1. Tell us what is happening", body: "Share only what you are comfortable sharing. We identify immediate safety, withdrawal or safeguarding priorities first." },
              { Icon: UserRoundCheck, title: "2. Clarify the right level of care", body: "We discuss whether family guidance, online support, detox, residential treatment or another route appears proportionate." },
              { Icon: MapPin, title: "3. Decide the next practical step", body: "Where appropriate, we compare suitable routes, explain trade-offs and help coordinate the move forward." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="border border-border/40 bg-white p-6">
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                <h3 className="mt-5 font-serif text-xl text-primary">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Treatment destinations</p>
              <h2 className="font-serif text-3xl leading-tight text-primary md:text-4xl">Compare the setting as carefully as the price.</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Location affects clinical fit, treatment length, family involvement, travel, confidentiality, total cost and the quality of aftercare. Overseas is not automatically better or cheaper.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {destinations.map(([name, href]) => (
                <Link key={name} href={href} className="group flex items-center justify-between border border-border/40 bg-secondary/15 px-5 py-4 text-sm font-medium text-primary hover:border-accent/50 hover:bg-white">
                  Private rehab in {name}<ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-1" />
                </Link>
              ))}
              <Link href="/how-much-does-rehab-cost-uk" className="group flex items-center justify-between border border-accent/40 bg-accent/10 px-5 py-4 text-sm font-semibold text-primary hover:bg-accent/15">
                Compare treatment costs<ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading="You do not need to make the treatment decision alone."
        body="Tell us what is happening. We will help you identify the safest, most proportionate next step and explain the realistic options without pressure."
        primaryLabel="Discuss treatment options today"
        primaryHref="/contact"
        secondaryLabel="I am worried about someone"
        secondaryHref="/family-addiction-intervention-uk"
      />
    </Layout>
  );
}
