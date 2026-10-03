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
  costLow?: number;
  costHigh?: number;
  costIncludesHeading?: string;
  references?: Array<{ label: string; href: string }>;
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
  "All figures are typical guide ranges only. Actual costs depend on the facility, length of stay, level of medical care required, and accommodation type, and are always confirmed transparently before any decision is made. Insight Recovery Network provides assessment-led guidance and will tell you honestly when a less expensive option is clinically appropriate.";

export const destinations: Destination[] = [
  {
    slug: "private-rehab-thailand",
    country: "Thailand",
    title: "Private Rehab Thailand",
    seoTitle: "Private Rehab Thailand: Costs & Treatment Placement | IRN",
    metaDescription:
      "Compare private rehab in Thailand, guide costs from £8,000 to £15,000, detox, trauma-informed care, programme lengths and assessment-led placement support.",
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
          "Standards, staffing and medical capability vary between facilities. Assessment-led placement guidance helps check who provides care, how detox and mental-health risk are managed, what is outside the programme's scope and whether the setting fits the person. IRN explains any relevant provider relationship transparently before a recommendation.",
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
    seoTitle: "Rehab in South Africa: Costs and Private Treatment | IRN",
    metaDescription:
      "Compare rehab in South Africa: guide costs, longer stays, privacy and returning to the UK. Discuss suitable private treatment options with IRN.",
    heroImage: "/private-rehab-south-africa-hero.png",
    heroImageAlt:
      "Private treatment placement hero image for South Africa with a residential rehab setting beneath mountains",
    heroEyebrow: "Treatment Placement: South Africa",
    heroHeading: "Private Rehab in South Africa: Costs and Treatment Options",
    heroIntro:
      "Considering rehab in South Africa from the UK? Compare the full cost, clinical care, programme length and support for returning home before choosing a centre. Insight Recovery Network provides assessment-led treatment placement guidance. We do not own or operate the facilities. Craig Bilton brings experience of working in addiction treatment in South Africa to these conversations.",
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
    detailSections: [
      {
        heading: "Compare the full cost of rehab in South Africa",
        paragraphs: [
          "A monthly programme price and a quote for a complete residential stay are not directly comparable. Ask for a written quote for the same length of treatment, with the accommodation, clinical programme and medical support clearly described. The guide range above is not a quotation or a guarantee of availability.",
          "Before paying a deposit, establish which costs are additional and what happens if a clinician recommends a different level of care or a longer stay. IRN can help you organise these questions when comparing options.",
        ],
        points: [
          "Confirm whether assessment, detox, medication and psychiatric consultations are included or separately charged.",
          "Budget for flights, airport transfers and any travel or visa requirements that apply to your circumstances.",
          "Check the total for the proposed stay, payment currency, cancellation terms and the cost of any extension.",
          "Ask what aftercare is included, how long it lasts and whether it is accessible from the UK.",
        ],
      },
      {
        heading: "Rehab for business owners and professionals in South Africa",
        paragraphs: [
          "Running a business can make time away feel difficult. The useful question is whether a programme can meet your treatment needs while you make realistic arrangements for responsibilities at home. An executive label or attractive setting does not establish clinical suitability.",
          "Discuss confidentiality, contact with colleagues or family, device access and any essential work commitments before admission. Each centre sets its own rules. Continuing to work throughout treatment should not be assumed, and any agreed contact needs to fit the clinical plan.",
        ],
        points: [
          "Ask who receives information and what consent is required before anyone is contacted.",
          "Agree a practical handover of work and financial responsibilities before travelling.",
          "Clarify whether private accommodation is available and whether it changes the quoted cost.",
        ],
      },
      {
        heading: "Plan safe travel and your return to the UK",
        paragraphs: [
          "If physical dependence or withdrawal may be involved, seek a medical assessment before making travel arrangements. Overseas placement is not a way to manage urgent withdrawal or an emergency.",
          "Before admission, ask how the centre plans discharge, medication continuity and ongoing support at home. Agree who will coordinate any handover with UK services and what support is available if difficulties arise after returning. IRN can discuss continuing support options within its service scope; availability and suitability should be confirmed in advance.",
        ],
      },
    ],
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
          "Favourable exchange rates and lower operating costs, not lower clinical standards at reputable facilities. South Africa has one of the most established addiction treatment cultures outside the UK and US. As with any destination, quality varies between providers, which is why assessment-led guidance and honest facility selection matter.",
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
    seoTitle: "Private Rehab Spain: Costs, UK Comparison & Placement | IRN",
    metaDescription:
      "Compare private rehab in Spain with UK options. Check written costs, detox arrangements, travel, family involvement and UK aftercare before choosing treatment.",
    heroImage: "/private-rehab-spain-hero.png",
    heroImageAlt:
      "Illustrative Mediterranean residential setting for the Spain treatment guide",
    heroEyebrow: "Treatment Placement: Spain",
    heroHeading: "Private Rehab in Spain: Costs and UK Treatment Options",
    heroIntro:
      "Considering private rehab in Spain from the UK? Start by comparing the provider's clinical capability, full written cost and plan for returning home. IRN helps individuals and families work through suitable UK and Spanish options. We do not run the treatment centres, and the chosen provider makes the admission and medical decisions.",
    whyHeading: "Spain or the UK: what matters for your decision?",
    whyIntro:
      "Distance from home is one factor in treatment selection. Compare the same needs and budget in both countries before deciding:",
    whyPoints: [
      "Clinical fit: confirm which withdrawal, physical-health and mental-health needs each provider can safely manage",
      "Language: check that assessment, therapy, medical explanations and written discharge information are available in English",
      "Family contact: agree visiting rules and consent for family involvement instead of assuming visits or therapy are included",
      "Access: compare the whole door-to-door journey, transfer arrangements and what would happen if an early return were needed",
      "Continuity: identify who will provide follow-up and any medication review after returning to the UK",
    ],
    costHeading: "How much does rehab in Spain cost?",
    costIntro:
      "There is no single price for private rehab in Spain. Ask for a dated, itemised quote for the recommended length of stay and level of care. Compare the total in the provider's billing currency, including travel and UK aftercare, rather than choosing on a headline weekly or monthly fee.",
    costNote:
      "A provider's advertised price is not a personal quote or confirmation of availability. Confirm the exchange rate and payment fees if paying from the UK. IRN does not charge you a treatment-placement or referral fee; treatment providers charge for care, and IRN therapy or additional paid support is agreed separately. Any relevant provider relationship should be explained before you decide.",
    costIncludesHeading: "What to confirm in your written quote",
    costIncludes: [
      "Exact nights, room type, meals and the scheduled individual and group therapy",
      "Whether detox, medical assessment, psychiatric input, medicines and investigations are included or charged separately",
      "Airport transfers, flights, changes to travel and any support needed during the journey",
      "Deposit, cancellation terms, early discharge, additional nights and unexpected hospital care",
      "Family sessions and aftercare: who delivers them, how often, for how long and at what extra cost",
    ],
    whoHeading: "When to consider Spain, and when to consider another route",
    whoPoints: [
      "Spain may be an option when the provider can meet the assessed needs and the person can travel safely",
      "A UK setting may be more practical when local medical care, frequent family contact or continuity with existing services is needed",
      "Medical or psychiatric instability needs appropriate assessment and care before an overseas admission is considered",
      "If residential care is not required, compare local services and structured online support as separate options",
    ],
    detailSections: [
      {
        heading: "Confirm suitability before booking travel",
        paragraphs: [
          "Ask the receiving provider who assesses admission, who is medically responsible and which needs it cannot manage. Check the relevant local authorisation, staff qualifications, out-of-hours support and arrangements for escalation to hospital.",
          "If alcohol or drug dependence raises withdrawal concerns, seek medical advice before stopping or travelling. An online questionnaire or placement conversation cannot establish that flying or detox abroad is safe. Urgent risk should be addressed locally before travel planning.",
        ],
      },
      {
        heading: "Travel, medicines and insurance from the UK",
        paragraphs: [
          "Check the current FCDO Spain travel guidance before booking. Agree the arrival airport, transfer, responsible contact and a plan for delays or a change in health. Discuss prescribed medicines and any required documentation with the prescriber and relevant authorities.",
          "A GHIC or EHIC does not pay for private rehab or travel specifically for planned treatment. Confirm appropriate insurance with the insurer, including the reason for travel, existing conditions, unexpected care and repatriation; ordinary holiday cover should not be assumed to apply.",
        ],
      },
      {
        heading: "Plan UK aftercare before admission",
        paragraphs: [
          "Ask for a discharge plan that names the follow-up provider, first appointment, contact arrangements and costs. Clarify whether the centre's aftercare is online, individual or group support, and what happens if further help is needed.",
          "With the person's consent, agree how relevant information will be shared with UK professionals. Medication supply and ongoing prescribing need their own plan. IRN's paid online or therapeutic support can be discussed separately where suitable; it does not replace medical care.",
        ],
      },
      {
        heading: "Bring the right questions to a placement conversation",
        paragraphs: [
          "You can start by explaining whether you are enquiring for yourself or a family member, the preferred timing, approximate budget and practical constraints. You do not need to choose a centre first or have every answer ready.",
          "Use the confidential enquiry form or a private conversation for personal details. Ask how options are selected, what any referral relationship means and which fees belong to the provider or to additional IRN support. An enquiry does not reserve a place or commit you to treatment.",
        ],
      },
    ],
    references: [
      { label: "FCDO: Spain travel and health guidance", href: "https://www.gov.uk/foreign-travel-advice/spain/health" },
      { label: "GOV.UK: healthcare for UK nationals visiting Spain", href: "https://www.gov.uk/guidance/healthcare-for-uk-nationals-visiting-spain" },
      { label: "NHS: alcohol support and withdrawal safety", href: "https://www.nhs.uk/live-well/alcohol-advice/alcohol-support/" },
    ],
    faqs: [
      {
        question: "Is private rehab in Spain cheaper than the UK?",
        answer:
          "It depends on the provider, assessed needs, length of stay and what the quote covers. Compare equivalent programmes and add travel, medical extras, extensions and UK aftercare. A lower advertised fee does not establish a lower total cost or suitable clinical care.",
      },
      {
        question: "Is Spain suitable if I need a medical detox?",
        answer:
          "Detox capability varies by provider and must be confirmed directly. A medical professional needs to assess withdrawal risk and safe travel before any decision. Some people need treatment in the UK first or a different setting. IRN does not prescribe, provide detox or decide fitness to fly.",
      },
      {
        question: "Can my family take part in treatment in Spain?",
        answer:
          "Ask the chosen centre about family sessions, visiting, remote participation, consent and any additional fees. Do not assume that family therapy or visits are included in a residential price. Agree these arrangements before admission.",
      },
      {
        question: "Does a GHIC or EHIC cover rehab in Spain?",
        answer:
          "No. These cards cover eligible state healthcare, not private treatment or travel for planned treatment. Check funding, payment and appropriate insurance separately before booking.",
      },
      {
        question: "What happens when I return to the UK?",
        answer:
          "Agree a written discharge and aftercare plan before admission, including who provides follow-up, the first appointment, any medicine or prescribing arrangements and the costs. The centre's aftercare offer and any additional IRN support should be explained separately.",
      },
      {
        question: "How do I enquire about treatment in Spain?",
        answer:
          "Request a confidential treatment conversation through IRN's enquiry form. We can discuss needs, timing, budget and UK or overseas options. Sending an enquiry does not book an appointment, reserve a treatment place or commit you to a service.",
      },
    ],
  },
  {
    slug: "private-rehab-sri-lanka",
    country: "Sri Lanka",
    title: "Private Rehab in Sri Lanka",
    seoTitle: "Private Rehab in Sri Lanka | Costs, Placement & Guidance | Insight Recovery Network",
    metaDescription:
      "Considering rehab in Sri Lanka? Assessment-led guidance on residential addiction treatment, typical costs from £12,000 to £18,000, smaller facilities and confidential placement support.",
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
