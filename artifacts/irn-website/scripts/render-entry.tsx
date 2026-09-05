import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import Home from "../src/pages/Home";
import GetHelp, { EnquiryPage } from "../src/pages/GetHelp";
import About from "../src/pages/About";

export function renderConversionPages() {
  return Object.fromEntries(
    [
      ["/", <Home />],
      ["/get-help", <GetHelp />],
      ["/contact", <EnquiryPage variant="contact" />],
      ["/about", <About />],
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
