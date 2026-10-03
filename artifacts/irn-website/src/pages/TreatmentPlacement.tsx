import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { RouteSchemas } from "@/components/RouteSchemas";
import { Layout } from "@/components/layout/Layout";
import { useEnquiryJourney } from "@/components/forms/EnquiryJourney";
import { getRouteParity, guidanceSections } from "@/data/route-parity";
import "@/styles/premium-pages.css";

const parity = getRouteParity("/treatment-placement");
const relationshipCopy = guidanceSections["/treatment-placement"];
const processSection = parity.prerenderSections?.[0];
const suitabilitySection = parity.prerenderSections?.[1];
const placementSteps = [
  {
    n: "1",
    title: "Understand the situation",
    body: "Assess urgency, risk, substance use history, mental health needs, family context, and practical requirements.",
  },
  {
    n: "2",
    title: "Identify suitable options",
    body: "Match needs against trusted providers, considering clinical fit, location, budget, length of stay, and environment.",
  },
  {
    n: "3",
    title: "Support admission planning",
    body: "Help coordinate communication, availability, documentation, travel considerations, and family questions.",
  },
  {
    n: "4",
    title: "Plan continuity of care",
    body: "Consider aftercare, online support, relapse prevention, and ongoing recovery structure.",
  },
];

const indications = [
  "Repeated relapse despite outpatient support",
  "High-risk alcohol or drug use",
  "Complex mental health alongside addiction",
  "Family unable to manage the situation safely",
  "Need for structured separation from current environment",
  "Previous treatment ended without strong aftercare",
];

const locations: Array<{ label: string; href?: string }> = [
  { label: "United Kingdom", href: "/private-rehab-uk" },
  { label: "South Africa", href: "/private-rehab-south-africa" },
  { label: "Thailand", href: "/private-rehab-thailand" },
  { label: "Spain", href: "/private-rehab-spain" },
  { label: "Sri Lanka", href: "/private-rehab-sri-lanka" },
];

const decisionGuides = [
  {
    title: "How to choose a private rehab",
    body: "Check clinical capability, regulation, detox, mental-health support, costs and aftercare before committing.",
    href: "/resources/how-to-choose-private-rehab-centre-uk",
  },
  {
    title: "How quickly can someone enter rehab?",
    body: "Understand which assessment, capacity, medication, travel and funding checks affect admission timing.",
    href: "/resources/how-quickly-can-someone-enter-rehab",
  },
  {
    title: "28-day vs longer-term rehab",
    body: "Compare duration by assessed need, progress reviews and the continuing-care plan rather than a package label.",
    href: "/resources/28-day-vs-90-day-rehab",
  },
  {
    title: "Private rehab vs NHS treatment",
    body: "Compare access, setting, funding and continuity without assuming either route is universally better.",
    href: "/resources/private-rehab-vs-nhs-addiction-treatment",
  },
  {
    title: "Online support vs residential rehab",
    body: "Use safety, home stability, treatment intensity and previous response to compare realistic levels of care.",
    href: "/resources/online-addiction-support-vs-residential-rehab",
  },
  {
    title: "UK private rehab costs",
    body: "Compare total pathway costs only after establishing which setting and clinical capabilities are required.",
    href: "/how-much-does-rehab-cost-uk",
  },
];

const comparison: Array<{
  country: string;
  href: string;
  bestFor: string;
  cost: string;
  advantage: string;
}> = [
  {
    country: "South Africa",
    href: "/private-rehab-south-africa",
    bestFor:
      "Longer treatment, relapse history, extended care, budget-sensitive families",
    cost: "From around £1,800/month up to around £10,000",
    advantage: "Best value for longer-term treatment and secondary care",
  },
  {
    country: "Spain",
    href: "/private-rehab-spain",
    bestFor: "UK proximity, family involvement, treatment close to home",
    cost: "Request an itemised quote for the assessed needs and length of stay",
    advantage:
      "Compare clinical suitability, travel arrangements and UK aftercare",
  },
  {
    country: "Thailand",
    href: "/private-rehab-thailand",
    bestFor:
      "Privacy, distance from triggers, established international centres",
    cost: "Around £8,000 to £15,000 for a standard 28-day stay",
    advantage:
      "Well-established international rehab market with structured residential care",
  },
  {
    country: "Sri Lanka",
    href: "/private-rehab-sri-lanka",
    bestFor: "Smaller, discreet, highly personalised treatment settings",
    cost: "Around £12,000 to £18,000 for a standard stay",
    advantage: "More intimate, individualised treatment environment",
  },
  {
    country: "United Kingdom",
    href: "/private-rehab-uk",
    bestFor:
      "Proximity, family involvement, ease of travel, NHS/private continuity",
    cost: "Varies widely by detox needs, length of stay and clinical intensity",
    advantage: "Closest to home, with detox and residential options nationwide",
  },
];

