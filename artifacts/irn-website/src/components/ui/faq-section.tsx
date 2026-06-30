import { Helmet } from "react-helmet-async";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  heading?: string;
  includeSchema?: boolean;
}

export function FAQSection({ items, heading = "Frequently asked questions", includeSchema = true }: FAQSectionProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="py-12 md:py-20 border-t border-border/40 bg-background" aria-labelledby="faq-heading">
      {includeSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
      )}
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="font-serif text-3xl md:text-4xl text-primary mb-10">{heading}</h2>
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.question} className="border-b border-border/40 pb-8 last:border-b-0">
                <h3 className="font-serif text-xl text-primary mb-3">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
