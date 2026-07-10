import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { ContactForm } from "@/components/forms/ContactForm";
import { Shield, Mail, Phone } from "lucide-react";
import { getOgConfig, ogImageUrl } from "@/config/og-pages";
import { ServiceSummary } from "@/components/ui/service-summary";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";

const contactOg = getOgConfig("/contact")!;

const contactFaqs: FAQItem[] = [
  {
    question: "What happens after I submit an enquiry?",
    answer: "We review the information you choose to share and respond to arrange a private conversation. That conversation is used to understand the situation and explain possible next steps without pressure or obligation.",
  },
  {
    question: "Is contacting Insight Recovery Network confidential?",
    answer: "Enquiries are handled discreetly and the information you provide is used to respond to your request. Please avoid sending unnecessary medical records or highly sensitive documents through the general form.",
  },
  {
    question: "Can you help in an emergency or prescribe medication?",
    answer: "No. Insight Recovery Network is not an emergency service and does not diagnose or prescribe. If someone is in immediate danger, call 999 or attend A&E; for urgent non-emergency medical advice use NHS 111.",
  },
];

export default function Contact() {
  return (
    <Layout>
      <SEO
        title={contactOg.seoTitle ?? contactOg.title}
        description="Contact Insight Recovery Network confidentially. Based in Newquay, Cornwall, we provide private guidance on addiction treatment, rehab placement, online recovery programmes, and mental health support for individuals and families."
        canonical="/contact"
        ogImage={ogImageUrl(contactOg.file)}
      />
      <section className="bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6 leading-tight">
              Tell us what is happening. We will help you identify the next step.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light mb-8">
              Contact us privately about rehab placement, family concerns, detox, online recovery support or an urgent treatment decision. You do not need to know which service you need before making contact.
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Shield className="w-4 h-4 text-accent" />
              Confidential · No obligation · Individuals and families welcome
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who="Individuals, families and professionals who want a private conversation about addiction, recovery or treatment options."
        problem="Creates a clear, low-pressure starting point when the right next step is uncertain."
        applies="Online and by telephone across the UK and internationally during standard business hours."
      />

      <section className="py-12 md:py-20 -mt-10">
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
                      <a href="mailto:info@insightrecoverynetwork.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        info@insightrecoverynetwork.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Phone</p>
                      <a href="tel:+447415994475" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                        +44 7415 994475
                      </a>
                      <p className="text-muted-foreground/70 text-xs mt-1">
                        Calls are answered during standard business hours. You can submit the form at any time.
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

      <FAQSection items={contactFaqs} heading="Before you make contact" />
    </Layout>
  );
}