const comparisonAreas = [
  {
    id: "care",
    label: "Clinical suitability",
    eyebrow: "A SUITABLE LEVEL OF CARE",
    title: "Can this provider meet the person’s needs?",
    checks: [
      "Appropriate medical and psychiatric assessment",
      "Experience with the relevant treatment needs",
      "Staffing, programme structure and individual support",
      "Clear admission criteria and care responsibilities",
    ],
    note: "The treatment provider makes its own clinical assessment and admission decision. IRN does not diagnose or prescribe.",
  },
  {
    id: "cost",
    label: "Complete costs",
    eyebrow: "A CLEAR FINANCIAL PICTURE",
    title: "What will the whole treatment pathway cost?",
    checks: [
      "Treatment fees and the proposed length of stay",
      "Assessment, medication and other separate charges",
      "Travel, transfers and practical arrangements",
      "Aftercare, extensions and any separate paid support",
    ],
    note: "Ask for a dated written breakdown. We explain any relevant referral or commercial relationship before you decide.",
  },
  {
    id: "continuity",
    label: "Life after treatment",
    eyebrow: "CONTINUITY FROM THE START",
    title: "What will support look like afterwards?",
    checks: [
      "A clear discharge and continuing-care plan",
      "Family involvement with appropriate consent",
      "Practical support for returning home",
      "Connections to relevant local or online support",
    ],
    note: "The plan should reflect the person’s needs and the provider’s recommendations. It is worth discussing before admission.",
  },
];
const relatedServices = [
  {
    title: "Alcohol Addiction Treatment",
    description:
      "Compare withdrawal assessment, community, online and residential alcohol treatment routes.",
    href: "/alcohol-addiction-treatment",
  },
  {
    title: "Cocaine Addiction Treatment",
    description:
      "Compare psychological, community, online and residential cocaine support.",
    href: "/cocaine-addiction-treatment",
  },
  {
    title: "Cannabis Addiction Treatment",
    description:
      "Choose support based on use, mental health, home stability and treatment fit.",
    href: "/cannabis-addiction-treatment",
  },
  {
    title: "Ketamine Addiction Treatment",
    description:
      "Coordinate addiction support with appropriate medical assessment for physical harm.",
    href: "/ketamine-addiction-treatment",
  },
  {
    title: "Benzodiazepine Treatment",
    description:
      "Keep prescriber-led withdrawal planning connected to wider recovery support.",
    href: "/benzodiazepine-addiction-treatment",
  },
  {
    title: "Prescription Drug Treatment",
    description:
      "Separate physical dependence and withdrawal from addiction, with prescribers retaining medication responsibility.",
    href: "/prescription-drug-addiction-treatment",
  },
  {
    title: "Dual Diagnosis Treatment",
    description:
      "Compare integrated mental-health and addiction treatment capability.",
    href: "/dual-diagnosis-treatment",
  },
  {
    title: "Addiction Detox UK",
    description:
      "Understand withdrawal risk, clinical assessment and the differences between community, residential and inpatient settings.",
    href: "/resources/addiction-detox-uk",
  },
  {
    title: "Detox vs Rehab",
    description:
      "Separate withdrawal management from rehabilitation and continuing recovery care.",
    href: "/resources/detox-vs-rehab",
  },
  {
    title: "Rehab Cost UK Guide",
    description:
      "Compare typical UK rehab, detox, overseas treatment and online recovery costs.",
    href: "/how-much-does-rehab-cost-uk",
  },
  {
    title: "Private Rehab UK",
    description: "Understand UK detox and residential rehabilitation options.",
    href: "/private-rehab-uk",
  },
  {
    title: "Private Rehab Alternatives",
    description:
      "Compare structured online support and other non-residential routes.",
    href: "/private-rehab-alternative-uk",
  },
  {
    title: "Online Recovery Programme",
    description:
      "Explore structured support for people who are medically stable.",
    href: "/online-programme",
  },
  {
    title: "Family Guidance",
    description: "Practical support for families deciding what to do next.",
    href: "/what-we-offer#family-guidance",
  },
  {
    title: "Detox Suitability Assessment",
    description:
      "Reflect on withdrawal risk before making changes to alcohol or drug use.",
    href: "/assessments/detox",
  },
  {
    title: "Luxury Rehab",
    description:
      "Compare premium private treatment without mistaking accommodation for clinical quality.",
    href: "/luxury-rehab",
  },
  {
    title: "Executive Rehab",
    description:
      "Review discreet treatment options for professionals and business leaders.",
    href: "/executive-rehab",
  },
  {
    title: "Destination Rehab",
    description:
      "Compare private treatment abroad, travel safety and return-home planning.",
    href: "/destination-rehab",
  },
];
const firstQuestions = [
  {
    question: "Can I contact you about someone else?",
    answer:
      "Yes. Families can ask for guidance about their own concerns before their adult relative agrees to treatment. Please do not send another person’s medical records with an initial enquiry.",
  },
  {
    question: "Do I need to choose a rehab first?",
    answer:
      "No. You can begin with the questions you have now. IRN can help you understand what to consider before choosing a provider.",
  },
  {
    question: "Does contacting IRN commit me to treatment?",
    answer:
      "No. An enquiry does not book an appointment, reserve a treatment place or commit you to a service. The scope and fees of any proposed support should be agreed before you proceed.",
  },
];
const Arrow = () => (
  <ArrowUpRight size={21} strokeWidth={1} aria-hidden="true" />
);

