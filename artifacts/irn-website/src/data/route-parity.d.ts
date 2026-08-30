export interface RouteFaq {
  question: string;
  answer: string;
}

export interface RouteParityDefinition {
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
  h1: string;
  heroIntro: string;
  primaryCta: {
    href: string;
    label: string;
    analyticsEvent: string;
    sourcePage: string;
    serviceInterest: string;
    location: string;
  };
  service?: {
    name: string;
    serviceType: string;
    description: string;
    areaServed?: unknown;
    offers?: unknown;
  };
  faqs?: RouteFaq[];
  highlights?: string[];
  prerenderSections?: Array<{ heading: string; body: string }>;
}

export const routeParity: Record<string, RouteParityDefinition>;
export const parityRoutes: string[];
export function getRouteParity(pathname: string): RouteParityDefinition;
export function buildRouteSchemas(pathname: string, faqs?: RouteFaq[]): Record<string, unknown>[];
