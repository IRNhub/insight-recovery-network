import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = resolve(root, "dist/public");
const artifactConfig = resolve(root, ".replit-artifact/artifact.toml");
const siteUrl = "https://www.insightrecoverynetwork.com";
const textExtensions = new Set([".html", ".js", ".mjs", ".ts", ".tsx", ".txt", ".xml", ".svg", ".toml"]);
const emDash = String.fromCodePoint(0x2014);

function fail(message) {
  throw new Error(`[static-seo] ${message}`);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, "utf8");
}

function assertNoEmDashes(directory) {
  for (const entry of readdirSync(directory)) {
    if (entry === "dist" || entry === "node_modules") continue;
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) {
      assertNoEmDashes(path);
      continue;
    }
    const extension = entry.slice(entry.lastIndexOf("."));
    if (!textExtensions.has(extension)) continue;
    if (readFileSync(path, "utf8").includes(emDash)) {
      fail(`Em dash found in ${path}. Use natural sentence punctuation instead.`);
    }
  }
}

assertNoEmDashes(root);

const config = read(artifactConfig);
if (/\bserve\s*=\s*["']static["']/.test(config)) {
  fail("Static production serving bypasses the non-www host redirect middleware.");
}
const hasProductionServe =
  /\[services\.production\.run\][\s\S]*?args\s*=\s*\[[^\]]*["']run["'][^\]]*["']serve["']/.test(config);
if (!hasProductionServe) {
  fail("Production must run the website serve script so canonical host redirects execute.");
}
const rewrites = [];
const rewritePattern = /\[\[services\.production\.rewrites\]\]\s*\n\s*from\s*=\s*"([^"]+)"\s*\n\s*to\s*=\s*"([^"]+)"/g;
for (const match of config.matchAll(rewritePattern)) {
  rewrites.push({ from: match[1], to: match[2] });
}

if (rewrites.some((rule) => rule.from === "/*" && rule.to === "/index.html")) {
  fail("Global SPA fallback is present; unknown URLs would become soft 404 homepages.");
}
const trailingSlashRewrites = rewrites.filter(
  (rule) => rule.from !== "/" && rule.from.endsWith("/"),
);
if (trailingSlashRewrites.length) {
  fail(`Trailing-slash rewrites bypass canonical 301 handling: ${trailingSlashRewrites.map((rule) => rule.from).join(", ")}`);
}

function targetForPath(pathname) {
  if (pathname === "/") return "/index.html";

  for (const rule of rewrites) {
    if (!rule.from.includes("*")) {
      if (rule.from === pathname) return rule.to;
      continue;
    }

    const prefix = rule.from.slice(0, -1);
    if (!pathname.startsWith(prefix)) continue;
    const wildcard = pathname.slice(prefix.length);
    return rule.to.replace("*", wildcard);
  }

  return null;
}

function firstMatch(html, pattern, label, pathname) {
  const match = html.match(pattern);
  if (!match) fail(`${pathname} has no ${label}.`);
  return match[1];
}

const sitemap = read(resolve(dist, "sitemap.xml"));
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urls.length) fail("Sitemap contains no URLs.");

const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);
if (duplicateUrls.length) fail(`Sitemap contains duplicate URLs: ${[...new Set(duplicateUrls)].join(", ")}`);

