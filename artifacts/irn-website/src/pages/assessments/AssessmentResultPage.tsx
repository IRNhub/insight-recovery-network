import { useEffect, useState } from "react";
import { AssessmentResult } from "@/components/assessment/AssessmentResult";
import { SEO } from "@/components/SEO";
import type { AuthoritativeAssessmentResult } from "@/types/assessment";

export default function AssessmentResultPage() {
  const [result, setResult] = useState<AuthoritativeAssessmentResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/assessments/result", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Result unavailable");
        const payload = await response.json() as { result?: AuthoritativeAssessmentResult };
        if (!payload.result) throw new Error("Result unavailable");
        setResult(payload.result);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  function recordCtaClick() {
    fetch("/api/assessments/result/cta", { method: "POST" }).catch(() => undefined);
  }

  return (
    <>
      <SEO
        title="Your Assessment Results"
        description="Your private assessment result from Insight Recovery Network."
        canonical="/assessment-results"
        noIndex={true}
      />
      {result ? (
        <AssessmentResult result={result} onCtaClick={recordCtaClick} onResultUpdate={setResult} />
      ) : (
        <main className="min-h-[60vh] bg-[#F6F4F0] px-6 py-20">
          <div className="mx-auto max-w-xl border border-border/60 bg-white p-8">
            <h1 className="font-serif text-3xl text-primary">
              {failed ? "This result is not available" : "Retrieving your result"}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
              {failed
                ? "For privacy, results can only be opened in the browser that completed the assessment while the secure access cookie remains valid. You can complete the assessment again or contact IRN if you need help."
                : "Please wait while the secure result is retrieved."}
            </p>
          </div>
        </main>
      )}
    </>
  );
}
