export interface DestinationFaq {
  question: string;
  answer: string;
}

export interface Destination {
  slug: string;
  country: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroEyebrow: string;
  heroHeading: string;
  heroIntro: string;
  whyHeading: string;
  whyIntro: string;
  whyPoints: string[];
  costHeading: string;
  costIntro: string;
  costLow: number;
  costHigh: number;
  costNote: string;
  costIncludes: string[];
  whoHeading: string;
  whoPoints: string[];
  faqs: DestinationFaq[];
}

const COST_DISCLAIMER =
  "All figures are typical guide ranges only. Actual costs depend on the facility, length of stay, level of medical care required, and accommodation type — and are always confirmed transparently before any decision is made. Insight Recovery Network provides independent guidance and will tell you honestly when a less expensive option is clinically appropriate.";

export const destinations: Destination[] = [
  {
    slug: "private-rehab-thailand",
    country: "Thailand",
    title: "Private Rehab in Thailand",
    seoTitle: "Private Rehab in Thailand | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering private rehab in Thailand? Independent guidance on residential addiction treatment in Thailand — typical costs from £8,000 to £15,000, what to expect, and confidential placement support from Insight Recovery Network.",
    heroImage: "/private-rehab-thailand-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Thailand with a tranquil residential rehab setting",
    heroEyebrow: "Treatment Placement — Thailand",
    heroHeading: "Private Rehab in Thailand",
    heroIntro:
      "Thailand has become one of the world's most established destinations for residential addiction treatment — combining internationally trained clinical teams, strong programme structure, genuine privacy away from home, and significantly lower costs than comparable UK facilities. We help you identify the right Thai facility for your clinical needs, and manage the admission from first conversation to arrival.",
    whyHeading: "Why people choose Thailand for rehab",
    whyIntro:
      "Thailand is often the right choice for people who want high-quality residential treatment with complete distance from their daily environment:",
    whyPoints: [
      "Established international treatment centres with Western-trained clinical teams and English-speaking programmes",
      "Significantly lower costs than UK private rehab of a comparable standard",
      "Complete separation from home triggers, work pressure, and social circles — often clinically valuable in early recovery",
      "Strong programme structure: individual therapy, group work, fitness, mindfulness, and relapse prevention planning",
      "Genuine privacy — you are highly unlikely to encounter anyone you know",
    ],
    costHeading: "How much does rehab in Thailand cost?",
    costIntro:
      "Residential addiction treatment in Thailand typically costs between £8,000 and £15,000 for a standard 28-day stay, depending on the facility, accommodation, and level of clinical care.",
    costLow: 8000,
    costHigh: 15000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Full residential accommodation and meals",
      "Structured clinical programme — individual and group therapy",
      "Psychiatric and medical oversight appropriate to the facility",
      "Wellness and fitness programmes",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who Thailand tends to suit",
    whoPoints: [
      "People who need full separation from their current environment to break entrenched patterns",
      "Professionals seeking privacy that is difficult to achieve in the UK",
      "Those seeking a high standard of care at a materially lower cost than UK equivalents",
      "People who respond well to structured, routine-led residential settings",
    ],
    faqs: [
      {
        question: "Is rehab in Thailand clinically safe and properly regulated?",
        answer:
          "Reputable Thai treatment centres operate with licensed medical teams, internationally trained therapists, and established clinical governance. Standards vary between facilities, which is exactly why independent placement guidance matters — we only recommend facilities we trust and that match your clinical needs, and we are not tied commercially to any provider.",
      },
      {
        question: "How long do people usually stay?",
        answer:
          "Most programmes are built around 28 days, but 60- and 90-day stays are common where there is a longer history of relapse, complex needs, or benefit from extended structure. The right length is a clinical decision, not a sales decision — we help you make it honestly.",
      },
      {
        question: "What about detox before treatment in Thailand?",
        answer:
          "Where there is significant physical dependency on alcohol, benzodiazepines, or opioids, medically supervised detox must be planned properly — either before travel or at a Thai facility with appropriate medical capability. This is one of the first things we assess, because it is a safety issue, not a preference.",
      },
      {
        question: "How quickly can admission be arranged?",
        answer:
          "Once the assessment conversation has happened and a facility is agreed, admission can often be arranged within days. We coordinate directly with the facility, including travel logistics and clinical handover, so the transition is structured rather than chaotic.",
      },
    ],
  },
  {
    slug: "private-rehab-south-africa",
    country: "South Africa",
    title: "Private Rehab in South Africa",
    seoTitle: "Private Rehab in South Africa | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering rehab in South Africa? Independent guidance on residential addiction treatment in South Africa — long-term programmes from around £1,800 per month up to around £10,000 for premium facilities. Confidential placement support.",
    heroImage: "/private-rehab-south-africa-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for South Africa with a residential rehab setting beneath mountains",
    heroEyebrow: "Treatment Placement — South Africa",
    heroHeading: "Private Rehab in South Africa",
    heroIntro:
      "South Africa offers some of the best value residential addiction treatment in the world — with a mature recovery industry, strong English-speaking clinical teams, and options ranging from affordable long-term recovery programmes to premium private facilities. For people who need extended treatment, South Africa often makes a longer stay financially possible where the UK would not.",
    whyHeading: "Why people choose South Africa for rehab",
    whyIntro:
      "South Africa is frequently the right answer where treatment length matters more than luxury — and where budget would otherwise cut recovery short:",
    whyPoints: [
      "Exceptional value: extended treatment is affordable in a way it rarely is in the UK",
      "A well-established treatment culture with experienced, English-speaking clinical teams",
      "Genuine long-term programme options — 60, 90 days and beyond — not just 28-day models",
      "Strong secondary care and step-down structures for consolidating early recovery",
      "Distance from home environment, triggers, and existing social networks",
    ],
    costHeading: "How much does rehab in South Africa cost?",
    costIntro:
      "South Africa covers the widest affordability range of any destination we work with — from around £1,800 per month for structured long-term recovery programmes up to around £10,000 for premium residential facilities.",
    costLow: 1800,
    costHigh: 10000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Residential accommodation and meals",
      "Structured clinical programme — individual and group therapy",
      "Programme length options well beyond the standard 28 days",
      "Step-down and secondary care options for longer recovery journeys",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who South Africa tends to suit",
    whoPoints: [
      "People who clinically need longer treatment — 60, 90 days or more — at a sustainable cost",
      "Those with a history of repeated relapse after short 28-day programmes",
      "Families funding treatment under real financial pressure who do not want to compromise on structure",
      "People who benefit from a strong recovery community culture",
    ],
    faqs: [
      {
        question: "Why is treatment in South Africa so much more affordable?",
        answer:
          "Favourable exchange rates and lower operating costs — not lower clinical standards at reputable facilities. South Africa has one of the most established addiction treatment cultures outside the UK and US. As with any destination, quality varies between providers, which is why independent guidance and honest facility selection matter.",
      },
      {
        question: "Is a longer, cheaper programme better than a short premium one?",
        answer:
          "Sometimes, yes. For many people — particularly after repeated relapse — treatment length is a stronger predictor of outcome than accommodation quality. Where the clinical picture supports it, ninety days of structured treatment in South Africa can be more valuable than twenty-eight days somewhere more luxurious. We will tell you honestly which applies to your situation.",
      },
      {
        question: "What is secondary or step-down care?",
        answer:
          "After primary residential treatment, secondary care provides a structured, supported living environment with continued therapy while the person gradually rebuilds independence. South Africa has particularly strong secondary care options, which is one reason long recovery journeys work well there.",
      },
      {
        question: "How does aftercare work when I return to the UK?",
        answer:
          "Aftercare is planned before discharge, not after. Returning clients can step into Insight Recovery Network's online recovery programme and Insight OS digital tools, so the structure built in treatment continues at home rather than ending at the airport.",
      },
    ],
  },
  {
    slug: "private-rehab-spain",
    country: "Spain",
    title: "Private Rehab in Spain",
    seoTitle: "Private Rehab in Spain | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering private rehab in Spain? Independent guidance on residential addiction treatment in Spain — from around £4,000 to £28,000 depending on facility, close to the UK with discreet, high-quality options. Confidential placement support.",
    heroImage: "/private-rehab-spain-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Spain with a Mediterranean residential rehab setting",
    heroEyebrow: "Treatment Placement — Spain",
    heroHeading: "Private Rehab in Spain",
    heroIntro:
      "Spain combines proximity to the UK with a broad spectrum of residential treatment — from accessible, well-run clinics to some of Europe's most exclusive private facilities. Short flights, easy family involvement, and a familiar time zone make Spain a practical choice for people who want distance from their environment without travelling across the world.",
    whyHeading: "Why people choose Spain for rehab",
    whyIntro:
      "Spain suits people who want genuine separation from home life while staying within easy reach of the UK:",
    whyPoints: [
      "Two to three hours from most UK airports — practical for admissions, family visits, and returning home",
      "The widest range of options in Europe: from accessible private clinics to ultra-premium facilities",
      "English-speaking programmes designed for international clients",
      "Climate and environment that support physical recovery, routine, and wellbeing",
      "Easier family involvement in therapy where that is clinically appropriate",
    ],
    costHeading: "How much does rehab in Spain cost?",
    costIntro:
      "Residential treatment in Spain spans a wide range — from around £4,000 at accessible private clinics to around £28,000 at the most exclusive facilities, typically for a 28-day stay.",
    costLow: 4000,
    costHigh: 28000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Full residential accommodation and meals",
      "Structured clinical programme — individual and group therapy",
      "Medical and psychiatric oversight appropriate to the facility",
      "Family involvement options where clinically appropriate",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who Spain tends to suit",
    whoPoints: [
      "People who need distance from home but cannot — or do not want to — travel long-haul",
      "Families who want to remain involved in the treatment process",
      "Professionals who may need to return to the UK quickly if required",
      "Those seeking premium, discreet treatment within Europe",
    ],
    faqs: [
      {
        question: "Why is the price range in Spain so wide?",
        answer:
          "Because the market is genuinely broad — Spain hosts both accessible private clinics and some of Europe's most exclusive treatment facilities. The right choice is the one that matches your clinical needs and budget honestly. Paying more does not automatically mean better outcomes, and we will say so when that is the case.",
      },
      {
        question: "Is Spain suitable if I need a medical detox?",
        answer:
          "Several Spanish facilities provide medically supervised detox with appropriate clinical staffing. Whether detox should happen in Spain or be arranged in the UK before travel depends on the severity of physical dependency — this is assessed first, as a safety matter.",
      },
      {
        question: "Can my family visit or take part in treatment?",
        answer:
          "Often, yes — and proximity is one of Spain's real advantages. Many facilities offer structured family programmes or therapy sessions, and short flights make participation realistic in a way long-haul destinations cannot match.",
      },
      {
        question: "How do I choose between Spain and somewhere like Thailand?",
        answer:
          "It usually comes down to distance, budget, family involvement, and what kind of separation you need. Spain offers proximity and flexibility; Thailand and South Africa offer greater distance and, often, more treatment time per pound. This is exactly the kind of decision our placement guidance is designed to work through with you.",
      },
    ],
  },
  {
    slug: "private-rehab-sri-lanka",
    country: "Sri Lanka",
    title: "Private Rehab in Sri Lanka",
    seoTitle: "Private Rehab in Sri Lanka | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering rehab in Sri Lanka? Independent guidance on residential addiction treatment in Sri Lanka — typical costs from £12,000 to £18,000, intimate high-quality facilities, and confidential placement support from Insight Recovery Network.",
    heroImage: "/private-rehab-sri-lanka-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Sri Lanka with a tropical residential rehab setting",
    heroEyebrow: "Treatment Placement — Sri Lanka",
    heroHeading: "Private Rehab in Sri Lanka",
    heroIntro:
      "Sri Lanka is a quieter, more intimate alternative to the established rehab destinations — small, high-quality residential facilities, strong one-to-one clinical attention, and a setting that genuinely supports reflection and recovery. For the right person, the combination of privacy, calm, and personalised care is exactly what early recovery needs.",
    whyHeading: "Why people choose Sri Lanka for rehab",
    whyIntro:
      "Sri Lanka suits people for whom smaller and more personal beats bigger and busier:",
    whyPoints: [
      "Small, intimate facilities with high staff-to-client ratios and genuinely personalised treatment",
      "Deep privacy — far from UK social and professional circles",
      "A calm, restorative environment suited to reflection and rebuilding routine",
      "Holistic elements — mindfulness, movement, nature — integrated alongside structured clinical work",
      "A less clinical, more residential feel that suits people deterred by institutional settings",
    ],
    costHeading: "How much does rehab in Sri Lanka cost?",
    costIntro:
      "Residential treatment in Sri Lanka typically costs between £12,000 and £18,000 for a standard stay, reflecting the small scale and high level of individual clinical attention.",
    costLow: 12000,
    costHigh: 18000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Full residential accommodation and meals",
      "Highly individualised clinical programme with strong one-to-one therapy time",
      "Holistic and wellbeing programmes integrated with clinical work",
      "Small client groups and high staff-to-client ratios",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who Sri Lanka tends to suit",
    whoPoints: [
      "People who would be overwhelmed or deterred by larger, busier treatment centres",
      "Those who need substantial one-to-one clinical attention rather than predominantly group-based work",
      "People seeking maximum privacy and discretion",
      "Those drawn to a holistic, reflective environment alongside structured therapy",
    ],
    faqs: [
      {
        question: "How is Sri Lanka different from Thailand for rehab?",
        answer:
          "Both offer distance, privacy, and strong value compared with the UK. The practical difference is scale and style: Thailand's established centres tend to be larger with bigger peer communities, while Sri Lanka's facilities are smaller and more individualised. Which is better depends on whether you recover best in a community or with concentrated personal attention.",
      },
      {
        question: "Are small facilities clinically robust enough?",
        answer:
          "The reputable ones, yes — small does not mean informal. The facilities we work with maintain proper clinical programmes, qualified therapeutic teams, and medical oversight. Where someone's needs exceed what an intimate setting can safely manage — for example complex detox or unstable dual diagnosis — we will recommend a different setting, honestly.",
      },
      {
        question: "What does a typical stay involve?",
        answer:
          "A structured daily rhythm: individual therapy, small group work, physical activity, mindfulness practice, and relapse prevention planning — within a residential setting that feels more like a retreat than an institution. Stays are typically four weeks or longer depending on clinical need.",
      },
      {
        question: "What happens when I come home?",
        answer:
          "Aftercare is planned before you leave. Most returning clients continue with structured support through Insight Recovery Network's online recovery programme and Insight OS, so the routines built in treatment carry directly into daily life at home.",
      },
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
