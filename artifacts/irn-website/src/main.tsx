import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

function AppWithReadySignal() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root")!).render(<AppWithReadySignal />);
