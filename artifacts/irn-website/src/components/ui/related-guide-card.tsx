import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getArticleBySlug } from "@/data/articles";

interface RelatedGuideCardProps {
  href: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  label?: string;
  sizes?: string;
}

/** Article thumbnails follow the published article's artwork and description. */
export function RelatedGuideCard({ href, title, description, image, imageAlt, label = "Explore the guide", sizes = "(min-width: 1024px) 380px, (min-width: 768px) 45vw, calc(100vw - 48px)" }: RelatedGuideCardProps) {
  const article = href.startsWith("/resources/")
    ? getArticleBySlug(href.slice("/resources/".length))
    : undefined;
  const src = image ?? article?.image;

  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      {src && (
        <div className="aspect-video overflow-hidden bg-secondary">
          <ResponsiveImage
            src={src}
            alt={imageAlt ?? article?.imageAlt ?? ""}
            sizes={sizes}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-serif text-xl leading-snug text-primary md:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
          {label} <ArrowRight className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
