import { Switch, Route, Router as WouterRouter } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";

import Home from "@/pages/Home";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { installLeadClickTracking } from "@/lib/analytics";

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
const PrivateRehabUK = lazy(() => import("@/pages/PrivateRehabUK"));
const RehabCostUK = lazy(() => import("@/pages/RehabCostUK"));
const PremiumTreatmentPage = lazy(() => import("@/pages/PremiumTreatmentPage"));
const SubstanceTreatmentPage = lazy(() => import("@/pages/SubstanceTreatmentPage"));
const FamilyInterventionUK = lazy(() => import("@/pages/FamilyInterventionUK"));
const ProfessionalAddictionSupport = lazy(() => import("@/pages/ProfessionalAddictionSupport"));
const GetHelp = lazy(() => import("@/pages/GetHelp"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const ServicesPricingGuide = lazy(() => import("@/pages/ServicesPricingGuide"));
const RecoveryPlanChecklistLanding = lazy(() => import("@/pages/RecoveryPlanChecklistLanding"));
const RecoveryPlanChecklist = lazy(() => import("@/pages/RecoveryPlanChecklist"));
const CraigBilton = lazy(() => import("@/pages/CraigBilton"));
const DestinationRehab = lazy(() => import("@/pages/DestinationRehab"));
const AddictionHelpCornwall = lazy(() => import("@/pages/AddictionHelpCornwall"));
const AdminApp = lazy(() => import("@/pages/admin/AdminApp"));
const FamilyAddictionImpactSurvey = lazy(() => import("@/pages/research/FamilyAddictionImpactSurvey"));
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("@/pages/legal/CookiePolicy"));
const ClinicalDisclaimer = lazy(() => import("@/pages/legal/ClinicalDisclaimer"));
const EditorialPolicy = lazy(() => import("@/pages/EditorialPolicy"));
const Media = lazy(() => import("@/pages/Media"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

/**
 * Client-side redirect map, mirrors the server-side SERVER_REDIRECTS in vite.config.ts.
 * Handles in-app navigation to old/legacy URLs (belt-and-suspenders alongside server 301s).
 * Trailing slashes are already stripped by useNormalisedLocation before this map is checked.
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
  "/online-recovery-programme":          "/online-programme",
  "/insightos":                          "/insight-os",
  "/online-therapy":                     "/online-programme",
  "/online-recovery":                    "/online-programme",
  "/family-support":                     "/family-addiction-intervention-uk",
  "/family-intervention":                "/family-addiction-intervention-uk",
  "/intervention":                       "/family-addiction-intervention-uk",
  "/rehab":                              "/treatment-placement",
  "/rehabilitation":                     "/treatment-placement",
  "/alcohol-detox":                      "/treatment-placement",
  "/alcohol-treatment":                  "/alcohol-addiction-treatment",
  "/alcohol-addiction":                  "/resources/understanding-alcohol-dependency",
  "/understanding-alcohol-addiction":    "/resources/understanding-alcohol-dependency",
  "/alcohol-dependency":                 "/resources/understanding-alcohol-dependency",
  "/resources/relapse-meaning-addiction-recovery": "/resources/relapse-meaning",
  "/resources/relapse-prevention-plan-what-to-include": "/resources/relapse-prevention-plan",
  "/resources/addiction-warning-signs-relapse-risk": "/resources/addiction-warning-signs",
  "/resources/structured-recovery-support-prevent-relapse": "/resources/how-structured-support-prevents-relapse",
  "/resources/what-does-enabler-mean-in-addiction": "/resources/what-does-enabler-mean",
  "/resources/addiction-intervention-uk": "/resources/how-to-stage-addiction-intervention-uk",
  "/resources/detoxing-from-alcohol-symptoms-when-dangerous": "/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help",
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
  "/blog/family-support":                "/family-addiction-intervention-uk",
};

/**
 * Custom wouter v3 location hook that strips trailing slashes before wouter
 * ever sees the path. This replaces the old `return null` + popstate-dispatch
 * approach which was unreliable because it fired a DOM event during a React
 * render cycle.
 *
 * Behaviour:
 * - wouter always receives the clean path (e.g. "/resources" not "/resources/")
 * - The address bar is silently updated via replaceState after render
 * - replaceState does NOT fire popstate, so there is no re-render loop
 * - No blank screen: the correct page component renders immediately
 */
function useNormalisedLocation(): ReturnType<typeof useBrowserLocation> {
  const [loc, navigate] = useBrowserLocation();

  const normLoc = loc !== "/" && loc.endsWith("/") ? loc.slice(0, -1) : loc;

  // Sync the address bar after render, replaceState, no reload, no popstate
  useEffect(() => {
    if (loc !== normLoc) {
      window.history.replaceState(
        null,
        "",
        normLoc + window.location.search + window.location.hash
      );
    }
  }, [loc, normLoc]);

  return [normLoc, navigate];
}

function Router() {
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem("irn_landing_page")) {
        window.sessionStorage.setItem(
          "irn_landing_page",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    } catch {
      // Source attribution is useful, but should never block the app.
    }
  }, []);

  useEffect(() => installLeadClickTracking(), []);

  // Enforce the custom www host on the bare domain and the public Replit host.
  // Preview hosts (*.replit.dev) remain unaffected.
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "insightrecoverynetwork.com" ||
      window.location.hostname === "insight-recovery-network.replit.app")
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
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/services-pricing-guide" component={ServicesPricingGuide} />
        <Route path="/recovery-plan-checklist" component={RecoveryPlanChecklistLanding} />
        <Route path="/recovery-plan-checklist/checklist" component={RecoveryPlanChecklist} />
        <Route path="/craig-bilton" component={CraigBilton} />
        <Route path="/about-insight-recovery-network" component={AboutInsightRecoveryNetwork} />
        <Route path="/online-addiction-recovery-programme-uk" component={OnlineAddictionRecoveryUK} />
        <Route path="/private-rehab-alternative-uk" component={PrivateRehabAlternativeUK} />
        <Route path="/private-rehab-uk" component={PrivateRehabUK} />
        <Route path="/how-much-does-rehab-cost-uk" component={RehabCostUK} />
        <Route path="/alcohol-addiction-treatment">{() => <SubstanceTreatmentPage slug="alcohol-addiction-treatment" />}</Route>
        <Route path="/cocaine-addiction-treatment">{() => <SubstanceTreatmentPage slug="cocaine-addiction-treatment" />}</Route>
        <Route path="/cannabis-addiction-treatment">{() => <SubstanceTreatmentPage slug="cannabis-addiction-treatment" />}</Route>
        <Route path="/ketamine-addiction-treatment">{() => <SubstanceTreatmentPage slug="ketamine-addiction-treatment" />}</Route>
        <Route path="/benzodiazepine-addiction-treatment">{() => <SubstanceTreatmentPage slug="benzodiazepine-addiction-treatment" />}</Route>
        <Route path="/dual-diagnosis-treatment">{() => <SubstanceTreatmentPage slug="dual-diagnosis-treatment" />}</Route>
        <Route path="/luxury-rehab">{() => <PremiumTreatmentPage slug="luxury-rehab" />}</Route>
        <Route path="/executive-rehab">{() => <PremiumTreatmentPage slug="executive-rehab" />}</Route>
        <Route path="/destination-rehab">{() => <PremiumTreatmentPage slug="destination-rehab" />}</Route>
        <Route path="/addiction-help-cornwall" component={AddictionHelpCornwall} />
        <Route path="/family-addiction-intervention-uk" component={FamilyInterventionUK} />
        <Route path="/confidential-addiction-help-professionals" component={ProfessionalAddictionSupport} />
        <Route path="/get-help" component={GetHelp} />
        <Route path="/private-rehab-thailand">{() => <DestinationRehab slug="private-rehab-thailand" />}</Route>
        <Route path="/private-rehab-south-africa">{() => <DestinationRehab slug="private-rehab-south-africa" />}</Route>
        <Route path="/private-rehab-spain">{() => <DestinationRehab slug="private-rehab-spain" />}</Route>
        <Route path="/private-rehab-sri-lanka">{() => <DestinationRehab slug="private-rehab-sri-lanka" />}</Route>
        {/* Research & Surveys (public, noindex, not in navigation or sitemap) */}
        <Route path="/research/family-addiction-impact-survey-2026" component={FamilyAddictionImpactSurvey} />
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
        <Route path="/editorial-policy" component={EditorialPolicy} />
        <Route path="/media" component={Media} />
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
        <WouterRouter hook={useNormalisedLocation}>
          <Router />
          <WhatsAppFloat />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
