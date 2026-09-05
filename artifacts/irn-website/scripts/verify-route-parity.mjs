import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { routeParity } from "../src/data/route-parity.js";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist/public");
const siteUrl = "https://www.insightrecoverynetwork.com";
const siteName = "Insight Recovery Network";
const allowedCommercialEvents = new Set([
  "get_help_click",
  "treatment_placement_enquiry",
  "online_programme_enquiry",
  "family_support_enquiry",
]);

const routeFiles = {
  "/": "index.html",
  "/get-help": "get-help.html",
  "/private-rehab-uk": "private-rehab-uk.html",
  "/treatment-placement": "treatment-placement.html",
  "/how-much-does-rehab-cost-uk": "how-much-does-rehab-cost-uk.html",
  "/private-rehab-alternative-uk": "private-rehab-alternative-uk.html",
  "/online-programme": "online-programme.html",
  "/family-addiction-intervention-uk": "family-addiction-intervention-uk.html",
};

const componentFiles = {
  "/": "src/pages/Home.tsx",
  "/get-help": "src/pages/GetHelp.tsx",
  "/private-rehab-uk": "src/pages/PrivateRehabUK.tsx",
  "/treatment-placement": "src/pages/TreatmentPlacement.tsx",
  "/how-much-does-rehab-cost-uk": "src/pages/RehabCostUK.tsx",
  "/private-rehab-alternative-uk": "src/pages/PrivateRehabAlternativeUK.tsx",
  "/online-programme": "src/pages/OnlineProgramme.tsx",
  "/family-addiction-intervention-uk": "src/pages/FamilyInterventionUK.tsx",
};

function invariant(condition, message) {
  if (!condition) throw new Error(`[route-parity] ${message}`);
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function text(value = "") {
  return decode(value.replace(/<[^>]+>/g, " "));
}

function attributes(tag = "") {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gis)].map((match) => [
      match[1].toLowerCase(),
      decode(match[3]),
    ]),
  );
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gis"))].map(
    (match) => ({ raw: match[0], attrs: attributes(match[0]) }),
  );
}

function one(items, label, route) {
  invariant(items.length === 1, `${route}: expected one ${label}, found ${items.length}`);
  return items[0];
}

function jsonLd(html, route) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match, index) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        throw new Error(`${route}: invalid JSON-LD script ${index + 1}: ${error.message}`);
      }
    },
  );
}

function types(schemas) {
  return new Set(schemas.flatMap((schema) => schema["@type"] ?? []));
}

function expectedCanonical(route) {
  return `${siteUrl}${route === "/" ? "/" : route}`;
}

