import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import About from "@/pages/About";
import WhatWeOffer from "@/pages/WhatWeOffer";
import TreatmentPlacement from "@/pages/TreatmentPlacement";
import OnlineProgramme from "@/pages/OnlineProgramme";
import InsightOS from "@/pages/InsightOS";
import Contact from "@/pages/Contact";
import ResourcesList from "@/pages/ResourcesList";
import ResourceDetail from "@/pages/ResourceDetail";
import AssessmentsIndex from "@/pages/assessments/AssessmentsIndex";
import AlcoholDetoxAssessment from "@/pages/assessments/AlcoholDetoxAssessment";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function RedirectToHome() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
}

function Router() {
  return (
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
      <Route path="/assessment/alcohol-detox" component={AlcoholDetoxAssessment} />
      <Route path="/suspended" component={RedirectToHome} />
      <Route path="/suspended/" component={RedirectToHome} />
      <Route component={NotFound} />
    </Switch>
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