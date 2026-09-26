import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { RouteSchemas } from "@/components/RouteSchemas";
import { useEnquiryJourney } from "@/components/forms/EnquiryJourney";
import { getRouteParity } from "@/data/route-parity";
import "@/styles/premium-pages.css";

const parity = getRouteParity("/");
const destinations = [
  ["United Kingdom", "/private-rehab-uk"],
  ["South Africa", "/private-rehab-south-africa"],
  ["Thailand", "/private-rehab-thailand"],
  ["Spain", "/private-rehab-spain"],
  ["Sri Lanka", "/private-rehab-sri-lanka"],
] as const;
const services = [
  {
    title: "Private treatment placement",
    body: "Clarify detox needs, compare suitable private rehab options and coordinate the move into treatment in the UK or selected international destinations.",
    href: "/treatment-placement",
    cta: "Compare treatment options",
  },
  {
    title: "Family consultation and intervention",
    body: "Create a calm, practical plan for risk, communication, boundaries and treatment, even before your loved one agrees to help.",
    href: "/family-addiction-intervention-uk",
    cta: "Get family guidance",
  },
  {
    title: "Structured online recovery support",
    body: "A private, structured route for medically stable people who need recovery support around work, family or aftercare responsibilities.",
    href: "/online-programme",
    cta: "Check online suitability",
  },
  {
    title: "Insight OS recovery tools",
    body: "Daily check-ins, journalling, recovery planning and pattern tracking that help turn a treatment plan into repeatable everyday actions.",
    href: "/insight-os",
    cta: "Explore Insight OS",
  },
];
const Arrow = () => (
  <ArrowUpRight size={21} strokeWidth={1} aria-hidden="true" />
);

function PremiumHeadline({ children }: { children: string }) {
  const parts = children.split(" to ");
  if (parts.length !== 2) return <h1>{children}</h1>;
  return (
    <h1>
      {parts[0]}
      <br />
      {" to "}
      <em>{parts[1]}</em>
    </h1>
  );
}

