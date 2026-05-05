import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { CTASection } from "@/components/ui/cta-section";
import { MapPin, Shield, HeartHandshake } from "lucide-react";

export default function TreatmentPlacement() {
  return (
    <Layout>
      <SEO
        title="Treatment Placement — Private Rehab & Detox Guidance"
        description="Independent, confidential guidance to find the right detox or rehabilitation facility in the UK or internationally. We assess needs and manage the transition."
        canonical="/treatment-placement"
      />
      <PageHero 
        label="Treatment Placement"
        heading="Navigating residential care with certainty."
        description="Independent, confidential guidance to find the right detox, rehabilitation facility, or specialised care setting worldwide."
        primaryCta={{ label: "Request Guidance", href: "/contact" }}
        image={{ src: "https://placehold.co/800x1000/E2E0D9/162B3B?text=Placement", alt: "Treatment placement guidance" }}
      />

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Not all facilities are appropriate for all individuals.
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Finding a reputable rehab facility is difficult. Marketing materials often obscure clinical realities, and making the wrong choice at a critical moment can be detrimental to recovery.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                We provide independent, objective placement advice. We assess the clinical need, the individual's background, and the family's requirements, then map these against our vetted network of treatment providers.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary w-10 h-10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-primary mb-1">Independent Assessment</h4>
                    <p className="text-sm text-muted-foreground font-light">We evaluate the clinical appropriateness of facilities without bias.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary w-10 h-10 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-primary mb-1">Managed Transition</h4>
                    <p className="text-sm text-muted-foreground font-light">From initial admission logistics to discharge planning and aftercare.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/30 p-10 md:p-14 border border-border/50 relative">
              <MapPin className="w-8 h-8 text-accent mb-8" />
              <h3 className="text-2xl font-serif text-primary mb-6">Our International Network</h3>
              <p className="text-muted-foreground font-light mb-8">
                We maintain close relationships with selected, high-quality treatment partners across multiple regions to ensure we can meet specific clinical and environmental needs.
              </p>
              <ul className="grid grid-cols-2 gap-y-4 text-primary font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> United Kingdom</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> South Africa</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Thailand</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Spain</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Sri Lanka</li>
              </ul>
              <div className="mt-10 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground italic font-light">
                  *Placement recommendations are made solely on clinical appropriateness and individual requirements. We offer careful, measured guidance without guarantees of specific outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Request confidential placement guidance."
        description="Speak with our clinical team to discuss options discreetly."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </Layout>
  );
}