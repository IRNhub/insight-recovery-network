export interface SharedRouteFaq {
  question: string;
  answer: string;
}

export const routeFaqs: Record<string, SharedRouteFaq[]>;
export function getRouteFaqs(pathname: string): SharedRouteFaq[];