export default function Home() {
  const { open } = useEnquiryJourney();
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
    open({ direct: true });
  }
  return (
    <Layout>
      <SEO
        title={parity.title}
        fullTitle={parity.title}
        description={parity.description}
        canonical={parity.canonical}
        noIndex={!parity.indexable}
        ogImage="https://www.insightrecoverynetwork.com/og-home-v2.png"
      />
      <RouteSchemas route="/" />
      <div className="premium-page premium-home">
        <section className="home-hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="line" /> Private treatment. Personal guidance.
            </p>
            <PremiumHeadline>{parity.h1}</PremiumHeadline>
            <p className="intro">{parity.heroIntro}</p>
            <p className="hero-detail">
              Speak directly with Craig Bilton about treatment for yourself or
              someone you care about, in the UK or internationally.
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
              <a className="text-link" href="#start-here">
                Not sure where to start? <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="micro reassurance">
              <span className="small-lock" aria-hidden="true">
                ◇
              </span>{" "}
              A private conversation. No obligation to proceed.
            </p>
          </div>
          <figure className="hero-portrait">
            <img
              src="/images/premium/craig-portrait.webp"
              alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network"
              width={1000}
              height={750}
              fetchPriority="high"
              loading="eager"
              sizes="(min-width: 1280px) 530px, (min-width: 621px) 45vw, calc(100vw - 40px)"
            />
            <figcaption>
              <span className="portrait-rule" />
              <span>
                <strong>Craig Bilton</strong>
                <small>Founder &amp; Clinical Director</small>
              </span>
              <span className="portrait-monogram" aria-hidden="true">
                IRN
              </span>
            </figcaption>
          </figure>
        </section>
        <section className="credibility wrap" aria-label="Our experience">
          <div>
            <strong>20+ years</strong>
            <span>International addiction treatment experience</span>
          </div>
          <div>
            <strong>UK &amp; international</strong>
            <span>Treatment options considered around your needs</span>
          </div>
          <div>
            <strong>Personal guidance</strong>
            <span>A direct conversation with Craig Bilton</span>
          </div>
        </section>
        <section className="routes-section section wrap" id="start-here">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Start with what matters to you</p>
              <h2>
                You do not need <br />
                all the answers yet.
              </h2>
            </div>
            <p>
              A few simple questions can help you tell us what you need. Or you
              can request a conversation straight away.
            </p>
          </div>
          <div className="route-list">
            <button
              type="button"
              className="route-row"
              onClick={() => open({ who: "myself", service: "placement" })}
            >
              <span className="route-num">01</span>
              <span className="route-title">
                I’m considering treatment
                <span>Understand your options and the next step.</span>
              </span>
              <span className="circle-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
            <button
              type="button"
              className="route-row"
              onClick={() => open({ who: "someone", service: "family" })}
            >
              <span className="route-num">02</span>
              <span className="route-title">
                I’m worried about someone
                <span>
                  Talk through the situation, even if they are not ready.
                </span>
              </span>
              <span className="circle-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
            <button
              type="button"
              className="route-row"
              onClick={() => open({ service: "placement" })}
            >
              <span className="route-num">03</span>
              <span className="route-title">
                I’m comparing options and costs
                <span>Make sense of what is included before committing.</span>
              </span>
              <span className="circle-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
          <p className="quiet-note">
            Need discretion around work or public responsibilities?{" "}
            <Link href="/confidential-addiction-help-professionals">
              Explore confidential support for professionals.
            </Link>
          </p>
        </section>
        <section className="dark-section" id="how-we-help">
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">A person beside you. A plan ahead.</p>
                <h2>
                  From uncertainty <br />
                  to a <em>clearer next step.</em>
                </h2>
              </div>
              <p>
                Choosing treatment involves more than finding a place. We help
                you consider the person, the care and the practical details
                together.
              </p>
            </div>
            <div className="service-steps">
              <article>
                <span className="step-number">01 / Understand</span>
                <h3>
                  Make room for <br />
                  your situation.
                </h3>
                <p>
                  Talk through your concerns, medical and mental-health needs,
                  what has already been tried, and the support available at
                  home.
                </p>
              </article>
              <article>
                <span className="step-number">02 / Compare</span>
                <h3>
                  See the options <br />
                  more clearly.
                </h3>
                <p>
                  Consider treatment needs, provider capabilities, location,
                  complete costs and family involvement. We explain relevant
                  provider relationships and fees.
                </p>
              </article>
              <article>
                <span className="step-number">03 / Coordinate</span>
                <h3>
                  Know what <br />
                  happens next.
                </h3>
                <p>
                  Get help with provider conversations, admission planning and
                  the questions to ask about aftercare. The provider retains
                  responsibility for its clinical assessment and care.
                </p>
              </article>
            </div>
            <div className="dark-bottom">
              <Link
                className="text-link light-link"
                href="/treatment-placement"
              >
                Explore treatment placement <Arrow />
              </Link>
              <div className="inline-destinations">
                {destinations.map(([name, href]) => (
                  <Link key={href} href={href}>
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="founder-section section wrap" id="about-craig">
          <figure className="founder-photo">
            <img
              src="/images/premium/craig-at-work.webp"
              width={1000}
              height={1250}
              loading="lazy"
              alt="Craig Bilton seated during an interview"
              sizes="(min-width: 1280px) 570px, (min-width: 621px) 45vw, calc(100vw - 40px)"
            />
            <figcaption>
              Craig Bilton · Founder &amp; Clinical Director
            </figcaption>
          </figure>
          <div className="founder-copy">
            <p className="eyebrow">Meet the person you will speak to</p>
            <h2>
              Experienced guidance. <br />
              <em>A personal approach.</em>
            </h2>
            <p className="lead">
              I’m Craig Bilton, founder of Insight Recovery Network.
            </p>
            <p>
              My work over more than 20 years has included addiction treatment,
              recovery programme management, family support and treatment
              placement, with international experience in South Africa, Thailand
              and Sri Lanka.
            </p>
            <p>
              IRN brings that experience to the decisions you are facing now,
              with space to ask questions and understand your options.
            </p>
            <button
              type="button"
              className="text-link"
              onClick={() => open({ direct: true })}
            >
              Request a conversation with Craig <Arrow />
            </button>
            <p className="quiet-note">
              For adults seeking private support, and families concerned about
              an adult. <Link href="/about">More about Craig and IRN.</Link>
            </p>
          </div>
        </section>
        <section
          className="premium-support section wrap"
          aria-labelledby="support-options-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Support that fits the situation</p>
              <h2 id="support-options-heading">
                Different needs. <br />
                <em>Practical routes forward.</em>
              </h2>
            </div>
            <p>
              Residential treatment is one route. The right support depends on
              safety, the person’s needs and their circumstances.
            </p>
          </div>
          <div className="support-grid">
            {services.map((service, index) => (
              <article key={service.href}>
                <span className="step-number">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <Link className="text-link" href={service.href}>
                  {service.cta}
                  <Arrow />
                </Link>
              </article>
            ))}
          </div>
          <div className="support-links">
            <Link href="/how-much-does-rehab-cost-uk">Compare rehab costs</Link>
            <Link href="/services-pricing-guide">IRN services and fees</Link>
          </div>
        </section>
        <section className="guide-section">
          <div className="wrap guide-layout">
            <div>
              <p className="eyebrow">Your next step</p>
              <h2>
                Start wherever <br />
                <em>you are.</em>
              </h2>
              <p>
                You do not need a diagnosis, a chosen provider or a complete
                history before asking for guidance.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => open({ direct: true })}
              >
                Go straight to contact <Arrow />
              </button>
            </div>
            <div className="card-stack">
              <div className="start-card">
                <div className="card-top">
                  <span>LET’S FIND A STARTING POINT</span>
                  <span>01 / 04</span>
                </div>
                <h3>
                  Who are you looking <br />
                  for help for?
                </h3>
                <div className="starter-options">
                  <button type="button" onClick={() => open({ who: "myself" })}>
                    Myself <Arrow />
                  </button>
                  <button
                    type="button"
                    onClick={() => open({ who: "someone" })}
                  >
                    Someone I care about <Arrow />
                  </button>
                  <button
                    type="button"
                    onClick={() => open({ who: "professional" })}
                  >
                    A client <Arrow />
                  </button>
                </div>
                <p className="micro">
                  A few optional questions. You stay in control.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="other-support wrap">
          <p>Looking for support outside residential treatment?</p>
          <button
            type="button"
            className="text-link"
            onClick={() => open({ service: "online", direct: true })}
          >
            Ask about online recovery support <Arrow />
          </button>
        </section>
      </div>
    </Layout>
  );
}
