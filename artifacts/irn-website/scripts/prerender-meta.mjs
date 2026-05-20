/**
 * Post-build pre-render script.
 *
 * After `vite build`, this script generates:
 *
 *  1. Per-page HTML files for the main site routes:
 *       dist/public/about.html
 *       dist/public/what-we-offer.html
 *       dist/public/treatment-placement.html
 *       dist/public/online-programme.html
 *       dist/public/insight-os.html
 *       dist/public/contact.html
 *     Each file is a copy of dist/public/index.html with:
 *       - Page-specific <title>, <meta>, <link rel="canonical"> and OG tags
 *       - Page-specific static body content (h1, descriptions, key links)
 *     Vite's preview server (sirv) serves `pagename.html` when `/pagename`
 *     is requested, so no rewrite rules are required for these files.
 *
 *  2. Per-article HTML files under dist/public/resources/<slug>.html
 *     Each file is a copy of dist/public/index.html with article-specific
 *     OG / Twitter / canonical / title meta tags replaced with article-specific
 *     values, so social crawlers see the correct preview metadata without JS.
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

const SITE_URL = "https://insightrecoverynetwork.com";
const SITE_NAME = "Insight Recovery Network";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

/** Escape a string for use inside an HTML attribute value. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MAIN SITE PAGES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Metadata for each pre-rendered page route.
 * Keep title/description in sync with the SEO component props in each page.
 */
