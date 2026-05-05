import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { PathwayCard } from "@/components/ui/pathway-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CTASection } from "@/components/ui/cta-section";
import { Shield, Globe, Compass, CheckCircle } from "lucide-react";
import { ServicePreview } from "@/components/ui/service-preview";

export default function Home() {
  return (
    <Layout>
      <PageHero 
        heading="Private addiction and mental health support, built around the person."
        description="Insight Recovery Network provides confidential treatment placement, structured online recovery support and digital recovery tools for individuals, families and professionals."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
        secondaryCta={{ label: "Explore Support Options", href: "/what-we-offer" }}
        image={{ src: "https://placehold.co/800x1000/E2E0D9/162B3B?text=Clinical+Setting", alt: "Calm private clinical setting" }}
      />

      {/* Pathways Section */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader 
            label="Where to start"
            heading="Find the right path"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <PathwayCard title="I need help for myself" href="/contact" delay={0} />
            <PathwayCard title="I need help for someone else" href="/contact" delay={100} />
            <PathwayCard title="I am a professional or organisation" href="/contact" delay={200} />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            <div className="lg:col-span-4 sticky top-32">
              <SectionHeader 
                label="Our Services"
                heading="Comprehensive care, quietly delivered"
                description="We offer discrete, evidence-based interventions tailored to the specific needs of the individual and their circumstances."
              />
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-12">
              <ServicePreview
                title="Treatment Placement"
                description="Expert guidance in finding the right detox, residential rehab, or ongoing recovery planning locally or internationally."
                href="/treatment-placement"
              />
              <ServicePreview
                title="Online Recovery Programme"
                description="Structured group support, one-to-one sessions, and accountability without entering residential treatment."
                href="/online-programme"
              />
              <ServicePreview
                title="Insight OS"
                description="A dedicated digital platform for recovery management. Daily check-ins, health scores, and proactive guidance."
                href="/insight-os"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us / Differentiators */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif leading-tight">Why Insight Recovery Network</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <Shield className="w-8 h-8 text-accent mx-auto md:mx-0" strokeWidth={1.5} />
              <h3 className="text-xl font-serif">Confidential guidance</h3>
              <p className="text-primary-foreground/70 font-light text-sm leading-relaxed">
                Absolute discretion and privacy for individuals and families navigating sensitive challenges.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-left">
              <CheckCircle className="w-8 h-8 text-accent mx-auto md:mx-0" strokeWidth={1.5} />
              <h3 className="text-xl font-serif">Clinically informed support</h3>
              <p className="text-primary-foreground/70 font-light text-sm leading-relaxed">
                Evidence-based approaches and expert insight to ensure appropriate and effective care.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-left">
              <Globe className="w-8 h-8 text-accent mx-auto md:mx-0" strokeWidth={1.5} />
              <h3 className="text-xl font-serif">International partnerships</h3>
              <p className="text-primary-foreground/70 font-light text-sm leading-relaxed">
                Access to a vetted network of premium treatment providers globally.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-left">
              <Compass className="w-8 h-8 text-accent mx-auto md:mx-0" strokeWidth={1.5} />
              <h3 className="text-xl font-serif">Digital recovery tools</h3>
              <p className="text-primary-foreground/70 font-light text-sm leading-relaxed">
                Modern software and systems to maintain continuity of care and monitor long-term recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader 
            align="center"
            label="The Process"
            heading="How It Works"
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative max-w-5xl mx-auto">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-border/60"></div>
            
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-background border border-accent text-primary flex items-center justify-center text-xl font-serif mb-6 relative z-10 transition-colors duration-300 group-hover:bg-accent group-hover:text-primary">
                1
              </div>
              <h3 className="text-xl font-medium text-primary mb-3">Tell us what is happening</h3>
              <p className="text-muted-foreground font-light px-4">
                Reach out confidentially to discuss your situation or concerns for a loved one.
              </p>
            </div>
            
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-background border border-accent text-primary flex items-center justify-center text-xl font-serif mb-6 relative z-10 transition-colors duration-300 group-hover:bg-accent group-hover:text-primary">
                2
              </div>
              <h3 className="text-xl font-medium text-primary mb-3">We help clarify the right level of support</h3>
              <p className="text-muted-foreground font-light px-4">
                Together, we review options and create a structured, appropriate plan of action.
              </p>
            </div>
            
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-background border border-accent text-primary flex items-center justify-center text-xl font-serif mb-6 relative z-10 transition-colors duration-300 group-hover:bg-accent group-hover:text-primary">
                3
              </div>
              <h3 className="text-xl font-medium text-primary mb-3">We guide the next step confidentially</h3>
              <p className="text-muted-foreground font-light px-4">
                From treatment placement to ongoing digital support, we manage the transition.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="A private conversation can be the first step."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
      />
    </Layout>
  );
}