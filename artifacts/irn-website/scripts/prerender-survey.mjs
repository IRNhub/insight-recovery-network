/**
 * Post-build pre-render for Research & Surveys pages.
 *
 * Runs after prerender-meta.mjs (see package.json "build"). Generates
 * dist/public/research/<slug>.html from the built index.html so that
 * crawlers see the correct title, description, canonical and – crucially –
 * the `noindex, follow` robots directive in static HTML, without executing
 * JavaScript.
 *
 * Survey pages are deliberately NOT added to sitemap.xml while responses
 * are being collected (prerender-meta.mjs only includes indexable PAGES
 * entries, and survey routes are not among them).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distPublic = resolve(root, "dist/public");

const SITE_URL = "https://www.insightrecoverynetwork.com";

const SURVEY_PAGES = [
  {
    route: "/research/family-addiction-impact-survey-2026",
    file: "research/family-addiction-impact-survey-2026.html",
    title: "UK Family Addiction Impact Survey 2026 | Insight Recovery Network",
    description:
      "An anonymous five-minute survey by Insight Recovery Network exploring how addiction affects families and the barriers to accessing help.",
    // Collecting responses: keep out of the index but let crawlers follow links.
    robots: "noindex, follow",
    body: `<main style="font-family:sans-serif;background:#F6F4F0;color:#162B3B;min-height:60vh;padding:4rem 2rem;"><div style="max-width:700px;margin:0 auto;"><p style="font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;margin-bottom:1rem;">IRN Research 2026</p><h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2.5rem;margin-bottom:1rem;">UK Family Addiction Impact Survey 2026</h1><p style="line-height:1.8;color:#4a5568;">An anonymous five-minute survey to help us better understand how addiction affects families, relationships and access to treatment. Anonymous. Adults aged 18+. Approximately 5 minutes.</p></div></main>`,
  },
];

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectMeta(baseHtml, page) {
  let out = baseHtml;
  const canonicalUrl = `${SITE_URL}${page.route}`;

  out = out.replace(/(<title>)[^<]*(<\/title>)/, `$1${page.title}$2`);
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${esc(page.description)}$2`,
  );
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonicalUrl}$2`,
  );
  if (/<meta\s+name="robots"/.test(out)) {
    out = out.replace(
      /(<meta\s+name="robots"\s+content=")[^"]*(")/,
      `$1${page.robots}$2`,
    );
  } else {
    out = out.replace(
      /<\/title>/,
      `</title>\n    <meta name="robots" content="${page.robots}" />`,
    );
  }
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${page.title}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${esc(page.description)}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonicalUrl}$2`,
  );

  // Static body for non-JS crawlers: inject just inside the root div fallback
  // position – append before closing </body>, matching prerender-meta's
  // approach of providing static content alongside the SPA mount point.
  if (page.body) {
    out = out.replace("</body>", `<noscript>${page.body}</noscript></body>`);
  }

  return out;
}

const baseHtml = readFileSync(resolve(distPublic, "index.html"), "utf-8");

console.log("\n▶  Pre-rendering research survey pages…\n");
for (const page of SURVEY_PAGES) {
  const outPath = resolve(distPublic, page.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, injectMeta(baseHtml, page), "utf-8");
  console.log(`  ✓ ${page.route}  →  ${page.file}  (${page.robots})`);
}
console.log(`\n  Pre-rendered ${SURVEY_PAGES.length} survey page(s).\n`);