function PremiumHeadline({ children }: { children: string }) {
  const parts = children.split(" made with ");
  if (parts.length !== 2) return <h1>{children}</h1>;
  return (
    <h1>
      {parts[0]}
      <br />
      {" made with "}
      <br />
      <em>{parts[1]}</em>
    </h1>
  );
}

export default function TreatmentPlacement() {
  const { open } = useEnquiryJourney();
  const [activeArea, setActiveArea] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % comparisonAreas.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index + comparisonAreas.length - 1) % comparisonAreas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = comparisonAreas.length - 1;
    else return;
    event.preventDefault();
    setActiveArea(next);
    tabs.current[next]?.focus();
  }
  function directEnquiry(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    open({ direct: true, service: "placement" });
  }
  return (
    <Layout>
      <SEO
        title={parity.title}
        fullTitle={parity.title}
        description={parity.description}
        canonical={parity.canonical}
        noIndex={!parity.indexable}
        ogImage="https://www.insightrecoverynetwork.com/treatment-placement-navigation-og.webp"
        ogImageWidth={1200}
        ogImageHeight={630}
        ogImageAlt="Adult standing where two coastal footpaths divide."
      />
      <RouteSchemas route="/treatment-placement" />
      <div className="premium-page premium-placement">
        <section className="placement-hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="line" /> Private rehab &amp; detox guidance
            </p>
            <PremiumHeadline>{parity.h1}</PremiumHeadline>
            <p className="intro">{parity.heroIntro}</p>
            <p className="hero-detail">
              Compare private treatment in the UK and internationally with Craig
              Bilton. We help you consider suitability, complete costs and
              continuity of support.
            </p>
            <div className="hero-actions">
              <Link
                href={parity.primaryCta.href}
                onClick={directEnquiry}
                className="button"
                data-primary-commercial-cta="true"
                data-analytics-event={parity.primaryCta.analyticsEvent}
                data-source-page={parity.primaryCta.sourcePage}
                data-service-interest={parity.primaryCta.serviceInterest}
                data-cta-location={parity.primaryCta.location}
              >
                {parity.primaryCta.label}
                <Arrow />
              </Link>
              <button
                type="button"
                className="text-link"
                onClick={() => open({ service: "placement" })}
              >
                Help me get started <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="micro reassurance">
              Private guidance. No obligation to choose a provider.
            </p>
          </div>
          <div className="placement-paper">
            <div className="paper-top">
              <span>THE WHOLE PICTURE</span>
              <span className="paper-seal" aria-hidden="true">
                IRN
              </span>
            </div>
            <h2>
              Good questions. <br />
              <em>Better-informed decisions.</em>
            </h2>
            <div className="paper-item">
              <span>01</span>
              <div>
                <h3>The care you need</h3>
                <p>What can the provider safely support?</p>
              </div>
            </div>
            <div className="paper-item">
              <span>02</span>
              <div>
                <h3>The complete cost</h3>
                <p>What is included, and what is separate?</p>
              </div>
            </div>
            <div className="paper-item">
              <span>03</span>
              <div>
                <h3>The way forward</h3>
                <p>What happens before and after admission?</p>
              </div>
            </div>
            <p className="paper-caption">
              The areas we help you consider together.
            </p>
          </div>
        </section>
        <section className="placement-reassurance wrap">
          <img
            src="/images/premium/craig-portrait.webp"
            alt=""
            width={64}
            height={64}
          />
          <div>
            <strong>Speak directly with Craig Bilton</strong>
            <p>
              More than 20 years’ international addiction treatment experience.
            </p>
          </div>
          <p>
            UK-based guidance. <br />
            UK and international options.
          </p>
        </section>
        <section className="section wrap compare-section" id="compare-options">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What we help you compare</p>
              <h2>
                The detail behind <br />a suitable placement.
              </h2>
            </div>
            <p>
              A reassuring website or an attractive setting is only part of the
              picture. These are the questions worth working through.
            </p>
          </div>
          <div className="comparison-layout">
            <div
              className="comparison-tabs"
              role="tablist"
              aria-label="Treatment comparison areas"
              aria-orientation="vertical"
            >
              {comparisonAreas.map((area, index) => (
                <button
                  key={area.id}
                  type="button"
                  role="tab"
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  id={`tab-${area.id}`}
                  aria-selected={activeArea === index}
                  aria-controls={`panel-${area.id}`}
                  tabIndex={activeArea === index ? 0 : -1}
                  onClick={() => setActiveArea(index)}
                  onKeyDown={(event) => onTabKey(event, index)}
                >
                  <span>0{index + 1}</span>
                  {area.label}
                  <Arrow />
                </button>
              ))}
            </div>
            <div className="comparison-panels">
              {comparisonAreas.map((area, index) => (
                <article
                  key={area.id}
                  role="tabpanel"
                  id={`panel-${area.id}`}
                  aria-labelledby={`tab-${area.id}`}
                  tabIndex={0}
                  hidden={activeArea !== index}
                >
                  <span className="panel-label">{area.eyebrow}</span>
                  <h3>{area.title}</h3>
                  <ul className="check-list">
                    {area.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                  <p>{area.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="dark-section">
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">How we work with you</p>
                <h2>
                  {`${processSection?.heading.split(". ")[0]}. `}
                  <br />
                  <em>
                    {processSection?.heading.split(". ").slice(1).join(". ")}
                  </em>
                </h2>
              </div>
              <p>{processSection?.body}</p>
            </div>
            <div className="timeline">
              {placementSteps.map((step) => (
                <article key={step.n}>
                  <span>0{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="button light-button"
              onClick={() => open({ direct: true, service: "placement" })}
            >
              Start with a conversation <Arrow />
            </button>
          </div>
        </section>
        <section className="section wrap placement-details">
          <div>
            <p className="eyebrow">UK &amp; international options</p>
            <h2>
              The right setting <br />
              <em>for the individual.</em>
            </h2>
            <p>
              Location is one part of a treatment decision. We help you consider
              the care available, practicalities, privacy, family access and the
              total cost.
            </p>
            <div className="destination-list">
              {locations.map((location) => (
                <Link key={location.label} href={location.href!}>
                  {location.label}
                </Link>
              ))}
            </div>
            <p className="quiet-note">
              IRN does not own or operate treatment facilities. Suitability and
              admission remain the provider’s responsibility.
            </p>
            <a href="#international-options" className="text-link">
              Compare destination guide costs <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="fee-note">
            <span className="eyebrow">Clear before you commit</span>
            <h3>
              Fees and provider <br />
              relationships.
            </h3>
            <p>
              Before you proceed, we explain the scope and cost of IRN’s
              support, the provider’s separate fees and any relevant commercial
              or referral relationship.
            </p>
            <p>
              You can ask whether a provider would pay IRN for a placement and
              whether that affects the price you pay.
            </p>
            <button
              type="button"
              className="text-link"
              onClick={() => open({ direct: true, service: "placement" })}
            >
              Ask about fees and options <Arrow />
            </button>
            <p className="quiet-note">
              <Link href="/services-pricing-guide">
                Read our services and pricing guide.
              </Link>
            </p>
          </div>
        </section>
        <section className="faq-section wrap">
          <div>
            <p className="eyebrow">Before we speak</p>
            <h2>
              A few questions <br />
              you may have.
            </h2>
          </div>
          <div className="faq-list">
            {firstQuestions.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
            <details>
              <summary>
                What if someone needs urgent medical help?
                <span aria-hidden="true">+</span>
              </summary>
              <p>
                IRN is not an emergency service. In immediate danger, call{" "}
                <a href="tel:999">999</a> or attend A&amp;E. For urgent
                non-emergency medical advice in England, contact{" "}
                <a
                  href="https://111.nhs.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NHS 111
                </a>
                .
              </p>
            </details>
          </div>
        </section>
        <section
          className="placement-library section wrap"
          aria-labelledby="placement-detail-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Take a closer look</p>
              <h2 id="placement-detail-heading">
                The detail for <br />
                <em>your decision.</em>
              </h2>
            </div>
            <p>
              Explore costs, clinical considerations and practical guides in
              your own time. You can ask us about any of these areas.
            </p>
          </div>
          <details className="library-group" id="international-options">
            <summary>
              International treatment options at a glance
              <span aria-hidden="true">+</span>
            </summary>
            <div className="library-content">
              <p>
                A starting point, not a recommendation. The right destination
                depends on clinical need, detox and mental-health risk, budget
                and family circumstances. All costs are typical guide ranges
                only.
              </p>
              <div className="destination-comparison">
                {comparison.map((row) => (
                  <article key={row.country}>
                    <h3>
                      <Link href={row.href}>
                        {row.country}
                        <Arrow />
                      </Link>
                    </h3>
                    <dl>
                      <div>
                        <dt>May suit</dt>
                        <dd>{row.bestFor}</dd>
                      </div>
                      <div>
                        <dt>Typical guide cost</dt>
                        <dd>{row.cost}</dd>
                      </div>
                      <div>
                        <dt>Practical considerations</dt>
                        <dd>{row.advantage}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
              <p className="quiet-note">
                Guide ranges only. Actual costs depend on the facility, length
                of stay, level of medical care required and accommodation. Where
                detox is needed, withdrawal risk must be assessed before any
                placement or travel.
              </p>
            </div>
          </details>
          <details className="library-group">
            <summary>
              {suitabilitySection?.heading}
              <span aria-hidden="true">+</span>
            </summary>
            <div className="library-content">
              <p>{suitabilitySection?.body}</p>
              <ul className="check-list indication-list">
                {indications.map((indication) => (
                  <li key={indication}>{indication}</li>
                ))}
              </ul>
              <p>
                Our self-assessments can help you reflect on your situation.
                They do not replace a medical assessment or determine whether
                withdrawal is safe.
              </p>
              <div className="support-links">
                <Link href="/assessments/detox">
                  Detox Suitability Assessment
                </Link>
                <Link href="/assessments/alcohol-use">
                  Alcohol Use Assessment
                </Link>
                <Link href="/assessments/drug-use">Drug Use Assessment</Link>
              </div>
            </div>
          </details>
          <details className="library-group">
            <summary>
              {relationshipCopy.heading}
              <span aria-hidden="true">+</span>
            </summary>
            <div className="library-content">
              {relationshipCopy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                {relationshipCopy.linkPrefix}
                <Link href={relationshipCopy.link.href}>
                  {relationshipCopy.link.label}
                </Link>
                {relationshipCopy.linkSuffix}
              </p>
            </div>
          </details>
          <details className="library-group">
            <summary>
              Guides to choosing treatment, admission, duration and cost
              <span aria-hidden="true">+</span>
            </summary>
            <div className="library-content">
              <p>
                Start with safety and clinical fit, then compare access,
                duration, location and complete pathway cost.
              </p>
              <div className="guide-links">
                {decisionGuides.map((guide) => (
                  <article key={guide.href}>
                    <h3>
                      <Link href={guide.href}>
                        {guide.title}
                        <Arrow />
                      </Link>
                    </h3>
                    <p>{guide.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </details>
          <details className="library-group">
            <summary>
              Explore treatment needs and other support routes
              <span aria-hidden="true">+</span>
            </summary>
            <div className="library-content guide-links">
              {relatedServices.map((service) => (
                <article key={service.href}>
                  <h3>
                    <Link href={service.href}>
                      {service.title}
                      <Arrow />
                    </Link>
                  </h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </details>
          <details className="library-group">
            <summary>
              More about treatment placement<span aria-hidden="true">+</span>
            </summary>
            <div className="library-content faq-list">
              {(parity.faqs ?? []).map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </details>
        </section>
        <section className="closing-section">
          <div className="wrap">
            <p className="eyebrow">A conversation is a place to start</p>
            <h2>
              You do not have to work <br />
              it all out <em>on your own.</em>
            </h2>
            <p>
              Tell us what you need help deciding. We will talk through the next
              step.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="button"
                onClick={() => open({ direct: true, service: "placement" })}
              >
                Request a private conversation <Arrow />
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => open({ service: "placement" })}
              >
                Start with a few questions <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
