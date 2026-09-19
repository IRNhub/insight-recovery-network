export interface ArticleNextStep {
  heading: string;
  description: string;
  label: string;
  href: string;
  secondaryLabel: string;
  secondaryHref: string;
}
export const articleNextSteps: Partial<Record<string, ArticleNextStep>>;
