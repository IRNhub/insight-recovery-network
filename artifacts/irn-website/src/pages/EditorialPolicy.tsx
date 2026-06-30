import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";

const sections = [
  {
    title: "Who creates our content",
    body: "Articles are published under the name of Craig Bilton, Founder and Clinical Director of Insight Recovery Network. Craig's background spans addiction treatment, residential rehabilitation, online recovery support and complex case guidance in the UK and internationally. His author page explains his experience and the scope of his role.",
  },
  {
    title: "How we research health information",
    body: "Factual health and treatment claims are checked against authoritative sources wherever possible, including NHS guidance, NICE recommendations, UK government clinical guidance, regulators and peer-reviewed research. Priority articles display their principal sources so readers can examine the underlying guidance directly.",
  },
  {
    title: "Publication and updates",
    body: "Articles show their original publication date and, when materially revised, a last-updated date. We revisit safety-critical and treatment-related information when guidance changes, when a reliable new source becomes available, or when a reader identifies a concern.",
  },
  {
    title: "Editorial independence",
    body: "Content is designed to help people understand their options, not to disguise advertising as clinical advice. Insight Recovery Network does not accept payment for favourable editorial coverage. Commercial relationships, if relevant to a page, should be made clear.",
  },
  {
    title: "Digital and AI-assisted tools",
    body: "We may use digital or AI-assisted tools to support research organisation, drafting, formatting and quality checks. These tools do not replace editorial responsibility. Published information remains the responsibility of the named author and Insight Recovery Network.",
  },
  {
    title: "Scope and safety",
    body: "Our content is general information and guidance. It is not a diagnosis, prescription, emergency service or substitute for an assessment by an appropriately qualified professional. Safety warnings are prioritised where withdrawal, overdose, self-harm, violence or safeguarding may be relevant.",
  },
  {
    title: "Corrections",
    body: "If you believe something is inaccurate, outdated or unclear, email info@insightrecoverynetwork.com with the page address and the concern. We review substantive corrections promptly and update the page where appropriate.",
  },
];

export default function EditorialPolicy() {
  return (
    <Layout>
      <SEO
        title="Editorial Policy"
        fullTitle="Editorial Policy | Insight Recovery Network"
        description="How Insight Recovery Network researches, writes, sources, reviews and updates addiction and mental health information."
        canonical="/editorial-policy"
      />

      <section
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-14 md:py-20 max-w-4xl">
          <div className="w-7 h-px mb-6" style={{ background: "#C9A96E" }} />
          <p className="text-[10px] font-semibold tracking-[0.20em] uppercase font-sans mb-4 text-accent/80">
            Trust and transparency
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-5 text-primary">
            Editorial Policy
          </h1>
          <p className="font-light text-lg leading-relaxed text-muted-foreground max-w-2xl">
            How we create useful, responsible and transparent information for people navigating addiction, recovery and treatment decisions.
          </p>
          <p className="font-light text-sm text-muted-foreground mt-5">Last updated: 30 June 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#FAFAF8]">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="flex flex-col gap-10 text-sm font-light leading-relaxed text-muted-foreground">
            {sections.map((section, index) => (
              <div key={section.title}>
                <h2 className="font-serif text-xl font-medium text-primary mb-3">
                  {index + 1}. {section.title}
                </h2>
                <p>{section.body}</p>
              </div>
            ))}

            <div className="pt-6 border-t border-border/50 text-xs">
              <p>
                Read more about{" "}
                <Link href="/craig-bilton" className="underline underline-offset-2 hover:text-primary">
                  Craig Bilton
                </Link>{" "}
                and our{" "}
                <Link href="/clinical-disclaimer" className="underline underline-offset-2 hover:text-primary">
                  clinical disclaimer
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
