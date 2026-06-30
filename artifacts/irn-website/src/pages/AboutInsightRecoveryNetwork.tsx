import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";

const SITE_URL = "https://www.insightrecoverynetwork.com";

const services = [
  {
    title: "Private Treatment Placement",
    body: "Confidential guidance on private rehab, detox, and residential treatment in the UK and internationally. We help individuals and families understand options, compare settings, and identify clinically appropriate treatment based on need and risk.",
    href: "/treatment-placement",
  },
  {
    title: "Online Recovery Programme",
    body: "Structured online addiction recovery support including facilitated group sessions, one-to-one therapy, relapse prevention planning, recovery worksheets, and daily digital support through Insight OS.",
    href: "/online-programme",
  },
  {
    title: "Family Intervention Guidance",
    body: "Support for families navigating addiction crises, including guidance on how to approach the person, what to say, what boundaries to consider, and how to coordinate a structured response where needed.",
    href: "/what-we-offer",
  },
  {
    title: "Self-Assessments",
    body: "Free confidential assessments for alcohol use, drug use, detox suitability, anxiety, depression, ADHD, and impulsivity. Designed to help individuals understand what they are experiencing and what level of support may be appropriate.",
    href: "/assessments",
  },
  {
    title: "Insight OS",
    body: "A structured digital recovery system providing daily check-ins, relapse prevention tools, anchor practices, and recovery planning for individuals who want a clinically informed framework to support their recovery between sessions.",
    href: "/insight-os",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Insight Recovery Network",
  alternateName: "IRN",
  description:
    "UK-based online addiction recovery and mental health support service providing private treatment placement guidance, structured online recovery programmes, family intervention support, relapse prevention planning, and digital recovery tools.",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/opengraph.jpg`,
  email: "info@insightrecoverynetwork.com",
  telephone: "+447415994475",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Newquay",
    addressRegion: "Cornwall",
    addressCountry: "GB",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  serviceType: [
    "Addiction Treatment Placement",
    "Online Addiction Recovery Support",
    "Family Intervention Guidance",
    "Relapse Prevention Planning",
    "Digital Recovery Tools",
  ],
  founder: {
    "@type": "Person",
    name: "Craig Bilton",
    jobTitle: "Clinical Director",
    description:
      "20+ years of international addiction treatment experience in senior clinical roles across the UK and internationally.",
  },
  knowsAbout: [
    "Addiction recovery",
    "Alcohol dependency and detox",
    "Drug rehabilitation",
    "Mental health and dual diagnosis",
    "Relapse prevention",
    "Family intervention",
    "Private rehab placement UK",
    "Online addiction recovery support UK",
  ],
};

export default function AboutInsightRecoveryNetwork() {
  return (
    <Layout>
      <SEO
        title="About Insight Recovery Network"
        fullTitle="About Insight Recovery Network | UK Addiction Recovery Support Service"
        description="Insight Recovery Network is a UK-based online addiction recovery and mental health support service. Private treatment placement guidance, online recovery programmes, family intervention, and digital recovery tools."
        canonical="/about-insight-recovery-network"
        ogImage={`${SITE_URL}/opengraph.jpg`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-14 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
              About Insight Recovery Network
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-tight mb-8 text-primary">
              A confidential addiction recovery and mental health support service.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Insight Recovery Network is a UK-based, online-only service providing private treatment placement guidance, structured recovery programmes, family intervention support, and digital recovery tools for individuals and families navigating addiction and mental health challenges.
            </p>
          </div>
        </div>
      </section>

      {/* What IRN Is */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                What Insight Recovery Network is
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Insight Recovery Network is an online-only private addiction recovery and mental health support service based in Newquay, Cornwall, UK. We work with individuals and families across the United Kingdom who need professional support in navigating addiction, seeking treatment, managing relapse risk, or understanding the options available to them.
                </p>
                <p>
                  We do not offer face-to-face appointments. All services are delivered online — by telephone, video call, and through our digital recovery platform, Insight OS. This is a deliberate choice: it allows us to support people discreetly, without the need to travel, attend a clinic, or disclose more than is necessary.
                </p>
                <p>
                  Insight Recovery Network was founded by Craig Bilton, Clinical Director, with over 20 years of international addiction treatment experience in senior clinical roles. The service is designed to provide support that is genuinely useful — not generic, not sales-driven, and not dependent on a single treatment pathway.
                </p>
              </div>
            </div>
            <div>
              <div className="bg-muted/50 rounded-sm p-8 border border-border/40">
                <h3 className="font-serif text-xl font-medium mb-6 text-primary">Service details</h3>
                <dl className="space-y-5 text-sm">
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Service type</dt>
                    <dd className="text-foreground">Private addiction recovery and mental health support</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Location</dt>
                    <dd className="text-foreground">Newquay, Cornwall, UK</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Service delivery</dt>
                    <dd className="text-foreground">Online only — telephone, video call, and Insight OS digital platform</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Face-to-face appointments</dt>
                    <dd className="text-foreground">Not available</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">General enquiries</dt>
                    <dd>
                      <a href="mailto:info@insightrecoverynetwork.com" className="text-foreground hover:text-accent transition-colors">
                        info@insightrecoverynetwork.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Clinical enquiries</dt>
                    <dd>
                      <a href="mailto:craig@insightrecoverynetwork.com" className="text-foreground hover:text-accent transition-colors">
                        craig@insightrecoverynetwork.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Telephone</dt>
                    <dd>
                      <a href="tel:+447415994475" className="text-foreground hover:text-accent transition-colors">
                        +44 7415 994475
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              What we offer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Insight Recovery Network provides a range of support services, designed to meet individuals and families at different points in the recovery process — from initial assessment and treatment decisions through to structured ongoing support and relapse prevention.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link
                key={s.href + s.title}
                href={s.href}
                className="group border border-border/40 rounded-sm p-7 hover:border-accent/40 transition-colors block"
              >
                <h3 className="font-serif text-xl font-medium mb-3 text-primary group-hover:text-accent/90 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-8 text-primary">
              Who we work with
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Insight Recovery Network works with adults in the UK who are concerned about their own alcohol use, drug use, or addictive behaviour, and with families supporting a loved one through addiction or mental health difficulties.
              </p>
              <p>
                We also work with professionals seeking treatment placement guidance for clients, employees, or patients, and with individuals who have completed residential treatment and need ongoing support to protect their recovery.
              </p>
              <p>
                Our services are not suitable as emergency or crisis support. If you or someone you know is in immediate danger, please contact 999 or attend your nearest A&amp;E. The Samaritans are available 24/7 on <strong>116 123</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical note */}
      <section className="py-12 md:py-16 bg-muted/40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl font-medium mb-5 text-primary">Important notice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Insight Recovery Network is a private support and treatment guidance service. We are not a regulated healthcare provider, a medical treatment service, or a registered charity. We do not provide clinical diagnoses, prescriptions, or emergency crisis support. Our role is to help individuals and families understand their options, navigate the treatment system, and access appropriate professional support. Any guidance we provide is advisory and should be considered alongside advice from a qualified medical professional.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        heading="Speak with us confidentially."
        body="If you would like to understand more about what Insight Recovery Network offers, or would like guidance on the most appropriate support for your situation, please get in touch. There is no obligation and no pressure."
        primaryLabel="Book a confidential call"
        primaryHref="/contact"
        secondaryLabel="View all services"
        secondaryHref="/what-we-offer"
      />
    </Layout>
  );
}
