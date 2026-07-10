import { Link } from "wouter";
import { Button } from "./button";

interface CTASectionProps {
  heading: string;
  description?: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  isExternal?: boolean;
}

export function CTASection({
  heading,
  description,
  body,
  primaryCta,
  primaryLabel,
  primaryHref,
  secondaryCta,
  secondaryLabel,
  secondaryHref,
  isExternal
}: CTASectionProps) {
  const resolvedPrimaryCta = primaryCta ?? {
    label: primaryLabel ?? "Book a confidential call",
    href: primaryHref ?? "/contact",
  };
  const resolvedSecondaryCta =
    secondaryCta ??
    (secondaryHref
      ? { label: secondaryLabel ?? "Take a free assessment", href: secondaryHref }
      : undefined);
  const resolvedDescription = description ?? body;
  const isDirectHref = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

  return (
    <section className="py-8 md:py-14 lg:py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl md:text-5xl font-serif text-primary-foreground leading-tight mb-5 md:mb-6">
            {heading}
          </h2>

          {resolvedDescription && (
            <p className="text-base md:text-xl text-primary-foreground/80 mb-7 md:mb-10 max-w-2xl font-light">
              {resolvedDescription}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {isExternal || isDirectHref(resolvedPrimaryCta.href) ? (
              <a href={resolvedPrimaryCta.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="w-full sm:w-auto">
                <Button size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base bg-white text-primary hover:bg-white/90 w-full">
                  {resolvedPrimaryCta.label}
                </Button>
              </a>
            ) : (
              <Link href={resolvedPrimaryCta.href} className="w-full sm:w-auto">
                <Button size="lg" className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base bg-white text-primary hover:bg-white/90 w-full">
                  {resolvedPrimaryCta.label}
                </Button>
              </Link>
            )}

            {resolvedSecondaryCta && (isDirectHref(resolvedSecondaryCta.href) ? (
              <a href={resolvedSecondaryCta.href} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-none h-14 px-10 text-base border-white/20 text-white hover:bg-white/10 w-full">
                  {resolvedSecondaryCta.label}
                </Button>
              </a>
            ) : (
              <Link href={resolvedSecondaryCta.href} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-none h-14 px-10 text-base border-white/20 text-white hover:bg-white/10 w-full">
                  {resolvedSecondaryCta.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