const homepage = read(resolve(dist, "index.html"));
const homepageTitle = firstMatch(homepage, /<title(?:\s[^>]*)?>([^<]+)<\/title>/, "title", "/");
let checked = 0;
const htmlByPath = new Map();

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== siteUrl) fail(`Non-canonical sitemap origin: ${url}`);

  const pathname = parsed.pathname;
  const target = targetForPath(pathname);
  if (!target) fail(`${pathname} has no production rewrite or static target.`);
  if (pathname.startsWith("/resources/") && !rewrites.some((rule) => rule.from === pathname)) {
    fail(`${pathname} needs an explicit Replit rewrite; wildcard target substitution is unsupported.`);
  }

  const targetPath = resolve(dist, target.replace(/^\//, ""));
  const html = read(targetPath);
  htmlByPath.set(pathname, html);
  const title = firstMatch(html, /<title(?:\s[^>]*)?>([^<]+)<\/title>/, "title", pathname);
  const canonical = firstMatch(
    html,
    /<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="([^"]+)")[^>]*>/,
    "canonical link",
    pathname,
  );
  const robots = firstMatch(
    html,
    /<meta\s+name="robots"\s+content="([^"]+)"/,
    "robots meta tag",
    pathname,
  );

  if (canonical !== `${siteUrl}${pathname}`) {
    fail(`${pathname} canonical is ${canonical}, expected ${siteUrl}${pathname}.`);
  }
  if (/noindex/i.test(robots)) fail(`${pathname} is in the sitemap but marked noindex.`);
  if (pathname !== "/" && title === homepageTitle) {
    fail(`${pathname} still uses the homepage title.`);
  }
  if (pathname.startsWith("/resources/") && !html.includes("<article>")) {
    fail(`${pathname} does not contain a statically rendered article body.`);
  }

  checked += 1;
}

const treatmentPaths = [
  "/alcohol-addiction-treatment",
  "/cocaine-addiction-treatment",
  "/cannabis-addiction-treatment",
  "/ketamine-addiction-treatment",
  "/benzodiazepine-addiction-treatment",
  "/dual-diagnosis-treatment",
];

for (const pathname of treatmentPaths) {
  const html = htmlByPath.get(pathname);
  if (!html) fail(`New treatment guide is missing from sitemap: ${pathname}`);
  const words = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 850) fail(`${pathname} static body is too light for a YMYL decision page (${words} words).`);
  for (const schemaType of ["WebPage", "Service", "BreadcrumbList", "FAQPage"]) {
    if (!html.includes(`\"@type\":\"${schemaType}\"`)) {
      fail(`${pathname} is missing ${schemaType} JSON-LD.`);
    }
  }
  for (const requiredText of [
    "not a regulated healthcare provider",
    "does not diagnose",
    "does not",
    "Clinical sources and review",
    "Craig Bilton",
  ]) {
    if (!html.toLowerCase().includes(requiredText.toLowerCase())) {
      fail(`${pathname} is missing clinical/trust content: ${requiredText}`);
    }
  }
}

const pillarLinks = {
  "/resources/understanding-alcohol-dependency": "/alcohol-addiction-treatment",
  "/resources/cocaine-addiction": "/cocaine-addiction-treatment",
  "/resources/cannabis-addiction": "/cannabis-addiction-treatment",
  "/resources/ketamine-addiction": "/ketamine-addiction-treatment",
  "/resources/benzodiazepine-addiction": "/benzodiazepine-addiction-treatment",
  "/resources/dual-diagnosis": "/dual-diagnosis-treatment",
};
for (const [pillar, treatment] of Object.entries(pillarLinks)) {
  const html = htmlByPath.get(pillar);
  if (!html?.includes(`href=\"${treatment}\"`)) {
    fail(`${pillar} does not link to its treatment guide ${treatment}.`);
  }
}

const resourceHub = htmlByPath.get("/resources");
for (const pathname of htmlByPath.keys()) {
  if (pathname.startsWith("/resources/") && !resourceHub?.includes(`href=\"${pathname}\"`)) {
    fail(`Resource hub raw HTML does not link to ${pathname}.`);
  }
}

