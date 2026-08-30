import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <Layout>
      <SEO
        title="Enquiry Received"
        fullTitle="Enquiry Received | Insight Recovery Network"
        description="Thank you for contacting Insight Recovery Network. Your confidential enquiry has been received."
        canonical="/thank-you"
        noIndex
      />
      <section className="py-14 md:py-20 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6">
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.6} />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-4">
              Enquiry received
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-6">
              Thank you. Your message has been received.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We will review your enquiry and respond confidentially. If your situation is urgent or there is immediate risk, please contact emergency services or go to your nearest A&E.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <Button size="lg" className="rounded-none h-12 px-8">
                  Return Home
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="rounded-none h-12 px-8">
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
