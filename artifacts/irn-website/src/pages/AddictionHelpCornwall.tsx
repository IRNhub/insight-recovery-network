import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { ServiceSummary } from "@/components/ui/service-summary";

const CANONICAL = "/addiction-help-cornwall";
const SITE_URL = "https://www.insightrecoverynetwork.com";

const pathways = [
  {
    title: "Confidential online assessment",
    body: "A private starting point to consider alcohol or drug use, withdrawal risk, mental health, family circumstances and the level of support that may be needed.",
    href: "/assessments",
    label: "Start an assessment",
  },
  {
    title: "Structured online recovery support",
    body: "For people who are medically stable and can remain safe at home, online support can provide routine, accountability and relapse prevention without leaving Cornwall.",
    href: "/online-programme",
    label: "Explore online support",
  },
  {
    title: "Assessment-led rehab placement",
    body: "When detox or residential treatment is appropriate, we help compare suitable providers in the UK and selected international destinations and coordinate the next steps.",
    href: "/treatment-placement",
    label: "See placement support",
  },
  {
    title: "Family and intervention guidance",
    body: "Families can ask for help before a loved one agrees to treatment, including guidance on conversations, boundaries, risk and preparing a realistic treatment option.",
    href: "/family-addiction-intervention-uk",
    label: "Get family guidance",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Does Insight Recovery Network operate a rehab centre in Cornwall?",
    answer: "No. Insight Recovery Network is an online support, treatment-placement and advisory network based in Newquay. We do not claim to own or operate a residential rehab centre in Cornwall. Where residential care is appropriate, we help people compare suitable external providers in the UK or internationally and explain any relevant provider relationship.",
  },
  {
    question: "Can I get addiction support online from Cornwall?",
    answer: "Yes, if online support is appropriate for your needs and you can remain medically and psychologically safe at home. A structured online recovery programme may suit people who need regular support, accountability and relapse prevention but do not need medically supervised detox or round-the-clock residential care.",
  },
  {
    question: "How do I find alcohol or drug rehab from Cornwall?",
    answer: "Begin with an assessment of substance use, withdrawal risk, mental health, previous treatment, home circumstances and budget. We can then help compare clinically suitable treatment options and explain the practical differences between UK, overseas, residential and online routes.",
  },
  {
    question: "Can you help families in Truro, Redruth or elsewhere in Cornwall?",
    answer: "Yes. Our assessment, family guidance and online recovery support are delivered remotely, so people in Truro, Redruth, Falmouth, St Austell, Newquay and surrounding areas can access the same confidential service without travelling to an IRN office.",
  },
  {
    question: "What if alcohol withdrawal may be dangerous?",
    answer: "Do not stop suddenly without medical advice if there may be physical dependence, a history of seizures, severe withdrawal or significant health concerns. Contact a GP or NHS 111 for urgent advice, and call 999 or attend A&E in an emergency. IRN can help with treatment planning but is not an emergency or medical detox service.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${CANONICAL}#service`,
  name: "Addiction Help in Cornwall",
  serviceType: "Addiction assessment, online recovery support and treatment placement guidance",
  description: "Confidential addiction assessment, online recovery support, family guidance and assessment-led rehab placement for people in Cornwall.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Cornwall",
  },
  url: `${SITE_URL}${CANONICAL}`,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Addiction Help in Cornwall", item: `${SITE_URL}${CANONICAL}` },
  ],
};

