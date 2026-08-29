export interface SubstanceTreatmentPage {
  slug: string;
  route: string;
  title: string;
  fullTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  ogImage: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  urgentNote: string;
  summary: { who: string; problem: string; applies: string; nextStep: string };
  highlights: Array<{ title: string; body: string }>;
  sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }>;
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
  sources: Array<[string, string]>;
  cta: {
    heading: string;
    description: string;
    primary: [string, string];
    secondary: [string, string];
  };
}

export const SUBSTANCE_TREATMENT_REVIEW_DATE: string;
export const substanceTreatmentPages: SubstanceTreatmentPage[];
export function getSubstanceTreatmentPage(slug: string): SubstanceTreatmentPage | undefined;
