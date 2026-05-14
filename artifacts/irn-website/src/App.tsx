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
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

const REDIRECT_PATHS: Record<string, string> = {
  "/suspended": "/",
  "/suspended/": "/",
};

function Router() {
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
        {/* Legacy / backward-compat routes */}
        <Route path="/assessment/alcohol-detox" component={AlcoholDetoxAssessment} />
        <Route path="/assessments/adhd" component={AdhdAssessmentPage} />
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
