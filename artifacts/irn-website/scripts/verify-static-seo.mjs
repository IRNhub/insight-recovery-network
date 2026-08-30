import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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

function tagAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([:@\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return attributes;
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
const pathsByTitle = new Map();
const pathsByDescription = new Map();

function recordUniqueValue(index, value, pathname) {
  const paths = index.get(value) ?? [];
  paths.push(pathname);
  index.set(value, paths);
}

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
  const description = firstMatch(
    html,
    /<meta\b(?=[^>]*\bname="description")(?=[^>]*\bcontent="([^"]+)")[^>]*>/,
    "meta description",
    pathname,
  );
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
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) fail(`${pathname} has ${h1Count} H1 elements; expected exactly one.`);

  recordUniqueValue(pathsByTitle, title.trim().toLowerCase(), pathname);
  recordUniqueValue(pathsByDescription, description.trim().toLowerCase(), pathname);

  checked += 1;
}

for (const [label, index] of [
  ["title", pathsByTitle],
  ["meta description", pathsByDescription],
]) {
  const duplicates = [...index.entries()].filter(([, paths]) => paths.length > 1);
  if (duplicates.length) {
    fail(
      `Duplicate ${label} values found: ${duplicates
        .map(([, paths]) => paths.join(" and "))
        .join("; ")}`,
    );
  }
}

const treatmentPaths = [
  "/alcohol-addiction-treatment",
  "/cocaine-addiction-treatment",
  "/cannabis-addiction-treatment",
  "/ketamine-addiction-treatment",
  "/benzodiazepine-addiction-treatment",
  "/prescription-drug-addiction-treatment",
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

const treatmentVisuals = {
  "/alcohol-addiction-treatment": {
    hero: "/alcohol-addiction-treatment-uk-hero.webp",
    alt: "Adult preparing walking shoes and a bag for a structured recovery morning.",
    og: "/alcohol-addiction-treatment-uk-og.webp",
  },
  "/cocaine-addiction-treatment": {
    hero: "/cocaine-addiction-treatment-uk-hero.webp",
    alt: "Adult tying running shoes beside a wet community athletics track.",
    og: "/cocaine-addiction-treatment-uk-og.webp",
  },
  "/cannabis-addiction-treatment": {
    hero: "/cannabis-addiction-treatment-uk-hero.webp",
    alt: "Adult preparing to start the day beside a made bed and home workspace.",
    og: "/cannabis-addiction-treatment-uk-og.webp",
  },
  "/ketamine-addiction-treatment": {
    hero: "/ketamine-addiction-treatment-uk-hero.webp",
    alt: "Adult leaving a community health centre after a planned medical appointment.",
    og: "/ketamine-addiction-treatment-uk-og.webp",
  },
  "/benzodiazepine-addiction-treatment": {
    hero: "/benzodiazepine-addiction-treatment-uk-hero.webp",
    alt: "Adult reviewing an unlabelled appointment card with a healthcare professional in a community pharmacy.",
    og: "/benzodiazepine-addiction-treatment-uk-og.webp",
  },
  "/dual-diagnosis-treatment": {
    hero: "/dual-diagnosis-treatment-uk-hero.webp",
    alt: "Adult walking with two support professionals in a community wellbeing centre courtyard.",
    og: "/dual-diagnosis-treatment-uk-og.webp",
  },
  "/prescription-drug-addiction-treatment": {
    hero: "/prescription-drug-addiction-treatment-uk-hero.webp",
    alt: "Adult preparing an unlabelled medicine box and notebook for a medication review at home.",
    og: "/prescription-drug-addiction-treatment-uk-og.webp",
  },
  "/treatment-placement": {
    hero: "/treatment-placement-navigation-hero.webp",
    alt: "Adult standing where two coastal footpaths divide.",
    og: "/treatment-placement-navigation-og.webp",
  },
};

for (const [pathname, visual] of Object.entries(treatmentVisuals)) {
  const html = htmlByPath.get(pathname);
  const imageTag = [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => tagAttributes(tag).src === visual.hero);
  if (!imageTag) {
    fail(`${pathname} has no visibly rendered masthead hero; an OG image alone is not sufficient.`);
  }
  const image = tagAttributes(imageTag);
  if (image.alt !== visual.alt) fail(`${pathname} hero ALT does not match the approved literal description.`);
  if (image.width !== "1600" || image.height !== "900") fail(`${pathname} hero lacks 1600x900 intrinsic dimensions.`);
  if (image.loading !== "eager" || image.fetchpriority !== "high") fail(`${pathname} above-the-fold hero lacks eager loading or high fetch priority.`);
  if (!image.sizes) fail(`${pathname} hero has no responsive sizes attribute.`);

  const heroPath = resolve(dist, visual.hero.slice(1));
  const ogPath = resolve(dist, visual.og.slice(1));
  const heroMetadata = await sharp(heroPath).metadata();
  const ogMetadata = await sharp(ogPath).metadata();
  if (heroMetadata.format !== "webp" || heroMetadata.width !== 1600 || heroMetadata.height !== 900) {
    fail(`${pathname} hero asset is not a 1600x900 WebP.`);
  }
  if (ogMetadata.format !== "webp" || ogMetadata.width !== 1200 || ogMetadata.height !== 630) {
    fail(`${pathname} OG asset is not a 1200x630 WebP.`);
  }
  if (statSync(heroPath).size > 200 * 1024) fail(`${pathname} hero exceeds the 200 KB performance ceiling.`);
  if (statSync(ogPath).size > 120 * 1024) fail(`${pathname} OG image exceeds the 120 KB performance ceiling.`);

  const ogImage = firstMatch(
    html,
    /<meta\b(?=[^>]*\bproperty="og:image")(?=[^>]*\bcontent="([^"]+)")[^>]*>/,
    "Open Graph image",
    pathname,
  );
  if (ogImage !== `${siteUrl}${visual.og}`) fail(`${pathname} does not use its dedicated OG image.`);
  if (!html.includes(`\"@type\":\"ImageObject\"`)) fail(`${pathname} is missing ImageObject JSON-LD for its visible hero.`);
}

