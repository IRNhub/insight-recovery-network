import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { placementSteps } from "@/data/placement-journey.js";

export function PlacementJourney() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  return (
    <section className="py-14 md:py-20" aria-labelledby={`${id}-heading`}>
      <div className="container mx-auto px-6 md:px-12">
        <p className="eyebrow mb-3">From the first conversation onwards</p>
        <h2 id={`${id}-heading`} className="section-title max-w-2xl">
          A clearer path, one step at a time.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          You stay involved in each decision. Explore what support can look
          like.
        </p>
        <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {placementSteps.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                aria-expanded={selected === index}
                aria-controls={`${id}-detail`}
                onClick={() => setSelected(index)}
                className={`journey-step group h-full w-full rounded-xl border p-5 text-left ${selected === index ? "border-primary bg-primary text-white" : "border-border bg-white text-primary hover:border-primary/50"}`}
              >
                <span className="mb-5 flex items-center justify-between">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${selected === index ? "border-white/40" : "border-primary/20"}`}
                  >
                    0{index + 1}
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="block text-lg font-semibold">
                  {step.title}
                </span>
                <span
                  className={`mt-2 block text-sm leading-relaxed ${selected === index ? "text-white/85" : "text-muted-foreground"}`}
                >
                  {step.summary}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div
          id={`${id}-detail`}
          className="mt-5 rounded-xl border border-border bg-white p-6 md:p-7"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="font-semibold text-primary">
            {placementSteps[selected].title}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {placementSteps[selected].detail}
          </p>
        </div>
      </div>
    </section>
  );
}
