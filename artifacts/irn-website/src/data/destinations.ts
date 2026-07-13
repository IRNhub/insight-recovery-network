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
  /**
   * Optional highlighted clinical/value message rendered as a pull-quote
   * style block beneath the "who it suits" points. Used where there is a
   * specific, clinically responsible point worth emphasising (e.g. the value
   * of longer treatment duration in South Africa).
   */
  clinicalNote?: string;
  detailSections?: Array<{
    heading: string;
    paragraphs: string[];
    points?: string[];
  }>;
  faqs: DestinationFaq[];
}

const COST_DISCLAIMER =
  "All figures are typical guide ranges only. Actual costs depend on the facility, length of stay, level of medical care required, and accommodation type, and are always confirmed transparently before any decision is made. Insight Recovery Network provides independent guidance and will tell you honestly when a less expensive option is clinically appropriate.";

export const destinations: Destination[] = [
  {
    slug: "private-rehab-thailand",
    country: "Thailand",
    title: "Private Rehab Thailand",
    seoTitle: "Private Rehab Thailand: Costs & Treatment Placement | IRN",
    metaDescription:
      "Compare private rehab in Thailand, guide costs from £8,000 to £15,000, detox, trauma-informed care, programme lengths and independent placement support.",
    heroImage: "/private-rehab-thailand-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Thailand with a tranquil residential rehab setting",
    heroEyebrow: "Treatment Placement: Thailand",
    heroHeading: "Private Rehab in Thailand: Costs and Treatment Placement",
    heroIntro:
      "Private rehab in Thailand can provide residential addiction treatment at a lower guide cost than many UK programmes, with distance from home and options for stays beyond 28 days. Suitability depends on withdrawal risk, mental health, trauma needs, medication, family circumstances and whether long-haul travel is safe. Insight Recovery Network assesses these factors and recommends appropriate partner programmes; we do not own or operate the facilities.",
    whyHeading: "Why people choose Thailand for rehab",
    whyIntro:
      "Thailand is often the right choice for people who want high-quality residential treatment with complete distance from their daily environment:",
    whyPoints: [
      "A range of English-speaking residential programmes for international clients",
      "Guide costs that may be lower than many UK private rehab programmes",
      "Complete separation from home triggers, work pressure, and social circles, often clinically valuable in early recovery",
      "Programmes may combine individual therapy, group work, wellbeing activity and relapse prevention planning",
      "Genuine privacy: you are highly unlikely to encounter anyone you know",
    ],
    costHeading: "How much does rehab in Thailand cost?",
    costIntro:
      "Residential addiction treatment in Thailand typically costs between £8,000 and £15,000 for a standard 28-day stay, depending on the facility, accommodation, and level of clinical care.",
    costLow: 8000,
    costHigh: 15000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Full residential accommodation and meals",
      "Structured clinical programme: individual and group therapy",
      "Clinical and medical input according to the selected provider and assessed needs",
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
    detailSections: [
      {
        heading: "Programme length, residential care and what is included",
        paragraphs: [
          "Many international programmes are organised around an initial 28-day stay, with 60- and 90-day options considered where longer containment, repetition and relapse-prevention work may be useful. Length should follow assessment rather than a standard sales package.",
          "A quoted residential fee may include accommodation, meals, the core therapy timetable and some wellbeing activities. Detox, psychiatric review, medication, specialist investigations, flights, transfers and extended aftercare may be separate. IRN checks the written inclusions before a placement decision.",
        ],
        points: [
          "Residential accommodation and a structured daily programme",
          "Individual and group therapeutic work, depending on provider",
          "Recovery and discharge planning before returning home",
          "Clear confirmation of medical, travel and additional costs",
        ],
      },
      {
        heading: "Detox, trauma-informed care and co-occurring needs",
        paragraphs: [
          "Alcohol, benzodiazepine and opioid withdrawal can be medically dangerous. Detox availability and capability vary by provider, so a medical assessment is needed before travel. Some people should detox in the UK or use a different service before entering a Thai residential programme.",
          "Trauma-informed care should mean that staff recognise how trauma can affect safety, trust, emotional regulation and substance use. It does not mean that every centre provides specialist PTSD treatment. Where PTSD, depression, anxiety, eating difficulties, self-harm risk or another mental-health need is present, IRN asks what the provider can safely manage and where its limits sit.",
        ],
        points: [
          "Withdrawal history, current use and physical health",
          "Medication and psychiatric or psychological support needs",
          "Trauma history, triggers and the required therapeutic approach",
          "Clear escalation plans if risk changes during treatment",
        ],
      },
      {
        heading: "Family involvement, travel and admission planning",
        paragraphs: [
          "Family involvement can range from scheduled updates and education to remote family sessions, subject to consent and the provider's programme. It should be confirmed before admission, especially when relatives will be central to the return-home plan.",
          "Long-haul travel requires practical planning. Passport and entry requirements, insurance, medication documentation, airport support, transfers, time away from work and the plan for returning to the UK all matter. IRN coordinates the placement and handover with the chosen provider, while the provider retains responsibility for admission and clinical decisions.",
        ],
      },
      {
        heading: "Who Thailand may not be suitable for",
        paragraphs: [
          "Thailand may not be the right setting where someone is medically unstable, cannot safely fly, needs a level of acute psychiatric or hospital care that the proposed programme cannot provide, must remain close to dependent family members, or would be poorly served by being far from their UK support network.",
          "Distance and a calm setting can help, but they do not make a programme clinically suitable on their own. IRN compares Thailand with UK and other international options and will recommend a different route when the assessment points elsewhere.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is rehab in Thailand clinically safe and properly regulated?",
        answer:
          "Standards, staffing and medical capability vary between facilities. Independent placement guidance helps check who provides care, how detox and mental-health risk are managed, what is outside the programme's scope and whether the setting fits the person. IRN explains any relevant provider relationship transparently before a recommendation.",
      },
      {
        question: "How long do people usually stay?",
        answer:
          "Most programmes are built around 28 days, but 60- and 90-day stays are common where there is a longer history of relapse, complex needs, or benefit from extended structure. The right length is a clinical decision, not a sales decision. We help you make it honestly.",
      },
      {
        question: "What about detox before treatment in Thailand?",
        answer:
          "Where there is significant physical dependency on alcohol, benzodiazepines, or opioids, medically supervised detox must be planned properly, either before travel or at a Thai facility with appropriate medical capability. This is one of the first things we assess, because it is a safety issue, not a preference.",
      },
      {
        question: "How quickly can admission be arranged?",
        answer:
          "Once the assessment conversation has happened and a facility is agreed, admission can often be arranged within days. We coordinate directly with the facility, including travel logistics and clinical handover, so the transition is structured rather than chaotic.",
      },
      {
        question: "Is rehab in Thailand cheaper than the UK?",
        answer:
          "Thailand can cost less than many UK private rehab programmes, but like-for-like comparison is difficult because staffing, medical cover, accommodation, programme length and included services vary. Cost should never be the only factor. Detox safety, mental health needs and the suitability of being far from home all matter.",
      },
      {
        question: "Can I travel to Thailand for alcohol or drug treatment?",
        answer:
          "Many people do travel from the UK for residential treatment in Thailand. The important first step is a proper assessment of physical dependency: where there is significant alcohol, benzodiazepine, or opioid dependence, a medically supervised detox must be planned safely, either before travel or at a facility equipped to manage it. Flying is not appropriate until withdrawal risk has been assessed.",
      },
    ],
  },
  {
    slug: "private-rehab-south-africa",
    country: "South Africa",
    title: "Private Rehab in South Africa",
    seoTitle: "Private Rehab in South Africa | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering rehab in South Africa? Independent guidance on residential addiction treatment in South Africa, long-term programmes from around £1,800 per month up to around £10,000 for premium facilities. Confidential placement support.",
    heroImage: "/private-rehab-south-africa-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for South Africa with a residential rehab setting beneath mountains",
    heroEyebrow: "Treatment Placement: South Africa",
    heroHeading: "Private Rehab in South Africa",
    heroIntro:
      "South Africa offers some of the best value residential addiction treatment in the world, with a mature recovery industry, strong English-speaking clinical teams, and options ranging from affordable long-term recovery programmes to premium private facilities. For people who need extended treatment, South Africa often makes a longer stay financially possible where the UK would not.",
    whyHeading: "Why people choose South Africa for rehab",
    whyIntro:
      "South Africa is frequently the right answer where treatment length matters more than luxury, and where budget would otherwise cut recovery short:",
    whyPoints: [
      "Exceptional value: extended treatment is affordable in a way it rarely is in the UK",
      "A well-established treatment culture with experienced, English-speaking clinical teams",
      "Genuine long-term programme options: 60, 90 days and beyond, not just 28-day models",
      "Strong secondary care and step-down structures for consolidating early recovery",
      "Distance from home environment, triggers, and existing social networks",
    ],
    costHeading: "How much does rehab in South Africa cost?",
    costIntro:
      "South Africa covers the widest affordability range of any destination we work with, from around £1,800 per month for structured long-term recovery programmes up to around £10,000 for premium residential facilities.",
    costLow: 1800,
    costHigh: 10000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Residential accommodation and meals",
      "Structured clinical programme: individual and group therapy",
      "Programme length options well beyond the standard 28 days",
      "Step-down and secondary care options for longer recovery journeys",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who South Africa tends to suit",
    whoPoints: [
      "People who clinically need longer treatment, 60, 90 days or more, at a sustainable cost",
      "Those with a history of repeated relapse after short 28-day programmes",
      "Families funding treatment under real financial pressure who do not want to compromise on structure",
      "People who benefit from a strong recovery community culture",
    ],
    clinicalNote:
      "For some clients, the difference between 28 days and 90 days is not luxury. It is clinical containment, repetition, routine, and time away from the old environment. South Africa can be a suitable option where longer treatment would be clinically useful but UK private rehab costs make extended care difficult. Whether a longer stay is right is a clinical judgement we make honestly with you, not a default recommendation.",
    faqs: [
      {
        question: "Is South Africa suitable for long-term addiction treatment?",
        answer:
          "It can be one of the better options for it. South Africa has a mature treatment culture with genuine 60- and 90-day programmes and strong secondary care, at costs that make extended treatment realistic where UK private rehab often does not. Whether a longer stay is clinically appropriate depends on history, dependency, and risk, which we assess before recommending it.",
      },
      {
        question: "Why do some clients choose South Africa for extended care?",
        answer:
          "Usually because treatment length matters for their recovery and budget would otherwise cut it short. After repeated relapse, sustained structure and time away from the old environment can matter more than accommodation quality, and South Africa makes that financially possible. Detox and mental health needs are assessed first, as these determine whether any destination is safe and appropriate.",
      },
      {
        question: "Why is treatment in South Africa so much more affordable?",
        answer:
          "Favourable exchange rates and lower operating costs, not lower clinical standards at reputable facilities. South Africa has one of the most established addiction treatment cultures outside the UK and US. As with any destination, quality varies between providers, which is why independent guidance and honest facility selection matter.",
      },
      {
        question: "Is a longer, cheaper programme better than a short premium one?",
        answer:
          "Sometimes, yes. For many people, particularly after repeated relapse, treatment length is a stronger predictor of outcome than accommodation quality. Where the clinical picture supports it, ninety days of structured treatment in South Africa can be more valuable than twenty-eight days somewhere more luxurious. We will tell you honestly which applies to your situation.",
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
      "Considering private rehab in Spain? Independent guidance on residential addiction treatment in Spain, from around £4,000 to £28,000 depending on facility, close to the UK with discreet, high-quality options. Confidential placement support.",
    heroImage: "/private-rehab-spain-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Spain with a Mediterranean residential rehab setting",
    heroEyebrow: "Treatment Placement: Spain",
    heroHeading: "Private Rehab in Spain",
    heroIntro:
      "Spain combines proximity to the UK with a broad spectrum of residential treatment, from accessible, well-run clinics to some of Europe's most exclusive private facilities. Short flights, easy family involvement, and a familiar time zone make Spain a practical choice for people who want distance from their environment without travelling across the world.",
    whyHeading: "Why people choose Spain for rehab",
    whyIntro:
      "Spain suits people who want genuine separation from home life while staying within easy reach of the UK:",
    whyPoints: [
      "Two to three hours from most UK airports: practical for admissions, family visits, and returning home",
      "The widest range of options in Europe: from accessible private clinics to ultra-premium facilities",
      "English-speaking programmes designed for international clients",
      "Climate and environment that support physical recovery, routine, and wellbeing",
      "Easier family involvement in therapy where that is clinically appropriate",
    ],
    costHeading: "How much does rehab in Spain cost?",
    costIntro:
      "Residential treatment in Spain spans a wide range, from around £4,000 at accessible private clinics to around £28,000 at the most exclusive facilities, typically for a 28-day stay.",
    costLow: 4000,
    costHigh: 28000,
    costNote: COST_DISCLAIMER,
    costIncludes: [
      "Full residential accommodation and meals",
      "Structured clinical programme: individual and group therapy",
      "Medical and psychiatric oversight appropriate to the facility",
      "Family involvement options where clinically appropriate",
      "Aftercare planning before discharge",
    ],
    whoHeading: "Who Spain tends to suit",
    whoPoints: [
      "People who need distance from home but cannot, or do not want to, travel long-haul",
      "Families who want to remain involved in the treatment process",
      "Professionals who may need to return to the UK quickly if required",
      "Those seeking premium, discreet treatment within Europe",
    ],
    faqs: [
      {
        question: "Why is the price range in Spain so wide?",
        answer:
          "Because the market is genuinely broad. Spain hosts both accessible private clinics and some of Europe's most exclusive treatment facilities. The right choice is the one that matches your clinical needs and budget honestly. Paying more does not automatically mean better outcomes, and we will say so when that is the case.",
      },
      {
        question: "Is Spain suitable if I need a medical detox?",
        answer:
          "Several Spanish facilities provide medically supervised detox with appropriate clinical staffing. Whether detox should happen in Spain or be arranged in the UK before travel depends on the severity of physical dependency. This is assessed first, as a safety matter.",
      },
      {
        question: "Can my family visit or take part in treatment?",
        answer:
          "Often, yes, and proximity is one of Spain's real advantages. Many facilities offer structured family programmes or therapy sessions, and short flights make participation realistic in a way long-haul destinations cannot match.",
      },
      {
        question: "How do I choose between Spain and somewhere like Thailand?",
        answer:
          "It usually comes down to distance, budget, family involvement, and what kind of separation you need. Spain offers proximity and flexibility; Thailand and South Africa offer greater distance and, often, more treatment time per pound. This is exactly the kind of decision our placement guidance is designed to work through with you.",
      },
      {
        question: "Is Spain a good option for private rehab close to the UK?",
        answer:
          "For many people, yes. Spain is two to three hours from most UK airports, which makes admission, family involvement, and the return home far more practical than long-haul destinations, while still providing genuine distance from the home environment. It suits people who want separation without travelling across the world. The right setting still depends on clinical need, detox requirements, and budget.",
      },
      {
        question: "How quickly can someone travel to Spain for treatment?",
        answer:
          "Once a facility is agreed and any clinical considerations are addressed, the short flight means travel can usually be arranged quickly. The key safety step is the same wherever someone goes: if there is significant physical dependency, withdrawal risk must be assessed and a medical detox planned before travel. We coordinate this so the move into treatment is safe and structured.",
      },
    ],
  },
  {
    slug: "private-rehab-sri-lanka",
    country: "Sri Lanka",
    title: "Private Rehab in Sri Lanka",
    seoTitle: "Private Rehab in Sri Lanka | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering rehab in Sri Lanka? Independent guidance on residential addiction treatment in Sri Lanka, typical costs from £12,000 to £18,000, intimate high-quality facilities, and confidential placement support from Insight Recovery Network.",
    heroImage: "/private-rehab-sri-lanka-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for Sri Lanka with a tropical residential rehab setting",
    heroEyebrow: "Treatment Placement: Sri Lanka",
    heroHeading: "Private Rehab in Sri Lanka",
    heroIntro:
      "Sri Lanka is a quieter, more intimate alternative to the established rehab destinations: small, high-quality residential facilities, strong one-to-one clinical attention, and a setting that genuinely supports reflection and recovery. For the right person, the combination of privacy, calm, and personalised care is exactly what early recovery needs.",
    whyHeading: "Why people choose Sri Lanka for rehab",
    whyIntro:
      "Sri Lanka suits people for whom smaller and more personal beats bigger and busier:",
    whyPoints: [
      "Small, intimate facilities with high staff-to-client ratios and genuinely personalised treatment",
      "Deep privacy: far from UK social and professional circles",
      "A calm, restorative environment suited to reflection and rebuilding routine",
      "Holistic elements (mindfulness, movement, nature) integrated alongside structured clinical work",
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
          "The reputable ones, yes: small does not mean informal. The facilities we work with maintain proper clinical programmes, qualified therapeutic teams, and medical oversight. Where someone's needs exceed what an intimate setting can safely manage, for example complex detox or unstable dual diagnosis, we will recommend a different setting, honestly.",
      },
      {
        question: "What does a typical stay involve?",
        answer:
          "A structured daily rhythm: individual therapy, small group work, physical activity, mindfulness practice, and relapse prevention planning, within a residential setting that feels more like a retreat than an institution. Stays are typically four weeks or longer depending on clinical need.",
      },
      {
        question: "What happens when I come home?",
        answer:
          "Aftercare is planned before you leave. Most returning clients continue with structured support through Insight Recovery Network's online recovery programme and Insight OS, so the routines built in treatment carry directly into daily life at home.",
      },
      {
        question: "Is Sri Lanka suitable for private addiction treatment?",
        answer:
          "For the right person, yes. Sri Lanka's smaller, more personalised facilities suit people who need substantial one-to-one attention or would be overwhelmed by larger centres. It is less suited to complex medical detox or unstable dual diagnosis, which need a setting with greater clinical capability, and we will say so honestly. Detox and mental health risks are always assessed before recommending any destination.",
      },
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
