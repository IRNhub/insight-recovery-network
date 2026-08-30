import { useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { trackEvent, safeReferrerPath } from "@/lib/analytics";

export default function NotFound() {
  useEffect(() => {
    trackEvent("not_found_view", {
      attempted_path: window.location.pathname,
      referrer_path: safeReferrerPath(document.referrer),
    });
  }, []);

  return (
    <Layout>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found. Please visit our homepage or contact us for assistance."
        canonical="/404"
        noIndex={true}
      />
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl text-center">
          <div className="w-8 h-px mx-auto mb-8" style={{ background: "#C9A96E" }} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 font-sans">
            404, Page Not Found
          </p>
          <h1 className="font-serif text-primary text-3xl md:text-4xl leading-tight mb-6">
            We couldn't find that page.
          </h1>
          <p className="text-muted-foreground font-light leading-relaxed mb-10">
            The page may have moved, but you are still in the right place. Choose a useful next step below, or contact us confidentially if you are unsure where to begin.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/">
              <button className="inline-flex w-full items-center justify-center px-6 min-h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Go to the homepage
              </button>
            </Link>
            <Link href="/assessments">
              <button className="inline-flex w-full items-center justify-center px-6 min-h-12 text-sm font-medium border border-primary/30 text-primary hover:border-primary/60 transition-colors">
                Start a free assessment
              </button>
            </Link>
            <Link href="/treatment-placement">
              <button className="inline-flex w-full items-center justify-center px-6 min-h-12 text-sm font-medium border border-primary/30 text-primary hover:border-primary/60 transition-colors">
                Get help choosing treatment
              </button>
            </Link>
            <Link href="/online-programme">
              <button className="inline-flex w-full items-center justify-center px-6 min-h-12 text-sm font-medium border border-primary/30 text-primary hover:border-primary/60 transition-colors">
                View the online programme
              </button>
            </Link>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link href="/get-help" data-analytics-event="get_help_click" data-source-page="404" data-service-interest="general-support" data-cta-location="404_actions">
              <span className="font-semibold text-primary underline underline-offset-4">Contact us confidentially</span>
            </Link>
            <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
            <a href="https://wa.me/447723486235?text=Hi%20Craig%2C%20I%27d%20like%20to%20speak%20confidentially." target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
