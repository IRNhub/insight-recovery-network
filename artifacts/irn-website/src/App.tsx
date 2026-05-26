import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const WhatWeOffer = lazy(() => import("@/pages/WhatWeOffer"));
const TreatmentPlacement = lazy(() => import("@/pages/TreatmentPlacement"));
const OnlineProgramme = lazy(() => import("@/pages/OnlineProgramme"));
const InsightOS = lazy(() => import("@/pages/InsightOS"));
const Contact = lazy(() => import("@/pages/Contact"));
const ResourcesList = lazy(() => import("@/pages/ResourcesList"));
const ResourceDetail = lazy(() => import("@/pages/ResourceDetail"));
const AssessmentsIndex = lazy(() => import("@/pages/assessments/AssessmentsIndex"));
const AlcoholDetoxAssessment = lazy(() => import("@/pages/assessments/AlcoholDetoxAssessment"));
const AlcoholUseAssessmentPage = lazy(() => import("@/pages/assessments/AlcoholUseAssessmentPage"));
const DrugUseAssessmentPage = lazy(() => import("@/pages/assessments/DrugUseAssessmentPage"));
const DetoxAssessmentPage = lazy(() => import("@/pages/assessments/DetoxAssessmentPage"));
const AnxietyAssessmentPage = lazy(() => import("@/pages/assessments/AnxietyAssessmentPage"));
const DepressionAssessmentPage = lazy(() => import("@/pages/assessments/DepressionAssessmentPage"));
const AdhdAssessmentPage = lazy(() => import("@/pages/assessments/AdhdAssessmentPage"));
const AboutInsightRecoveryNetwork = lazy(() => import("@/pages/AboutInsightRecoveryNetwork"));
const OnlineAddictionRecoveryUK = lazy(() => import("@/pages/OnlineAddictionRecoveryUK"));
const PrivateRehabAlternativeUK = lazy(() => import("@/pages/PrivateRehabAlternativeUK"));
const AdminApp = lazy(() => import("@/pages/admin/AdminApp"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("@/pages/legal/CookiePolicy"));
const ClinicalDisclaimer = lazy(() => import("@/pages/legal/ClinicalDisclaimer"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

/**
 * Client-side redirect map — mirrors the server-side SERVER_REDIRECTS in vite.config.ts.
 * Handles in-app navigation to old/legacy URLs (belt-and-suspenders alongside server 301s).
 * Trailing slashes are already stripped by the Router function before this map is checked.
 */
const REDIRECT_PATHS: Record<string, string> = {
  // ── Previously handled ────────────────────────────────────────────────
  "/suspended":                          "/",
  "/private-addiction-treatment":        "/treatment-placement",

  // ── Old WordPress page slugs ──────────────────────────────────────────
  "/about-us":                           "/about",
  "/contact-us":                         "/contact",
  "/get-in-touch":                       "/contact",
  "/services":                           "/what-we-offer",
  "/our-services":                       "/what-we-offer",
  "/what-we-do":                         "/what-we-offer",
  "/blog":                               "/resources",
  "/news":                               "/resources",
  "/articles":                           "/resources",
  "/privacy":                            "/privacy-policy",
  "/terms":                              "/terms-of-service",
  "/terms-and-conditions":               "/terms-of-service",
  "/online-therapy":                     "/online-programme",
  "/online-recovery":                    "/online-programme",
  "/family-support":                     "/what-we-offer",
  "/family-intervention":                "/what-we-offer",
  "/intervention":                       "/what-we-offer",
  "/rehab":                              "/treatment-placement",
  "/rehabilitation":                     "/treatment-placement",
  "/alcohol-detox":                      "/treatment-placement",
  "/alcohol-treatment":                  "/treatment-placement",
  "/alcohol-addiction":                  "/resources/understanding-alcohol-dependency",
  "/understanding-alcohol-addiction":    "/resources/understanding-alcohol-dependency",
  "/alcohol-dependency":                 "/resources/understanding-alcohol-dependency",
  "/drug-treatment":                     "/treatment-placement",
  "/drug-detox":                         "/treatment-placement",
  "/drug-rehabilitation":                "/treatment-placement",
  "/drug-addiction":                     "/treatment-placement",
  "/mental-health":                      "/what-we-offer",
  "/mental-health-support":              "/what-we-offer",
  "/self-assessment":                    "/assessments",
  "/addiction-assessment":               "/assessments",
  "/free-assessment":                    "/assessments",
  "/addiction":                          "/what-we-offer",
  "/recovery":                           "/what-we-offer",

  // ── Legacy canonical assessment routes → canonical URLs ───────────────
  "/assessment/alcohol-detox":           "/assessments/alcohol-detox",
  "/assessments/adhd":                   "/assessments/adhd-impulsivity",

  // ── Old WordPress blog post patterns ─────────────────────────────────
  "/blog/alcohol-addiction":             "/resources/understanding-alcohol-dependency",
  "/blog/alcohol-dependency":            "/resources/understanding-alcohol-dependency",
  "/blog/alcohol-detox":                 "/treatment-placement",
  "/blog/drug-addiction":                "/treatment-placement",
  "/blog/drug-treatment":                "/treatment-placement",
  "/blog/rehab":                         "/treatment-placement",
  "/blog/rehabilitation":                "/treatment-placement",
  "/blog/mental-health":                 "/what-we-offer",
  "/blog/online-recovery":               "/online-programme",
  "/blog/family-support":                "/what-we-offer",
};

function Router() {
  // Enforce www canonical — redirect bare domain to www.
  // Only fires on the real production domain, never in dev (*.replit.dev).
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "insightrecoverynetwork.com"
  ) {
    window.location.replace(
      "https://www.insightrecoverynetwork.com" +
        window.location.pathname +
        window.location.search +
        window.location.hash
    );
    return null;
  }

  const rawPath = typeof window !== "undefined" ? window.location.pathname : "";

  // Strip trailing slash from all paths except root "/".
  // IMPORTANT: use history.replaceState + popstate dispatch instead of
  // window.location.replace.  A full-page reload would re-trigger the static
  // server's automatic directory-redirect (/assessments → /assessments/) and
  // create an infinite reload loop on routes that share a name with a
  // sub-page directory (e.g. /assessments, /resources).
  if (rawPath !== "/" && rawPath.endsWith("/")) {
    const clean = rawPath.slice(0, -1);
    window.history.replaceState(
      null,
      "",
      clean + window.location.search + window.location.hash
    );
    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
    return null;
  }

  const redirectTarget = REDIRECT_PATHS[rawPath];
  if (redirectTarget) {
    window.location.replace(redirectTarget);
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/what-we-offer" component={WhatWeOffer} />
        <Route path="/treatment-placement" component={TreatmentPlacement} />
        <Route path="/online-programme" component={OnlineProgramme} />
        <Route path="/insight-os" component={InsightOS} />
        <Route path="/contact" component={Contact} />
        <Route path="/about-insight-recovery-network" component={AboutInsightRecoveryNetwork} />
        <Route path="/online-addiction-recovery-programme-uk" component={OnlineAddictionRecoveryUK} />
        <Route path="/private-rehab-alternative-uk" component={PrivateRehabAlternativeUK} />
        <Route path="/resources" component={ResourcesList} />
        <Route path="/resources/:slug" component={ResourceDetail} />
        <Route path="/assessments" component={AssessmentsIndex} />
        {/* Canonical assessment routes */}
        <Route path="/assessments/alcohol-detox" component={AlcoholDetoxAssessment} />
        <Route path="/assessments/alcohol-use" component={AlcoholUseAssessmentPage} />
        <Route path="/assessments/drug-use" component={DrugUseAssessmentPage} />
        <Route path="/assessments/detox" component={DetoxAssessmentPage} />
        <Route path="/assessments/anxiety" component={AnxietyAssessmentPage} />
        <Route path="/assessments/depression" component={DepressionAssessmentPage} />
        <Route path="/assessments/adhd-impulsivity" component={AdhdAssessmentPage} />
        {/* Legacy routes are handled as client-side 301s in REDIRECT_PATHS above */}
        {/* Legal */}
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/clinical-disclaimer" component={ClinicalDisclaimer} />
        {/* Admin */}
        <Route path="/admin" component={AdminApp} />
        <Route path="/admin/:rest*" component={AdminApp} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