for (const [route, file] of Object.entries(routeFiles)) {
  const parity = routeParity[route];
  invariant(parity, `${route}: missing shared route definition`);
  const html = readFileSync(resolve(dist, file), "utf8");
  const title = one(
    [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)],
    "title",
    route,
  );
  const descriptions = tags(html, "meta").filter(
    (tag) => tag.attrs.name?.toLowerCase() === "description",
  );
  const robots = tags(html, "meta").filter(
    (tag) => tag.attrs.name?.toLowerCase() === "robots",
  );
  const canonicals = tags(html, "link").filter(
    (tag) => tag.attrs.rel?.toLowerCase() === "canonical",
  );
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const primaryCtas = [
    ...html.matchAll(
      /<a\b(?=[^>]*data-primary-commercial-cta=["']true["'])[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ].map((match) => ({
    raw: match[0],
    label: text(match[1]),
    attrs: attributes(match[0].match(/^<a\b[^>]*>/i)?.[0] ?? ""),
  }));

  invariant(text(title[1]) === parity.title, `${route}: raw title differs from shared title`);
  invariant(
    one(descriptions, "description", route).attrs.content === parity.description,
    `${route}: raw description differs from shared description`,
  );
  invariant(
    one(canonicals, "canonical", route).attrs.href === expectedCanonical(route),
    `${route}: raw canonical is incorrect`,
  );
  invariant(
    one(robots, "robots directive", route).attrs.content === "index, follow",
    `${route}: expected index, follow`,
  );
  invariant(h1s.length === 1, `${route}: expected one raw H1, found ${h1s.length}`);
  invariant(text(h1s[0][1]) === parity.h1, `${route}: raw H1 differs from shared H1`);

  const cta = one(primaryCtas, "primary commercial CTA", route);
  invariant(
    allowedCommercialEvents.has(parity.primaryCta.analyticsEvent),
    `${route}: unsupported primary CTA analytics event`,
  );
  invariant(cta.attrs.href === parity.primaryCta.href, `${route}: raw primary CTA destination drift`);
  invariant(cta.label === parity.primaryCta.label, `${route}: raw primary CTA label drift`);
  invariant(
    cta.attrs["data-analytics-event"] === parity.primaryCta.analyticsEvent,
    `${route}: raw primary CTA analytics classification drift`,
  );

  const body = text(
    (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " "),
  );
  const minimumWords = route === "/" ? 250 : 180;
  invariant(body.split(/\s+/).filter(Boolean).length >= minimumWords, `${route}: raw body is too thin`);
  invariant(body.includes(parity.h1), `${route}: shared H1 missing from raw body`);
  invariant(
    route === "/" || !body.includes(routeParity["/"].h1),
    `${route}: homepage substitution detected`,
  );
  for (const section of parity.prerenderSections ?? []) {
    invariant(body.includes(section.heading), `${route}: shared raw section missing: ${section.heading}`);
  }

  const schemas = jsonLd(html, route);
  const schemaTypes = types(schemas);
  for (const required of ["WebPage", ...(route === "/" ? [] : ["BreadcrumbList"]), ...(parity.service ? ["Service"] : []), ...((parity.faqs?.length ?? 0) ? ["FAQPage"] : [])]) {
    invariant(schemaTypes.has(required), `${route}: missing raw ${required} schema`);
  }
  const ids = schemas.map((schema) => schema["@id"]).filter(Boolean);
  invariant(new Set(ids).size === ids.length, `${route}: duplicate JSON-LD @id detected`);
  if (parity.faqs?.length) {
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    invariant(
      faq.mainEntity?.length === parity.faqs.length,
      `${route}: raw FAQ schema does not match shared visible FAQ count`,
    );
  }

  const source = readFileSync(resolve(root, componentFiles[route]), "utf8");
  for (const contract of [
    "title={parity.title}",
    "description={parity.description}",
    "canonical={parity.canonical}",
    "noIndex={!parity.indexable}",
    "{parity.h1}",
    "href={parity.primaryCta.href}",
    "<RouteSchemas",
  ]) {
    invariant(source.includes(contract), `${route}: React component does not use shared contract ${contract}`);
  }
  if (parity.faqs?.length) {
    invariant(source.includes("parity.faqs"), `${route}: visible React FAQs are not shared`);
  }
}

const representativeArticle = "/resources/when-should-family-consider-rehab";
const articleHtml = readFileSync(
  resolve(dist, "_resources/when-should-family-consider-rehab.html"),
  "utf8",
);
const articleTitle = text(
  articleHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1],
);
invariant(
  articleTitle === `When Should a Family Consider Rehab? | ${siteName}`,
  `${representativeArticle}: article title convention drift`,
);
const articleTypes = types(jsonLd(articleHtml, representativeArticle));
for (const required of ["Article", "FAQPage", "BreadcrumbList"]) {
  invariant(articleTypes.has(required), `${representativeArticle}: missing raw ${required} schema`);
}

const layoutSource = readFileSync(resolve(root, "src/components/layout/Layout.tsx"), "utf8");
invariant(
  layoutSource.includes('data-prerendered-meta="true"') &&
    layoutSource.includes('data-prerendered-jsonld="true"'),
  "Layout must remove prerendered metadata and JSON-LD after React mounts",
);

console.log(
  `✓ Route parity contract passed for ${Object.keys(routeFiles).length} commercial routes and one representative article.`,
);
