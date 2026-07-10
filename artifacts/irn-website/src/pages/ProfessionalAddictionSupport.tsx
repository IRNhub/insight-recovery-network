import { Helmet } from "react-helmet-async";
import { ArrowRight, Briefcase, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import professionalImage from "@/assets/professional-partnerships.webp";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const CANONICAL = "/confidential-addiction-help-professionals";

const faqs: FAQItem[] = [
  {
    question: "Will my employer be told if I contact you?",
    answer:
      "Not simply because you make a private enquiry. We explain how information is handled and obtain consent before involving an employer, family member or treatment provider, except where a legal or immediate safeguarding duty applies.",
  },
  {
    question: "Can I get help without entering residential rehab?",
    answer:
      "Possibly. Structured online support may suit people who are medically stable, have a safe environment and do not require supervised withdrawal or 24-hour care. Where risk is higher, residential or medically supervised treatment may be safer.",
  },
  {
    question: "Can you help compare discreet residential options?",
    answer:
      "Yes. We can help consider clinical fit, confidentiality, location, work and family constraints, detox needs, mental-health support, budget and aftercare across UK and selected international providers.",
  },
  {
    question: "Can a partner, colleague or adviser contact you first?",
    answer:
      "Yes. Partners, family members, GPs, therapists, HR leaders, EAPs and legal advisers may request an initial confidential conversation about possible routes and how to approach the situation appropriately.",
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

const pressures = [
  "You are still performing at work, but alcohol or drug use is becoming harder to contain",
  "You are worried about confidentiality, reputation, professional registration or employment",
  "Stress, anxiety, trauma, sleep or burnout are interacting with substance use",
  "You cannot simply disappear from work or family life without a clear plan",
  "Previous attempts to moderate, stop or manage the problem privately have not lasted",
  "You need an independent view of online, outpatient, detox and residential options",
];

export default function ProfessionalAddictionSupport() {
  return (
    <Layout>
      <SEO
        title="Confidential Addiction Help for Professionals"
        fullTitle="Confidential Addiction Help for Professionals UK | Insight Recovery Network"
        description="Discreet addiction treatment guidance for executives, professionals and business owners. Compare structured online support, private detox and residential rehab confidentially."
        canonical={CANONICAL}
        ogImage={`${SITE_URL}/og-treatment-placement.png`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="relative overflow-hidden border-b border-border/40 bg-primary py-12 text-primary-foreground md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_35%,rgba(201,169,110,0.18),transparent_40%)]" />
        <div className="container relative mx-auto grid items-center gap-12 px-6 md:px-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Private support for professionals</p>
            <h1 className="mb-6 font-serif text-4xl leading-[1.08] tracking-tight text-primary-foreground md:text-5xl lg:text-[3.45rem]">
              Get help before the problem decides for you.
            </h1>
            <p className="mb-5 max-w-xl text-lg font-light leading-relaxed text-primary-foreground/75">
              Confidential addiction guidance for professionals, executives and business owners who need a credible plan without unnecessary exposure.
            </p>
            <p className="mb-8 max-w-xl leading-relaxed text-primary-foreground/65">
              We help you compare structured online support, medically supervised detox and discreet residential treatment around your clinical needs, work, family and privacy.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact">
                <Button className="h-12 w-full rounded-none bg-white px-7 text-primary hover:bg-white/90 sm:w-auto">
                  Arrange a discreet consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+447415994475">
                <Button variant="outline" className="h-12 w-full rounded-none border-white/25 px-7 text-white hover:bg-white/10 sm:w-auto">
                  Call confidentially
                </Button>
              </a>
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <img
              src={professionalImage}
              alt="A professional arranging confidential addiction treatment support"
              className="aspect-[5/4] w-full rounded-xl object-cover shadow-2xl"
              width={1200}
              height={960}
              fetchPriority="high"
            />
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 divide-x divide-white/15 rounded-lg bg-primary/90 p-4 backdrop-blur-sm">
              <div className="pr-4">
                <p className="text-xs font-semibold">Discreet first contact</p>
                <p className="mt-1 text-[11px] text-white/55">No obligation to proceed</p>
              </div>
              <div className="pl-4">
                <p className="text-xs font-semibold">20+ years’ experience</p>
                <p className="mt-1 text-[11px] text-white/55">UK and international treatment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who="Professionals, executives, founders, clinicians and public-facing individuals concerned about alcohol, drugs, relapse or deteriorating mental health."
        problem="Clarifies a proportionate, confidential route before work, health, relationships or professional responsibilities are further affected."
        applies="Telephone and online consultation across the UK, with treatment guidance in the UK and selected international destinations."
        nextStep="Arrange a discreet consultation"
        updated="10 July 2026"
      />

      <section className="border-b border-border/40 py-12 md:py-20">
        <div className="container mx-auto grid gap-12 px-6 md:px-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">High-functioning does not mean low-risk</p>
            <h2 className="font-serif text-3xl leading-tight text-primary md:text-4xl">You do not have to wait for a public crisis.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Career success can hide the severity of a problem and make asking for help feel more threatening. The aim is to understand the real level of risk and choose the least disruptive route that is still safe and clinically appropriate.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {pressures.map((item) => (
              <div key={item} className="flex gap-3 border border-border/40 bg-white p-5">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { Icon: LockKeyhole, title: "Privacy built into the plan", body: "We discuss who needs to know, consent, contact preferences and how treatment can be coordinated with minimum unnecessary disclosure." },
              { Icon: ShieldCheck, title: "Safety sets the level of care", body: "Professional commitments do not override withdrawal risk, mental-health risk or the need for supervised treatment where clinically indicated." },
              { Icon: Briefcase, title: "Work and continuity considered", body: "Where safe, we consider online structure, leave arrangements, treatment length, return-to-work planning and sustained aftercare." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="border border-border/40 bg-background p-7">
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
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Choosing the right route</p>
            <h2 className="font-serif text-3xl text-primary md:text-4xl">The most private option is the one that deals with the problem properly.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="border-l-2 border-accent/60 bg-secondary/20 p-6">
                <h3 className="font-serif text-xl text-primary">Structured online support</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">May suit medically stable people who can engage safely from home and need strong structure around existing responsibilities.</p>
                <Link href="/online-programme" className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:text-accent">Explore the online programme <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </div>
              <div className="border-l-2 border-accent/60 bg-secondary/20 p-6">
                <h3 className="font-serif text-xl text-primary">Detox or residential treatment</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">May be safer where there is physical dependence, repeated relapse, significant risk, an unstable environment or a need to step away completely.</p>
                <Link href="/treatment-placement" className="mt-5 inline-flex items-center text-sm font-semibold text-primary hover:text-accent">Compare treatment options <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={faqs} heading="Confidentiality and treatment questions" />
      <CTASection
        heading="A private conversation can prevent a public crisis."
        body="Explain what is happening and what you need to protect. We will help you identify a safe, proportionate next step without pressure."
        primaryLabel="Arrange a discreet consultation"
        primaryHref="/contact"
        secondaryLabel="Compare rehab options"
        secondaryHref="/treatment-placement"
      />
    </Layout>
  );
}
