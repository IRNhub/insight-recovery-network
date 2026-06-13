import { ArrowRight, Download, FileText } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const guideHref = "/services-pricing-guide-2026.pdf";

const guideItems = [
  "Treatment placement, detox, residential rehab, and longer-term care options",
  "Online recovery programme levels and monthly pricing",
  "Family guidance, assessment, crisis support, and ongoing case support",
];

export default function ServicesPricingGuide() {
  return (
    <Layout>
      <SEO
        title="Services & Pricing Guide"
        fullTitle="Services & Pricing Guide | Insight Recovery Network"
        description="A private guide to Insight Recovery Network services, treatment placement, online recovery programme options, and support pricing."
        canonical="/services-pricing-guide"
        noIndex
      />

      <section className="relative overflow-hidden bg-background py-12 md:py-20">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px)",
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-5">
              Private guide
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
              Services & Pricing Guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
              A clear overview of the main ways Insight Recovery Network supports individuals and families, including treatment placement, online recovery programmes, and additional clinical support.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-none h-12 px-8 w-full sm:w-auto gap-2">
                <a href={guideHref} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4" strokeWidth={1.8} />
                  View Guide
                  <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none h-12 px-8 w-full sm:w-auto gap-2">
                <a href={guideHref} download>
                  <Download className="w-4 h-4" strokeWidth={1.8} />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-4">
                What is inside
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
                A calmer way to understand the options before we speak.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-4">
                {guideItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-border/60 pb-4 last:border-b-0"
                  >
                    <span className="font-serif text-2xl text-accent/80 min-w-10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground/80 leading-relaxed mt-8">
                This page is not listed in the main website navigation. It is intended as a simple reference for people who have already made an enquiry or booked a confidential conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl text-primary leading-tight mb-4">
              Questions before a call are welcome.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The guide is only a starting point. The right pathway depends on clinical need, risk, previous treatment history, mental health concerns, family dynamics, budget, and the level of support required.
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-none h-12 px-8">
                Contact Insight Recovery Network
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
