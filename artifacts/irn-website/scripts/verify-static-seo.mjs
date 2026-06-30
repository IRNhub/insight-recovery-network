import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = resolve(root, "dist/public");
const artifactConfig = resolve(root, ".replit-artifact/artifact.toml");
const siteUrl = "https://www.insightrecoverynetwork.com";

function fail(message) {
  throw new Error(`[static-seo] ${message}`);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, "utf8");
}

const config = read(artifactConfig);
const rewrites = [];
const rewritePattern = /\[\[services\.production\.rewrites\]\]\s*\n\s*from\s*=\s*"([^"]+)"\s*\n\s*to\s*=\s*"([^"]+)"/g;
for (const match of config.matchAll(rewritePattern)) {
  rewrites.push({ from: match[1], to: match[2] });
}

if (rewrites.some((rule) => rule.from === "/*" && rule.to === "/index.html")) {
  fail("Global SPA fallback is present; unknown URLs would become soft 404 homepages.");
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
const homepageTitle = firstMatch(homepage, /<title>([^<]+)<\/title>/, "title", "/");
let checked = 0;

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
  const title = firstMatch(html, /<title>([^<]+)<\/title>/, "title", pathname);
  const canonical = firstMatch(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"/,
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

for (const pathname of ["/treatment-placement", "/online-programme", "/what-we-offer", "/contact"]) {
  const target = targetForPath(pathname);
  const html = read(resolve(dist, target.replace(/^\//, "")));
  if (!/Frequently asked questions|Before you make contact/i.test(html)) {
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

console.log(`✓ Static SEO verification passed for ${checked} sitemap URLs.`);
console.log("✓ Article bodies, canonicals, noindex rules and true-404 routing are consistent.");
