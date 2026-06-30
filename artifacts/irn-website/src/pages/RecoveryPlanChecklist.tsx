import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Is there enough daily structure?",
    prompts: [
      "What does the person do between therapy, groups, calls, or check-ins?",
      "Is there a plan for mornings, evenings, weekends, boredom, sleep, and unstructured time?",
      "Does the routine reduce risk, or does it rely on motivation staying high?",
    ],
  },
  {
    title: "What happens between sessions?",
    prompts: [
      "Is the recovery work active between appointments?",
      "Are there check-ins, tasks, reflection prompts, journalling, or accountability points?",
      "Does the person know what to do when they are triggered and alone?",
    ],
  },
  {
    title: "Is there a plan after a slip?",
    prompts: [
      "Does the plan define what counts as a warning sign, lapse, or relapse?",
      "Who gets told, and how quickly?",
      "Is the response practical and non-shaming, or does everything depend on hiding the slip?",
    ],
  },
  {
    title: "Are family and support roles clear?",
    prompts: [
      "Does everyone know what support is helpful and what becomes rescuing?",
      "Are boundaries clear before a crisis happens?",
      "Is the family included where appropriate, or left guessing?",
    ],
  },
  {
    title: "Is aftercare specific?",
    prompts: [
      "Does aftercare start before discharge or before the programme ends?",
      "Are appointments, peer support, recovery tools, family agreements, and daily structure named?",
      "Is the plan specific enough that someone could follow it on a difficult day?",
    ],
  },
  {
    title: "Does the plan match the actual risk?",
    prompts: [
      "Does it account for withdrawal risk, mental health, previous relapse, home environment, work pressure, and relationship stress?",
      "Is the intensity of support realistic for the level of risk?",
      "Is the plan based on the person in front of you, rather than a generic model?",
    ],
  },
  {
    title: "Are warning signs and accountability defined?",
    prompts: [
      "What are the earliest signs that recovery is weakening?",
      "Who notices them, and what happens next?",
      "Is accountability built into the routine, not only used after things go wrong?",
    ],
  },
];

export default function RecoveryPlanChecklist() {
  return (
    <Layout>
      <SEO
        title="Recovery Plan Checklist"
        fullTitle="Recovery Plan Checklist | Insight Recovery Network"
        description="A private checklist for assessing whether a recovery plan, treatment programme, or aftercare structure is the right fit."
        canonical="/recovery-plan-checklist/checklist"
        noIndex
      />

      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-5">
              Private checklist
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
              Recovery Plan Checklist
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Use these questions before choosing care, leaving treatment, building aftercare, or trying to strengthen relapse prevention. A good plan should be specific enough to hold up on a difficult day.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl space-y-6">
            {sections.map((section, index) => (
              <div key={section.title} className="border border-border/60 bg-white p-6 md:p-8">
                <div className="flex gap-4 items-start mb-5">
                  <span className="font-serif text-2xl text-accent/80 min-w-10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-primary leading-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.prompts.map((prompt) => (
                    <div key={prompt} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" strokeWidth={1.7} />
                      <p className="text-muted-foreground leading-relaxed">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">
              If the checklist raises concerns, slow the decision down.
            </h2>
            <p className="text-white/75 leading-relaxed mb-7">
              Insight Recovery Network can help you think through treatment placement, online recovery support, relapse prevention, and aftercare options with clarity and confidentiality.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="rounded-none h-12 px-8">
                Book a confidential call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
