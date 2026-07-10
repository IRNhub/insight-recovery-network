import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found. Please visit our homepage or contact us for assistance."
        canonical="/404"
        noIndex={true}
      />
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-lg text-center">
          <div className="w-8 h-px mx-auto mb-8" style={{ background: "#C9A96E" }} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 font-sans">
            404, Page Not Found
          </p>
          <h1 className="font-serif text-primary text-3xl md:text-4xl leading-tight mb-6">
            We couldn't find that page.
          </h1>
          <p className="text-muted-foreground font-light leading-relaxed mb-10">
            The page you are looking for may have moved or no longer exists. Please use the navigation above, or get in touch and we will be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="inline-flex items-center justify-center px-8 h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Back to Homepage
              </button>
            </Link>
            <Link href="/contact">
              <button className="inline-flex items-center justify-center px-8 h-12 text-sm font-medium border border-primary/30 text-primary hover:border-primary/60 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
