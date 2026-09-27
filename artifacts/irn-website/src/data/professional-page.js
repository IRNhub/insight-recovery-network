export const professionalPage = {
  route: "/for-professionals",
  title: "Private Addiction Support for GPs | Insight Recovery Network",
  description: "Cornwall-based online recovery support and private rehab placement guidance for adults. Information for GPs on suitability, introductions, fees and care boundaries.",
  h1: "Private addiction support. A considered next step.",
  ogImage: "https://www.insightrecoverynetwork.com/og-home-v2.png",
  pdf: "/documents/irn-professional-guide.pdf",
  email: "mailto:info@insightrecoverynetwork.com?subject=Professional%20introduction",
};

export const professionalSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.insightrecoverynetwork.com/for-professionals#webpage",
    url: "https://www.insightrecoverynetwork.com/for-professionals",
    name: professionalPage.title,
    description: professionalPage.description,
    isPartOf: { "@id": "https://www.insightrecoverynetwork.com/#website" },
    about: { "@id": "https://www.insightrecoverynetwork.com/#organization" },
    inLanguage: "en-GB",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.insightrecoverynetwork.com/" },
      { "@type": "ListItem", position: 2, name: "For GPs and healthcare professionals", item: "https://www.insightrecoverynetwork.com/for-professionals" },
    ],
  },
];
