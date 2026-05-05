import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { CTASection } from "@/components/ui/cta-section";
import { Users, User, Calendar, Activity, Lock } from "lucide-react";

export default function OnlineProgramme() {
  return (
    <Layout>
      <SEO
        title="Online Recovery Programme — Structured Digital Support"
        description="A structured online recovery programme with group support, one-to-one therapy, daily structure, and relapse prevention — available without residential care."
        canonical="/online-programme"
      />
      <PageHero 
        label="Online Programme"
        heading="Structured recovery support, accessible anywhere."
        description="A robust digital programme providing the accountability, therapy, and structure needed to establish and maintain recovery."
        primaryCta={{ label: "Enquire Now", href: "/contact" }}
      />

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight mb-6">
              For when residential care is not the right fit.
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Our Online Programme is designed for individuals who require professional support and structured relapse prevention but cannot—or do not need to—step away from their professional and family responsibilities to enter a residential facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-border flex flex-col items-start hover:border-accent/40 transition-colors">
              <Users className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-serif text-primary mb-3">Group Support</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Facilitated, confidential peer groups providing shared experience, accountability, and a supportive network to combat isolation.
              </p>
            </div>
            
            <div className="bg-white p-8 border border-border flex flex-col items-start hover:border-accent/40 transition-colors">
              <User className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-serif text-primary mb-3">One-to-One Sessions</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Dedicated individual therapy to address specific underlying issues and develop personalised coping strategies.
              </p>
            </div>

            <div className="bg-white p-8 border border-border flex flex-col items-start hover:border-accent/40 transition-colors">
              <Calendar className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-serif text-primary mb-3">Daily Structure</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Frameworks designed to instil healthy routines, manage triggers, and keep individuals focused on their recovery goals.
              </p>
            </div>

            <div className="bg-white p-8 border border-border flex flex-col items-start hover:border-accent/40 transition-colors lg:col-start-2">
              <Activity className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-serif text-primary mb-3">Relapse Prevention</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                Practical, evidence-based tools and education to identify warning signs early and intervene before a return to use.
              </p>
            </div>

            <div className="bg-white p-8 border border-border flex flex-col items-start hover:border-accent/40 transition-colors">
              <Lock className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-serif text-primary mb-3">Secure Environment</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                All sessions and communications take place within a highly secure, private digital environment ensuring absolute confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Ask about the online programme."
        description="We can discuss if this level of care is appropriate for your situation."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </Layout>
  );
}