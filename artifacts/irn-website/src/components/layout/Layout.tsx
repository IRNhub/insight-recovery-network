import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Insight Recovery Network",
  url: "https://www.insightrecoverynetwork.com",
  logo: "https://www.insightrecoverynetwork.com/og-about.png",
  description:
    "A UK-based private addiction recovery and mental health support service providing treatment placement guidance, online recovery programmes, family intervention, and digital recovery tools.",
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
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Insight Recovery Network",
  url: "https://www.insightrecoverynetwork.com",
  description:
    "Private addiction recovery and mental health support — treatment placement, online recovery programmes, and digital recovery tools.",
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Craig Bilton",
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "Insight Recovery Network",
    url: "https://www.insightrecoverynetwork.com",
  },
  description:
    "Addiction recovery specialist with over 20 years of international experience in residential rehabilitation, online recovery support, and complex case management.",
  url: "https://www.insightrecoverynetwork.com/craig-bilton",
};

export function Layout({ children }: LayoutProps) {
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
