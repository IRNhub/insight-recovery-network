import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { ServiceSummary } from "@/components/ui/service-summary";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const CANONICAL = "/how-much-does-rehab-cost-uk";
const HERO_IMAGE = `${SITE_URL}/how-much-does-rehab-cost-uk-hero.webp`;

const priceRows = [
  {
    option: "UK alcohol detox only",
    range: "£2,000–£6,000",
    includes: "Medical assessment, supervised withdrawal planning and short-term clinical monitoring where appropriate.",
    suited: "People who need withdrawal managed safely before therapy, residential treatment or structured aftercare.",
  },
  {
    option: "28-day UK private rehab",
    range: "£8,000–£20,000+",
    includes: "Accommodation, meals, group programme, individual sessions, recovery planning and clinical oversight.",
    suited: "People needing a structured residential reset with proximity to home, work, family or existing care.",
  },
  {
    option: "60–90 day UK residential treatment",
    range: "£18,000–£45,000+",
    includes: "Longer residential care, extended therapy, recovery planning and more time for stabilisation.",
    suited: "Complex cases, repeated relapse, dual-diagnosis needs or situations where a longer stay is clinically appropriate.",
  },
  {
    option: "Overseas residential rehab",
    range: "From around £2,200–£8,000+ per month",
    includes: "Residential treatment abroad; inclusions vary by country, provider, clinical model and accommodation level.",
    suited: "People who may benefit from a longer stay, privacy, distance from triggers or a lower monthly treatment cost.",
  },
  {
    option: "Online recovery programme",
    range: "£950–£1,950 per month",
    includes: "Structured online recovery support, accountability, relapse prevention planning and guided therapeutic input.",
    suited: "Medically stable clients who do not need residential treatment or who need robust aftercare.",
  },
  {
    option: "Treatment placement support",
    range: "Enquire for guidance",
    includes: "Assessment-led guidance to compare suitable UK, overseas, online and family support options.",
    suited: "Individuals and families who need help understanding clinical fit, budget and next steps before choosing.",
  },
];

const costFactors = [
  "Detox requirements",
  "Length of stay",
  "Clinical complexity",
  "Level of accommodation",
  "Location",
  "Staff-to-client ratio",
  "Medical and psychiatric involvement",
  "Aftercare and family support",
];

const includedItems = [
  "Accommodation",
  "Meals",
  "Assessment",
  "Group therapy",
  "Individual therapy",
  "Recovery planning",
  "Relapse prevention",
  "Psychoeducation",
  "Family communication where appropriate",
  "Aftercare planning",
  "Medical detox where included by the provider",
];

const additionalCosts = [
  "Detox fees",
  "Psychiatric appointments",
  "Medication",
  "Blood tests or medical checks",
  "Airport transfers",
  "Family sessions",
  "Aftercare",
  "Extended stay fees",
  "Private room upgrades",
  "Travel insurance for overseas treatment",
  "Flights for overseas placements",
];

const overseasLinks = [
  { label: "South Africa treatment placement", href: "/private-rehab-south-africa" },
  { label: "Thailand rehab options", href: "/private-rehab-thailand" },
  { label: "Spain rehab options", href: "/private-rehab-spain" },
  { label: "Sri Lanka rehab options", href: "/private-rehab-sri-lanka" },
];

