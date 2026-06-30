import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

export function RelatedServiceLinks({ links, heading = "Related support and guidance" }: { links: RelatedLink[]; heading?: string }) {
  return (
    <section className="py-12 md:py-16 border-t border-border/40 bg-secondary/15">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="font-serif text-2xl md:text-3xl text-primary mb-8">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="group border border-border/40 bg-background p-6 hover:border-accent/50 transition-colors">
              <h3 className="font-serif text-lg text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-primary group-hover:text-accent">
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
