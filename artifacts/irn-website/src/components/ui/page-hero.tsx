import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ReactNode } from "react";
import { Button } from "./button";
import { Link } from "wouter";

interface PageHeroProps {
  label?: string;
  heading: ReactNode;
  description: ReactNode;
  primaryCta?: { label: string; href: string };
  /** Button-style primary CTA (e.g. smooth-scroll) instead of a link */
  primaryAction?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; href: string };
  /** Small trust/annotation line rendered beneath the CTAs */
  footnote?: ReactNode;
  image?: { src: string; alt: string; width?: number; height?: number; loading?: "eager" | "lazy" };
}

export function PageHero({
  label,
  heading,
  description,
  primaryCta,
  primaryAction,
  secondaryCta,
  footnote,
  image
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-10 md:py-14">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 z-10 pr-0 lg:pr-8">
            {label && (
              <span className="text-xs font-semibold tracking-widest uppercase text-accent/80 font-sans">
                {label}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-[1.1] tracking-tight">
              {heading}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              {description}
            </p>
            
            {(primaryCta || primaryAction || secondaryCta) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {primaryCta && (
                  <Link href={primaryCta.href}>
                    <Button size="lg" className="rounded-none h-14 px-8 text-base shadow-sm w-full sm:w-auto">
                      {primaryCta.label}
                    </Button>
                  </Link>
                )}
                {primaryAction && (
                  <Button
                    size="lg"
                    className="rounded-none h-14 px-8 text-base shadow-sm w-full sm:w-auto"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Link href={secondaryCta.href}>
                    <Button variant="outline" size="lg" className="rounded-none h-14 px-8 text-base border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                      {secondaryCta.label}
                    </Button>
                  </Link>
                )}
              </div>
            )}
            {footnote && (
              <p className="text-sm text-muted-foreground/80 font-light tracking-wide">
                {footnote}
              </p>
            )}
          </div>

          {image && (
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full relative">
                <div className="absolute inset-0 bg-secondary/30 translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0"></div>
                <ResponsiveImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading={image.loading}
                  data-placeholder={image.src.includes('placehold')}
                  className="absolute inset-0 w-full h-full object-cover z-10 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}