const batchTwoResourcePaths = [
  "/resources/addiction-detox-uk",
  "/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help",
  "/resources/benzodiazepine-withdrawal",
  "/resources/opioid-detox",
  "/resources/cocaine-withdrawal",
  "/resources/ketamine-withdrawal",
  "/resources/detox-vs-rehab",
];

for (const pathname of batchTwoResourcePaths) {
  const html = htmlByPath.get(pathname);
  if (!html) fail(`Batch 2 detox or withdrawal guide is missing from sitemap: ${pathname}`);
  const words = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 900) fail(`${pathname} static body is too light for a YMYL withdrawal decision page (${words} words).`);
  for (const schemaType of ["Article", "MedicalWebPage", "BreadcrumbList", "FAQPage"]) {
    if (!html.includes(`\"@type\":\"${schemaType}\"`)) {
      fail(`${pathname} is missing ${schemaType} JSON-LD.`);
    }
  }
  for (const requiredText of [
    "not a regulated healthcare provider",
    "does not",
    "999",
    "Sources and further reading",
    "Craig Bilton",
  ]) {
    if (!html.toLowerCase().includes(requiredText.toLowerCase())) {
      fail(`${pathname} is missing clinical/trust content: ${requiredText}`);
    }
  }
  if (!/href="https:\/\/(?:www\.)?(?:nice\.org\.uk|nhs\.uk|gov\.uk)|href="https:\/\/www\.nhs\.uk/.test(html)) {
    fail(`${pathname} does not expose an authoritative NICE, NHS or GOV.UK source link.`);
  }
}

