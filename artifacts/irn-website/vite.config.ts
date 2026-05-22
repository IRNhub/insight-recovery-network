import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// PORT is only required when running the dev/preview server, not during build.
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;
if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// The app is always served at the domain root ("/") — both in production
// (custom domain) and in the Replit dev proxy.  Hard-coding "/" removes
// any dependency on the BASE_PATH env-var and keeps the wouter Router
// base as "" (root) regardless of build mode.
const basePath = "/";

function servePrerenderedHtmlPlugin() {
  function htmlMiddleware(
    req: import("http").IncomingMessage,
    res: import("http").ServerResponse,
    next: () => void,
  ) {
    const pathname = (req.url ?? "/").split("?")[0].split("#")[0];
    if (pathname === "/" || pathname.includes(".") || pathname.startsWith("/api")) {
      return next();
    }
    const clean = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const htmlFile = path.resolve(
      import.meta.dirname,
      "dist/public",
      clean.replace(/^\//, "") + ".html",
    );
    if (fs.existsSync(htmlFile)) {
      const content = fs.readFileSync(htmlFile);
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": content.length,
      });
      res.end(content);
      return;
    }
    next();
  }
  return {
    name: "serve-prerendered-html",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use(htmlMiddleware);
    },
    configurePreviewServer(server: import("vite").PreviewServer) {
      server.middlewares.use(htmlMiddleware);
    },
  };
}

/**
 * Server-side 301 redirect map for legacy and old WordPress URLs.
 * Runs in both the Vite dev server and the production preview server.
 * Keys are normalised (trailing slash stripped, lowercase) before lookup.
 */
const SERVER_REDIRECTS: Record<string, string> = {
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

  // ── Old WordPress blog post patterns (common RankMath slugs) ─────────
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

function serverRedirectsPlugin() {
  function middleware(
    req: import("http").IncomingMessage,
    res: import("http").ServerResponse,
    next: () => void,
  ) {
    const raw = (req.url ?? "").split("?")[0].split("#")[0];
    // Normalise: strip trailing slash (except root), lowercase
    const pathname = raw !== "/" && raw.endsWith("/") ? raw.slice(0, -1) : raw;
    const target = SERVER_REDIRECTS[pathname.toLowerCase()];
    if (target) {
      res.writeHead(301, { Location: target });
      res.end();
      return;
    }
    next();
  }
  return {
    name: "server-redirects",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: import("vite").PreviewServer) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    servePrerenderedHtmlPlugin(),
    serverRedirectsPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
