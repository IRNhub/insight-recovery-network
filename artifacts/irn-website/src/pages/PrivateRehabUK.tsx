import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";
import { ArrowRight } from "lucide-react";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const CANONICAL = "/private-rehab-uk";

const whenAppropriate = [
  "Alcohol dependence where a medically supervised detox may be required",
  "Drug dependence, including prescription, stimulant, or opioid use",
  "Relapse after previous attempts to stop or after community treatment",
  "Co-occurring anxiety, depression, trauma, or chronic stress alongside substance use",
  "A family crisis where a rapid, structured assessment is needed",
  "A need for treatment close to home or close to family",
];

const whatWeAssess = [
  "Clinical suitability: whether residential treatment is the right level of care",
  "Detox requirements and withdrawal risk, as a safety matter first",
  "Mental health and dual-diagnosis needs",
  "Appropriate length of stay",
  "Family involvement and how it can support recovery",
  "Budget and what it realistically covers",
  "Location: close to home, or distance from triggers",
  "Aftercare planning and ongoing recovery structure",
  "Safeguarding and risk considerations",
];

const howWeHelp = [
  {
    title: "Independent assessment",
    body: "An independent view of the situation, free of any commercial tie to a facility, so guidance is based on clinical fit, safety, budget and recovery needs.",
  },
  {
    title: "Is residential treatment appropriate?",
    body: "Clarifying whether residential rehab is actually needed, or whether another route would be safer or more effective.",
  },
  {
    title: "Detox decision support",
    body: "Identifying whether withdrawal needs to be medically supervised, which is a safety question that should be answered before anything else.",
  },
  {
    title: "Comparing UK and overseas",
    body: "Weighing UK rehab against overseas treatment options on value, length of stay, distance and clinical fit.",
  },
  {
    title: "Helping families decide well",
    body: "Helping families avoid rushed or emotionally driven decisions, and consider the options calmly before making contact with anyone.",
  },
  {
    title: "Preparing for treatment",
    body: "If residential care is chosen, help with what to expect and how to prepare, so the move into treatment is structured rather than chaotic.",
  },
  {
    title: "Aftercare and online structure",
    body: "Supporting aftercare and structured online recovery through our online programme and Insight OS, so progress continues after treatment.",
  },
  {
    title: "Family consultation and intervention",
    body: "Family consultation and intervention planning where needed, drawing on Craig Bilton's 20 years in addiction treatment and international recovery work.",
  },
];