const batchThreeResourceVisuals = {
  "/resources/cannabis-withdrawal": {
    hero: "/cannabis-withdrawal-uk-hero.webp",
    alt: "Adult filling a glass of water beside an open kitchen window in the early morning.",
    og: "/cannabis-withdrawal-uk-og.webp",
  },
  "/resources/how-quickly-can-someone-enter-rehab": {
    hero: "/how-quickly-enter-private-rehab-uk-hero.webp",
    alt: "Adult holding house keys during a phone conversation beside a front window.",
    og: "/how-quickly-enter-private-rehab-uk-og.webp",
  },
  "/resources/28-day-vs-90-day-rehab": {
    hero: "/28-day-vs-longer-rehab-uk-hero.webp",
    alt: "Two adults preparing vegetables and crockery together in a communal kitchen.",
    og: "/28-day-vs-longer-rehab-uk-og.webp",
  },
};

for (const [pathname, visual] of Object.entries(batchThreeResourceVisuals)) {
  const html = htmlByPath.get(pathname);
  if (!html) fail(`Batch 3 resource guide is missing from sitemap: ${pathname}`);
  const words = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 900) fail(`${pathname} static body is too light for a decision guide (${words} words).`);
  for (const schemaType of ["Article", "MedicalWebPage", "BreadcrumbList", "FAQPage", "ImageObject"]) {
    if (!html.includes(`\"@type\":\"${schemaType}\"`)) {
      fail(`${pathname} is missing ${schemaType} JSON-LD.`);
    }
  }
  for (const requiredText of [
    "not a regulated healthcare provider",
    "does not",
    "Sources and further reading",
    "Craig Bilton",
  ]) {
    if (!html.toLowerCase().includes(requiredText.toLowerCase())) {
      fail(`${pathname} is missing clinical or trust content: ${requiredText}`);
    }
  }
  if (!/href="https:\/\/(?:www\.)?(?:nice\.org\.uk|nhs\.uk|gov\.uk|cqc\.org\.uk)|href="https:\/\/www\.nhs\.uk/.test(html)) {
    fail(`${pathname} does not expose an authoritative NICE, NHS, GOV.UK or CQC source link.`);
  }

  const imageTag = [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => tagAttributes(tag).src === visual.hero);
  if (!imageTag) fail(`${pathname} has no visible hero; an OG image alone is not sufficient.`);
  const image = tagAttributes(imageTag);
  if (image.alt !== visual.alt) fail(`${pathname} hero ALT does not match the approved literal description.`);
  if (image.width !== "1600" || image.height !== "900") fail(`${pathname} hero lacks 1600x900 intrinsic dimensions.`);
  if (image.loading !== "eager" || image.fetchpriority !== "high") fail(`${pathname} above-the-fold hero lacks eager loading or high fetch priority.`);
  if (!image.sizes) fail(`${pathname} hero has no responsive sizes attribute.`);

  const heroPath = resolve(dist, visual.hero.slice(1));
  const ogPath = resolve(dist, visual.og.slice(1));
  const heroMetadata = await sharp(heroPath).metadata();
  const ogMetadata = await sharp(ogPath).metadata();
  if (heroMetadata.format !== "webp" || heroMetadata.width !== 1600 || heroMetadata.height !== 900) {
    fail(`${pathname} hero asset is not a 1600x900 WebP.`);
  }
  if (ogMetadata.format !== "webp" || ogMetadata.width !== 1200 || ogMetadata.height !== 630) {
    fail(`${pathname} OG asset is not a 1200x630 WebP.`);
  }
  if (statSync(heroPath).size > 200 * 1024) fail(`${pathname} hero exceeds the 200 KB performance ceiling.`);
  if (statSync(ogPath).size > 120 * 1024) fail(`${pathname} OG image exceeds the 120 KB performance ceiling.`);
  const ogImage = firstMatch(
    html,
    /<meta\b(?=[^>]*\bproperty="og:image")(?=[^>]*\bcontent="([^"]+)")[^>]*>/,
    "Open Graph image",
    pathname,
  );
  if (ogImage !== `${siteUrl}${visual.og}`) fail(`${pathname} does not use its dedicated OG image.`);
}

