import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";

const SITE_URL = "https://www.insightrecoverynetwork.com";

const faqs = [
  {
    question: "What is an online addiction recovery programme?",
    answer:
      "An online addiction recovery programme is structured, professionally guided recovery support delivered via video call and digital tools rather than in person. At its best, it includes group sessions, individual therapeutic work, relapse prevention planning, educational resources, and accountability support. A clinical online programme is different from a self-help app or informal peer group, it is structured, professionally delivered, and clinically informed.",
  },
  {
    question: "Is online addiction recovery as effective as residential rehab?",
    answer:
      "For some people and at certain stages of recovery, structured online support can be highly effective. For others, particularly those with severe physical dependency, high relapse risk, poor home environments, or significant mental health complexity, residential treatment is safer and more appropriate. The right approach depends on individual clinical needs, risk level, home circumstances, and stage of recovery. Insight Recovery Network can help you understand which level of support is most appropriate for your situation.",
  },
  {
    question: "Who is online addiction recovery support suitable for?",
    answer:
      "Online recovery support is generally suitable for individuals who are medically stable (not requiring supervised detox), who have a reasonably stable home environment, who have some motivation to engage with structured support, and who either cannot access in-person treatment or are choosing to manage recovery without residential care. It is also well-suited as aftercare support following residential treatment.",
  },
  {
    question: "Is the programme suitable if I am still drinking or using?",
    answer:
      "This depends on the individual situation. Some people engage with online recovery support while actively reducing use, working towards abstinence, or following a structured tapering plan. Others are already abstinent and seeking structure to protect their recovery. Where there is active dependency, significant withdrawal risk, or clinical complexity, a more intensive level of support, including medically supervised detox or residential treatment, may be recommended first.",
  },
  {
    question: "How is this different from a therapy app or 12-step group?",
    answer:
      "Insight Recovery Network's online programme is clinically structured and professionally led. It is not an app with automated responses or gamified content. It is not an anonymous peer-support group. It provides clinical oversight, individual therapeutic work, structured relapse prevention planning, and professional accountability, closer to an intensive outpatient programme delivered online than to self-help or peer support.",
  },
  {
    question: "What does the online programme cost?",
    answer:
      "Pricing is available on request. Please contact us at info@insightrecoverynetwork.com or +44 7415 994475 for a confidential conversation about options and what is most appropriate for your situation.",
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

const whoFor = [
  {
    heading: "You need structure but cannot step away from work or family",
    body: "The online programme provides a clinical rhythm of structured support without requiring you to leave your responsibilities, or your life, behind.",
  },
  {
    heading: "You have completed residential treatment and need robust aftercare",
    body: "The transition out of residential care is a high-risk period. Structured online support significantly reduces the likelihood of relapse in the critical first weeks and months.",
  },
  {
    heading: "You want professional guidance without entering residential rehab",
    body: "Not everyone needs, or is ready for, residential care. For those who are not yet at that point, structured online support offers a serious, clinically informed alternative.",
  },
  {
    heading: "You are relapsing despite trying to manage alone",
    body: "Willpower and self-monitoring are rarely enough on their own. Professional structure, accountability, and relapse prevention planning make a measurable difference.",
  },
  {
    heading: "You are supporting a loved one and need a structured approach",
    body: "We can help families understand whether this level of support is appropriate and coordinate a structured response for the person they are supporting.",
  },
];

const notSuitable = [
  "Active dependency on alcohol, benzodiazepines, or opioids where medically supervised detox is required",
  "Severe or unstable mental health conditions that require a higher level of clinical care",
  "Unsafe home environments where isolation, access to substances, or lack of support make online support insufficient",
  "Repeated residential relapses that indicate a need for a more intensive or different approach",
  "Active crisis situations requiring emergency or immediate clinical intervention",
];

const comparisons: [string, string][] = [
  [
    "vs. 12-step groups",
    "12-step fellowships can provide valuable peer community but are not clinically structured, do not provide individual therapeutic work, and may not suit everyone. They are not a professional service.",
  ],
  [
    "vs. general counselling",
    "General counselling can address underlying emotional difficulties but is typically not addiction-specific, not structured around relapse prevention, and does not include clinical oversight of the recovery process.",
  ],
  [
    "vs. therapy apps",
    "Therapy apps provide self-directed content and sometimes automated coaching. They do not provide professional clinical oversight, structured group work, or individual accountability.",
  ],
  [
    "vs. residential rehab",
    "Residential treatment is the most appropriate choice for those with severe dependency, withdrawal risk, unsafe environments, or repeated relapse. It is not always necessary. Structured online support is a serious alternative where residential care is not clinically indicated.",
  ],
];

export default function OnlineAddictionRecoveryUK() {
  return (
    <Layout>
      <SEO
        title="Online Addiction Recovery Support UK Guide"
        fullTitle="Online Addiction Recovery Support UK Guide | Insight Recovery Network"
        description="A plain-English guide to online addiction recovery support in the UK: who it suits, when rehab is safer, how it compares with therapy apps, counselling and 12-step groups."
        canonical="/online-addiction-recovery-programme-uk"
        ogImage={`${SITE_URL}/opengraph.jpg`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-14 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
              Online Recovery Support, UK
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-tight mb-8 text-primary">
              Structured online addiction recovery support, built around your life.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-10">
              Professional, clinically informed recovery support delivered online, for individuals in the UK who need structure, accountability, and professional guidance without residential treatment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/get-help" data-analytics-event="online_programme_enquiry" data-service-interest="online-programme" data-cta-location="hero">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Book a confidential call
                </button>
              </Link>
              <Link href="/online-programme">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-primary/25 text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  Compare Programme Options
                </button>
              </Link>
              <Link href="/assessments">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Take a free assessment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What it is / How it differs */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                What online addiction recovery support is
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Online addiction recovery support is structured, professionally delivered recovery work carried out via video call and digital tools. At its best, it is clinically rigorous, individually tailored, and sustained over time.
                </p>
                <p>
                  Insight Recovery Network's online recovery support is not an app with automated check-ins. It is not a peer-support chatroom. It is not an informal weekly group. It is a structured, professionally led programme providing individual therapeutic work, clinical guidance, relapse prevention planning, and ongoing accountability, delivered flexibly to fit around work, family, and daily life.
                </p>
                <p>
                  The programme makes use of{" "}
                  <Link
                    href="/insight-os"
                    className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
                  >
                    Insight OS
                  </Link>
                  , a structured digital recovery system providing daily check-ins, anchor practices, relapse prevention tools, and progress tracking between sessions.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                How it differs from other options
              </h2>
              <div className="space-y-4">
                {comparisons.map(([label, body]) => (
                  <div key={label} className="border border-border/40 rounded-sm p-5">
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent/80 mb-2">{label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-4 text-primary">
              Who online recovery support is suitable for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {whoFor.map((item) => (
              <div key={item.heading} className="border border-border/40 rounded-sm p-7">
                <h3 className="font-serif text-lg font-medium mb-3 text-primary">{item.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-medium mb-5 text-primary">
              When online support may not be appropriate
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Online recovery support has real limits. We will always be honest about when a different level of care is safer or more appropriate.
            </p>
            <ul className="space-y-3 mb-6">
              {notSuitable.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-accent mt-0.5 flex-shrink-0">, </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If any of these apply, we can provide guidance on{" "}
              <Link
                href="/treatment-placement"
                className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
              >
                appropriate treatment placement
              </Link>
              , including private detox, residential rehab, and dual-diagnosis treatment in the UK and internationally.
            </p>
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
        heading="Find out whether online recovery support is right for you."
        body="A confidential conversation can help clarify whether online recovery support, treatment placement, or another level of care is most appropriate for your situation. No obligation, no pressure."
        primaryLabel="Ask about programme availability"
        primaryHref="/get-help"
        secondaryLabel="Take a free assessment"
        secondaryHref="/assessments"
        primaryEvent="online_programme_enquiry"
        sourcePage="online-addiction-recovery-programme-uk"
        serviceInterest="online-programme"
        ctaLocation="final_cta"
      />
    </Layout>
  );
}
