import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { ContactForm } from "@/components/forms/ContactForm";
import { Shield, Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Contact Us — Speak Confidentially"
        description="Contact Insight Recovery Network confidentially. Private guidance on addiction treatment, rehab placement, online recovery programmes, and mental health support for individuals and families."
        canonical="/contact"
      />
      <section className="bg-secondary/20 py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6 leading-tight">
              Speak Confidentially
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light mb-8">
              We understand that making contact can be difficult. Your enquiry is completely confidential. We will only use your information to respond to your request for support.
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Shield className="w-4 h-4 text-accent" />
              Secure and discreet communication
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 -mt-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="bg-white border border-border p-8 shadow-sm">
                <h3 className="font-serif text-xl text-primary mb-6">Direct Contact</h3>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Email</p>
                      <a href="mailto:support@insightrecoverynetwork.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        support@insightrecoverynetwork.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Phone</p>
                      <p className="text-muted-foreground text-sm">
                        Available during standard business hours. Enquiries via form are monitored continuously.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 relative z-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}