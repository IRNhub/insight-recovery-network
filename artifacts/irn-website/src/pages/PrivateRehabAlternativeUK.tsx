import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { RouteSchemas } from "@/components/RouteSchemas";
import { getRouteParity } from "@/data/route-parity";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const parity = getRouteParity("/private-rehab-alternative-uk");

const faqs = [
  {
    question: "Is online support a genuine alternative to private rehab?",
    answer:
      "For some people, structured online recovery support can be a clinically appropriate alternative to private residential rehab, particularly where physical dependency does not require medical detox, where the home environment is stable, and where the level of need can be met without 24-hour residential care. For others, residential rehab is the safer or more appropriate choice. The right answer depends on the individual's clinical needs, risk, and circumstances. Insight Recovery Network will always be honest about which route is more appropriate.",
  },
  {
    question: "What if I have been waiting for NHS addiction treatment?",
    answer:
      "NHS addiction services can be valuable and may be the right route for many people. If you have been waiting for NHS support and are concerned about the delay, Insight Recovery Network can provide interim guidance, online recovery support, and treatment placement advice while you navigate the NHS system or consider private alternatives.",
  },
  {
    question: "What is included in structured online recovery support?",
    answer:
      "Insight Recovery Network's online recovery support includes professional clinical oversight, group recovery sessions, one-to-one therapeutic work, relapse prevention planning, recovery worksheets, and access to Insight OS, a digital recovery system providing daily structure, check-ins, and anchor practices.",
  },
  {
    question: "When would you recommend treatment placement over online support?",
    answer:
      "We would recommend treatment placement, including private detox or residential rehab, where there is significant physical dependency requiring medically supervised withdrawal, where the home environment is unsafe or unsupportive, where repeated relapse has occurred in community or online settings, where dual diagnosis requires more intensive clinical intervention, or where the person cannot maintain safety without around-the-clock support. We make this recommendation honestly when it is the right call.",
  },
  {
    question: "Can family members access support through Insight Recovery Network?",
    answer:
      "Yes. We provide family intervention guidance for families supporting a loved one through addiction. This includes guidance on how to approach the person, what to say, what boundaries to consider, and how to coordinate a structured response. Family involvement is often a critical and overlooked part of the recovery process.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private Rehab Alternatives and Online Recovery Support",
  description: "Guidance on structured online recovery support, family support and treatment placement when residential care may be required.",
  provider: { "@type": "Organization", name: "Insight Recovery Network", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}/private-rehab-alternative-uk`,
};

const options = [
  {
    title: "Structured online recovery support",
    body: "A professionally delivered online recovery programme with clinical oversight, group sessions, individual therapeutic work, relapse prevention planning, and daily digital recovery tools. Suitable for those who need professional structure without residential care.",
    href: "/online-programme",
  },
  {
    title: "Relapse prevention planning",
    body: "A structured plan identifying warning signs, triggers, high-risk situations, and specific intervention steps. Built around the individual's history, patterns, and recovery goals. Delivered as part of the online programme or as a standalone session.",
    href: "/online-programme",
  },
  {
    title: "Family intervention guidance",
    body: "Support for families navigating addiction crises, including how to approach the person, how to reduce enabling, and how to coordinate a structured response. Families are often the first to ask for help, and their involvement significantly affects outcomes.",
    href: "/family-addiction-intervention-uk",
  },
  {
    title: "Treatment placement guidance",
    body: "Where residential treatment, detox, or a higher level of clinical care is needed, we provide confidential guidance on private rehab and detox options in the UK and internationally, helping individuals and families identify the most clinically appropriate setting.",
    href: "/treatment-placement",
  },
  {
    title: "Free self-assessments",
    body: "Free confidential assessments for alcohol use, drug use, detox suitability, anxiety, depression, and ADHD. Designed to help individuals understand what they are experiencing and whether professional support is appropriate, without obligation.",
    href: "/assessments",
  },
];

const treatmentOptions = [
  {
    title: "UK Private Rehab",
    maySuit: "People needing an intensive residential environment or a high level of structure.",
    consideration: "Can be expensive and programme length varies considerably.",
  },
  {
    title: "Overseas Private Rehab",
    maySuit: "People considering longer treatment, greater separation from their usual environment, privacy, or different cost structures.",
    consideration: "Travel, location, clinical suitability and quality of the chosen programme need careful consideration.",
  },
  {
    title: "Structured Online Recovery",
    maySuit: "Medically stable people who need intensive structured support while remaining at home and continuing appropriate work or family responsibilities.",
    consideration: "It is not a substitute for medically supervised detox or residential care where risk is high.",
  },
  {
    title: "NHS and Local Services",
    maySuit: "People who want or need publicly funded addiction support.",
    consideration: "Available services, thresholds, waiting times and treatment intensity vary by area.",
  },
  {
    title: "Family Support / Intervention",
    maySuit: "Families who are concerned about someone who is unwilling, ambivalent or not yet ready to seek help.",
    consideration: "The immediate work may focus on the family's strategy, communication and boundaries rather than immediate admission to treatment.",
  },
  {
    title: "Medical Detox",
    maySuit: "People with physical dependence or clinically significant withdrawal risk.",
    consideration: "Detox suitability should be professionally assessed and, where required, medically supervised.",
  },
];

const familyDecisionChecklist = [
  "Alcohol or drug use pattern",
  "Withdrawal risk",
  "Physical health",
  "Mental health",
  "Previous treatment attempts",
  "Current home environment",
  "Willingness to engage",
  "Safeguarding or risk concerns",
  "Required level of structure",
  "Aftercare",
  "Affordability",
];

const whenRehabNeeded = [
  "There is significant physical dependency on alcohol, benzodiazepines, or opioids requiring medically supervised withdrawal",
  "The home environment is unsafe, chaotic, or provides access to substances with no support network",
  "Repeated relapse despite community or online support suggests a need for a more intensive clinical intervention",
  "Dual diagnosis involves severe and unstable mental health conditions requiring specialist clinical care",
  "The person cannot maintain safety without around-the-clock support",
];

const alternativesComparison = [
  {
    option: "UK Private Rehab",
    maySuit: "Someone who needs residential structure, wants treatment closer to home, or may benefit from easier family contact.",
    consideration: "The programme, clinical capability, length of stay and aftercare should be checked against the person's actual needs.",
  },
  {
    option: "Overseas Private Rehab",
    maySuit: "Someone for whom distance, privacy, a different environment or a longer residential pathway may be relevant.",
    consideration: "Travel, medical arrangements, family access, safeguarding and continuing care at home need careful planning.",
  },
  {
    option: "Structured Online Recovery",
    maySuit: "Someone who is medically stable, can remain safe at home and needs professional structure without residential care.",
    consideration: "It is not a substitute for medical detox or 24-hour support where withdrawal, safety or clinical complexity requires more intensive care.",
  },
  {
    option: "NHS and Local Services",
    maySuit: "Someone who may benefit from accessible community addiction, mental health, GP or local authority support.",
    consideration: "Availability, eligibility and waiting times vary, so immediate safety and interim support may need consideration.",
  },
  {
    option: "Family Support / Intervention",
    maySuit: "Families supporting someone who is not engaging, is ambivalent about help or needs a more structured conversation.",
    consideration: "Family guidance cannot replace urgent medical or safeguarding action, and the person's autonomy and safety still matter.",
  },
  {
    option: "Medical Detox",
    maySuit: "Someone whose physical dependence or withdrawal history means stopping alcohol or drugs may require clinical supervision.",
    consideration: "Detox is a medical step rather than a complete recovery plan; the setting and ongoing treatment should be assessed separately.",
  },
];

const ukVsAbroad = [
  {
    factor: "Clinical needs",
    uk: "A UK setting may be practical when treatment needs to sit alongside existing local or family support.",
    abroad: "An overseas setting may be considered when a different environment or a longer residential pathway fits the assessed need.",
  },
  {
    factor: "Programme length",
    uk: "Length varies by provider and need; confirm what happens after the initial stay.",
    abroad: "Longer stays may be available, but time away should be realistic for work, family and continuing care.",
  },
  {
    factor: "Treatment model",
    uk: "Compare the therapy, medical provision, staffing and relapse-prevention approach rather than the setting alone.",
    abroad: "The same questions apply overseas, with additional checks on governance, communication and clinical accountability.",
  },
  {
    factor: "Cost",
    uk: "Costs vary by detox needs, location, clinical intensity, accommodation and duration.",
    abroad: "The total cost also includes travel, transfers, time away and any care needed when returning home.",
  },
  {
    factor: "Privacy and environment",
    uk: "Proximity can support discretion and continuity, while the local environment may include familiar triggers.",
    abroad: "Distance and a different environment may feel helpful for some people, but privacy should never replace clinical suitability.",
  },
  {
    factor: "Family contact",
    uk: "Being closer may make planned family involvement easier, subject to consent and clinical appropriateness.",
    abroad: "Distance can make visits and communication harder, so expectations and contact arrangements should be agreed in advance.",
  },
  {
    factor: "Travel and aftercare",
    uk: "Travel is usually simpler, but a clear plan for returning home and accessing local support is still important.",
    abroad: "Travel planning, medication continuity, handover and aftercare in the UK need to be considered before admission.",
  },
  {
    factor: "Medical requirements",
    uk: "Where medically supervised detox may be needed, confirm the service can provide or coordinate the appropriate level of care.",
    abroad: "Do not travel for residential treatment without checking withdrawal risk, medical access, medication arrangements and emergency planning.",
  },
];

const familyDecisionFactors = [
  ["Substance-use pattern", "Consider which substances are involved, frequency, quantity, recent changes and any polydrug use."],
  ["Withdrawal risk", "Ask whether stopping could be medically risky and whether a supervised detox assessment is needed."],
  ["Physical and mental health", "Include physical conditions, medication, anxiety, depression, trauma, psychosis or other mental-health needs."],
  ["Previous treatment", "Review what has been tried, what helped, what did not, and whether relapse or disengagement followed."],
  ["Home environment", "Consider safety, stability, access to substances, relationships and whether there is practical support."],
  ["Willingness to engage", "Understand what the person is willing to consider; pressure alone does not establish clinical suitability."],
  ["Safeguarding", "Take immediate risks, dependants, vulnerability, violence, self-neglect and urgent safety concerns seriously."],
  ["Structure", "Match the level of daily support, supervision and therapeutic contact to the person's needs."],
  ["Aftercare", "Ask how therapy, medication, family support, relapse prevention and local services will continue after treatment."],
  ["Affordability", "Choose a plan that is financially sustainable, including travel, treatment length and continuing support."],
];

export default function PrivateRehabAlternativeUK() {
  return (
    <Layout>
      <SEO
        title={parity.title}
        fullTitle={parity.title}
        description={parity.description}
        canonical={parity.canonical}
        noIndex={!parity.indexable}
        ogImage={`${SITE_URL}/opengraph.jpg`}
      />
      <RouteSchemas route="/private-rehab-alternative-uk" />

      {/* Hero */}
      <section className="py-14 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
              Private Rehab Alternatives, UK
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-tight mb-8 text-primary">
              {parity.h1}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-10">
              Residential private rehab is one option, but it is not automatically right for everyone. Depending on clinical needs and circumstances, alternatives may include structured online recovery, NHS or local services, overseas residential treatment, medically supervised detox where appropriate, or family guidance and intervention when someone is not engaging. Insight Recovery Network helps people compare an appropriate level and location of care without assuming one route fits all.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={parity.primaryCta.href} data-analytics-event={parity.primaryCta.analyticsEvent} data-source-page={parity.primaryCta.sourcePage} data-service-interest={parity.primaryCta.serviceInterest} data-cta-location={parity.primaryCta.location} data-cta-label={parity.primaryCta.label}>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Discuss suitable treatment options
                </button>
              </Link>
              <Link href="/assessments">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Take a free assessment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who="People seeking structured addiction recovery support who may not need, want or be ready for residential rehabilitation."
        problem="Compares realistic alternatives while keeping detox safety and the need for a proper assessment clear."
        applies="Online across the UK and internationally; regulated detox or residential care is arranged separately when required."
        nextStep="Start a confidential conversation about suitable options."
      />

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-5 text-primary">
              Comparing Alternatives to Private Rehab
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The most suitable route depends on withdrawal risk, physical and mental health, safety, willingness to engage, practical circumstances and the support available afterwards. These options are not interchangeable, and a proper assessment should come before a decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {alternativesComparison.map((item) => (
              <article key={item.option} className="border border-border/40 rounded-sm p-6">
                <h3 className="font-serif text-xl font-medium mb-4 text-primary">{item.option}</h3>
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    <strong className="text-primary">May suit:</strong>{" "}
                    <span className="text-muted-foreground">{item.maySuit}</span>
                  </p>
                  <p>
                    <strong className="text-primary">Main consideration:</strong>{" "}
                    <span className="text-muted-foreground">{item.consideration}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-5 text-primary">
              UK Rehab vs Rehab Abroad
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              There is no universally better location. Compare <Link href="/private-rehab-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">UK private rehab</Link> and <Link href="/treatment-placement" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">treatment placement guidance</Link> with overseas routes such as <Link href="/private-rehab-spain" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">Spain</Link>, <Link href="/private-rehab-south-africa" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">South Africa</Link>, <Link href="/private-rehab-thailand" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">Thailand</Link> and <Link href="/private-rehab-sri-lanka" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">Sri Lanka</Link> against the same clinical and practical questions.
            </p>
          </div>
          <div className="space-y-4">
            {ukVsAbroad.map((item) => (
              <div key={item.factor} className="grid grid-cols-1 lg:grid-cols-[minmax(10rem,0.7fr)_1fr_1fr] gap-4 border-b border-border/40 pb-4 last:border-b-0">
                <h3 className="font-serif text-lg font-medium text-primary">{item.factor}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-primary">UK:</strong> {item.uk}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-primary">Abroad:</strong> {item.abroad}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-5 text-primary">
              Choosing Treatment for a Family Member
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Families often have to make sense of difficult information while someone is not ready to engage. A useful decision considers the whole situation rather than choosing by urgency, location or accommodation alone. Our <Link href="/resources/how-to-choose-private-rehab-centre-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">guide to choosing a private rehab centre</Link> may help with questions to ask, while <Link href="/family-addiction-intervention-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">family intervention guidance</Link> can help when a more structured conversation is needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {familyDecisionFactors.map(([factor, description]) => (
              <div key={factor} className="border-l-2 border-accent/50 pl-5">
                <h3 className="font-serif text-lg font-medium mb-2 text-primary">{factor}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-10 max-w-3xl">
            Insight Recovery Network can help individuals and families compare an appropriate level and location of care, whether that means community support, structured online recovery, medical detox, UK or overseas residential treatment, or family guidance. We do not assume that one route is right for everyone.
          </p>
        </div>
      </section>
      {/* Who this is for / When rehab is needed */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                Who this guide is for
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  You may be concerned about alcohol or drug use but unsure whether residential rehab is necessary. You may be comparing cost, waiting time, privacy and the practical impact of stepping away from home, work or family. You may also be deciding for a loved one or looking for ongoing support after residential treatment.
                </p>
                <p>
                  Some people can be supported safely at home with appropriate structure and professional guidance. Others, particularly those with significant physical dependence, unsafe home environments or complex needs, require medically supervised detox or residential care.
                </p>
                <p>
                  Insight Recovery Network helps individuals and families compare the appropriate level and location of treatment rather than directing everyone towards the same option.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                When residential treatment is still needed
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are clear about this because it matters. Online recovery support is not an appropriate substitute for residential treatment where:
              </p>
              <ul className="space-y-3 mb-6">
                {whenRehabNeeded.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span aria-hidden="true" className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where residential treatment is appropriate, we can provide{" "}
                <Link
                  href="/treatment-placement"
                  className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
                >
                  confidential treatment placement guidance
                </Link>{" "}
                to help identify the right setting in the UK or internationally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UK treatment and overseas treatment */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10" aria-labelledby="uk-rehab-abroad-heading">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-16 items-start">
            <div>
              <h2 id="uk-rehab-abroad-heading" className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                UK Rehab vs Rehab Abroad
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Overseas treatment is not inherently better or worse than treatment in the UK. The more useful question is whether a particular programme can safely meet the person's needs and support recovery after they return home.
                </p>
                <p>
                  Compare clinical needs and medical requirements first, followed by programme length, treatment model, total cost, privacy, environment, family contact, travel and aftercare. A lower headline price or attractive location does not by itself make a programme suitable.
                </p>
                <p>
                  You can start with IRN's guides to{" "}
                  <Link href="/private-rehab-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">
                    private rehab in the UK
                  </Link>{" "}
                  and{" "}
                  <Link href="/treatment-placement" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">
                    assessment-led treatment placement
                  </Link>{" "}
                  before comparing specific destinations.
                </p>
              </div>
            </div>
            <div className="border border-border/40 bg-background p-6 md:p-8">
              <h3 className="font-serif text-xl font-medium text-primary mb-4">Existing IRN destination guides</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Explore the practical considerations covered in IRN's existing guides to residential treatment in:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["Spain", "/private-rehab-spain"],
                  ["South Africa", "/private-rehab-south-africa"],
                  ["Thailand", "/private-rehab-thailand"],
                  ["Sri Lanka", "/private-rehab-sri-lanka"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="block border border-border/40 px-4 py-3 text-sm font-medium text-primary hover:border-accent/50 hover:text-accent transition-colors">
                      Private rehab in {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Family decision support */}
      <section className="py-12 md:py-20 border-b border-border/40" aria-labelledby="family-treatment-heading">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-10">
            <h2 id="family-treatment-heading" className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              Choosing Treatment for a Family Member
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Families are often making decisions under pressure. A rehab should not be chosen on price, location or marketing alone; the aim is to match the person with an appropriate level of care while considering safety, engagement and what happens after treatment.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A careful discussion should consider the following factors together:
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-border/40 bg-border/40 mb-10">
            {familyDecisionChecklist.map((factor) => (
              <li key={factor} className="bg-background px-5 py-4 text-sm text-primary">
                {factor}
              </li>
            ))}
          </ul>
          <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
            <p>
              For a more detailed checklist, read{" "}
              <Link href="/resources/how-to-choose-private-rehab-centre-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">
                How to Choose the Right Private Rehab Centre in the UK
              </Link>.
            </p>
            <p>
              If the person is unwilling, ambivalent or not yet ready to seek help, IRN's{" "}
              <Link href="/family-addiction-intervention-uk" className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors">
                family support and intervention guidance
              </Link>{" "}
              can help the family think through communication, boundaries and an appropriate next step. A confidential conversation with IRN can also help compare online treatment, UK or overseas residential care, detox and other suitable routes without assuming one option is right for everyone.
            </p>
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        links={[
          { title: "Online Recovery Programme", description: "See how structured online recovery support works in everyday life.", href: "/online-programme" },
          { title: "Private Rehab UK", description: "Understand when residential treatment may be the more appropriate route.", href: "/private-rehab-uk" },
          { title: "Treatment Placement", description: "Get guidance when detox or residential care may be needed.", href: "/treatment-placement" },
          { title: "How Quickly Can Someone Enter Rehab?", description: "See what must be established before a safe private admission can be confirmed.", href: "/resources/how-quickly-can-someone-enter-rehab" },
          { title: "28-Day vs Longer-Term Rehab", description: "Compare residential duration with stepped and non-residential support.", href: "/resources/28-day-vs-90-day-rehab" },
          { title: "Family Guidance", description: "Support for families navigating uncertainty, boundaries and treatment decisions.", href: "/what-we-offer#family-guidance" },
          { title: "Detox Suitability Assessment", description: "Check whether stopping alcohol or drugs could require medical input.", href: "/assessments/detox" },
          { title: "Luxury Rehab", description: "Understand when premium residential care may add meaningful privacy or individual attention.", href: "/luxury-rehab" },
          { title: "Destination Rehab", description: "Compare private residential care abroad with UK and non-residential routes.", href: "/destination-rehab" },
        ]}
      />

      {/* Options */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              How Insight Recovery Network can help
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Following a confidential discussion, IRN can help compare appropriate treatment routes and provide one or more of the following where suitable:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((opt) => (
              <Link
                key={opt.title}
                href={opt.href}
                className="group border border-border/40 rounded-sm p-7 hover:border-accent/40 transition-colors block"
              >
                <h3 className="font-serif text-lg font-medium mb-3 text-primary group-hover:text-accent/90 transition-colors">
                  {opt.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{opt.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              Frequently asked questions
            </h2>
          </div>
          <div className="max-w-3xl space-y-8">
            {(parity.faqs ?? []).map((faq) => (
              <div key={faq.question} className="border-b border-border/40 pb-8 last:border-b-0">
                <h3 className="font-serif text-xl font-medium mb-3 text-primary">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Not sure which route is right for you?"
        body="A confidential conversation can help clarify whether structured online support, treatment placement, or another approach is most appropriate. No obligation, no pressure."
        primaryLabel="Discuss suitable treatment options"
        primaryHref="/get-help"
        primaryEvent="treatment_placement_enquiry"
        serviceInterest="treatment-placement"
        sourcePage="private-rehab-alternative-uk"
        secondaryLabel="Take a free assessment"
        secondaryHref="/assessments"
      />
    </Layout>
  );
}
