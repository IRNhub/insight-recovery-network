import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SOCIAL_LINKS, type SocialPlatform } from "@/config/social-links.js";

type SocialLinksVariant = "header" | "footer" | "contact";

interface SocialLinksProps {
  variant: SocialLinksVariant;
  showLabels?: boolean;
  className?: string;
}

const SOCIAL_ICONS: Record<SocialPlatform, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
};

const LIST_STYLES: Record<SocialLinksVariant, string> = {
  header: "flex items-center gap-0.5",
  footer: "flex flex-col items-start gap-2",
  contact: "flex flex-wrap items-center gap-3",
};

const LINK_STYLES: Record<SocialLinksVariant, string> = {
  header:
    "inline-flex h-9 w-9 items-center justify-center text-primary transition-[color,transform] duration-200 hover:scale-[1.04] hover:text-[#8A6836] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none",
  footer:
    "inline-flex min-h-10 items-center gap-3 text-sm text-primary-foreground/80 transition-[color,transform] duration-200 hover:scale-[1.02] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transform-none",
  contact:
    "inline-flex min-h-10 items-center gap-3 border border-border bg-background px-4 text-sm font-medium text-primary transition-[color,border-color,transform] duration-200 hover:scale-[1.02] hover:border-[#8A6836] hover:text-[#8A6836] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none",
};

export function SocialLinks({
  variant,
  showLabels = false,
  className = "",
}: SocialLinksProps) {
  return (
    <ul
      className={`${LIST_STYLES[variant]} ${className}`.trim()}
      aria-label="Insight Recovery Network social media"
    >
      {SOCIAL_LINKS.map(({ id, label, url }) => {
        const Icon = SOCIAL_ICONS[id];

        return (
          <li key={id}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Insight Recovery Network on ${label} (opens in a new tab)`}
              className={LINK_STYLES[variant]}
              data-testid={`link-social-${id}-${variant}`}
            >
              <Icon
                aria-hidden="true"
                focusable="false"
                className="h-[1.05rem] w-[1.05rem] shrink-0"
              />
              {showLabels && <span>{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
