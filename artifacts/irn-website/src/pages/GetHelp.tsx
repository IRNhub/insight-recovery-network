import { Link } from "wouter";
import { Phone, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { RouteSchemas } from "@/components/RouteSchemas";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { FAQSection } from "@/components/ui/faq-section";
import { getRouteParity } from "@/data/route-parity";
import craigImage from "@/assets/craig-bilton.jpg";

export function EnquiryPage({
  variant = "get-help",
}: {
  variant?: "get-help" | "contact";
}) {
  const base = getRouteParity("/get-help");
  const parity =
    variant === "contact"
      ? {
          ...base,
          title: "Contact Insight Recovery Network",
          description: "Contact IRN by phone, WhatsApp, email or a private enquiry form. Tell us how and when it is suitable to respond about treatment placement or recovery support.",
          canonical: "/contact",
          h1: "Contact Insight Recovery Network",
        }
      : base;
  const isContact = variant === "contact";
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
      {!isContact && <RouteSchemas route="/get-help" />}
      <section className="home-hero py-9 md:py-14">
        <div className="container mx-auto grid items-start gap-8 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-4">A confidential first step</p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.12] tracking-tight text-primary md:text-5xl">
              {parity.h1}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {parity.heroIntro}
            </p>
            <a
              href={parity.primaryCta.href}
              data-primary-commercial-cta="true"
              data-analytics-event={parity.primaryCta.analyticsEvent}
              data-source-page={
                isContact ? "/contact" : parity.primaryCta.sourcePage
              }
              data-service-interest={parity.primaryCta.serviceInterest}
              data-cta-location={parity.primaryCta.location}
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4"
            >
              {parity.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary">
              <a
                href="tel:+447415994475"
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call +44 7415 994475
              </a>
              <a
                href="https://wa.me/447723486235?text=Hi%20Craig%2C%20I%27d%20like%20to%20speak%20confidentially."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Or email{" "}
              <a
                href="mailto:info@insightrecoverynetwork.com"
                className="break-all text-primary underline underline-offset-4"
              >
                info@insightrecoverynetwork.com
              </a>
              .
            </p>
            <div className="mt-8 hidden rounded-xl border border-border bg-white/70 p-6 lg:block">
              <div className="flex items-center gap-4">
                <ResponsiveImage
                  src={craigImage}
                  alt="Craig Bilton"
                  width={80}
                  height={80}
                  sizes="80px"
                  loading="lazy"
                  className="h-20 w-20 rounded-full object-cover object-top"
                />
                <div>
                  <p className="font-serif text-xl text-primary">
                    Craig Bilton
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Founder & Clinical Director
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                More than 20 years of international experience in addiction
                treatment and recovery support, including work in South Africa,
                Thailand and Sri Lanka.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                About Craig and IRN
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <EnquiryForm variant={variant} />
        </div>
      </section>
      <section className="border-y border-border bg-white py-10">
        <div className="container mx-auto mb-8 px-6 md:px-12">
          <h2 className="font-serif text-2xl text-primary">Who this is for</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Private support for adults aged 18 and over, and families seeking
            help for an adult. IRN provides private, paid services and does not
            provide emergency or NHS crisis care. We do not work with people
            under 18. We help you understand suitable treatment and support
            options in the UK and abroad.
          </p>
        </div>
        <div className="container mx-auto grid gap-7 px-6 md:grid-cols-3 md:px-12">
          <div>
            <ShieldCheck
              className="mb-3 h-5 w-5 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-primary">
              Handled discreetly
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Choose your contact method and tell us if there are limits on when
              or how we should respond.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">
              Clear about the next step
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We respond during our working hours to discuss your request.
              Sending a form does not book an appointment or commit you to a
              service.
            </p>
            <Link
              href="/services-pricing-guide"
              className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
            >
              View IRN services and fees
            </Link>
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">
              If you need urgent medical help
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              IRN is not an emergency service and does not diagnose or
              prescribe. In immediate danger, call{" "}
              <a
                href="tel:999"
                className="font-semibold text-primary underline"
              >
                999
              </a>{" "}
              or attend A&amp;E. For urgent non-emergency advice, use{" "}
              <a
                href="https://111.nhs.uk"
                className="font-semibold text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                NHS 111
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <FAQSection
        heading="Before you make contact"
        items={parity.faqs ?? []}
        includeSchema={isContact}
      />
    </Layout>
  );
}
export default function GetHelp() {
  return <EnquiryPage />;
}