const PAGES = [
  {
    route: "/about",
    file: "about.html",
    title: "About Insight Recovery Network | Private Addiction Recovery Support",
    description:
      "Learn about Insight Recovery Network, founded by Craig Bilton, providing discreet addiction recovery support, treatment placement guidance, family intervention, and online recovery programmes.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">
              About Insight Recovery Network
            </p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Discreet addiction recovery support for individuals and families navigating complex treatment decisions.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Insight Recovery Network provides confidential guidance for people facing addiction, mental health, treatment placement, relapse risk, and family crisis situations. We help individuals and families understand the options, make informed decisions, and access the right level of support.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">About Craig Bilton, Founder</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:1.5rem;">
              With over 20 years of international addiction treatment experience, Craig Bilton founded Insight Recovery Network to provide genuinely independent, clinically informed guidance. His background spans residential rehabilitation, online recovery support, and complex case management across the UK and internationally.
            </p>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;">
              Craig's approach is built on three principles: clarity, continuity, and practical support — providing honest guidance, long-term recovery planning, and tangible tools rather than generic advice.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">What We Help With</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Alcohol and drug addiction concerns</li>
              <li>Private rehab and detox decisions</li>
              <li>Treatment placement in the UK and internationally</li>
              <li>Family intervention and crisis guidance</li>
              <li>Online addiction recovery support</li>
              <li>Relapse prevention and aftercare planning</li>
              <li>Mental health and dual-diagnosis considerations</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">
              All enquiries are handled with complete discretion. You do not need to have everything worked out before reaching out.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get in Touch</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/what-we-offer",
    file: "what-we-offer.html",
    title: "Addiction Counselling &amp; Recovery Services | Insight Recovery Network",
    description:
      "Insight Recovery Network offers addiction counselling, private rehab placement, online recovery programmes, family intervention support, and relapse prevention tools — tailored to each individual's needs.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Our Services</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Comprehensive support across the recovery continuum.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              From the moment of crisis through to long-term wellbeing, we provide structured pathways for individuals, families, and professionals.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;">
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Treatment Placement</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">Confidential, independent guidance for finding the right detox or residential rehabilitation facility in the UK or internationally, matched to individual clinical need.</p>
                <a href="/treatment-placement" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Learn more about Treatment Placement</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Online Recovery Programme</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">Structured group support, one-to-one therapy sessions and relapse prevention planning for alcohol and drug addiction recovery. Available from wherever you are.</p>
                <a href="/online-programme" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Learn more about the Online Recovery Programme</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Insight OS Digital Recovery Tools</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">A structured digital recovery platform for daily check-ins, mood tracking, journaling, recovery planning and access to the Anchor guidance system.</p>
                <a href="/insight-os" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Learn more about Insight OS</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Family &amp; Intervention Guidance</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">Structured support and guidance for families navigating a loved one's addiction, mental health difficulties and the process of seeking appropriate care.</p>
                <a href="/what-we-offer" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Learn more about Family Guidance</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Professional Partnerships</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">A discreet, expert resource for professionals, EAPs, HR teams, and legal counsel — assessing, advising, and coordinating a clinical response to sensitive substance or mental health issues.</p>
                <a href="/contact" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Enquire about Professional Partnerships</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Aftercare &amp; Continuity Planning</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">Sustained recovery requires structure beyond treatment. Tailored aftercare plans integrating Insight OS, peer support, clinical oversight, and scheduled reviews.</p>
                <a href="/insight-os" style="color:#162B3B;font-family:sans-serif;font-size:0.85rem;text-decoration:underline;">Learn more about Aftercare</a>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">Not sure where to start? A private conversation can help clarify the most appropriate pathway for you or your family.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get in Touch</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/treatment-placement",
    file: "treatment-placement.html",
    title: "Private Rehab Placement — UK &amp; International | Insight Recovery Network",
    description:
      "Independent guidance on private rehab placement and detox across the UK and internationally. Insight Recovery Network assess your needs, identify the right facility, and manage the transition — confidentially and without pressure.",
    ogImage: `${SITE_URL}/og-treatment-placement.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Treatment Placement</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Independent guidance on private rehab and detox, UK and internationally.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Choosing the right treatment facility is one of the most consequential decisions a person or family can make. We assess your needs, identify the most appropriate options, and manage the transition — without commercial ties to any provider.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">How the Placement Process Works</h2>
            <ol style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><strong style="color:#162B3B;">Understand the situation</strong> — Assess urgency, risk, substance use history, mental health needs, family context, and practical requirements.</li>
              <li><strong style="color:#162B3B;">Identify suitable options</strong> — Match needs against trusted providers, considering clinical fit, location, budget, length of stay, and environment.</li>
              <li><strong style="color:#162B3B;">Present and clarify</strong> — Share a clear shortlist of appropriate facilities with honest assessments of each, without pressure or sales tactics.</li>
              <li><strong style="color:#162B3B;">Manage the transition</strong> — Coordinate directly with the chosen facility to ensure a smooth and structured admission.</li>
              <li><strong style="color:#162B3B;">Aftercare planning</strong> — Ensure a clear plan is in place before discharge, including ongoing support through Insight OS and the Online Recovery Programme.</li>
            </ol>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">What We Cover</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Alcohol detox and residential rehabilitation</li>
              <li>Drug detox and residential rehabilitation</li>
              <li>Dual-diagnosis treatment (addiction and mental health)</li>
              <li>Private facilities across the UK</li>
              <li>International treatment centres in Thailand, Spain, South Africa, and Sri Lanka</li>
              <li>Continuing care and structured aftercare planning</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">
              All enquiries are handled with complete discretion. There is no obligation and no pressure.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get in Touch</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/online-programme",
    file: "online-programme.html",
    title: "Online Addiction Recovery Programme | Insight Recovery Network",
    description:
      "A structured online addiction recovery programme with group therapy, one-to-one support, daily accountability, and relapse prevention planning — available without residential care. Delivered by Insight Recovery Network.",
    ogImage: `${SITE_URL}/og-online-programme.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Online Recovery Programme</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              A structured online addiction recovery programme — without residential care.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              For those who need clinical-grade recovery support but cannot or choose not to enter residential treatment, our online programme delivers structured group therapy, one-to-one sessions, daily accountability, and relapse prevention planning — wherever you are in the world.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">Who Is the Programme For?</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Those who need structure but cannot step away from work or family responsibilities</li>
              <li>People who have completed residential treatment and need strong aftercare</li>
              <li>Those in early recovery who want daily clinical support and peer accountability</li>
              <li>Individuals who prefer the privacy of online recovery over residential settings</li>
              <li>People whose location limits access to in-person treatment</li>
            </ul>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">Programme Components</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Group Therapy Sessions</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Structured weekly group sessions with peers in recovery, facilitated by a clinical therapist.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">One-to-One Support</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Individual sessions with your assigned clinician to address personal recovery challenges and goals.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Relapse Prevention Planning</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">A structured, personalised plan identifying triggers, warning signs, and practical intervention strategies.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Insight OS Digital Tools</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Daily check-ins, mood tracking, journaling, and Anchor recovery guidance — integrated throughout the programme.</p>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">Ready to take the next step? A private conversation can help clarify whether the online programme is the right fit.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get in Touch</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/insight-os",
    file: "insight-os.html",
    title: "Insight OS — The Operating System for Your Recovery | Insight Recovery Network",
    description:
      "Insight OS is a structured digital recovery platform with daily check-ins, mood tracking, guided journaling, relapse prevention tools, and Anchor recovery guidance.",
    ogImage: `${SITE_URL}/og-insight-os.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Insight OS</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              The operating system for your recovery.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Insight OS is a structured digital recovery platform designed to bring daily rhythm, accountability, and clinical guidance to life outside treatment. It combines daily check-ins, mood tracking, guided journaling, relapse prevention tools, and the Anchor recovery guidance system.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get Started</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">What Insight OS Includes</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Daily Check-Ins</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">A structured morning check-in to set intentions and a reflective evening review to track progress and emotional state.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Mood Tracking</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Track emotional patterns over time to identify triggers, early warning signs, and progress in recovery.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Guided Journaling</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Clinically informed journal prompts to support reflection, self-awareness, and emotional processing in recovery.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Anchor Guidance System</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">A structured recovery guidance system providing strategies, frameworks, and prompts for navigating difficult moments.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Relapse Prevention Tools</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Personalised prevention plans, trigger identification, and structured response protocols for high-risk situations.</p>
              </article>
              <article style="padding:1.5rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h3 style="font-size:1rem;font-weight:500;margin-bottom:0.5rem;">Recovery Planning</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Goal setting, milestone tracking, and structured weekly planning to maintain momentum and long-term wellbeing.</p>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Get Started with Insight OS</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">Insight OS is available as part of the Online Recovery Programme or as a standalone digital recovery tool. Contact us to find out more.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/contact",
    file: "contact.html",
    title: "Contact Us — Speak Confidentially | Insight Recovery Network",
    description:
      "Contact Insight Recovery Network confidentially. Based in Newquay, Cornwall, we provide private guidance on addiction treatment, rehab placement, online recovery programmes, and mental health support for individuals and families.",
    ogImage: `${SITE_URL}/og-contact.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Contact</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:640px;">
              Speak Confidentially
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:580px;color:#4a5568;margin-bottom:2rem;">
              You do not need to have everything worked out before making contact. A private conversation can help clarify the most appropriate support for you or your family. All enquiries are handled with complete discretion.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Contact Details</h2>
            <p style="font-family:sans-serif;font-size:1rem;color:#4a5568;line-height:2;">
              Email: <a href="mailto:support@insightrecoverynetwork.com" style="color:#162B3B;">support@insightrecoverynetwork.com</a><br>
              Based in Newquay, Cornwall, UK<br>
              Supporting clients across the UK and internationally
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What to Expect</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:580px;color:#4a5568;">
              Your first contact will be a confidential, no-obligation conversation. We will listen carefully, ask relevant questions, and help you understand the most appropriate pathway forward — whether that is treatment placement, an online programme, Insight OS, or simply more information.
            </p>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Our Services</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/treatment-placement" style="color:#162B3B;">Treatment Placement</a> — Private rehab and detox guidance, UK and internationally</li>
              <li><a href="/online-programme" style="color:#162B3B;">Online Recovery Programme</a> — Structured group and one-to-one support</li>
              <li><a href="/insight-os" style="color:#162B3B;">Insight OS</a> — Digital recovery tools and daily structure</li>
              <li><a href="/what-we-offer" style="color:#162B3B;">Family Guidance</a> — Support for families navigating addiction</li>
              <li><a href="/assessments" style="color:#162B3B;">Free Assessments</a> — Confidential self-assessments for alcohol, drugs, and mental health</li>
            </ul>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments",
    file: "assessments.html",
    title: "Free Addiction &amp; Mental Health Assessments | Insight Recovery Network",
    description:
      "Confidential self-assessments for alcohol use, drug use, detox suitability, anxiety, depression, and ADHD. Start a free clinical assessment and receive personalised guidance — no registration required.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Clinical Assessments</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Free confidential assessments for addiction and mental health.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:1rem;">
              These assessments are designed to help individuals and families understand their situation more clearly. Each one takes 7–15 minutes, is completely confidential, and requires no registration. Results are designed to provide personalised guidance — not a diagnosis.
            </p>
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              These tools are for informational purposes only and do not constitute medical advice. If you are in crisis or require urgent support, please contact your GP or emergency services.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially Instead</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:2rem;">Available Assessments</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.75rem;">
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Alcohol &amp; Detox Suitability Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Explore whether alcohol may be affecting your wellbeing and whether stopping suddenly could carry medical risk. Covers use patterns, withdrawal history, and detox safety.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">10–15 minutes &nbsp;·&nbsp; For individuals drinking heavily considering stopping</p>
                <a href="/assessments/alcohol-detox" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Alcohol &amp; Detox Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Alcohol Use Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Reflect on your current relationship with alcohol and understand whether it may be affecting your health, relationships, or daily life.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">7–10 minutes &nbsp;·&nbsp; For individuals questioning their drinking</p>
                <a href="/assessments/alcohol-use" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Alcohol Use Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Drug Use &amp; Substance Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Explore your relationship with substances and identify whether further professional support or treatment may be appropriate.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">7–10 minutes &nbsp;·&nbsp; For individuals concerned about substance use</p>
                <a href="/assessments/drug-use" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Drug Use Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Detox Suitability Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Understand whether medical detox may be necessary, and what level of supervision or support is advisable before reducing or stopping substance use.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">8–12 minutes &nbsp;·&nbsp; For individuals preparing to stop using substances</p>
                <a href="/assessments/detox" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Detox Suitability Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Anxiety Screening Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Explore patterns of anxiety, worry, and nervous system activation to understand whether anxiety may be contributing to addictive behaviour or recovery difficulty.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">7–10 minutes &nbsp;·&nbsp; For individuals experiencing anxiety alongside addiction</p>
                <a href="/assessments/anxiety" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Anxiety Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">Depression Screening Assessment</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Reflect on mood, energy, motivation, and emotional wellbeing to understand whether depression may be a factor in your recovery and what support may be appropriate.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">7–10 minutes &nbsp;·&nbsp; For individuals experiencing low mood or depression</p>
                <a href="/assessments/depression" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start Depression Assessment</a>
              </article>
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.4);background:#fff;">
                <h3 style="font-size:1.1rem;font-weight:500;margin-bottom:0.5rem;">ADHD &amp; Impulsivity Screening</h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;margin-bottom:1rem;">Explore attention, impulsivity, and executive function patterns that may be contributing to addictive behaviour, relapse, or difficulty engaging with treatment.</p>
                <p style="font-family:sans-serif;font-size:0.8rem;color:#888;margin-bottom:1rem;">10–12 minutes &nbsp;·&nbsp; For individuals exploring ADHD and addiction</p>
                <a href="/assessments/adhd-impulsivity" style="display:inline-block;padding:0.625rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.85rem;font-weight:500;">Start ADHD Assessment</a>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Clinical Disclaimer</h2>
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.8;max-width:680px;color:#4a5568;">
              These assessments are for informational and educational purposes only. They do not constitute a diagnosis, clinical assessment, or medical advice. Results are intended to provide personalised guidance to help you understand your situation and consider appropriate next steps. If you have concerns about withdrawal, mental health crisis, or urgent physical health issues, please contact your GP, a medical professional, or emergency services immediately.
            </p>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Not sure where to start?</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">A private conversation with Craig Bilton can help clarify the most appropriate level of support for you or your family — without pressure or obligation.</p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
              <a href="/resources" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Browse Resources</a>
            </div>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/resources",
    file: "resources.html",
    title: "Addiction &amp; Recovery Resources — Clinical Articles | Insight Recovery Network",
    description:
      "Authoritative articles on addiction, recovery, treatment options, and mental health — written by Craig Bilton to help individuals and families make informed decisions about addiction support and treatment.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Programme</a>
          <a href="/insight-os" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Clinical Resources</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Addiction and recovery articles.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;">
              Authoritative articles on addiction, recovery, treatment options, and mental health — written by Craig Bilton to help individuals and families understand their situation and make informed decisions.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:2rem;">All Articles</h2>
            <div style="display:flex;flex-direction:column;gap:0;">
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Treatment Options</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/private-rehab-vs-nhs-addiction-treatment" style="color:#162B3B;text-decoration:none;">Private Rehab vs NHS Addiction Treatment: What Is the Difference?</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Compare private rehab and NHS addiction treatment in the UK, including access, cost, detox, confidentiality, aftercare and support — and understand which route may be more appropriate for your situation.</p>
                <a href="/resources/private-rehab-vs-nhs-addiction-treatment" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Treatment Options</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/how-to-choose-private-rehab-centre-uk" style="color:#162B3B;text-decoration:none;">How to Choose the Right Private Rehab Centre in the UK</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Choosing private rehab in the UK? Learn what to look for, what questions to ask, what warning signs to avoid, and how to find a treatment setting that is clinically appropriate for the person's actual needs.</p>
                <a href="/resources/how-to-choose-private-rehab-centre-uk" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Addiction &amp; Substances</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/why-cant-i-stop-how-addiction-works" style="color:#162B3B;text-decoration:none;">Why Can't I Stop? How Addiction Works</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Addiction is not a moral failing or a lack of willpower. Understanding the neuroscience and psychology of compulsive use can help individuals and families make sense of what is happening — and why change is often so difficult without support.</p>
                <a href="/resources/why-cant-i-stop-how-addiction-works" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Recovery &amp; Wellbeing</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/online-recovery-programmes" style="color:#162B3B;text-decoration:none;">Online Recovery Programmes: Who Are They For and Do They Work?</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Digital recovery support has matured significantly in recent years. For many people, structured online programmes offer a clinically effective alternative to in-person treatment.</p>
                <a href="/resources/online-recovery-programmes" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Mental Health</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/mental-health-and-addiction" style="color:#162B3B;text-decoration:none;">Mental Health and Addiction: Understanding the Connection</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Addiction and mental health conditions frequently co-occur. Understanding the relationship between them is essential to effective treatment.</p>
                <a href="/resources/mental-health-and-addiction" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Family &amp; Relationships</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/supporting-a-loved-one-through-recovery" style="color:#162B3B;text-decoration:none;">Supporting a Loved One Through Recovery</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">When someone close to you is in recovery, knowing how to help — and how not to — can make a significant difference to their long-term wellbeing and your own.</p>
                <a href="/resources/supporting-a-loved-one-through-recovery" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Recovery &amp; Wellbeing</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/managing-relapse-part-of-recovery" style="color:#162B3B;text-decoration:none;">Managing Relapse as Part of Recovery</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Relapse does not mean failure. Understanding how and why relapse happens — and how to respond to it — is one of the most important parts of sustainable recovery.</p>
                <a href="/resources/managing-relapse-part-of-recovery" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Treatment Options</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/what-happens-in-residential-rehabilitation" style="color:#162B3B;text-decoration:none;">What Happens in Residential Rehabilitation?</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Residential rehabilitation can feel like a significant step. Understanding what actually happens during a residential rehab stay can help individuals and families make a more informed decision.</p>
                <a href="/resources/what-happens-in-residential-rehabilitation" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Addiction &amp; Substances</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/understanding-alcohol-dependency" style="color:#162B3B;text-decoration:none;">Understanding Alcohol Dependency</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Alcohol dependency is a complex condition involving physical, psychological, and social factors. Understanding its nature is the first step towards making sense of what is happening and what level of support may be needed.</p>
                <a href="/resources/understanding-alcohol-dependency" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">You do not need to have everything worked out before reaching out. A private conversation can help clarify the most appropriate support for you or your family.</p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get in Touch</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
            </div>
          </section>
        </div>
      </main>
    `,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: inject page-specific meta tags into index.html
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace all key meta tags and body content in the built index.html
 * to produce a page-specific pre-rendered HTML file.
 */
function injectPageMeta(baseHtml, page) {
  let out = baseHtml;
  const canonicalUrl = `${SITE_URL}${page.route}`;

  // og:title
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${page.title}$2`
  );

  // og:description
  out = out.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${esc(page.description)}$2`
  );

  // og:image
  out = out.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${esc(page.ogImage)}$2`
  );

  // og:image:alt
  out = out.replace(
    /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
    `$1${esc(SITE_NAME)}$2`
  );

  // og:url
  out = out.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonicalUrl}$2`
  );

  // twitter:title
  out = out.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${page.title}$2`
  );

  // twitter:description
  out = out.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${esc(page.description)}$2`
  );

  // twitter:image
  out = out.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${esc(page.ogImage)}$2`
  );

  // Replace the static body content inside <div id="root">...</div>
  // Uses greedy matching so the outer closing </div> is matched (not an inner one).
  // The comment "React mounts here" immediately follows the root </div>.
  const bodyReplaced = out.replace(
    /(<div id="root">)[\s\S]*(<\/div>)(\s*\n\s*<!-- React mounts here)/,
    `$1\n${page.body}\n    $2$3`
  );

  // ── Assertions: fail hard if critical replacements did not apply ──────────
  const checks = [
    {
      label: "#root body content",
      // Verify the body replacement ran: <div id="root"> must be directly
      // followed by content from page.body (not the home-page static shell).
      // We check for the absence of the default home-page marker in the root.
      pattern: null,
      customCheck: () => bodyReplaced !== out,
    },
  ];

  for (const check of checks) {
    const passed = check.customCheck
      ? check.customCheck()
      : check.pattern.test(check.html);
    if (!passed) {
      throw new Error(
        `[prerender] Replacement failed for route "${page.route}": ${check.label} was not applied.\n` +
        `Check that index.html contains the expected marker text and try rebuilding.`
      );
    }
  }

  return bodyReplaced;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARTICLE PAGES
