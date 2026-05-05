import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { CTASection } from "@/components/ui/cta-section";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function WhatWeOffer() {
  return (
    <Layout>
      <PageHero 
        label="Our Services"
        heading="Comprehensive support across the recovery continuum."
        description="From the moment of crisis through to long-term health, we provide structured pathways for individuals, families, and professionals."
      />

      {/* Core Services */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Service 1 */}
            <div className="flex flex-col group border border-border p-10 hover:border-primary/20 transition-colors bg-white">
              <h3 className="text-2xl font-serif text-primary mb-4">Treatment Placement</h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-grow">
                Confidential guidance in identifying and securing the most appropriate detox or residential rehabilitation facility, leveraging our network of trusted international providers.
              </p>
              <Link href="/treatment-placement" className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-accent group-hover:text-primary transition-colors">
                Explore placement <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="flex flex-col group border border-border p-10 hover:border-primary/20 transition-colors bg-white mt-0 md:mt-8">
              <h3 className="text-2xl font-serif text-primary mb-4">Online Programme</h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-grow">
                A structured, robust digital recovery programme offering group support, one-to-one therapy, and accountability for those unable or unsuited to enter residential care.
              </p>
              <Link href="/online-programme" className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-accent group-hover:text-primary transition-colors">
                Explore programme <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="flex flex-col group border border-border p-10 hover:border-primary/20 transition-colors bg-white mt-0 md:mt-16">
              <h3 className="text-2xl font-serif text-primary mb-4">Insight OS</h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-grow">
                Our proprietary digital platform. The operating system for your recovery, featuring daily check-ins, health scoring, and AI-assisted guidance to monitor and sustain progress.
              </p>
              <Link href="/insight-os" className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-accent group-hover:text-primary transition-colors">
                Explore OS <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialised Support */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-white mb-6">Specialised Guidance</h2>
            <p className="text-lg text-primary-foreground/70 font-light leading-relaxed">
              We extend our expertise beyond the individual to support the wider network affected by addiction and mental health challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div className="flex flex-col">
              <div className="h-px w-12 bg-accent mb-6"></div>
              <h3 className="text-2xl font-serif text-white mb-4">Family & Intervention</h3>
              <p className="text-primary-foreground/80 font-light leading-relaxed">
                Addiction rarely affects just one person. We support families in navigating complex, highly emotional situations with care, clarity, and boundaries. From strategic guidance to formal intervention planning, we provide the framework needed to initiate change safely.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="h-px w-12 bg-accent mb-6"></div>
              <h3 className="text-2xl font-serif text-white mb-4">Professional Partnerships</h3>
              <p className="text-primary-foreground/80 font-light leading-relaxed">
                We act as a discreet, expert resource for professionals, Employee Assistance Programmes (EAPs), HR teams, and legal counsel. When an organisation encounters a sensitive substance or mental health issue with a key stakeholder, we assess, advise, and execute a clinical response.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Find the appropriate support."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </Layout>
  );
}