const faqs = [
  {
    question: "How much does private rehab cost in the UK?",
    answer:
      "There is no single figure. UK private rehab costs vary significantly depending on detox needs, location, clinical intensity, accommodation, length of stay, and whether specialist mental health input is required. Shorter admissions can run to several thousand pounds, while premium or specialist programmes cost considerably more. Rather than quote a fixed price, we help you understand what a given level of care actually involves, and will tell you honestly where a less expensive option, including overseas, is clinically appropriate.",
  },
  {
    question: "Do I need detox before rehab?",
    answer:
      "It depends on the substance and the degree of physical dependency. Where there is significant dependence on alcohol, benzodiazepines, or opioids, a medically supervised detox is a safety requirement and must be planned properly. Withdrawal from some substances can be dangerous without medical oversight. Assessing this is one of the first things we do, because it determines what is safe.",
  },
  {
    question: "Is UK private rehab always the best option?",
    answer:
      "No. UK private rehab suits some situations well, particularly where proximity, family involvement, or continuity with existing care matters. For others, overseas residential treatment, medically supervised detox, structured online recovery support, or family intervention may be more appropriate. The point of an independent view is to work out which route fits before money is committed, rather than assuming a UK admission is automatically the answer.",
  },
  {
    question: "Should I choose UK rehab or overseas rehab?",
    answer:
      "It depends on clinical need, risk, budget, family situation, and recovery history. UK treatment can be better for proximity, family involvement, ease of travel, and continuity with NHS or private care. Overseas options may offer better value, longer treatment duration, more privacy, or greater distance from triggers. There is no universal answer, which is exactly why an independent comparison is worth having first.",
  },
  {
    question: "Can families contact Insight Recovery Network before the person agrees to treatment?",
    answer:
      "Yes, and they often do. Families are frequently the first to reach out. We can provide confidential guidance on how to approach a loved one, what to consider, and how to think about intervention and a structured response, before the person has agreed to anything.",
  },
  {
    question: "Can Insight Recovery Network help me understand my options before contacting a rehab?",
    answer:
      "Yes. That is the core of what we do. We give an independent, clinically informed view of the situation and help you compare the realistic routes, UK rehab, overseas treatment, detox, online recovery support, or family intervention, so you can make a clearer decision before contacting treatment centres directly. We do not refer into UK facilities or work on commission from them.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${CANONICAL}#service`,
  name: "Private Rehab UK Guidance",
  serviceType: "Addiction treatment guidance and recovery planning",
  description:
    "Independent guidance for individuals and families considering private rehab in the UK, including detox considerations, comparison with overseas treatment, online recovery support and aftercare planning.",
  provider: { "@type": "Organization", name: "Insight Recovery Network", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
};

const overseasOptions = [
  { country: "South Africa", href: "/private-rehab-south-africa", note: "Best value for longer-term and secondary care" },
  { country: "Spain", href: "/private-rehab-spain", note: "Close to the UK, easy family involvement" },
  { country: "Thailand", href: "/private-rehab-thailand", note: "Established centres, distance from triggers" },
  { country: "Sri Lanka", href: "/private-rehab-sri-lanka", note: "Intimate, highly personalised settings" },
];

export default function PrivateRehabUK() {
  return (
    <Layout>
      <SEO
        title="Private Rehab UK"
        fullTitle="Private Rehab UK | Independent Guidance Before Choosing Treatment | Insight Recovery Network"
        description="Considering private rehab in the UK? Insight Recovery Network helps individuals and families compare UK rehab, overseas treatment, detox needs, online recovery support and aftercare before committing to a treatment route."
        canonical={CANONICAL}
        ogImage={`${SITE_URL}/private-rehab-uk-hero.png`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      {/* Hero: split layout, real HTML text (left) + supportive image (right) */}
      <section className="py-14 md:py-20 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left: copy */}
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
                Private Rehab UK: Independent Guidance
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] font-medium leading-[1.08] tracking-tight mb-7 text-primary">
                Private Rehab UK: Independent Guidance Before You Choose
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Many people begin by searching for private rehab in the UK. Before committing to a costly
                admission, it is worth understanding whether UK rehab, overseas residential treatment,
                medically supervised detox, structured online support, family intervention or aftercare
                planning is the right fit.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-9">
                Insight Recovery Network provides independent guidance to help individuals and families
                make a safer, clearer and more informed decision, with no commercial ties to any facility.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Link href="/contact">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
                  >
                    Speak Confidentially
                  </button>
                </Link>
                <Link href="/assessments">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto"
                  >
                    Take a Free Assessment
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: supportive hero image (scene prioritised; copy lives in HTML above) */}
            <div className="relative">
              <div
                className="absolute -inset-2 md:-inset-3 rounded-2xl pointer-events-none"
                style={{ background: "rgba(201,169,110,0.10)", border: "1px solid rgba(201,169,110,0.22)" }}
              />
              <div className="relative overflow-hidden rounded-xl border border-border/40 bg-primary shadow-sm">
                <img
                  src="/private-rehab-uk-hero.png"
                  alt="Couple reviewing private rehab and treatment options with independent guidance"
                  className="block w-full h-full object-cover aspect-[4/3] lg:aspect-[5/4]"
                  style={{ objectPosition: "center" }}
                  width={1536}
                  height={1024}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* When UK private rehab may be appropriate */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              When residential rehab may be appropriate
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Residential treatment, in the UK or overseas, is not the right answer for everyone, and we
              will say so when it is not. It is worth considering where one or more of the following
              applies:
            </p>
          </div>
          <ul className="max-w-3xl space-y-3">
            {whenAppropriate.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we help you assess */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              What we help you assess
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Choosing treatment well means weighing several things at once. We work through them with
              you so the decision is informed rather than rushed:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatWeAssess.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white border border-border/30 rounded-xl px-5 py-4"
                style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.04)" }}
              >
                <span
                  className="flex-shrink-0 font-serif text-[10.5px] mt-0.5"
                  style={{ color: "rgba(201,169,110,0.85)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[13.5px] text-primary/80 font-light leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Costs */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                What does private rehab cost in the UK?
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  There is no single price. Costs vary significantly depending on detox needs,
                  location, clinical intensity, accommodation, length of stay, and whether specialist
                  mental health input is required.
                </p>
                <p>
                  Private UK rehab can range from several thousand pounds for shorter admissions to
                  considerably higher costs for premium or specialist programmes. A higher price does
                  not automatically mean a better outcome, and a longer programme at a lower cost is
                  sometimes the more clinically useful option.
                </p>
                <p>
                  Before committing to any admission, it is worth getting an independent view. We can
                  help you understand what a given level of care actually involves, and whether a UK or
                  overseas option represents better value for the clinical need.
                </p>
              </div>
            </div>
            <div className="border border-border/40 bg-white p-8">
              <h3 className="font-serif text-xl font-medium mb-5 text-primary">
                What affects the cost
              </h3>
              <ul className="space-y-3">
                {[
                  "Whether a medically supervised detox is required",
                  "Length of stay: shorter admissions versus extended programmes",
                  "Location and the type of accommodation",
                  "Clinical intensity and staff-to-client ratios",
                  "Specialist mental health or dual-diagnosis input",
                  "Aftercare and ongoing support arrangements",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/70 leading-relaxed italic mt-6">
                We provide independent guidance and will tell you honestly when a less expensive option
                is clinically appropriate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UK vs Overseas */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              UK or overseas rehab?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              UK private rehab can be appropriate for proximity, family involvement, ease of travel and
              continuity with existing care. Overseas treatment may be more appropriate when longer
              treatment duration, better value, privacy, distance from triggers or extended care is
              needed. It is a genuine comparison, not a default.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="border border-border/40 bg-white p-7 md:p-8 rounded-sm">
              <h3 className="font-serif text-xl font-medium mb-4 text-primary">UK treatment may suit when</h3>
              <ul className="space-y-3">
                {[
                  "Proximity matters: staying close to home or family",
                  "Family involvement in treatment is important",
                  "Ease of travel and quick admission are priorities",
                  "Continuity with existing NHS or private care is valuable",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border/40 bg-white p-7 md:p-8 rounded-sm">
              <h3 className="font-serif text-xl font-medium mb-4 text-primary">Overseas may suit when</h3>
              <ul className="space-y-3">
                {[
                  "Better value or longer treatment duration is needed",
                  "Greater distance from triggers and old environments helps",
                  "Extended or secondary care would be clinically useful",
                  "Privacy away from local social and professional circles matters",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
            The right decision depends on clinical need, risk, budget, family situation, and recovery
            history. Explore the international options below, read our{" "}
            <Link
              href="/treatment-placement"
              className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
            >
              treatment placement overview
            </Link>
            , or consider whether{" "}
            <Link
              href="/online-programme"
              className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
            >
              structured online recovery support
            </Link>{" "}
            could meet the need. Not sure where to start? A{" "}
            <Link
              href="/assessments"
              className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
            >
              free confidential assessment
            </Link>{" "}
            is a useful first step.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overseasOptions.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group border border-border/40 bg-white rounded-sm p-5 hover:border-accent/50 transition-colors block"
              >
                <h3 className="font-serif text-base font-medium text-primary group-hover:text-accent/90 transition-colors mb-1 inline-flex items-center gap-1.5">
                  {o.country}
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </h3>
                <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{o.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA: speak with Craig before contacting facilities */}
      <section className="py-12 md:py-16 border-b border-border/40 bg-primary">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/90 mb-4">
              Before you contact treatment centres directly
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight text-primary-foreground mb-4">
              Get an independent view first.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed font-light mb-7 max-w-2xl">
              Before you contact treatment centres directly, a short confidential conversation can help
              clarify whether private rehab in the UK, overseas treatment, detox, structured online
              support or family intervention is the most appropriate next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary text-sm font-medium hover:bg-white/90 transition-colors w-full sm:w-auto"
                >
                  Speak Confidentially
                </button>
              </Link>
              <Link href="/assessments">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-primary-foreground text-sm font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Take a Free Assessment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How IRN helps */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              How Insight Recovery Network helps
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We are an independent guide, not a treatment facility. Our role is to help individuals
              and families make a clear, informed decision and access the right level of support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howWeHelp.map((item) => (
              <div key={item.title} className="border border-border/40 rounded-sm p-6">
                <h3 className="font-serif text-lg font-medium mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              Frequently asked questions
            </h2>
          </div>
          <div className="max-w-3xl space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border/40 pb-8 last:border-b-0">
                <h3 className="font-serif text-xl font-medium mb-3 text-primary">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Considering private rehab in the UK?"
        body="Compare your options first. A confidential conversation can clarify whether UK rehab, overseas treatment, detox, structured online support or family intervention is the most appropriate next step. Independent guidance, no pressure, no commercial ties to any facility."
        primaryLabel="Speak Confidentially"
        primaryHref="/contact"
        secondaryLabel="Take a Free Assessment"
        secondaryHref="/assessments"
      />
    </Layout>
  );
}
