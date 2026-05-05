import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { CTASection } from "@/components/ui/cta-section";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Us — Clinically Informed Recovery Guidance"
        description="Learn about our clinical and recovery-informed approach, our international experience, and the values that guide our support for individuals and families."
        canonical="/about"
      />
      <PageHero 
        label="About Us"
        heading="Clinically informed care with absolute discretion."
        description="Insight Recovery Network was founded to provide clear, practical, and highly confidential support for individuals and families facing complex addiction and mental health challenges."
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 lg:col-start-3">
              <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed max-w-none">
                <p className="text-2xl text-primary font-serif leading-relaxed mb-8">
                  Navigating treatment options or knowing how to help someone can be overwhelming. We exist to bring clarity, dignity, and clinical expertise to those decisions.
                </p>
                
                <h3>A Clinical and Recovery-Informed Approach</h3>
                <p>
                  Insight Recovery Network operates at the intersection of clinical best practice and lived recovery experience. Our approach prioritises the person, stripping away the jargon and confusion to focus on what actually works. We do not apply a one-size-fits-all model; every recommendation is carefully considered based on the individual's specific needs, background, and clinical requirements.
                </p>

                <h3>International Experience</h3>
                <p>
                  With partnerships and experience spanning multiple countries, we have the network and capability to arrange support locally or internationally. Whether that involves sourcing a specialised detox facility in the UK, a residential programme in South Africa, or long-term therapeutic care in Thailand, we possess the insight to connect individuals with the right environment for their recovery.
                </p>

                <h3 className="mt-12">Our Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 not-prose">
                  <div className="border-l-2 border-accent pl-6 py-2">
                    <h4 className="font-serif text-xl text-primary mb-2">Confidentiality</h4>
                    <p className="text-muted-foreground font-light text-sm">We protect privacy fiercely, ensuring that individuals and families can seek help safely.</p>
                  </div>
                  <div className="border-l-2 border-accent pl-6 py-2">
                    <h4 className="font-serif text-xl text-primary mb-2">Dignity</h4>
                    <p className="text-muted-foreground font-light text-sm">We treat every individual with profound respect, regardless of the severity of their situation.</p>
                  </div>
                  <div className="border-l-2 border-accent pl-6 py-2">
                    <h4 className="font-serif text-xl text-primary mb-2">Clarity</h4>
                    <p className="text-muted-foreground font-light text-sm">We provide clear, honest guidance devoid of false promises or unnecessary complexity.</p>
                  </div>
                  <div className="border-l-2 border-accent pl-6 py-2">
                    <h4 className="font-serif text-xl text-primary mb-2">Continuity</h4>
                    <p className="text-muted-foreground font-light text-sm">We look beyond acute intervention, focusing on sustainable, long-term recovery support.</p>
                  </div>
                  <div className="border-l-2 border-accent pl-6 py-2">
                    <h4 className="font-serif text-xl text-primary mb-2">Practical Support</h4>
                    <p className="text-muted-foreground font-light text-sm">We offer tangible tools and structured guidance, not just abstract concepts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile Placeholder */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5">
                <div className="aspect-[3/4] w-full max-w-sm mx-auto md:mx-0 relative">
                  <img 
                    src="https://placehold.co/600x800/E2E0D9/162B3B?text=Craig+Bilton" 
                    alt="Craig Bilton" 
                    data-placeholder="true"
                    className="w-full h-full object-cover shadow-sm grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 border border-primary/10 m-2"></div>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-sm font-semibold tracking-widest uppercase text-accent font-sans mb-3">
                  Founder & Clinical Director
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-primary mb-6">Craig Bilton</h3>
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                  [Placeholder for Founder Bio] Craig has extensive experience in the clinical management of complex addiction cases and international treatment placement. He founded Insight Recovery Network to bridge the gap between initial crisis intervention and long-term sustainable recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Discuss your situation with us."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </Layout>
  );
}