const faqs = [
  {
    question: "How much does private rehab cost in the UK?",
    answer:
      "Private rehab in the UK often ranges from around £8,000 to £20,000+ for a 28-day stay, with longer or more clinically intensive admissions costing more. The final cost depends on detox needs, location, accommodation, clinical complexity and length of stay.",
  },
  {
    question: "How much does alcohol rehab cost?",
    answer:
      "Alcohol rehab costs vary because some people need medically supervised detox before residential therapy begins. Alcohol withdrawal can carry medical risk, so families should not choose a programme on price alone where dependency, previous seizures, delirium tremens or significant physical health concerns are present.",
  },
  {
    question: "Is detox included in rehab cost?",
    answer:
      "Sometimes, but not always. Some rehabs include detox in the package price, while others charge separately for medical assessment, medication, blood tests or additional clinical monitoring. Always ask what is included before committing.",
  },
  {
    question: "Is overseas rehab cheaper than UK rehab?",
    answer:
      "Overseas rehab can sometimes offer a longer residential stay at a lower monthly cost than UK private rehab. It is not suitable for everyone, and clinical risk, detox needs, travel, medication, mental health risk, family dynamics and legal or work issues must be considered first.",
  },
  {
    question: "Can I get rehab through the NHS?",
    answer:
      "Some people can access support through NHS or local authority-commissioned drug and alcohol services, though access to funded residential rehab can vary by area and assessment outcome. If there is immediate medical risk, contact a GP, NHS 111, 999 or A&E as appropriate.",
  },
  {
    question: "How long should someone stay in rehab?",
    answer:
      "There is no universal answer. A 28-day admission may suit some people, while others need 60–90 days or a stepped pathway including detox, residential treatment, secondary care and aftercare. The right duration depends on severity, risk, relapse history and support at home.",
  },
  {
    question: "What is the lowest-cost private rehab option?",
    answer:
      "The lowest-cost private route may be a shorter admission, detox-only pathway, structured online support, or overseas treatment where clinically appropriate. Lower cost is not automatically unsafe, but families should check governance, staffing, detox safety, therapeutic structure and aftercare before deciding.",
  },
  {
    question: "Is online rehab a good alternative?",
    answer:
      "Structured online recovery support can be a good alternative for people who are medically stable, have a safe home environment and do not need residential detox or 24-hour support. It is not a replacement for medically supervised detox or residential care where risk is high.",
  },
  {
    question: "How do I know which rehab is right?",
    answer:
      "The right option depends on clinical risk, substance use history, mental health, withdrawal risk, budget, family context and what has or has not worked before. A clinically informed assessment can help separate unsuitable options from those that genuinely fit.",
  },
  {
    question: "Can Insight Recovery Network help me compare options?",
    answer:
      "Yes. Insight Recovery Network helps individuals and families compare UK rehab, overseas treatment, online recovery support and family guidance options, with attention to safety, suitability and budget. We do not diagnose, prescribe or provide emergency care.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${CANONICAL}#service`,
  name: "UK Rehab Cost and Treatment Options Guidance",
  serviceType: "Private rehab cost guidance and treatment placement support",
  description:
    "Clinically informed guidance for individuals and families comparing private rehab costs in the UK, alcohol detox costs, overseas treatment options and structured online recovery support.",
  provider: {
    "@type": "Organization",
    name: "Insight Recovery Network",
    url: SITE_URL,
  },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "South Africa" },
    { "@type": "Country", name: "Thailand" },
    { "@type": "Country", name: "Spain" },
    { "@type": "Country", name: "Sri Lanka" },
  ],
  url: `${SITE_URL}${CANONICAL}`,
};

