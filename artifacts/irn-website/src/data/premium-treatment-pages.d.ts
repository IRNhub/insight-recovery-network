export interface PremiumTreatmentPage {
  slug: string;
  route: string;
  title: string;
  fullTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  summary: {
    who: string;
    problem: string;
    applies: string;
    nextStep: string;
  };
  highlights: Array<{ title: string; body: string }>;
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  comparison: {
    title: string;
    introduction: string;
    columns: [string, string, string];
    rows: Array<[string, string, string]>;
  };
  process: Array<[string, string]>;
  transparency: string;
  faqs: Array<[string, string]>;
  relatedLinks: Array<[string, string, string]>;
  cta: {
    heading: string;
    description: string;
    primary: [string, string];
    secondary: [string, string];
  };
}

export const PREMIUM_TREATMENT_REVIEW_DATE: string;
export const premiumTreatmentPages: PremiumTreatmentPage[];
export function getPremiumTreatmentPage(slug: string): PremiumTreatmentPage | undefined;
