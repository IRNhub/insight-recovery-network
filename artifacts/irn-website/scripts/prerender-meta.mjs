/**
 * Post-build pre-render script.
 *
 * After `vite build`, this script generates per-article HTML files under
 *   dist/public/resources/<slug>.html
 *
 * Each file is a copy of dist/public/index.html with the generic site-wide
 * OG / Twitter / canonical / title meta tags replaced with article-specific
 * values, so social crawlers (Facebook, LinkedIn, etc.) see the correct
 * preview metadata without needing JavaScript.
 *
 * The artifact.toml rewrites map  /resources/<slug>  →  /resources/<slug>.html
 * so browsers and crawlers both receive the pre-rendered shell at the clean URL.
 * Flat .html files (not directories) are used deliberately: directory-based
 * pre-rendering causes static servers to return 403 (directory listing disabled)
 * for bare slug paths, which blocks social crawlers.
 *
 * Run via:  node scripts/prerender-meta.mjs
 * Wired into package.json "build" so it runs automatically after vite build.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distPublic = resolve(root, "dist/public");
const publicDir = resolve(root, "public");

const SITE_URL = "https://www.insightrecoverynetwork.com";

/** Escape a string for use inside an HTML attribute value. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Article metadata for pre-rendering.
 * Keep pageTitle, ogTitle, description, and date in sync with
 * src/data/articles.ts whenever articles are added or updated.
 */
const ARTICLES = [
  {
    slug: "why-cant-i-stop-how-addiction-works",
    pageTitle:
      "Why Can't I Stop Drinking or Using, Even When I Want To? | Insight Recovery Network",
    ogTitle:
      "Why Can't I Stop Drinking or Using, Even When I Want To?",
    description:
      "If you have tried to stop and willpower was never enough, the problem was never your character. Here is how addiction actually works, and how recovery is possible.",
    image: `${SITE_URL}/article-why-cant-i-stop-og.jpg`,
    imageAlt: "A person sitting at a desk torn between the pull of addiction and the life they want — freedom, connection, purpose, peace.",
    date: "2026-05-19",
    type: "article",
  },
  {
    slug: "understanding-alcohol-dependency",
    pageTitle:
      "Understanding Alcohol Dependency: Signs, Stages and What to Do Next | Insight Recovery Network",
    ogTitle:
      "Understanding Alcohol Dependency: Signs, Stages and What to Do Next",
    description:
      "Alcohol dependency develops gradually, often beneath the surface of everyday life. Recognising the signs early can make a significant difference to the path ahead.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-04-28",
    type: "article",
  },
  {
    slug: "what-happens-in-residential-rehabilitation",
    pageTitle:
      "What Happens in Residential Rehabilitation? | Insight Recovery Network",
    ogTitle: "What Happens in Residential Rehabilitation?",
    description:
      "Residential rehabilitation is often the most effective route for complex or severe addiction. Here is an honest account of what the process actually involves.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-04-14",
    type: "article",
  },
  {
    slug: "managing-relapse-part-of-recovery",
    pageTitle:
      "Managing Relapse: Why It Is Part of Recovery, Not the End of It | Insight Recovery Network",
    ogTitle:
      "Managing Relapse: Why It Is Part of Recovery, Not the End of It",
    description:
      "Relapse is one of the most misunderstood aspects of addiction. Understanding it clinically — rather than morally — changes everything about how we respond to it.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-03-31",
    type: "article",
  },
  {
    slug: "supporting-a-loved-one-through-recovery",
    pageTitle:
      "Supporting a Loved One Through Recovery: What Helps and What Does Not | Insight Recovery Network",
    ogTitle:
      "Supporting a Loved One Through Recovery: What Helps and What Does Not",
    description:
      "Watching someone you care about struggle with addiction is one of the most distressing experiences a family can face. Knowing how to respond can make a real difference.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-03-17",
    type: "article",
  },
  {
    slug: "mental-health-and-addiction",
    pageTitle:
      "The Connection Between Mental Health and Addiction | Insight Recovery Network",
    ogTitle: "The Connection Between Mental Health and Addiction",
    description:
      "Addiction and mental health conditions frequently co-occur. Understanding the relationship between them is essential to effective treatment.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-02-24",
    type: "article",
  },
  {
    slug: "online-recovery-programmes",
    pageTitle:
      "Online Recovery Programmes: Who Are They For and Do They Work? | Insight Recovery Network",
    ogTitle:
      "Online Recovery Programmes: Who Are They For and Do They Work?",
    description:
      "Digital recovery support has matured significantly in recent years. For many people, structured online programmes offer a clinically effective alternative to in-person treatment.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-02-10",
    type: "article",
  },
];

