import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const HERO_IMAGE = "/media-hero.webp";

const topics = [
  "Addiction, recovery and relapse risk",
  "Crypto trading, day trading and gambling-like behaviour",
  "The impact of addiction on partners and families",
  "Treatment suitability and private rehab navigation",
  "Online recovery, aftercare and continuity of support",
  "Addiction and co-occurring mental health difficulties",
];

interface MediaCoverageItem {
  publication: string;
  title: string;
  href: string;
  author?: string;
  description?: string;
  schemaType?: "Article" | "NewsArticle";
}

const coverage: MediaCoverageItem[] = [
  {
    publication: "Business Insider",
    title: "How crypto-trading addiction can affect finances, relationships and recovery",
    href: "https://www.businessinsider.com/crypto-trading-addicts-gambling-therapy-marriage-conflicts-financial-losses-lawsuits-2025-2",
  },
  {
    publication: "SBS Insight",
    title: "The hidden harm and treatment needs associated with crypto-trading addiction",
    href: "https://www.sbs.com.au/news/insight/article/there-is-a-part-of-crypto-which-is-so-dark-bobs-trading-addiction-cost-him-800-000/bkm938fgi",
  },
  {
    publication: "Psychreg",
    title: "When Families Are Trying to Hold Recovery Together Before Treatment",
    author: "Craig Bilton",
    description:
      "Craig Bilton contributed an article exploring how families often try to hold recovery together before formal treatment begins, and why support, boundaries and professional guidance matter during this stage.",
    href: "https://www.psychreg.org/when-families-are-trying-hold-recovery-together-before-treatment/",
    schemaType: "Article",
  },
];

const mediaSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/media#webpage`,
  url: `${SITE_URL}/media`,
  name: "Media and expert commentary | Insight Recovery Network",
  description:
    "Media enquiries and expert commentary from Craig Bilton on addiction, recovery, treatment, families and crypto-trading addiction.",
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}${HERO_IMAGE}`,
    width: 1693,
    height: 929,
  },
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#craig-bilton`,
    name: "Craig Bilton",
    jobTitle: "Founder & Clinical Director",
    url: `${SITE_URL}/about`,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    knowsAbout: topics,
    subjectOf: coverage.map((item) => ({
      "@type": item.schemaType ?? "NewsArticle",
      headline: item.title,
      url: item.href,
      publisher: { "@type": "Organization", name: item.publication },
      ...(item.author
        ? {
            author: {
              "@type": "Person",
              "@id": `${SITE_URL}/#craig-bilton`,
              name: item.author,
              url: `${SITE_URL}/about`,
            },
          }
        : {}),
    })),
  },
};

export default function Media() {
  return (
    <Layout>
      <SEO
        title="Media & Expert Commentary"
        fullTitle="Media & Expert Commentary | Craig Bilton"
        description="Media enquiries and expert commentary from Craig Bilton on addiction, recovery, treatment, families and crypto-trading addiction."
        canonical="/media"
        ogImage={`${SITE_URL}${HERO_IMAGE}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(mediaSchema)}</script>
      </Helmet>

      <section
        className="border-b border-border/40"
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-14 md:py-20">
          <div className="max-w-4xl">
            <div className="w-7 h-px mb-6 bg-accent" />
            <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/80 mb-4">
              Media enquiries
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
              Clear, responsible commentary on addiction and recovery.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mb-8">
              Craig Bilton is available to journalists seeking practical, evidence-conscious context on addiction, treatment decisions, family impact, relapse risk and emerging behavioural addictions.
            </p>
            <a href="mailto:craig@insightrecoverynetwork.com?subject=Media%20enquiry">
              <Button size="lg" className="rounded-none h-12 px-8">
                <Mail className="w-4 h-4 mr-2" />
                Request expert comment
              </Button>
            </a>
          </div>

          <div
            className="relative mt-9 md:mt-12 overflow-hidden rounded-xl bg-[#07182f]"
            style={{
              aspectRatio: "1693 / 929",
              boxShadow: "0 18px 50px -16px rgba(22,43,59,0.28), 0 0 0 1px rgba(22,43,59,0.08)",
            }}
          >
            <ResponsiveImage
              src={HERO_IMAGE}
              alt="Insight Recovery Network media and expert commentary studio"
              className="block h-full w-full object-cover object-center"
              width={1693}
              height={929}
              sizes="(min-width: 1280px) 1152px, (min-width: 768px) calc(100vw - 6rem), calc(100vw - 3rem)"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/80 mb-4">
                Expert source
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-5">
                Craig Bilton, Founder &amp; Clinical Director
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Craig has more than 20 years&apos; international experience across addiction treatment, mental health support, residential rehabilitation, programme leadership, family guidance and treatment placement.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                He can provide concise background briefings, on-record comment and interviews. Commentary is kept within his professional scope and avoids diagnosis, prescription or claims about an individual who has not been assessed.
              </p>
              <Link href="/about" className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-4">
                Read Craig&apos;s full profile
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-serif text-2xl text-primary mb-5">Topics Craig can discuss</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <div key={topic} className="border border-border/60 bg-background p-5">
                    <p className="text-primary leading-snug">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-8">
            <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/80 mb-4">
              Selected commentary
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
              External publications and media contributions
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              External articles and media contributions from Craig Bilton and Insight Recovery Network.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
            {coverage.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-border/60 bg-background p-6 hover:border-accent/60 transition-colors"
              >
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent/80 mb-3">
                  {item.publication}
                </p>
                <h3 className="font-serif text-xl text-primary leading-snug mb-4">{item.title}</h3>
                {item.author && (
                  <p className="text-sm font-medium text-primary/80 mb-3">By {item.author}</p>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {item.description}
                  </p>
                )}
                <span className="inline-flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  {item.schemaType === "Article" ? "Read the article" : "Read the coverage"}
                  <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl border-l-2 border-accent pl-6">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-4">For journalists and producers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Please include your outlet, deadline, topic and whether the request is for background or on-record comment. Email <a href="mailto:craig@insightrecoverynetwork.com" className="text-primary underline underline-offset-2">craig@insightrecoverynetwork.com</a>.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service. Media commentary is general information and does not replace individual clinical assessment or medical advice.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
