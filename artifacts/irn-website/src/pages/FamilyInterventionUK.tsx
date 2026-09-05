import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ArrowRight, Check, HeartHandshake, Phone, Shield, Users } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { RouteSchemas } from "@/components/RouteSchemas";
import { getRouteParity } from "@/data/route-parity";
import familyImage from "@/assets/wwo-family-intervention.webp";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const CANONICAL = "/family-addiction-intervention-uk";
const parity = getRouteParity(CANONICAL);

const faqs: FAQItem[] = [
  {
    question: "Can I ask for help before my loved one agrees to treatment?",
    answer:
      "Yes. Families are often the first to make contact. A consultation can help you understand risk, decide what boundaries are realistic, plan a calmer conversation and consider treatment routes before the person has agreed to anything.",
  },
  {
    question: "Do you organise confrontational interventions?",
    answer:
      "Our approach is planned, respectful and safety-led. An intervention is not an ambush or a guarantee that someone will accept treatment. We help families prepare, communicate consistently, reduce enabling patterns and decide what they will do if treatment is refused.",
  },
  {
    question: "What if the person is intoxicated or becoming aggressive?",
    answer:
      "Do not attempt a high-stakes conversation while someone is intoxicated or where anybody may be unsafe. If there is immediate danger, violence, a serious medical concern or risk to life, call 999 or attend A&E. For urgent non-emergency medical or mental-health advice in England, use NHS 111.",
  },
  {
    question: "Can you help us compare private rehab options?",
    answer:
      "Yes. Where residential treatment may be appropriate, we can help clarify detox needs, clinical considerations, budget, location, family involvement and aftercare before suitable UK or international options are considered.",
  },
  {
    question: "Is the consultation confidential?",
    answer:
      "Yes. Initial family conversations are handled discreetly. We will also explain the limits of confidentiality and what information can or cannot be shared once other people or treatment providers become involved.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Family Addiction Consultation and Intervention Guidance UK",
  serviceType: "Family addiction consultation and intervention planning",
  provider: { "@type": "Organization", name: "Insight Recovery Network", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}${CANONICAL}`,
};

const signs = [
  "Alcohol or drug use is escalating and previous conversations have gone nowhere",
  "The family is divided about money, housing, boundaries or what help to offer",
  "You are repeatedly managing crises, covering consequences or feeling responsible for keeping everything together",
  "There are concerns about withdrawal, mental health, self-neglect, children or other safeguarding risks",
  "A treatment opportunity exists, but the family does not know how to present it safely",
  "You need an experienced, assessment-led view before paying for private treatment",
];

const process = [
  {
    title: "Understand what is happening",
    body: "We listen to the history, current risks, substance use, mental-health concerns, family dynamics and what has already been tried.",
  },
  {
    title: "Create one family plan",
    body: "We help the family agree what it will communicate, which boundaries are realistic and what support can be offered without making the situation easier to continue.",
  },
  {
    title: "Prepare the conversation",
    body: "We decide who should be involved, when to speak, what to say and how to respond to denial, anger, bargaining or refusal.",
  },
  {
    title: "Prepare treatment options",
    body: "Where appropriate, suitable detox, residential or online routes can be clarified in advance so the next step is practical rather than vague.",
  },
  {
    title: "Support the next step",
    body: "We help families move from conversation to assessment, admission or a structured alternative, while keeping safety and continuity in view.",
  },
];

export default function FamilyInterventionUK() {
  return (
    <Layout>
      <SEO
        title={parity.title}
        fullTitle={parity.title}
        description={parity.description}
        canonical={parity.canonical}
        noIndex={!parity.indexable}
        ogImage={`${SITE_URL}/addiction-intervention-uk.png`}
      />
      <RouteSchemas route={CANONICAL} />

      <section className="relative overflow-hidden border-b border-border/40 bg-secondary/20 py-10 md:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(201,169,110,0.16),transparent_42%)]" />
        <div className="container relative mx-auto grid grid-cols-1 items-center gap-10 px-6 md:px-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Confidential help for families
            </p>
            <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[3.5rem]">
              {parity.h1}
            </h1>
            <p className="mb-5 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
              {parity.heroIntro}
            </p>
            <p className="mb-8 max-w-xl leading-relaxed text-muted-foreground">
              Speak confidentially with Craig Bilton about risk, boundaries, how to approach the conversation and which treatment options should be ready if the person agrees.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={parity.primaryCta.href} data-analytics-event={parity.primaryCta.analyticsEvent} data-source-page={parity.primaryCta.sourcePage} data-service-interest={parity.primaryCta.serviceInterest} data-cta-location={parity.primaryCta.location} data-cta-label={parity.primaryCta.label}>
                <Button className="h-12 w-full rounded-none px-7 sm:w-auto">
                  {parity.primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+447415994475">
                <Button variant="outline" className="h-12 w-full rounded-none border-primary/25 px-7 sm:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  Call +44 7415 994475
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Private · No obligation · You can call without your loved one being present
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div className="absolute -inset-3 rounded-2xl border border-accent/20 bg-accent/10" />
            <ResponsiveImage
              src={familyImage}
              alt="A private family addiction consultation with an experienced adviser"
              className="relative aspect-[5/4] w-full rounded-xl object-cover shadow-xl"
              width={1200}
              height={960}
              fetchPriority="high"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-primary/90 p-4 text-primary-foreground backdrop-blur-sm sm:right-auto sm:max-w-xs">
              <p className="font-serif text-base">A clear plan before the next crisis</p>
              <p className="mt-1 text-xs leading-relaxed text-primary-foreground/65">
                Safety, communication, boundaries and treatment options considered together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-amber-200/60 bg-amber-50/70">
        <div className="container mx-auto px-6 py-4 text-sm leading-relaxed text-primary md:px-12">
          <strong>Immediate danger:</strong> IRN is not a crisis service. Call 999 or attend A&amp;E if someone is at immediate risk. For urgent non-emergency medical or mental-health help in England, use NHS 111.
        </div>
      </div>

      <ServiceSummary
        who="Families, partners, parents and friends worried about someone’s alcohol or drug use, denial, repeated relapse or refusal of help."
        problem="Creates a unified, safety-led plan for communication, boundaries, treatment options and the next practical step."
        applies="Confidential consultation by telephone or video across the UK, with treatment guidance in the UK and selected international destinations."
        nextStep="Discuss your family situation"
        updated="10 July 2026"
      />

      <section className="border-b border-border/40 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">When to contact us</p>
              <h2 className="font-serif text-3xl leading-tight text-primary md:text-4xl">
                You do not need to prove that things are “bad enough”.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Families often call while still questioning themselves. If the situation is affecting safety, trust, finances, children, work or the family’s ability to function, it is reasonable to ask for guidance.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {signs.map((sign) => (
                <div key={sign} className="flex gap-3 border border-border/40 bg-white p-5">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{sign}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">The consultation process</p>
            <h2 className="font-serif text-3xl text-primary md:text-4xl">From fear and disagreement to one practical plan</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {process.map((step, index) => (
              <div key={step.title} className="border border-border/40 bg-background p-5">
                <span className="font-serif text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-lg leading-snug text-primary">{step.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 py-12 md:py-20">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-6 md:px-12 lg:grid-cols-3">
          {[
            {
              Icon: HeartHandshake,
              title: "Calm, not confrontational",
              body: "We help families communicate clearly without shaming, diagnosing or making threats they cannot maintain.",
            },
            {
              Icon: Shield,
              title: "Safety before persuasion",
              body: "Withdrawal risk, mental health, aggression, self-neglect and safeguarding are considered before any planned conversation.",
            },
            {
              Icon: Users,
              title: "Support for the family too",
              body: "The consultation is not only about getting somebody into treatment. It also helps the family stop carrying the situation alone.",
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="border-t border-accent/40 pt-6">
              <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif text-xl text-primary">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="border border-border/40 bg-white p-7 md:p-9">
              <h2 className="font-serif text-2xl text-primary">If treatment may be needed</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We can help you think through private detox, residential rehab, dual-diagnosis needs, online support and aftercare before the family commits financially.
              </p>
              <Link href="/treatment-placement" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-accent">
                Explore treatment placement <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="border border-border/40 bg-white p-7 md:p-9">
              <h2 className="font-serif text-2xl text-primary">If they are not ready</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The family can still change how it responds. A clear plan, consistent boundaries and appropriate support can reduce chaos even when the person continues to deny the problem.
              </p>
              <Link href="/resources/what-to-do-when-someone-refuses-treatment" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-accent">
                Read what to do when help is refused <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={parity.faqs ?? []} heading="Family consultation questions" includeSchema={false} />

      <CTASection
        heading="You can make the first call without them."
        body="Tell us what is happening. We will help you slow the situation down, identify the immediate priorities and decide what a realistic next step looks like."
        primaryLabel="Discuss your family situation"
        primaryHref="/get-help"
        primaryEvent="family_support_enquiry"
        serviceInterest="family-support"
        sourcePage="family-addiction-intervention-uk"
        secondaryLabel="Call +44 7415 994475"
        secondaryHref="tel:+447415994475"
      />
    </Layout>
  );
}
