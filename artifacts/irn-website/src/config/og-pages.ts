/**
 * Single source of truth for page OG image configuration.
 *
 * Both the build-time generator (`scripts/generate-og-images.ts`) and the
 * individual page components import from here so title and filename changes
 * automatically propagate to both the generated PNG and the <SEO> tag.
 */

export interface OgPageConfig {
  /** Route path, used to look up a page's config */
  path: string;
  /** Output filename in public/, e.g. "og-home.png" */
  file: string;
  /**
   * Large headline rendered in the OG image.
   * Also used as the page <title> unless `seoTitle` is set.
   */
  title: string;
  /**
   * Optional subtitle shown beneath the gold rule in the OG image.
   * Not included in the HTML <title> tag.
   */
  subtitle?: string;
  /**
   * Override the HTML <title> when it should read differently from
   * the OG image headline (e.g. longer / with subtitle appended).
   * Falls back to `title` when omitted.
   */
  seoTitle?: string;
}

export const OG_PAGES: OgPageConfig[] = [
  {
    path: "/",
    file: "og-home.png",
    title: "Private Addiction Recovery Support",
  },
  {
    path: "/about",
    file: "og-about.png",
    title: "About Insight Recovery Network",
  },
  {
    path: "/contact",
    file: "og-contact.png",
    title: "Speak Confidentially",
    seoTitle: "Contact Us | Speak Confidentially",
  },
  {
    path: "/treatment-placement",
    file: "og-treatment-placement.png",
    title: "Private Rehab Placement",
    subtitle: "UK & International",
    seoTitle: "Private Rehab Placement | UK & International",
  },
  {
    path: "/online-programme",
    file: "og-online-programme.png",
    title: "Online Addiction Recovery Programme",
  },
  {
    path: "/insight-os",
    file: "og-insight-os.png",
    title: "Insight OS",
    subtitle: "The Operating System for Your Recovery",
    seoTitle: "Insight OS: The Operating System for Your Recovery",
  },
  {
    path: "/what-we-offer",
    file: "og-what-we-offer.png",
    title: "Addiction Counselling & Recovery Services",
    subtitle: "Insight Recovery Network",
    seoTitle: "Addiction Counselling & Recovery Services",
  },
  {
    path: "/assessments",
    file: "og-assessments.png",
    title: "Free Confidential Assessments",
    subtitle: "Addiction & Mental Health",
    seoTitle: "Free Confidential Addiction & Mental Health Assessments",
  },
  {
    path: "/resources",
    file: "og-resources.png",
    title: "Recovery Resources",
    subtitle: "Addiction & Mental Health Articles",
    seoTitle: "Addiction & Mental Health Recovery Resources",
  },
];

const SITE_BASE_URL = "https://www.insightrecoverynetwork.com";

/** Absolute URL for a page's OG image, ready to pass to <SEO ogImage={}> */
export function ogImageUrl(file: string): string {
  return `${SITE_BASE_URL}/${file}`;
}

/** Find the OG config for a given route path */
export function getOgConfig(path: string): OgPageConfig | undefined {
  return OG_PAGES.find((p) => p.path === path);
}