// ─────────────────────────────────────────────────────────────────────────────

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
  {
    slug: "private-rehab-vs-nhs-addiction-treatment",
    pageTitle:
      "Private Rehab vs NHS Addiction Treatment | Insight Recovery Network",
    ogTitle:
      "Private Rehab vs NHS Addiction Treatment: What Is the Difference?",
    description:
      "Compare private rehab and NHS addiction treatment in the UK, including access, cost, detox, confidentiality, aftercare and support.",
    image: `${SITE_URL}/private-rehab-nhs.png`,
    imageAlt: "Private rehab and NHS addiction treatment comparison guidance in a calm professional consultation setting",
    date: "2026-05-20",
    type: "article",
  },
  {
    slug: "how-to-choose-private-rehab-centre-uk",
    pageTitle:
      "How to Choose the Right Private Rehab in the UK | Insight Recovery Network",
    ogTitle:
      "How to Choose the Right Private Rehab Centre in the UK",
    description:
      "Choosing private rehab in the UK? Learn what to ask, what to avoid, and how to find clinically suitable addiction treatment.",
    image: `${SITE_URL}/rehab-options.png`,
    imageAlt: "Private rehab guidance consultation with treatment planning notes and a calm professional setting",
    date: "2026-05-19",
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

/** Inject article-specific meta tags into the base index.html. */
function injectArticleMeta(html, article) {
  let out = html;

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

// ─────────────────────────────────────────────────────────────────────────────
// 3. OG IMAGE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const indexPath = resolve(distPublic, "index.html");
  if (!existsSync(indexPath)) {
    console.error("dist/public/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  const baseHtml = readFileSync(indexPath, "utf-8");

  // ── Step 1: Pre-render main site pages ───────────────────────────────────
  console.log("\n▶  Pre-rendering main site pages…\n");

  let pageCount = 0;
  for (const page of PAGES) {
    const html = injectPageMeta(baseHtml, page);
    writeFileSync(resolve(distPublic, page.file), html, "utf-8");
    console.log(`  ✓ ${page.route}  →  ${page.file}`);
    pageCount++;
  }

  console.log(`\n  Pre-rendered ${pageCount} site pages.\n`);

  // ── Step 2: Generate 1200×630 OG image for the new article ───────────────
  console.log("▶  Generating article OG images…\n");
  await generateArticleOgImage();

  // ── Step 3: Clean up old directory-based pre-rendered article files ───────
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

  // ── Step 4: Ensure resources/ directory exists ────────────────────────────
  mkdirSync(resourcesDir, { recursive: true });

  // ── Step 5: Pre-render per-article flat HTML files ────────────────────────
  console.log("\n▶  Pre-rendering article OG meta tags…\n");

  let articleCount = 0;
  for (const article of ARTICLES) {
    const html = injectArticleMeta(baseHtml, article);
    writeFileSync(resolve(resourcesDir, `${article.slug}.html`), html, "utf-8");
    console.log(`  ✓ /resources/${article.slug}  →  resources/${article.slug}.html`);
    articleCount++;
  }

  console.log(`\n  Pre-rendered ${articleCount} article pages.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