const inboundLinks = new Map([...htmlByPath.keys()].map((pathname) => [pathname, new Set()]));
for (const [source, html] of htmlByPath) {
  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    if (!match[1].startsWith("/") || match[1].startsWith("//")) continue;
    let target = match[1].split(/[?#]/)[0];
    if (target !== "/" && target.endsWith("/")) target = target.slice(0, -1);
    if (inboundLinks.has(target) && target !== source) inboundLinks.get(target).add(source);
  }
}
const orphaned = [...inboundLinks.entries()]
  .filter(([pathname, sources]) => pathname !== "/" && sources.size === 0)
  .map(([pathname]) => pathname);
if (orphaned.length) {
  fail(`Sitemap pages orphaned in raw HTML: ${orphaned.join(", ")}`);
}

for (const utilityPath of [
  "/services-pricing-guide",
  "/thank-you",
  "/recovery-plan-checklist/checklist",
  "/get-help",
  "/admin",
]) {
  const target = targetForPath(utilityPath);
  if (!target) fail(`Required utility route is unmapped: ${utilityPath}`);
  const html = read(resolve(dist, target.replace(/^\//, "")));
  if (!/noindex, nofollow/i.test(html)) fail(`${utilityPath} must be noindex, nofollow.`);
}

const conversionPriorityPaths = [
  "/treatment-placement",
  "/private-rehab-uk",
  "/private-rehab-alternative-uk",
  "/online-programme",
  "/what-we-offer",
  "/contact",
  "/private-rehab-south-africa",
  "/private-rehab-spain",
  "/private-rehab-thailand",
  "/private-rehab-sri-lanka",
  "/luxury-rehab",
  "/executive-rehab",
  "/destination-rehab",
  ...treatmentPaths,
];

for (const pathname of conversionPriorityPaths) {
  const target = targetForPath(pathname);
  if (!target) fail(`Priority conversion route is unmapped: ${pathname}`);
  const html = read(resolve(dist, target.replace(/^\//, "")));
  for (const requiredText of [
    "Who this is for",
    "What it helps solve",
    "Where it applies",
    "Book a confidential call",
    "Craig Bilton",
    "not a regulated healthcare provider",
  ]) {
    if (!html.toLowerCase().includes(requiredText.toLowerCase())) {
      fail(`${pathname} is missing conversion/trust content: ${requiredText}`);
    }
  }
}

for (const pathname of [
  "/treatment-placement",
  "/online-programme",
  "/what-we-offer",
  "/contact",
  "/luxury-rehab",
  "/executive-rehab",
  "/destination-rehab",
]) {
  const target = targetForPath(pathname);
  const html = read(resolve(dist, target.replace(/^\//, "")));
  if (!/Frequently asked questions|Before you make contact|Questions about/i.test(html)) {
    fail(`${pathname} is missing a visible FAQ section.`);
  }
}

const notFound = read(resolve(dist, "404.html"));
if (!/noindex, nofollow/i.test(notFound)) fail("404.html must be noindex, nofollow.");
if (!/Page Not Found/i.test(notFound)) fail("404.html does not contain a clear not-found title.");
if (targetForPath("/this-route-must-not-exist") !== null) {
  fail("An arbitrary unknown path still matches a production rewrite.");
}

const privateGuide = read(resolve(dist, "services-pricing-guide.html"));
if (!/noindex, nofollow/i.test(privateGuide)) fail("Private pricing guide must remain noindex.");
if (sitemap.includes(`${siteUrl}/services-pricing-guide</loc>`)) {
  fail("Private noindex pricing guide must not appear in the sitemap.");
}

const robotsTxt = read(resolve(dist, "robots.txt"));
if (!/User-agent:\s*OAI-SearchBot\s*\nAllow:\s*\//i.test(robotsTxt)) {
  fail("robots.txt does not explicitly allow OAI-SearchBot.");
}
const robotsSitemaps = [...robotsTxt.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)]
  .map((match) => match[1]);
if (robotsSitemaps.length !== 1 || robotsSitemaps[0] !== `${siteUrl}/sitemap.xml`) {
  fail(`robots.txt must reference only ${siteUrl}/sitemap.xml.`);
}

console.log(`✓ Static SEO verification passed for ${checked} sitemap URLs.`);
console.log("✓ Article bodies, canonicals, noindex rules and true-404 routing are consistent.");
