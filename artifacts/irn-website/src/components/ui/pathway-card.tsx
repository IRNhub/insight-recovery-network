import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface PathwayCardProps {
  title: string;
  description?: string;
  href: string;
  linkLabel?: string;
  delay?: number;
}

export function PathwayCard({ title, description, href, linkLabel = "Explore path", delay = 0 }: PathwayCardProps) {
  return (
    <Link href={href} data-testid={`link-pathway-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div
        className="group relative flex flex-col justify-between h-full bg-white p-8 md:p-10 border border-border/40 hover:border-accent/50 transition-all duration-400 cursor-pointer"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="mb-8">
          <div className="w-5 h-px bg-accent mb-5 transition-all duration-300 group-hover:w-10"></div>
          <h3 className="font-serif text-xl md:text-2xl text-primary leading-snug pr-4 mb-4">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center text-xs font-semibold tracking-wide uppercase text-accent mt-auto group-hover:text-primary transition-colors duration-300">
          <span>{linkLabel}</span>
          <ArrowRight className="ml-2 w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>

        <div className="absolute bottom-0 left-0 h-px bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
      </div>
    </Link>
  );
}