/**
 * Replace a single meta tag attribute value.
 * Matches:  <meta property="og:title" content="...OLD...">
 *           <meta name="description" content="...OLD...">
 * and replaces the content value only.
 */
function replaceMeta(html, attr, attrValue, newContent) {
  const re = new RegExp(
    `(<meta\\s+${attr}="${escapeRegex(attrValue)}"\\s+content=")[^"]*(")`
  );
  return html.replace(re, `$1${newContent}$2`);
}

function replaceMeta2(html, attr, attrValue, newContent) {
  const re = new RegExp(
    `(<meta\\s+content=")[^"]*(\"\\s+${attr}="${escapeRegex(attrValue)}")`
  );
  return html.replace(re, `$1${newContent}$2`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Inject article-specific meta tags into the base index.html. */
function injectArticleMeta(html, article) {
  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(article.pageTitle)}</title>`);

  // <meta name="description">
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${esc(article.description)}$2`
  );

  // <link rel="canonical">
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${SITE_URL}/resources/${article.slug}$2`
  );

  // og:title
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${esc(article.ogTitle)}$2`
  );

  // og:description
  out = out.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${esc(article.description)}$2`
  );

  // og:image
  out = out.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${esc(article.image)}$2`
  );

  // og:image:width — set to 1200
  out = out.replace(
    /(<meta\s+property="og:image:width"\s+content=")[^"]*(")/,
    `$11200$2`
  );

  // og:image:height — set to 630
  out = out.replace(
    /(<meta\s+property="og:image:height"\s+content=")[^"]*(")/,
    `$1630$2`
  );

  // og:image:alt
  out = out.replace(
    /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
    `$1${esc(article.imageAlt)}$2`
  );

  // og:url
  out = out.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${SITE_URL}/resources/${article.slug}$2`
  );

  // og:type — website → article
  out = out.replace(
    /(<meta\s+property="og:type"\s+content=")[^"]*(")/,
    `$1${esc(article.type)}$2`
  );

  // twitter:title
  out = out.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${esc(article.ogTitle)}$2`
  );

  // twitter:description
  out = out.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${esc(article.description)}$2`
  );

  // twitter:image
  out = out.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${esc(article.image)}$2`
  );

  // Insert article:published_time after og:locale
  if (article.type === "article" && article.date) {
    out = out.replace(
      /(<meta\s+property="og:locale"[^/]*\/>)/,
      `$1\n    <meta property="article:published_time" content="${article.date}T00:00:00+00:00" />`
    );
  }

  return out;
}

/** Generate a 1200×630 JPEG OG image for the article. */
async function generateArticleOgImage() {
  const src = resolve(publicDir, "article-why-cant-i-stop.png");
  if (!existsSync(src)) {
    console.warn("  ⚠ article-why-cant-i-stop.png not found, skipping OG image generation.");
    return;
  }

  const outDist = resolve(distPublic, "article-why-cant-i-stop-og.jpg");
  const outPublic = resolve(publicDir, "article-why-cant-i-stop-og.jpg");

  await sharp(src)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toFile(outDist);

  await sharp(src)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toFile(outPublic);

  console.log("  ✓ article-why-cant-i-stop-og.jpg  (1200×630 JPEG)");
}

async function main() {
  const indexPath = resolve(distPublic, "index.html");
  if (!existsSync(indexPath)) {
    console.error("dist/public/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  console.log("\n▶  Pre-rendering article OG meta tags…\n");

  // Step 1: Generate 1200×630 OG image for the new article
  await generateArticleOgImage();

  // Step 2: Remove any old directory-based pre-rendered files (slug/index.html)
  // They cause 403s on static servers that disable directory listing.
  const resourcesDir = resolve(distPublic, "resources");
  if (existsSync(resourcesDir)) {
    for (const article of ARTICLES) {
      const oldDir = resolve(resourcesDir, article.slug);
      if (existsSync(oldDir)) {
        rmSync(oldDir, { recursive: true, force: true });
        console.log(`  🗑  Removed old directory: resources/${article.slug}/`);
      }
    }
  }

  // Step 3: Ensure resources/ directory exists
  mkdirSync(resourcesDir, { recursive: true });

  // Step 4: Read the built index.html
  const baseHtml = readFileSync(indexPath, "utf-8");

  // Step 5: Generate per-article flat HTML files: resources/<slug>.html
  let count = 0;
  for (const article of ARTICLES) {
    const html = injectArticleMeta(baseHtml, article);
    writeFileSync(resolve(resourcesDir, `${article.slug}.html`), html, "utf-8");
    console.log(`  ✓ /resources/${article.slug}  →  resources/${article.slug}.html`);
    count++;
  }

  console.log(`\n  Pre-rendered ${count} article pages.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