export default function RehabCostUK() {
  return (
    <Layout>
      <SEO
        title="How Much Does Rehab Cost in the UK?"
        fullTitle="How Much Does Rehab Cost in the UK? Private Rehab Prices Explained"
        description="Private alcohol rehab in the UK can vary widely depending on detox, length of stay and clinical support. Learn typical costs, what affects price, and how to compare safe treatment options."
        canonical={CANONICAL}
        ogImage={HERO_IMAGE}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="py-14 md:py-20 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
                Rehab cost guide — UK
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] font-medium leading-[1.08] tracking-tight mb-7 text-primary">
                How Much Does Rehab Cost in the UK?
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Private rehab costs vary depending on detox needs, length of stay, clinical intensity, location, accommodation level and whether treatment is in the UK or overseas.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-9">
                Insight Recovery Network helps you understand the real cost, what is included, what level of care is needed, and which options are clinically appropriate before you commit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Speak to us about treatment options
                  <ArrowRight size={16} strokeWidth={1.8} />
                </Link>
                <a
                  href="#uk-vs-overseas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-primary/25 text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  Compare UK and overseas rehab options
                </a>
              </div>
            </div>

            <div>
              <img
                src="/how-much-does-rehab-cost-uk-hero.webp"
                alt="Insight Recovery Network private rehab cost guide for the UK"
                width={1717}
                height={916}
                className="w-full rounded-sm shadow-2xl shadow-primary/10 border border-border/50"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who="Individuals and families comparing private alcohol rehab, detox, residential treatment, online support or overseas options."
        problem="Explains realistic cost ranges, what affects price and how to compare options without choosing on price alone."
        applies="UK private rehab, alcohol detox, overseas residential treatment and structured online recovery support."
        nextStep="Speak to us about treatment options"
        updated="9 July 2026"
      />

      <section className="py-12 md:py-18 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              Families often search for rehab costs under pressure.
            </h2>
            <p>
              Cost searches usually happen at a difficult moment: someone is worried about safety, the family is unsure how serious the situation is, and treatment options all seem to use different language.
            </p>
            <p>
              We help you understand the real cost of care, what is included, whether detox is needed, what level of support is appropriate, and how UK, overseas and online options compare. The aim is not to find the lowest price. It is to avoid unsuitable placements and make a calm, informed decision.
            </p>
            <p>
              If you need a wider view first, you can also read about our{" "}
              <Link href="/treatment-placement" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent">
                treatment placement support
              </Link>
              ,{" "}
              <Link href="/private-rehab-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent">
                private rehab in the UK
              </Link>
              , and{" "}
              <Link href="/private-rehab-alternative-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent">
                private rehab alternatives
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Typical private rehab costs
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-4">
              Private rehab price ranges in the UK and overseas
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These are broad guide prices only. Actual costs depend on clinical needs, detox requirements, risk, location, accommodation level and length of stay.
            </p>
          </div>

          <div className="overflow-x-auto border border-border/50 bg-background">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase">Treatment option</th>
                  <th className="px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase">Typical cost range</th>
                  <th className="px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase">What it usually includes</th>
                  <th className="px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase">Best suited for</th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((row) => (
                  <tr key={row.option} className="border-b border-border/40 last:border-b-0 align-top">
                    <td className="px-5 py-5 font-serif text-lg text-primary">{row.option}</td>
                    <td className="px-5 py-5 text-sm font-semibold text-primary">{row.range}</td>
                    <td className="px-5 py-5 text-sm text-muted-foreground leading-relaxed">{row.includes}</td>
                    <td className="px-5 py-5 text-sm text-muted-foreground leading-relaxed">{row.suited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mt-5 max-w-3xl">
            These figures are broad guide prices only. Actual costs depend on clinical needs, detox requirements, risk, location, accommodation level and length of stay.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                What affects the cost of rehab?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Two programmes can look similar on the surface but provide very different levels of medical oversight, therapeutic intensity, staffing and aftercare. These are the main factors that change the price.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {costFactors.map((factor) => (
                <div key={factor} className="flex gap-3 border border-border/40 bg-background p-5">
                  <CheckCircle2 size={18} className="text-accent mt-0.5 flex-shrink-0" strokeWidth={1.8} />
                  <p className="text-sm text-primary leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/15">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                Why private rehab in the UK can be expensive
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  UK private rehab can cost more because safe residential care is staff-intensive. A good provider may need 24-hour staffing, clinical governance, medical detox capacity, regulated facilities, accommodation, food, therapy groups, individual sessions, and psychiatric or medical input where required.
                </p>
                <p>
                  That does not mean UK treatment is the wrong choice. UK rehab can be appropriate where medical risk, family proximity, legal or work commitments, insurance, or continuity with local care matter.
                </p>
              </div>
            </div>
            <div id="uk-vs-overseas">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                Is overseas rehab cheaper than UK rehab?
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Overseas treatment can sometimes offer longer stays at a lower monthly cost, particularly in countries where residential care is less expensive to operate. Insight Recovery Network helps families compare treatment placement in South Africa, Thailand, Sri Lanka and Spain.
                </p>
                <p>
                  Overseas treatment is not suitable for everyone. Clinical risk must be assessed first. Travel, detox needs, medication, mental health risk, family dynamics, safeguarding and legal issues all matter. Lower cost should never be the only deciding factor.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
                {overseasLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border border-border/40 bg-background px-5 py-4 text-sm text-primary hover:border-accent/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Alcohol rehab cost UK
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
              How much does alcohol rehab cost?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Alcohol rehab costs vary because alcohol dependence may require medically supervised detox before therapy begins. Detox can increase the total cost because withdrawal risk needs proper medical assessment and monitoring.
              </p>
              <p>
                Costs are influenced by severity of dependence, withdrawal history, previous seizures or delirium tremens, physical health, psychiatric risk and medication needs. Families should not choose alcohol rehab based only on price if detox risk is present.
              </p>
              <p>
                If you are unsure whether detox may be needed, start with the{" "}
                <Link href="/assessments/alcohol-detox" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent">
                  alcohol detox suitability assessment
                </Link>
                , or contact us for a private conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-6">
                What is usually included in rehab fees?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includedItems.map((item) => (
                  <p key={item} className="border border-border/40 bg-background px-4 py-3 text-sm text-primary">
                    {item}
                  </p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-5">
                Medical detox is not always included. Ask the provider to confirm this in writing before admission.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-6">
                Hidden or additional costs to ask about
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalCosts.map((item) => (
                  <p key={item} className="border border-border/40 bg-background px-4 py-3 text-sm text-primary">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                How Insight Recovery Network helps
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-7">
                We help individuals and families compare realistic options without pressure, panic or false reassurance.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Request a confidential treatment options call
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Understand what level of care is needed",
                "Compare UK and overseas options",
                "Avoid unsuitable placements",
                "Consider clinical and detox risk",
                "Match budget with appropriate care",
                "Coordinate assessment and placement",
                "Support families before, during and after treatment",
                "Consider structured online recovery where appropriate",
              ].map((item) => (
                <div key={item} className="border border-border/40 bg-background p-5 text-sm leading-relaxed text-primary">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-5">
              When lower-cost rehab may be risky
            </h2>
            <div className="space-y-4 text-primary-foreground/80 leading-relaxed">
              <p>
                Lower cost is not automatically bad. Some programmes are lean, ethical and clinically useful. But families should check clinical governance, staff qualifications, detox safety, therapeutic structure, safeguarding, aftercare and whether the programme actually fits the person’s needs.
              </p>
              <p>
                Be cautious of “holiday-style” treatment if clinical structure is weak. A beautiful setting can support recovery, but it cannot replace proper assessment, risk management, therapy and aftercare planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              FAQs
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              Frequently asked questions about rehab cost
            </h2>
          </div>
          <div className="max-w-3xl space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border/40 pb-8 last:border-b-0">
                <h3 className="font-serif text-xl font-medium text-primary mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        heading="Related rehab cost and treatment guidance"
        links={[
          {
            title: "Treatment placement support",
            description: "Independent guidance to compare suitable detox, rehab, online and overseas treatment routes.",
            href: "/treatment-placement",
          },
          {
            title: "Private rehab UK",
            description: "A broader guide to private rehab in the UK and when residential treatment may fit.",
            href: "/private-rehab-uk",
          },
          {
            title: "Online recovery programme",
            description: "Structured online support for people who are medically stable or need strong aftercare.",
            href: "/online-addiction-recovery-programme-uk",
          },
          {
            title: "Private rehab alternative UK",
            description: "Options to consider when residential rehab is not clinically necessary or not the right fit.",
            href: "/private-rehab-alternative-uk",
          },
          {
            title: "Free detox suitability assessment",
            description: "A confidential starting point if you are unsure whether detox risk needs medical attention.",
            href: "/assessments/detox",
          },
          {
            title: "Speak to Insight Recovery Network",
            description: "Book a confidential call to compare treatment options calmly and privately.",
            href: "/contact",
          },
        ]}
      />
    </Layout>
  );
}
