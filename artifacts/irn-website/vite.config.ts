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

/**
 * Sets Cache-Control response headers:
 * - /assets/*   → immutable (Vite content-hashed files)
 * - HTML, sitemap, robots → no-store (always revalidate)
 * - everything else → 1-hour public cache
 */
function cacheControlPlugin() {
  function middleware(
    req: import("http").IncomingMessage,
    res: import("http").ServerResponse,
    next: () => void,
  ) {
    const pathname = (req.url ?? "/").split("?")[0];
    if (/^\/assets\//.test(pathname)) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    } else if (
      pathname === "/" ||
      pathname.endsWith(".html") ||
      pathname === "/sitemap.xml" ||
      pathname === "/robots.txt"
    ) {
      res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
    } else {
      res.setHeader("cache-control", "public, max-age=3600");
    }
    next();
  }
  return {
    name: "cache-control",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: import("vite").PreviewServer) {
      server.middlewares.use(middleware);
    },
  };
}

/**
 * Serves pre-compressed (.br / .gz) static assets in preview mode.
 *
 * Intercepts requests for compressible files in dist/public/ and sends
 * the matching .br or .gz variant (created by scripts/compress-assets.mjs)
 * with the correct Content-Encoding and Vary headers.
 *
 * Only registered in configurePreviewServer — in dev mode, /assets/* are
 * served by Vite's own transform pipeline from source, so we must not
 * shadow them with pre-built files.  The homepage (/) is also handled
 * here so sirv serves the compressed dist/public/index.html in preview.
 */
function serveCompressedStaticPlugin() {
  const MIME: Record<string, string> = {
    ".js":          "application/javascript; charset=utf-8",
    ".mjs":         "application/javascript; charset=utf-8",
    ".css":         "text/css; charset=utf-8",
    ".json":        "application/json; charset=utf-8",
    ".xml":         "application/xml; charset=utf-8",
    ".svg":         "image/svg+xml; charset=utf-8",
    ".txt":         "text/plain; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".html":        "text/html; charset=utf-8",
  };

  function middleware(
    req: import("http").IncomingMessage,
    res: import("http").ServerResponse,
    next: () => void,
  ) {
    const pathname = (req.url ?? "/").split("?")[0];

    // Resolve the disk path: "/" → index.html, others by pathname.
    const diskPath =
      pathname === "/"
        ? path.join(import.meta.dirname, "dist/public", "index.html")
        : path.join(import.meta.dirname, "dist/public", pathname);

    const ext = path.extname(diskPath).toLowerCase();
    const mime = MIME[ext];
    if (!mime || !fs.existsSync(diskPath)) return next();

    const ae = (req.headers["accept-encoding"] as string) ?? "";
    const useBr = /\bbr\b/.test(ae);
    const useGz = /\bgzip\b/.test(ae);

    let serveFile = "";
    let encoding = "";
    if (useBr && fs.existsSync(diskPath + ".br")) {
      serveFile = diskPath + ".br";
      encoding  = "br";
    } else if (useGz && fs.existsSync(diskPath + ".gz")) {
      serveFile = diskPath + ".gz";
      encoding  = "gzip";
    }

    if (!serveFile) return next(); // no pre-compressed version; let sirv handle

    const content = fs.readFileSync(serveFile);
    res.writeHead(200, {
      "Content-Type":     mime,
      "Content-Encoding": encoding,
      "Content-Length":   content.length,
      "Vary":             "Accept-Encoding",
    });
    res.end(content);
  }

  return {
    name: "serve-compressed-static",
    // Preview only — dev mode must use Vite's transform pipeline for source assets.
    configurePreviewServer(server: import("vite").PreviewServer) {
      server.middlewares.use(middleware);
    },
  };
}

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
      const ae = (req.headers["accept-encoding"] as string) ?? "";
      const useBr = /\bbr\b/.test(ae);
      const useGz = /\bgzip\b/.test(ae);

      let serveFile = htmlFile;
      let encoding = "";
      if (useBr && fs.existsSync(htmlFile + ".br")) {
        serveFile = htmlFile + ".br";
        encoding  = "br";
      } else if (useGz && fs.existsSync(htmlFile + ".gz")) {
        serveFile = htmlFile + ".gz";
        encoding  = "gzip";
      }

      const content = fs.readFileSync(serveFile);
      const headers: Record<string, string | number> = {
        "Content-Type":   "text/html; charset=utf-8",
        "Content-Length": content.length,
        "Vary":           "Accept-Encoding",
      };
      if (encoding) headers["Content-Encoding"] = encoding;

      res.writeHead(200, headers);
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
    // Redirect non-www to www (canonical domain enforcement).
    // Strips port from Host so localhost dev is unaffected.
    const host = (req.headers.host ?? "").replace(/:\d+$/, "");
    if (host === "insightrecoverynetwork.com") {
      const proto =
        (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
      res.writeHead(301, {
        Location: `${proto}://www.insightrecoverynetwork.com${req.url}`,
      });
      res.end();
      return;
    }

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
    serverRedirectsPlugin(),
    cacheControlPlugin(),
    serveCompressedStaticPlugin(),
    servePrerenderedHtmlPlugin(),
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
