import { ReactNode, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SOCIAL_PROFILE_URLS } from "@/config/social-links.js";

interface LayoutProps {
  children: ReactNode;
}

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.insightrecoverynetwork.com/#organization",
  name: "Insight Recovery Network",
  url: "https://www.insightrecoverynetwork.com",
  logo: "https://www.insightrecoverynetwork.com/og-about.png",
  description:
    "A UK-based private addiction support service providing rehab and detox placement guidance, family intervention consultations, structured online recovery programmes and continuing-care tools.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Newquay",
    addressRegion: "Cornwall",
    addressCountry: "GB",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "info@insightrecoverynetwork.com",
    availableLanguage: "English",
  },
  founder: {
    "@type": "Person",
    name: "Craig Bilton",
  },
  sameAs: SOCIAL_PROFILE_URLS,
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.insightrecoverynetwork.com/#website",
  name: "Insight Recovery Network",
  url: "https://www.insightrecoverynetwork.com",
  description:
    "Private rehab placement, family addiction guidance and structured online recovery support in the UK and selected international destinations.",
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.insightrecoverynetwork.com/#craig-bilton",
  name: "Craig Bilton",
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "Insight Recovery Network",
    url: "https://www.insightrecoverynetwork.com",
  },
  description:
    "Addiction recovery specialist with over 20 years of international experience in residential rehabilitation, online recovery support, and complex case management.",
  url: "https://www.insightrecoverynetwork.com/about",
};

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    document
      .head.querySelectorAll('[data-prerendered-meta="true"]')
      .forEach((element) => element.remove());
    document.head
      .querySelectorAll(
        '[data-static-jsonld="true"], [data-prerendered-jsonld="true"]',
      )
      .forEach((element) => element.remove());
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ORGANIZATION_SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(WEBSITE_SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(PERSON_SCHEMA)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col pt-[88px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
