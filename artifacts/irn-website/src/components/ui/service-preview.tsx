import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ServicePreviewProps {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
}

export function ServicePreview({ title, description, href, linkLabel = "Learn More" }: ServicePreviewProps) {
  return (
    <div className="group border-b border-border pb-12 last:border-b-0 last:pb-0">
      <h3 className="text-2xl font-serif text-primary mb-4 flex items-center justify-between">
        {title}
        <ArrowRight
          className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
          strokeWidth={1.5}
        />
      </h3>
      <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-light">
        {description}
      </p>
      <Link
        href={href}
        className="text-sm font-semibold tracking-wide uppercase text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors"
        data-testid={`link-service-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {linkLabel}
      </Link>
    </div>
  );
}