export default function AddictionHelpCornwall() {
  return (
    <Layout>
      <SEO
        title="Addiction Help Cornwall"
        fullTitle="Addiction Help in Cornwall: Online Support & Rehab Placement"
        description="Confidential addiction help in Cornwall, including online assessment, recovery support, family guidance and assessment-led UK or international rehab placement."
        canonical={CANONICAL}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <section className="border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
              <MapPin size={15} aria-hidden="true" /> Cornwall addiction support
            </p>
            <h1 className="mb-7 max-w-3xl font-serif text-4xl font-medium leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[3.5rem]">
              Addiction Help in Cornwall: Assessment, Online Support and Rehab Placement
            </h1>
            <p className="mb-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Insight Recovery Network helps individuals and families across Cornwall understand what level of addiction support may be appropriate, access structured online recovery and compare suitable detox or residential treatment options in the UK and internationally.
            </p>
            <p className="mb-9 max-w-3xl leading-relaxed text-muted-foreground">
              We are an online-only advisory and recovery network based in Newquay. We do not own or operate a residential rehab centre in Cornwall, and we explain any relevant provider relationship before a placement decision.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Book a confidential call <ArrowRight size={16} />
              </Link>
              <Link href="/assessments" className="inline-flex items-center justify-center border border-primary/25 px-7 py-3.5 text-sm font-medium text-primary hover:bg-primary/5">
                Take a free assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who="Adults and families in Newquay, Truro, Redruth, Falmouth, St Austell and surrounding areas who need confidential addiction guidance."
        problem="Clarifies whether local, online, detox or residential support may fit, and helps families compare realistic next steps."
        applies="Remote assessment and support across Cornwall, with assessment-led placement into suitable UK or international providers where needed."
        nextStep="Book a confidential call"
        updated="13 July 2026"
      />

      <section className="border-b border-border/40 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-5 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">What support is available from Cornwall?</h2>
            <p className="leading-relaxed text-muted-foreground">
              The right route depends on medical safety, severity, home circumstances, previous relapse, mental health and the support already around the person. These pathways can be considered separately or as stages of one plan.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {pathways.map((pathway) => (
              <article key={pathway.title} className="border border-border/40 bg-background p-7">
                <h3 className="mb-3 font-serif text-xl text-primary">{pathway.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{pathway.body}</p>
                <Link href={pathway.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                  {pathway.label} <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-secondary/15 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-5 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">When online support may be appropriate</h2>
              <ul className="space-y-3">
                {["The person is medically stable and can remain safe at home", "They need structure, accountability and regular recovery support", "Work, caring or travel makes residential treatment difficult", "They have completed detox or rehab and need continuing care"].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground"><CheckCircle2 size={18} className="mt-1 shrink-0 text-accent" />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-5 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">When detox or residential care may be needed</h2>
              <ul className="space-y-3">
                {["There may be dangerous withdrawal or significant physical dependence", "Repeated attempts to stop have ended in rapid relapse", "The home environment is unsafe or strongly linked to ongoing use", "Mental health, safeguarding or other risks need closer assessment"].map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground"><CheckCircle2 size={18} className="mt-1 shrink-0 text-accent" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 max-w-3xl border-l-4 border-accent bg-background p-6 text-sm leading-relaxed text-muted-foreground">
            Alcohol, benzodiazepine and opioid withdrawal can carry medical risks. If physical dependence may be present, seek medical advice before stopping suddenly. For urgent non-emergency advice use NHS 111. In an emergency call 999 or attend A&amp;E.
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        heading="Compare support from Cornwall"
        links={[
          { title: "Treatment placement", description: "Assessment-led help comparing detox and residential programmes.", href: "/treatment-placement" },
          { title: "Private rehab UK", description: "Understand UK residential treatment and the questions to ask.", href: "/private-rehab-uk" },
          { title: "Online recovery programme", description: "Structured support available without leaving Cornwall.", href: "/online-programme" },
          { title: "Rehab costs UK", description: "Compare guide prices, inclusions and lower-cost routes.", href: "/how-much-does-rehab-cost-uk" },
          { title: "Family addiction guidance", description: "Plan conversations, boundaries and suitable next steps.", href: "/family-addiction-intervention-uk" },
          { title: "Contact IRN", description: "Discuss the situation confidentially with no obligation.", href: "/contact" },
        ]}
      />

      <FAQSection items={faqs} heading="Questions about addiction help in Cornwall" />

      <CTASection
        heading="Not sure what level of help is needed?"
        body="A confidential conversation can help you separate urgent medical questions from the longer-term treatment decision and understand the realistic options available from Cornwall."
        primaryLabel="Book a confidential call"
        primaryHref="/contact"
        secondaryLabel="Take a free assessment"
        secondaryHref="/assessments"
      />
    </Layout>
  );
}
