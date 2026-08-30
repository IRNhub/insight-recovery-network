import { getRouteFaqs } from "./route-faqs.js";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * Parity-critical route content shared by React and the static prerender.
 * Keep layout-only copy in page components; keep anything tested in both
 * delivery modes here.
 */
export const routeParity = {
  "/": {
    title: "Addiction Treatment Guidance & Rehab Placement | Insight Recovery Network",
    description: "Confidential help comparing private rehab, detox, family intervention and structured online addiction support in the UK and selected destinations.",
    canonical: "/",
    indexable: true,
    h1: "Find the right rehab, detox or recovery support without guessing.",
    heroIntro: "Confidential guidance for individuals and families making urgent, expensive and deeply personal treatment decisions.",
    primaryCta: {
      href: "/get-help",
      label: "Discuss treatment options today",
      analyticsEvent: "get_help_click",
      sourcePage: "home",
      serviceInterest: "general-support",
      location: "hero",
    },
  },
  "/get-help": {
    title: "Get Private Addiction Help | Treatment Guidance UK",
    description: "Speak confidentially with Insight Recovery Network about private rehab placement, online recovery, family support or intervention guidance in the UK.",
    canonical: "/get-help",
    indexable: true,
    h1: "Speak to Someone About Private Addiction Treatment",
    heroIntro: "Start with a confidential discussion about private rehab placement, structured online recovery, family support or professional intervention guidance. We will help you identify a realistic next step without pressure.",
    primaryCta: {
      href: "#book",
      label: "Speak to the admissions team",
      analyticsEvent: "get_help_click",
      sourcePage: "get-help",
      serviceInterest: "general-support",
      location: "hero",
    },
    service: {
      name: "Private Addiction Treatment Guidance",
      serviceType: "Private addiction treatment guidance and enquiry support",
      description: "Confidential guidance for adults considering private rehab placement, structured online recovery, family support or intervention guidance in the UK.",
      areaServed: [{ "@type": "Country", name: "United Kingdom" }],
    },
    faqs: getRouteFaqs("/get-help"),
  },
  "/private-rehab-uk": {
    title: "Private Rehab UK | Assessment-Led Guidance Before Choosing Treatment | Insight Recovery Network",
    description: "Considering private rehab in the UK? Insight Recovery Network helps individuals and families compare UK rehab, overseas treatment, detox needs, online recovery support and aftercare before committing to a treatment route.",
    canonical: "/private-rehab-uk",
    indexable: true,
    h1: "Private Rehab UK: Assessment-Led Guidance Before You Choose",
    heroIntro: "Many people begin by searching for private rehab in the UK. Before committing to a costly admission, it is worth understanding whether UK rehab, overseas residential treatment, medically supervised detox, structured online support or another route is the better fit.",
    primaryCta: {
      href: "/get-help",
      label: "Get help choosing the right treatment",
      analyticsEvent: "treatment_placement_enquiry",
      sourcePage: "private-rehab-uk",
      serviceInterest: "treatment-placement",
      location: "hero",
    },
    service: {
      name: "Private Rehab UK Guidance",
      serviceType: "Addiction treatment guidance and recovery planning",
      description: "Assessment-led guidance for individuals and families considering private rehab in the UK, including detox considerations, comparison with overseas treatment, online recovery support and aftercare planning.",
      areaServed: [{ "@type": "Country", name: "United Kingdom" }],
    },
    faqs: getRouteFaqs("/private-rehab-uk"),
    prerenderSections: [
      {
        heading: "How Insight Recovery Network helps",
        body: "Assessment-led guidance compares clinical suitability, detox risk, UK and overseas treatment, budget, family context and aftercare before a provider is chosen.",
      },
      {
        heading: "When private rehab may be appropriate",
        body: "Residential care may be appropriate where withdrawal, relapse history, mental-health needs, safety or the home environment requires a higher level of support.",
      },
    ],
  },
  "/treatment-placement": {
    title: "Help Choosing a Rehab | Assessment-Led Placement",
    description: "Assessment-led help choosing a private rehab or detox provider. Compare suitable UK and international options, provider relationships and admission planning.",
    canonical: "/treatment-placement",
    indexable: true,
    h1: "Find a Suitable Private Rehab or Detox Provider Without a Rushed Decision",
    heroIntro: "Insight Recovery Network helps individuals and families assess their needs, compare appropriate treatment options and access suitable programmes in the UK and internationally.",
    primaryCta: {
      href: "/get-help",
      label: "Request a treatment-options call",
      analyticsEvent: "treatment_placement_enquiry",
      sourcePage: "treatment-placement",
      serviceInterest: "treatment-placement",
      location: "hero",
    },
    service: {
      name: "Private Rehab and Detox Placement",
      serviceType: "Addiction Treatment Placement",
      description: "Assessment-led, clinically informed guidance on private rehab, detox and residential treatment placement in the UK and internationally.",
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Place", name: "International" },
      ],
    },
    faqs: getRouteFaqs("/treatment-placement"),
    prerenderSections: [
      {
        heading: "How placement guidance works.",
        body: "We clarify the situation, compare suitable options, explain relevant provider relationships and support practical admission planning while the selected provider retains responsibility for clinical assessment and care.",
      },
      {
        heading: "When treatment placement may be appropriate.",
        body: "Placement guidance can help when detox, residential care, repeated relapse, complex mental-health needs or an urgent but non-emergency transition requires a suitable regulated provider.",
      },
    ],
  },
  "/how-much-does-rehab-cost-uk": {
    title: "Rehab Costs UK: Private Rehab Prices Explained",
    description: "Compare UK private rehab costs, typical 28-day prices, detox fees, what affects the final price and lower-cost or overseas treatment alternatives.",
    canonical: "/how-much-does-rehab-cost-uk",
    indexable: true,
    h1: "How Much Does Rehab Cost in the UK?",
    heroIntro: "Insight Recovery Network helps you understand the real cost, what is included, what level of care is needed, and which options are clinically appropriate before you commit.",
    primaryCta: {
      href: "/get-help",
      label: "Speak to us about treatment options",
      analyticsEvent: "treatment_placement_enquiry",
      sourcePage: "rehab-costs-uk",
      serviceInterest: "treatment-placement",
      location: "hero",
    },
    service: {
      name: "UK Rehab Cost and Treatment Options Guidance",
      serviceType: "Private rehab cost guidance and treatment placement support",
      description: "Clinically informed guidance for individuals and families comparing private rehab costs in the UK, alcohol detox costs, overseas treatment options and structured online recovery support.",
      areaServed: ["United Kingdom", "South Africa", "Thailand", "Spain", "Sri Lanka"].map((name) => ({ "@type": "Country", name })),
    },
    faqs: getRouteFaqs("/how-much-does-rehab-cost-uk"),
  },
  "/private-rehab-alternative-uk": {
    title: "Alternatives to Private Rehab UK | Online, NHS & Overseas Options",
    description: "Compare alternatives to private rehab in the UK, including structured online recovery, NHS services, medical detox, family guidance and overseas treatment.",
    canonical: "/private-rehab-alternative-uk",
    indexable: true,
    h1: "Alternatives to Private Rehab in the UK",
    heroIntro: "Residential private rehab is one treatment option, but it is not automatically right for every person or family. Depending on clinical needs, risk and circumstances, alternatives may include structured online recovery, NHS or local services, overseas residential treatment, medically supervised detox where appropriate, or family guidance and intervention when someone is not yet engaging.",
    primaryCta: {
      href: "/get-help",
      label: "Discuss suitable treatment options",
      analyticsEvent: "treatment_placement_enquiry",
      sourcePage: "private-rehab-alternative-uk",
      serviceInterest: "treatment-placement",
      location: "hero",
    },
    service: {
      name: "Private Rehab Alternatives and Online Recovery Support",
      serviceType: "Private rehab alternative guidance",
      description: "Guidance on structured online recovery support, family support and treatment placement when residential care may be required.",
      areaServed: [{ "@type": "Country", name: "United Kingdom" }],
    },
    faqs: getRouteFaqs("/private-rehab-alternative-uk"),
    prerenderSections: [
      {
        heading: "Comparing Alternatives to Private Rehab",
        body: "Compare UK private rehab, overseas residential treatment, structured online recovery, NHS and local services, family support or intervention, and medical detox according to need, risk and circumstances.",
      },
      {
        heading: "UK Rehab vs Rehab Abroad",
        body: "Overseas treatment is not inherently better or worse than UK treatment. Compare clinical needs, programme length, treatment model, total cost, privacy, environment, family contact, travel, aftercare and medical requirements.",
      },
      {
        heading: "Choosing Treatment for a Family Member",
        body: "Do not choose treatment on price, location or marketing alone. Consider substance use, withdrawal risk, physical and mental health, previous treatment, the home environment, willingness to engage, safeguarding, structure, aftercare and affordability.",
      },
      {
        heading: "When residential treatment is still needed",
        body: "Online or community support is not a safe substitute where withdrawal, an unsafe home environment, repeated relapse or complex clinical needs require around-the-clock or medically supervised care.",
      },
    ],
  },
  "/online-programme": {
    title: "Online Recovery Programme Options and Pricing | Insight Recovery Network",
    description: "Compare private paid structured online recovery programme options, pricing and individual support levels, with Insight OS access and relapse-prevention planning.",
    canonical: "/online-programme",
    indexable: true,
    h1: "Online Recovery Programme Options and Pricing",
    heroIntro: "Choose the level of structured online recovery support that fits your situation, from essential monthly support through to enhanced clinical input, with Insight OS access included.",
    primaryCta: {
      href: "/get-help",
      label: "Ask about programme availability",
      analyticsEvent: "online_programme_enquiry",
      sourcePage: "online-programme",
      serviceInterest: "online-programme",
      location: "hero",
    },
    service: {
      name: "Insight Recovery Network Online Programme Options",
      serviceType: "Online Addiction Recovery Programme",
      description: "Commercial programme page for Insight Recovery Network's private paid online recovery support options, including monthly support levels, one-to-one sessions, group work, relapse prevention planning and Insight OS access.",
      offers: [
        { "@type": "Offer", name: "Essential Support", price: "950", priceCurrency: "GBP", description: "Four individual sessions per month with group programme and Insight OS access." },
        { "@type": "Offer", name: "Structured Support", price: "1250", priceCurrency: "GBP", description: "Eight individual sessions per month with enhanced planning and family support where appropriate." },
        { "@type": "Offer", name: "Enhanced Clinical Support", price: "1950", priceCurrency: "GBP", description: "Twelve individual sessions per month with enhanced case management and care coordination." },
      ],
    },
    faqs: getRouteFaqs("/online-programme"),
    highlights: [
      "Three private paid monthly support levels: Essential, Structured and Enhanced Clinical Support",
      "Individual sessions, facilitated group support and relapse prevention planning",
      "Insight OS access, daily digital check-ins, recovery worksheets and ongoing accountability",
    ],
    prerenderSections: [
      {
        heading: "What's included.",
        body: "Each private paid support level combines individual sessions, facilitated group support, relapse-prevention planning, accountability and Insight OS access. The appropriate level is discussed before enrolment.",
      },
      {
        heading: "Three levels of support.",
        body: "Essential Support, Structured Support and Enhanced Clinical Support provide different monthly levels of individual contact and case coordination. Current prices and inclusions are shown on this page and are not residential treatment fees.",
      },
    ],
  },
  "/family-addiction-intervention-uk": {
    title: "Family Addiction Help & Intervention UK | Insight Recovery Network",
    description: "Confidential family addiction consultations and intervention guidance in the UK. Get a clear plan when someone you love is drinking, using drugs, refusing help or may need private treatment.",
    canonical: "/family-addiction-intervention-uk",
    indexable: true,
    h1: "You do not have to wait for them to ask for help.",
    heroIntro: "When someone you love is drinking, using drugs, refusing treatment or creating repeated crises, the family needs a plan, not another argument.",
    primaryCta: {
      href: "/get-help",
      label: "Discuss your family situation",
      analyticsEvent: "family_support_enquiry",
      sourcePage: "family-addiction-intervention-uk",
      serviceInterest: "family-support",
      location: "hero",
    },
    service: {
      name: "Family Addiction Consultation and Intervention Guidance UK",
      serviceType: "Family addiction consultation and intervention planning",
      description: "Confidential guidance for UK families planning a safe, consistent response to addiction, treatment refusal and repeated crises.",
      areaServed: [{ "@type": "Country", name: "United Kingdom" }],
    },
    faqs: getRouteFaqs("/family-addiction-intervention-uk"),
    prerenderSections: [
      {
        heading: "What we help families do",
        body: "Families can plan safer conversations, realistic boundaries, treatment options and a consistent response before the person they are worried about agrees to help.",
      },
    ],
  },
};

export const parityRoutes = Object.keys(routeParity);

export function getRouteParity(pathname) {
  const route = routeParity[pathname];
  if (!route) throw new Error(`No route parity definition for ${pathname}`);
  return route;
}

export function buildRouteSchemas(pathname, faqs = undefined) {
  const route = getRouteParity(pathname);
  const visibleFaqs = faqs ?? route.faqs ?? [];
  const canonicalUrl = `${SITE_URL}${route.canonical}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORGANIZATION_ID },
    },
  ];

  if (pathname !== "/") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.h1, item: canonicalUrl },
      ],
    });
  }

  if (route.service) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: route.service.name,
      serviceType: route.service.serviceType,
      description: route.service.description,
      provider: { "@id": ORGANIZATION_ID },
      url: canonicalUrl,
      ...(route.service.areaServed ? { areaServed: route.service.areaServed } : {}),
      ...(route.service.offers ? { offers: route.service.offers } : {}),
    });
  }

  if (visibleFaqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: visibleFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return schemas;
}
