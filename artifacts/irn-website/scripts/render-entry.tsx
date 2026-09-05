import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import Home from "../src/pages/Home";
import GetHelp, { EnquiryPage } from "../src/pages/GetHelp";
import About from "../src/pages/About";
import TreatmentPlacement from "../src/pages/TreatmentPlacement";
import FamilyInterventionUK from "../src/pages/FamilyInterventionUK";
import RehabCostUK from "../src/pages/RehabCostUK";
import OnlineProgramme from "../src/pages/OnlineProgramme";

export function renderConversionPages() {
  return Object.fromEntries(
    [
      ["/", <Home />],
      ["/get-help", <GetHelp />],
      ["/contact", <EnquiryPage variant="contact" />],
      ["/about", <About />],
      ["/treatment-placement", <TreatmentPlacement />],
      ["/family-addiction-intervention-uk", <FamilyInterventionUK />],
      ["/how-much-does-rehab-cost-uk", <RehabCostUK />],
      ["/online-programme", <OnlineProgramme />],
    ].map(([route, element]) => [
      route,
      renderToString(
        <HelmetProvider context={{}}>
          <Router ssrPath={route as string}>{element}</Router>
        </HelmetProvider>,
      ),
    ]),
  );
}