const batchThreeReciprocalLinks = [
  ["/resources/prescription-drug-addiction", "/prescription-drug-addiction-treatment"],
  ["/prescription-drug-addiction-treatment", "/resources/prescription-drug-addiction"],
  ["/prescription-drug-addiction-treatment", "/resources/benzodiazepine-withdrawal"],
  ["/prescription-drug-addiction-treatment", "/resources/opioid-detox"],
  ["/resources/cannabis-addiction", "/resources/cannabis-withdrawal"],
  ["/resources/cannabis-withdrawal", "/cannabis-addiction-treatment"],
  ["/cannabis-addiction-treatment", "/resources/cannabis-withdrawal"],
  ["/treatment-placement", "/resources/how-quickly-can-someone-enter-rehab"],
  ["/treatment-placement", "/resources/28-day-vs-90-day-rehab"],
  ["/resources/how-to-choose-private-rehab-centre-uk", "/resources/how-quickly-can-someone-enter-rehab"],
  ["/resources/how-to-choose-private-rehab-centre-uk", "/resources/28-day-vs-90-day-rehab"],
  ["/how-much-does-rehab-cost-uk", "/resources/28-day-vs-90-day-rehab"],
];
for (const [source, target] of batchThreeReciprocalLinks) {
  if (!htmlByPath.get(source)?.includes(`href=\"${target}\"`)) {
    fail(`${source} does not link to its Batch 3 cluster page ${target}.`);
  }
}

const batchTwoReciprocalLinks = [
  ["/resources/prescription-drug-addiction", "/resources/benzodiazepine-withdrawal"],
  ["/resources/prescription-drug-addiction", "/resources/opioid-detox"],
  ["/resources/understanding-alcohol-dependency", "/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help"],
  ["/resources/benzodiazepine-addiction", "/resources/benzodiazepine-withdrawal"],
  ["/resources/cocaine-addiction", "/resources/cocaine-withdrawal"],
  ["/resources/ketamine-addiction", "/resources/ketamine-withdrawal"],
  ["/benzodiazepine-addiction-treatment", "/resources/benzodiazepine-withdrawal"],
  ["/cocaine-addiction-treatment", "/resources/cocaine-withdrawal"],
  ["/ketamine-addiction-treatment", "/resources/ketamine-withdrawal"],
  ["/how-much-does-rehab-cost-uk", "/resources/detox-vs-rehab"],
];
for (const [source, target] of batchTwoReciprocalLinks) {
  if (!htmlByPath.get(source)?.includes(`href=\"${target}\"`)) {
    fail(`${source} does not link to its Batch 2 guide ${target}.`);
  }
}

const detoxHub = htmlByPath.get("/resources/addiction-detox-uk");
for (const target of batchTwoResourcePaths.slice(1)) {
  if (!detoxHub?.includes(`href=\"${target}\"`)) {
    fail(`/resources/addiction-detox-uk does not link to ${target}.`);
  }
}

const rehabCost = htmlByPath.get("/how-much-does-rehab-cost-uk");
for (const schemaType of ["WebPage", "Service", "BreadcrumbList", "FAQPage"]) {
  if (!rehabCost?.includes(`\"@type\":\"${schemaType}\"`)) {
    fail(`/how-much-does-rehab-cost-uk is missing ${schemaType} JSON-LD.`);
  }
}
for (const requiredText of ["Last reviewed 28 August 2026", "not a statistical market average", "not a regulated healthcare provider"]) {
  if (!rehabCost?.toLowerCase().includes(requiredText.toLowerCase())) {
    fail(`/how-much-does-rehab-cost-uk is missing Batch 2 review content: ${requiredText}`);
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
