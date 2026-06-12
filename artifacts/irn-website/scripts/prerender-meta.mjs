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
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distPublic = resolve(root, "dist/public");
const publicDir = resolve(root, "public");

const SITE_URL = "https://www.insightrecoverynetwork.com";
const SITE_NAME = "Insight Recovery Network";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-home.png`;

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
    ogImage: `${SITE_URL}/og-about.png`,
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
              About Insight Recovery Network
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
    ogImage: `${SITE_URL}/og-what-we-offer.png`,
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
              Addiction Counselling and Recovery Services
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
              Private Rehab and Detox Placement Guidance
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
              <li>International treatment centres in <a href="/private-rehab-thailand" style="color:#162B3B;">Thailand</a>, <a href="/private-rehab-spain" style="color:#162B3B;">Spain</a>, <a href="/private-rehab-south-africa" style="color:#162B3B;">South Africa</a>, and <a href="/private-rehab-sri-lanka" style="color:#162B3B;">Sri Lanka</a></li>
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
              Structured Online Addiction Recovery Programme
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
              Digital Recovery Tools for Addiction and Mental Health
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
              Speak Confidentially With Insight Recovery Network
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:580px;color:#4a5568;margin-bottom:2rem;">
              You do not need to have everything worked out before making contact. A private conversation can help clarify the most appropriate support for you or your family. All enquiries are handled with complete discretion.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Contact Details</h2>
            <p style="font-family:sans-serif;font-size:1rem;color:#4a5568;line-height:2;">
              Telephone: <a href="tel:+447415994475" style="color:#162B3B;">+44 7415 994475</a><br>
              Email: <a href="mailto:info@insightrecoverynetwork.com" style="color:#162B3B;">info@insightrecoverynetwork.com</a><br>
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
    route: "/recovery-plan-checklist",
    file: "recovery-plan-checklist.html",
    title: "Recovery Plan Checklist | Insight Recovery Network",
    description:
      "A practical one-page checklist to help you assess whether a recovery plan, treatment programme, or aftercare structure is the right fit.",
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
        <div style="max-width:1200px;margin:0 auto;padding:4rem 2rem;">
          <section style="max-width:760px;padding:2rem 0 3rem;">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free checklist</p>
            <h1 style="font-size:clamp(2.25rem,5vw,4rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;">
              A good plan can still be the wrong fit.
            </h1>
            <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              The Recovery Plan Checklist helps you assess whether a recovery plan, treatment programme, or aftercare structure has enough daily support, relapse planning, family clarity, and accountability to match real risk.
            </p>
            <a href="/recovery-plan-checklist" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Get the checklist</a>
          </section>
        </div>
      </main>
    `,
  },
  // ── New service / entity pages ─────────────────────────────────────────────
  {
    route: "/about-insight-recovery-network",
    file: "about-insight-recovery-network.html",
    title: "About Insight Recovery Network | UK Addiction Recovery Support Service",
    description:
      "Insight Recovery Network is a UK-based online addiction recovery and mental health support service. Private treatment placement guidance, online recovery programmes, family intervention, and digital recovery tools.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">About Insight Recovery Network</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              A confidential addiction recovery and mental health support service.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Insight Recovery Network is a UK-based, online-only service providing private treatment placement guidance, structured recovery programmes, family intervention support, and digital recovery tools for individuals and families navigating addiction and mental health challenges.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Service details</h2>
            <dl style="font-family:sans-serif;font-size:0.9rem;line-height:1.8;color:#4a5568;max-width:600px;">
              <dt style="font-weight:600;color:#162B3B;">Service type</dt><dd style="margin-bottom:0.75rem;">Private addiction recovery and mental health support</dd>
              <dt style="font-weight:600;color:#162B3B;">Location</dt><dd style="margin-bottom:0.75rem;">Newquay, Cornwall, UK</dd>
              <dt style="font-weight:600;color:#162B3B;">Service delivery</dt><dd style="margin-bottom:0.75rem;">Online only — telephone, video call, and Insight OS digital platform</dd>
              <dt style="font-weight:600;color:#162B3B;">Face-to-face appointments</dt><dd style="margin-bottom:0.75rem;">Not available</dd>
              <dt style="font-weight:600;color:#162B3B;">General enquiries</dt><dd style="margin-bottom:0.75rem;"><a href="mailto:info@insightrecoverynetwork.com" style="color:#162B3B;">info@insightrecoverynetwork.com</a></dd>
              <dt style="font-weight:600;color:#162B3B;">Clinical enquiries</dt><dd style="margin-bottom:0.75rem;"><a href="mailto:craig@insightrecoverynetwork.com" style="color:#162B3B;">craig@insightrecoverynetwork.com</a></dd>
              <dt style="font-weight:600;color:#162B3B;">Telephone</dt><dd><a href="tel:+447415994475" style="color:#162B3B;">+44 7415 994475</a></dd>
            </dl>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What we offer</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/treatment-placement" style="color:#162B3B;">Private Treatment Placement</a> — confidential guidance on private rehab, detox, and residential treatment in the UK and internationally</li>
              <li><a href="/online-programme" style="color:#162B3B;">Online Recovery Programme</a> — structured group sessions, one-to-one therapy, and relapse prevention planning</li>
              <li><a href="/what-we-offer" style="color:#162B3B;">Family Intervention Guidance</a> — support for families navigating addiction crises</li>
              <li><a href="/assessments" style="color:#162B3B;">Free Self-Assessments</a> — confidential assessments for alcohol use, drug use, anxiety, depression, and ADHD</li>
              <li><a href="/insight-os" style="color:#162B3B;">Insight OS</a> — a structured digital recovery system for daily check-ins and relapse prevention</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              Insight Recovery Network is a private support and treatment guidance service. We are not a regulated healthcare provider or a medical treatment service. We do not provide clinical diagnoses, prescriptions, or emergency crisis support. If you or someone you know is in immediate danger, please contact 999 or attend your nearest A&amp;E.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/online-addiction-recovery-programme-uk",
    file: "online-addiction-recovery-programme-uk.html",
    title: "Online Addiction Recovery Programme UK | Insight Recovery Network",
    description:
      "Structured online addiction recovery support for individuals in the UK. Group sessions, one-to-one therapy, relapse prevention planning, and Insight OS digital recovery tools. Professional support without residential treatment.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Online Recovery Support — UK</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              Structured online addiction recovery support, built around your life.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Professional, clinically informed recovery support delivered online — for individuals in the UK who need structure, accountability, and professional guidance without residential treatment.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Who online recovery support is suitable for</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Those who need structure but cannot step away from work or family responsibilities</li>
              <li>Those who have completed residential treatment and need robust aftercare</li>
              <li>Those wanting professional guidance without entering residential rehab</li>
              <li>Those relapsing despite trying to manage alone</li>
              <li>Families who need a structured approach for a loved one</li>
            </ul>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">When online support may not be appropriate</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Active dependency on alcohol, benzodiazepines, or opioids requiring medically supervised detox</li>
              <li>Severe or unstable mental health conditions requiring a higher level of clinical care</li>
              <li>Unsafe home environments where online support alone is insufficient</li>
              <li>Repeated residential relapses indicating a need for more intensive intervention</li>
              <li>Active crisis situations requiring emergency clinical intervention</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Frequently Asked Questions</h2>
            <dl style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:720px;">
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">Is online addiction recovery as effective as residential rehab?</dt>
              <dd>For some people and at certain stages, structured online support can be highly effective. For others with severe dependency or complex needs, residential treatment is safer and more appropriate.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">How is this different from a therapy app or 12-step group?</dt>
              <dd>Insight Recovery Network's online programme is clinically structured and professionally led — not automated content or anonymous peer support. It provides clinical oversight, individual therapeutic work, and structured relapse prevention planning.</dd>
            </dl>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/private-rehab-alternative-uk",
    file: "private-rehab-alternative-uk.html",
    title: "Private Rehab Alternative UK | Structured Online Recovery | Insight Recovery Network",
    description:
      "Exploring alternatives to private residential rehab in the UK? Structured online recovery support, relapse prevention planning, family guidance, and treatment placement where residential care is needed. Confidential and clinically informed.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Private Rehab Alternatives — UK</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              Not ready for residential rehab — or not sure it is necessary?
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Private residential rehab is not always the right answer. There are other routes — and being honest about which one is appropriate makes the difference between recovery that works and recovery that does not.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What Insight Recovery Network can offer</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/online-programme" style="color:#162B3B;">Structured online recovery support</a> — clinically led group sessions, individual therapeutic work, and relapse prevention planning</li>
              <li>Structured relapse prevention planning built around the individual's history, patterns, and goals</li>
              <li><a href="/what-we-offer" style="color:#162B3B;">Family intervention guidance</a> — support for families navigating addiction crises</li>
              <li><a href="/treatment-placement" style="color:#162B3B;">Treatment placement guidance</a> — where residential detox or rehab is needed, confidential guidance on appropriate settings</li>
              <li><a href="/assessments" style="color:#162B3B;">Free self-assessments</a> — understand what you are experiencing without obligation</li>
            </ul>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">When residential treatment is still needed</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:680px;margin-bottom:1rem;">Online recovery support is not an appropriate substitute for residential treatment where:</p>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>There is significant physical dependency on alcohol, benzodiazepines, or opioids requiring medically supervised withdrawal</li>
              <li>The home environment is unsafe, chaotic, or provides access to substances with no support network</li>
              <li>Multiple residential relapses indicate a need for more intensive clinical intervention</li>
              <li>Dual diagnosis involves severe and unstable mental health conditions</li>
              <li>The person cannot maintain safety without around-the-clock support</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Frequently Asked Questions</h2>
            <dl style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:720px;">
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">Is online support a genuine alternative to private rehab?</dt>
              <dd>For some people, structured online recovery support can be clinically appropriate — particularly where physical dependency does not require medical detox and the home environment is stable. For others, residential rehab is the safer choice.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">When would you recommend treatment placement over online support?</dt>
              <dd>Where there is significant physical dependency, an unsafe home environment, repeated residential relapse, or a need for around-the-clock support. We make this recommendation honestly when it is the right call.</dd>
            </dl>
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
    ogImage: `${SITE_URL}/og-assessments.png`,
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
              Free Confidential Addiction and Mental Health Assessments
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
  // ── Individual assessment intro pages ──────────────────────────────────────
  {
    route: "/assessments/alcohol-detox",
    file: "_assessments/alcohol-detox.html",
    title: "Alcohol &amp; Detox Suitability Assessment | Insight Recovery Network",
    description:
      "Free confidential assessment to understand whether alcohol use may carry withdrawal risk and whether medical detox may be appropriate. Takes 10–15 minutes. No registration required.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Alcohol &amp; Detox Suitability Assessment — free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              Designed for individuals drinking heavily who are considering stopping or reducing. This assessment explores whether alcohol use may carry withdrawal risk and whether medical detox may be appropriate. Takes 10–15 minutes and requires no registration.
            </p>
            <a href="/assessments/alcohol-detox" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Alcohol &amp; Detox Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Alcohol use patterns, frequency, and quantity</li>
              <li>Withdrawal history and previous detox experiences</li>
              <li>Physical health factors and current medications</li>
              <li>Detox suitability and level of supervision recommended</li>
              <li>Appropriate next steps and support options</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. Alcohol withdrawal can be medically serious. Please contact your GP or seek medical advice before stopping or reducing alcohol use if you are concerned.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/alcohol-use",
    file: "_assessments/alcohol-use.html",
    title: "Alcohol Use Self-Assessment | Insight Recovery Network",
    description:
      "Free confidential alcohol use self-assessment. Reflect on how drinking may be affecting your health, relationships, and daily life — personalised results sent to your email. No registration required.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Alcohol Use Assessment — understand your relationship with alcohol.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This free assessment explores current drinking patterns and helps you understand whether alcohol may be affecting your health, relationships, work, or daily life. Based on clinically validated screening criteria. Takes 7–10 minutes and requires no registration.
            </p>
            <a href="/assessments/alcohol-use" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Alcohol Use Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Drinking frequency, quantity, and patterns</li>
              <li>Impact on health, mood, and relationships</li>
              <li>Signs of dependency or difficulty controlling use</li>
              <li>Motivation and readiness to change</li>
              <li>Appropriate support options and next steps</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. If you are concerned about alcohol withdrawal or urgent health risks, please contact your GP or seek medical support immediately.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/drug-use",
    file: "_assessments/drug-use.html",
    title: "Drug Use &amp; Substance Self-Assessment | Insight Recovery Network",
    description:
      "Free confidential drug use and substance assessment. Explore your relationship with substances and understand whether professional support or treatment may be appropriate. No registration required.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Drug Use &amp; Substance Assessment — free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This free assessment explores your relationship with substances — including recreational drugs, prescription medications, and stimulants — and helps you understand whether the level of use may be causing harm or whether professional support is appropriate. Takes 7–10 minutes and requires no registration.
            </p>
            <a href="/assessments/drug-use" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Drug Use Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Substance type, frequency, and patterns of use</li>
              <li>Impact on daily functioning and relationships</li>
              <li>Dependency risk and withdrawal considerations</li>
              <li>Co-occurring mental health concerns</li>
              <li>Appropriate treatment and support pathways</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. If you are concerned about substance withdrawal or urgent health risks, please contact your GP or seek medical support immediately.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/detox",
    file: "_assessments/detox.html",
    title: "Detox Suitability Assessment | Insight Recovery Network",
    description:
      "Free confidential detox suitability assessment. Understand whether medical detox is advisable, what level of supervision may be needed, and how to approach stopping safely. No registration required.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Detox Suitability Assessment — understand what level of support you may need.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This assessment explores your substance use, medical history, and withdrawal risk to help determine whether detox is appropriate and what level of medical supervision may be advisable. Detox from alcohol, benzodiazepines, or opioids can carry serious risk without proper guidance. Takes 8–12 minutes and requires no registration.
            </p>
            <a href="/assessments/detox" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Detox Suitability Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Substance use and dependence level</li>
              <li>Previous detox or withdrawal experiences</li>
              <li>Physical health, medications, and risk factors</li>
              <li>Appropriate detox pathway and supervision level</li>
              <li>Whether residential or community detox is advisable</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. Detox from alcohol, benzodiazepines, or opioids can be medically serious. Always seek professional guidance before stopping or reducing use.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/anxiety",
    file: "_assessments/anxiety.html",
    title: "Anxiety Screening Assessment — Free &amp; Confidential | Insight Recovery Network",
    description:
      "Free confidential anxiety self-assessment based on GAD-7 criteria. Understand how anxiety may be affecting your thoughts, physical symptoms, and daily functioning — results sent to your email.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Anxiety Screening Assessment — free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This assessment explores anxiety patterns including worry, physical tension, sleep disruption, and avoidance behaviour. Based on clinically validated GAD-7 screening criteria. Designed to help individuals understand whether anxiety may be contributing to addictive behaviour or recovery difficulty. Takes 7–10 minutes and requires no registration.
            </p>
            <a href="/assessments/anxiety" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Anxiety Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Frequency and severity of anxious thoughts and worry</li>
              <li>Physical symptoms including tension, restlessness, and sleep difficulties</li>
              <li>Impact on work, relationships, and daily functioning</li>
              <li>Connection between anxiety and substance use</li>
              <li>Appropriate support and treatment considerations</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. If you are experiencing a mental health crisis or urgent distress, please contact your GP or a mental health crisis service immediately.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/depression",
    file: "_assessments/depression.html",
    title: "Depression Screening Assessment — Free &amp; Confidential | Insight Recovery Network",
    description:
      "Free confidential depression self-assessment based on PHQ-9 criteria. Understand how low mood may be affecting your energy, motivation, and wellbeing — personalised results sent to your email.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Depression Screening Assessment — free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This assessment explores low mood, reduced motivation, sleep difficulties, and changes in energy and outlook. Based on PHQ-9 screening criteria. Designed to help individuals understand whether depression may be a factor in their wellbeing or recovery. Takes 7–10 minutes and requires no registration.
            </p>
            <a href="/assessments/depression" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start Depression Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Mood, energy, and motivation patterns</li>
              <li>Sleep, appetite, and concentration changes</li>
              <li>Feelings of hopelessness or worthlessness</li>
              <li>Impact on daily life, work, and relationships</li>
              <li>Connection between depression and substance use or recovery</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. If you are experiencing suicidal thoughts or a mental health crisis, please contact your GP, a crisis line, or emergency services immediately.
            </p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/assessments/adhd-impulsivity",
    file: "_assessments/adhd-impulsivity.html",
    title: "ADHD &amp; Impulsivity Self-Assessment | Insight Recovery Network",
    description:
      "Free confidential ADHD and impulsivity self-assessment. Explore patterns of attention, focus, and impulsive behaviour that may be affecting your work, relationships, or recovery. No registration required.",
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
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              ADHD &amp; Impulsivity Assessment — free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This assessment explores patterns of attention, focus, restlessness, and impulsive behaviour that may be contributing to addictive behaviour, relapse, or difficulty engaging with structured treatment. Designed for individuals exploring whether ADHD may be a factor in their recovery. Takes 10–12 minutes and requires no registration.
            </p>
            <a href="/assessments/adhd-impulsivity" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Start ADHD &amp; Impulsivity Assessment</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What This Assessment Covers</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Attention, focus, and concentration patterns</li>
              <li>Impulsivity, decision-making, and self-control</li>
              <li>Restlessness, hyperactivity, and emotional regulation</li>
              <li>Impact on work, relationships, and daily life</li>
              <li>Connection between ADHD patterns and addiction or relapse</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <p style="font-family:sans-serif;font-size:0.875rem;line-height:1.8;max-width:680px;color:#4a5568;">
              This assessment is for informational purposes only and does not constitute a clinical assessment, diagnosis, or medical advice. Only a qualified clinician can diagnose ADHD. Results are intended to help you reflect and consider whether professional guidance may be appropriate.
            </p>
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
    ogImage: `${SITE_URL}/og-resources.png`,
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
              Addiction and Mental Health Recovery Resources
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;">
              Authoritative articles on addiction, recovery, treatment options, and mental health — written by Craig Bilton to help individuals and families understand their situation and make informed decisions.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:2rem;">All Articles</h2>
            <div style="display:flex;flex-direction:column;gap:0;">
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Recovery &amp; Wellbeing</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/why-willpower-is-not-a-recovery-plan" style="color:#162B3B;text-decoration:none;">Why Willpower Is Not a Recovery Plan</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Willpower can help someone get through a difficult moment, but it is not the same as having a recovery plan. Lasting recovery needs structure, support, emotional regulation, accountability and a clear relapse prevention strategy.</p>
                <a href="/resources/why-willpower-is-not-a-recovery-plan" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Treatment Options</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/online-addiction-support-vs-residential-rehab" style="color:#162B3B;text-decoration:none;">Online Addiction Support vs Residential Rehab: Which Is More Effective?</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Online addiction support or residential rehab? A clinically informed UK guide to choosing the right level of care based on risk, fit, and recovery needs.</p>
                <a href="/resources/online-addiction-support-vs-residential-rehab" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
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
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
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
  {
    route: "/privacy-policy",
    file: "privacy-policy.html",
    title: "Privacy Policy | Insight Recovery Network",
    description:
      "How Insight Recovery Network collects, uses and protects your personal data under UK GDPR. All enquiries are handled with complete discretion.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Legal</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Privacy Policy</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:2rem;max-width:640px;">
            We are committed to protecting the privacy of everyone who contacts us. This page explains what personal data we collect, how we use it, and your rights under UK GDPR. We are based in Newquay, Cornwall, UK.
          </p>
          <a href="mailto:info@insightrecoverynetwork.com" style="font-family:sans-serif;font-size:0.9rem;color:#162B3B;text-decoration:underline;">info@insightrecoverynetwork.com</a>
        </div>
      </main>
    `,
  },
  {
    route: "/terms-of-service",
    file: "terms-of-service.html",
    title: "Terms of Service | Insight Recovery Network",
    description:
      "Terms governing use of the Insight Recovery Network website and services. We provide private online support and guidance — not regulated medical treatment or emergency care.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Legal</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Terms of Service</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:2rem;max-width:640px;">
            Insight Recovery Network is an online-only private support and guidance service. We do not provide regulated medical treatment, clinical diagnosis, or emergency care. Governing law: England and Wales.
          </p>
          <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Contact Us</a>
        </div>
      </main>
    `,
  },
  {
    route: "/cookie-policy",
    file: "cookie-policy.html",
    title: "Cookie Policy | Insight Recovery Network",
    description:
      "Insight Recovery Network uses only essential session cookies. We do not use tracking, advertising or analytics cookies. Learn what cookies we set and how to manage them.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Legal</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Cookie Policy</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:2rem;max-width:640px;">
            We use only strictly necessary session storage for admin authentication. We do not use tracking, advertising, or analytics cookies. No cookie consent banner is required.
          </p>
          <a href="mailto:info@insightrecoverynetwork.com" style="font-family:sans-serif;font-size:0.9rem;color:#162B3B;text-decoration:underline;">info@insightrecoverynetwork.com</a>
        </div>
      </main>
    `,
  },
  {
    route: "/clinical-disclaimer",
    file: "clinical-disclaimer.html",
    title: "Clinical Disclaimer | Insight Recovery Network",
    description:
      "Insight Recovery Network provides private online support and guidance — not regulated medical treatment. Read our full clinical disclaimer including emergency service contacts.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak Confidentially</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Legal</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Clinical Disclaimer</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:1.5rem;max-width:640px;">
            Insight Recovery Network is not a regulated medical provider, not registered with the CQC, and not an emergency service. If you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E. For 24/7 emotional support, contact the Samaritans on <strong>116 123</strong>.
          </p>
          <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
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

  // <title> tag
  out = out.replace(
    /(<title>)[^<]*(<\/title>)/,
    `$1${page.title}$2`
  );

  // meta name="description"
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${esc(page.description)}$2`
  );

  // canonical href
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonicalUrl}$2`
  );

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
    `$1\n${page.body}\n${STATIC_FOOTER}\n    $2$3`
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
      "Why Can't I Stop Using? | Insight Recovery",
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
      "Alcohol Dependency Signs | Insight Recovery",
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
      "What Happens in Rehab? | Insight Recovery",
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
      "Managing Relapse in Recovery | Insight Recovery",
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
      "Supporting a Loved One in Recovery | Insight Recovery",
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
      "Mental Health and Addiction | Insight Recovery",
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
      "Online Recovery Programmes UK | Insight Recovery",
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
  {
    slug: "online-addiction-support-vs-residential-rehab",
    pageTitle:
      "Online Addiction Support vs Residential Rehab UK: Which Is Right? | Insight Recovery Network",
    ogTitle:
      "Online Addiction Support vs Residential Rehab UK: Which Is Right?",
    description:
      "Online addiction support or residential rehab? A clinically informed UK guide to choosing the right level of care based on risk, fit, and recovery needs.",
    image: `${SITE_URL}/online-vs-residential-hero.png`,
    imageAlt: "A calm professional editorial photograph with a notebook, coffee cup and desk lamp in navy and gold, representing the considered choice between online addiction support and residential rehab",
    date: "2026-05-26",
    type: "article",
  },
  {
    slug: "why-willpower-is-not-a-recovery-plan",
    pageTitle:
      "Why Willpower Is Not a Recovery Plan | Addiction Recovery Support UK | Insight Recovery Network",
    ogTitle:
      "Why Willpower Is Not a Recovery Plan | Addiction Recovery Support UK",
    description:
      "Willpower alone is rarely enough for lasting addiction recovery. Learn why structure, support, relapse prevention planning and emotional regulation matter.",
    image: `${SITE_URL}/article-willpower.png`,
    imageAlt: "Why Willpower Is Not a Recovery Plan — Insight Recovery Network branded editorial image with navy and gold design showing a mug reading 'Recovery Is a Plan Not a Promise'",
    date: "2026-05-29",
    type: "article",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2b. FULL ARTICLE BODY PRE-RENDERING + STRUCTURED DATA (JSON-LD)
//
// Previously article pages only had their <meta> tags swapped, which meant
// crawlers without JavaScript (Google first-pass, Bing, ChatGPT, Claude,
// Perplexity, etc.) saw the home-page body on every /resources/* URL —
// i.e. 11 duplicates of the home page. The functions below render the full
// article content statically and embed Article / FAQPage / BreadcrumbList /
// Organization / Person JSON-LD so both search engines and LLMs can read
// the real content without executing JS.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the full article data (content, faq, author, readingTime) from
 * src/data/articles.ts. Tries native TS import first (Node >= 23), then
 * falls back to transforming via vite's bundled esbuild. Returns null on
 * failure so the build degrades gracefully to meta-only prerendering.
 */
async function loadTsModule(relPath) {
  const tsPath = resolve(root, relPath);
  try {
    return await import(pathToFileURL(tsPath).href);
  } catch {
    /* fall through to esbuild transform */
  }
  try {
    const { transformWithEsbuild } = await import("vite");
    const src = readFileSync(tsPath, "utf-8");
    const { code } = await transformWithEsbuild(src, tsPath, {
      loader: "ts",
      format: "esm",
    });
    const tmpPath = resolve(distPublic, `.tmp-${relPath.replace(/[^a-z0-9]/gi, "_")}.mjs`);
    writeFileSync(tmpPath, code, "utf-8");
    const mod = await import(pathToFileURL(tmpPath).href);
    rmSync(tmpPath, { force: true });
    return mod;
  } catch (err) {
    console.warn(`  ⚠ Could not load ${relPath} (${err?.message}).`);
    return null;
  }
}

async function loadFullArticles() {
  const mod = await loadTsModule("src/data/articles.ts");
  return mod?.articles?.length ? mod.articles : null;
}

async function loadDestinations() {
  const mod = await loadTsModule("src/data/destinations.ts");
  return mod?.destinations?.length ? mod.destinations : null;
}

/** Escape HTML text content (not attributes). */
function escText(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Render inline markdown (**bold**, [text](url)) inside an escaped line. */
function inlineMd(line) {
  let out = escText(line);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong style=\"color:#162B3B;\">$1</strong>");
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#162B3B;text-decoration:underline;">$1</a>'
  );
  return out;
}

/**
 * Convert the article markdown-ish content (same dialect rendered by
 * src/pages/ResourceDetail.tsx: ## / ### headings, "- " lists, | tables |,
 * **bold**, [links](url), paragraphs) into static inline-styled HTML.
 */
function markdownToHtml(content) {
  const lines = content.split("\n");
  const html = [];
  let listItems = null;
  let tableRows = null;

  const P_STYLE =
    "font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin:1rem 0;max-width:680px;";
  const H2_STYLE =
    "font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin:2.5rem 0 1rem;max-width:680px;";
  const H3_STYLE =
    "font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:500;color:#162B3B;margin:2rem 0 0.75rem;max-width:680px;";

  const flushList = () => {
    if (listItems?.length) {
      html.push(
        `<ul style="font-family:sans-serif;font-size:0.95rem;line-height:1.9;color:#4a5568;padding-left:1.25rem;margin:1rem 0;max-width:680px;">${listItems
          .map((li) => `<li style="margin-bottom:0.35rem;">${li}</li>`)
          .join("")}</ul>`
      );
    }
    listItems = null;
  };

  const flushTable = () => {
    if (tableRows?.length >= 2) {
      const cells = (row) =>
        row.split("|").map((s) => s.trim()).filter(Boolean);
      const isSeparator = (row) =>
        cells(row).every((c) => /^[-: ]+$/.test(c));
      const headers = cells(tableRows[0]);
      const dataRows = tableRows.slice(1).filter((r) => !isSeparator(r));
      html.push(
        `<div style="overflow-x:auto;margin:1.5rem 0;max-width:680px;"><table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:0.875rem;color:#4a5568;">` +
          `<thead><tr>${headers
            .map(
              (h) =>
                `<th style="text-align:left;padding:0.6rem 0.75rem;border-bottom:2px solid rgba(201,169,110,0.5);color:#162B3B;">${inlineMd(h)}</th>`
            )
            .join("")}</tr></thead>` +
          `<tbody>${dataRows
            .map(
              (r) =>
                `<tr>${cells(r)
                  .map(
                    (c) =>
                      `<td style="padding:0.6rem 0.75rem;border-bottom:1px solid rgba(201,169,110,0.25);vertical-align:top;">${inlineMd(c)}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}</tbody></table></div>`
      );
    }
    tableRows = null;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    // [CTA:/path:Button Label] ... [/CTA] — inline CTA callout block
    // (mirrors the block parser in src/pages/ResourceDetail.tsx)
    if (line.startsWith("[CTA:")) {
      flushList();
      flushTable();
      const tagMatch = line.match(/^\[CTA:([^:\]]+):([^\]]+)\]$/);
      const ctaHref = tagMatch ? tagMatch[1] : "/contact";
      const ctaLabel = tagMatch ? tagMatch[2] : "Speak Confidentially";
      const ctaLines = [];
      idx++;
      while (idx < lines.length && lines[idx].trim() !== "[/CTA]") {
        if (lines[idx].trim()) ctaLines.push(lines[idx].trim());
        idx++;
      }
      html.push(
        `<div style="margin:2.5rem 0;padding:1.75rem 2rem;border-left:4px solid #C9A96E;background:linear-gradient(135deg,rgba(246,244,240,0.95),rgba(242,237,227,0.7));max-width:680px;">` +
          ctaLines
            .map((l) => `<p style="${P_STYLE}">${inlineMd(l)}</p>`)
            .join("") +
          `<a href="${ctaHref}" style="display:inline-block;margin-top:0.5rem;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">${escText(ctaLabel)}</a>` +
          `</div>`
      );
      continue;
    }

    if (line.includes("|") && line.split("|").filter(Boolean).length >= 2) {
      flushList();
      (tableRows ??= []).push(line);
      continue;
    }
    flushTable();

    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      html.push(`<h3 style="${H3_STYLE}">${inlineMd(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      html.push(`<h2 style="${H2_STYLE}">${inlineMd(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("- ")) {
      (listItems ??= []).push(inlineMd(line.slice(2)));
      continue;
    }
    if (/^\*\*[^*]+\*\*$/.test(line)) {
      flushList();
      html.push(
        `<p style="font-family:sans-serif;font-weight:600;color:#162B3B;margin:1.5rem 0 0.5rem;max-width:680px;">${escText(line.replace(/^\*\*|\*\*$/g, ""))}</p>`
      );
      continue;
    }
    flushList();
    html.push(`<p style="${P_STYLE}">${inlineMd(line)}</p>`);
  }
  flushList();
  flushTable();
  return html.join("\n");
}

/** Shared site header used in statically rendered article bodies. */
const STATIC_HEADER = `
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
      </header>`;

/**
 * Shared static footer appended to every prerendered page and article.
 * Gives crawlers and LLMs a consistent sitewide internal-link block,
 * contact details, and the regulatory disclaimer.
 */
const STATIC_FOOTER = `
      <footer style="background:#162B3B;color:#F6F4F0;padding:3rem 2rem 2rem;font-family:sans-serif;">
        <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;">
          <div>
            <p style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;margin-bottom:0.75rem;">Insight Recovery Network</p>
            <p style="font-size:0.8rem;line-height:1.7;opacity:0.75;">Private addiction and mental health support — online programmes, assessments and treatment placement. Based in Newquay, Cornwall, UK. Supporting clients across the UK and internationally.</p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Services</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="/treatment-placement" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a><br><a href="/online-programme" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Recovery Programme</a><br><a href="/insight-os" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Insight OS</a><br><a href="/what-we-offer" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Family &amp; Intervention Guidance</a></p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Free Assessments</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="/assessments/alcohol-use" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Alcohol Use</a><br><a href="/assessments/drug-use" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Drug Use</a><br><a href="/assessments/detox" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Detox Suitability</a><br><a href="/assessments" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">All Assessments</a></p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Contact</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="tel:+447415994475" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">+44 7415 994475</a><br><a href="mailto:info@insightrecoverynetwork.com" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">info@insightrecoverynetwork.com</a><br><a href="/contact" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Speak Confidentially</a><br><a href="/resources" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources &amp; Articles</a></p>
          </div>
        </div>
        <div style="max-width:1200px;margin:2rem auto 0;padding-top:1.5rem;border-top:1px solid rgba(246,244,240,0.15);">
          <p style="font-size:0.75rem;line-height:1.7;opacity:0.6;">Insight Recovery Network is a private support and treatment guidance service. We are not a regulated healthcare provider and do not provide clinical diagnoses, prescriptions, or emergency crisis support. If you or someone you know is in immediate danger, call 999 or attend your nearest A&amp;E.</p>
          <p style="font-size:0.75rem;margin-top:0.75rem;"><a href="/privacy-policy" style="color:#F6F4F0;opacity:0.6;text-decoration:none;">Privacy Policy</a> · <a href="/terms-of-service" style="color:#F6F4F0;opacity:0.6;text-decoration:none;">Terms of Service</a> · <a href="/cookie-policy" style="color:#F6F4F0;opacity:0.6;text-decoration:none;">Cookie Policy</a> · <a href="/clinical-disclaimer" style="color:#F6F4F0;opacity:0.6;text-decoration:none;">Clinical Disclaimer</a></p>
        </div>
      </footer>`;

/** Build the full static body HTML for an article page. */
function buildArticleBodyHtml(meta, full) {
  const canonicalUrl = `${SITE_URL}/resources/${full.slug}`;
  const dateFormatted = new Date(full.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const faqHtml = full.faq?.length
    ? `
          <section style="padding:3rem 0;border-top:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin-bottom:1.5rem;">Frequently Asked Questions</h2>
            ${full.faq
              .map(
                (f) => `
            <div style="margin-bottom:1.5rem;max-width:680px;">
              <h3 style="font-family:sans-serif;font-size:1rem;font-weight:600;color:#162B3B;margin-bottom:0.5rem;">${escText(f.question)}</h3>
              <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;">${inlineMd(f.answer)}</p>
            </div>`
              )
              .join("")}
          </section>`
    : "";

  return `${STATIC_HEADER}
      <main style="background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <nav aria-label="Breadcrumb" style="font-family:sans-serif;font-size:0.8rem;color:#4a5568;margin-bottom:2rem;">
            <a href="/" style="color:#4a5568;">Home</a> › <a href="/resources" style="color:#4a5568;">Resources</a> › <span>${escText(full.title)}</span>
          </nav>
          <article>
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.9);margin-bottom:1.25rem;">${escText(full.category)}</p>
            <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.9rem,4vw,2.75rem);line-height:1.12;font-weight:500;margin-bottom:1rem;max-width:720px;">${escText(full.title)}</h1>
            <p style="font-family:sans-serif;font-size:0.85rem;color:#4a5568;margin-bottom:2.5rem;">By <a href="/about" style="color:#162B3B;">${escText(full.author)}</a>, ${escText(full.authorRole)} · ${dateFormatted} · ${full.readingTime} min read</p>
            ${markdownToHtml(full.content)}
          </article>
          ${faqHtml}
          <section style="padding:3rem 0;border-top:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;margin-bottom:1rem;">Speak Confidentially</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">If anything in this article resonates with your situation, a private conversation can help clarify the most appropriate support for you or your family. All enquiries are handled with complete discretion.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;margin-right:0.75rem;">Get in Touch</a>
            <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
          </section>
        </div>
      </main>
${STATIC_FOOTER}`;
}

/** Build the full static body HTML for a destination placement page. */
function buildDestinationBodyHtml(d) {
  const li = (item) =>
    `<li style="margin-bottom:0.5rem;">${inlineMd(item)}</li>`;
  const ul = (items) =>
    `<ul style="font-family:sans-serif;font-size:0.95rem;line-height:1.9;color:#4a5568;padding-left:1.25rem;margin:1rem 0;max-width:680px;">${items.map(li).join("")}</ul>`;
  const h2 = (text) =>
    `<h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;font-weight:500;color:#162B3B;margin-bottom:1.25rem;">${escText(text)}</h2>`;
  const p = (text, style = "") =>
    `<p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:1rem;max-width:680px;${style}">${escText(text)}</p>`;

  return `${STATIC_HEADER}
      <main style="background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.9);margin-bottom:1.25rem;">${escText(d.heroEyebrow)}</p>
            <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">${escText(d.heroHeading)}</h1>
            ${p(d.heroIntro)}
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;margin-top:1rem;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Speak Confidentially</a>
              <a href="/treatment-placement" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">How Placement Works</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            ${h2(d.whyHeading)}
            ${p(d.whyIntro)}
            ${ul(d.whyPoints)}
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            ${h2(d.costHeading)}
            ${p(d.costIntro, "font-size:1.05rem;color:#162B3B;")}
            ${p(d.costNote, "font-size:0.85rem;")}
            <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.2rem;font-weight:500;color:#162B3B;margin:1.5rem 0 0.75rem;">What treatment typically includes</h3>
            ${ul(d.costIncludes)}
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            ${h2(d.whoHeading)}
            ${ul(d.whoPoints)}
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            ${h2("Frequently asked questions")}
            ${d.faqs
              .map(
                (f) => `
            <div style="margin-bottom:1.5rem;max-width:680px;">
              <h3 style="font-family:sans-serif;font-size:1rem;font-weight:600;color:#162B3B;margin-bottom:0.5rem;">${escText(f.question)}</h3>
              <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;">${escText(f.answer)}</p>
            </div>`
              )
              .join("")}
          </section>
          <section style="padding:3rem 0;">
            ${h2(`Considering treatment in ${d.country}?`)}
            ${p("A confidential conversation can clarify whether this is the right setting for your situation — clinically and practically. Independent guidance, no pressure, no commercial ties to any facility.")}
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;margin-right:0.75rem;">Speak Confidentially</a>
            <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a Free Assessment</a>
          </section>
        </div>
      </main>
${STATIC_FOOTER}`;
}

function buildDestinationJsonLd(d) {
  const canonicalUrl = `${SITE_URL}/${d.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: `Private Rehab Placement — ${d.country}`,
      serviceType: "Addiction treatment placement guidance",
      description: d.metaDescription,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: d.country },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: d.costLow,
        highPrice: d.costHigh,
        description: d.costIntro,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: d.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];
}

// ── JSON-LD builders ─────────────────────────────────────────────────────────

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
  image: DEFAULT_OG_IMAGE,
  description:
    "Private addiction and mental health support service providing online recovery programmes, confidential treatment placement guidance in the UK and internationally, family intervention support, free self-assessments, and the Insight OS digital recovery platform.",
  email: "info@insightrecoverynetwork.com",
  telephone: "+447415994475",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Newquay",
    addressRegion: "Cornwall",
    addressCountry: "GB",
  },
  areaServed: [{ "@type": "Country", name: "United Kingdom" }, "Worldwide"],
  founder: { "@id": `${SITE_URL}/#craig-bilton` },
  knowsAbout: [
    "Addiction recovery",
    "Private rehab placement",
    "Alcohol and drug detox guidance",
    "Online addiction recovery programmes",
    "Family intervention",
    "Relapse prevention",
  ],
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#craig-bilton`,
  name: "Craig Bilton",
  jobTitle: "Founder & Clinical Director",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  url: `${SITE_URL}/about`,
  description:
    "Addiction treatment specialist with over 20 years of international experience spanning residential rehabilitation, online recovery support, and complex case management across the UK and internationally.",
  knowsAbout: [
    "Addiction treatment",
    "Recovery planning",
    "Relapse prevention",
    "Residential rehabilitation",
    "Dual diagnosis",
    "Family intervention",
  ],
};

function buildArticleJsonLd(meta, full) {
  const canonicalUrl = `${SITE_URL}/resources/${meta.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: full?.title ?? meta.ogTitle,
    description: meta.description,
    image: meta.image,
    datePublished: `${meta.date}T00:00:00+00:00`,
    dateModified: `${meta.date}T00:00:00+00:00`,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#craig-bilton`,
      name: "Craig Bilton",
      jobTitle: "Founder & Clinical Director",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
}

function buildFaqJsonLd(meta, full) {
  if (!full?.faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/resources/${meta.slug}#faq`,
    mainEntity: full.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function buildBreadcrumbJsonLd(meta, full) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` },
      { "@type": "ListItem", position: 3, name: full?.title ?? meta.ogTitle, item: `${SITE_URL}/resources/${meta.slug}` },
    ],
  };
}

/** Inject JSON-LD script tags before </head>. Skips null entries. */
function injectJsonLd(html, jsonLdObjects) {
  const scripts = jsonLdObjects
    .filter(Boolean)
    .map(
      (obj) =>
        `<script type="application/ld+json">${JSON.stringify(obj).replace(/<\//g, "<\\/")}</script>`
    )
    .join("\n    ");
  if (!scripts) return html;
  return html.replace("</head>", `    ${scripts}\n  </head>`);
}

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

/**
 * Inject article-specific meta tags into the base index.html.
 * When `full` (the matching entry from src/data/articles.ts) is provided,
 * also replaces the static home-page body with the full article body and
 * embeds Article / FAQPage / BreadcrumbList JSON-LD.
 */
function injectArticleMeta(html, article, full = null) {
  let out = html;
  const canonicalUrl = `${SITE_URL}/resources/${article.slug}`;

  // <title> tag
  out = out.replace(
    /(<title>)[^<]*(<\/title>)/,
    `$1${esc(article.pageTitle)}$2`
  );

  // meta name="description"
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${esc(article.description)}$2`
  );

  // canonical href
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonicalUrl}$2`
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

  // Replace the static home-page body with the full article body so
  // crawlers and LLMs without JS see the real article, not the home page.
  if (full) {
    const articleBody = buildArticleBodyHtml(article, full);
    const bodyReplaced = out.replace(
      /(<div id="root">)[\s\S]*(<\/div>)(\s*\n\s*<!-- React mounts here)/,
      `$1\n${articleBody}\n    $2$3`
    );
    if (bodyReplaced === out) {
      console.warn(
        `  ⚠ Body replacement failed for /resources/${article.slug} — root marker not found.`
      );
    } else {
      out = bodyReplaced;
    }
  }

  // Structured data: Article + Breadcrumb (+ FAQ where present) + entity graph
  out = injectJsonLd(out, [
    buildArticleJsonLd(article, full),
    buildFaqJsonLd(article, full),
    buildBreadcrumbJsonLd(article, full),
    ORGANIZATION_JSONLD,
    PERSON_JSONLD,
  ]);

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

  // sharp is loaded lazily so the prerender can still run in environments
  // where sharp's native binaries are unavailable (e.g. CI on another OS).
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("  ⚠ sharp unavailable on this platform — skipping OG image generation.");
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

  // Ensure sub-directories used by PAGES entries exist before writing
  mkdirSync(resolve(distPublic, "_assessments"), { recursive: true });

  let pageCount = 0;
  for (const page of PAGES) {
    const html = injectJsonLd(injectPageMeta(baseHtml, page), [
      ORGANIZATION_JSONLD,
      PERSON_JSONLD,
    ]);
    writeFileSync(resolve(distPublic, page.file), html, "utf-8");
    console.log(`  ✓ ${page.route}  →  ${page.file}`);
    pageCount++;
  }

  console.log(`\n  Pre-rendered ${pageCount} site pages.\n`);

  // ── Step 1a: Pre-render destination placement pages ───────────────────────
  const destinations = await loadDestinations();
  if (destinations) {
    LOADED_DESTINATIONS = destinations;
    console.log("▶  Pre-rendering destination placement pages…\n");
    for (const d of destinations) {
      const page = {
        route: `/${d.slug}`,
        file: `${d.slug}.html`,
        title: esc(d.seoTitle),
        description: d.metaDescription,
        ogImage: `${SITE_URL}/opengraph.jpg`,
        body: buildDestinationBodyHtml(d),
      };
      const html = injectJsonLd(injectPageMeta(baseHtml, page), [
        ...buildDestinationJsonLd(d),
        ORGANIZATION_JSONLD,
        PERSON_JSONLD,
      ]);
      writeFileSync(resolve(distPublic, page.file), html, "utf-8");
      console.log(`  ✓ ${page.route}  →  ${page.file}  (full body + Service/FAQ JSON-LD)`);
    }
    console.log("");
  } else {
    console.warn("  ⚠ Destination data unavailable — skipping destination pages.\n");
  }

  // ── Step 1b: Inject Organization + Person JSON-LD into the home page ──────
  if (!baseHtml.includes("#organization")) {
    const homeHtml = injectJsonLd(baseHtml, [ORGANIZATION_JSONLD, PERSON_JSONLD]);
    writeFileSync(indexPath, homeHtml, "utf-8");
    console.log("  ✓ index.html — injected Organization + Person JSON-LD\n");
  }

  // ── Step 2: Generate 1200×630 OG image for the new article ───────────────
  console.log("▶  Generating article OG images…\n");
  await generateArticleOgImage();

  // ── Step 3: Clean up old directory-based pre-rendered article files ───────
  // They cause 403s on static servers that disable directory listing.
  // Clean up old resources/ directory (previously caused directory conflict)
  const oldResourcesDir = resolve(distPublic, "resources");
  if (existsSync(oldResourcesDir)) {
    rmSync(oldResourcesDir, { recursive: true, force: true });
    console.log(`  🗑  Removed old conflicting directory: resources/`);
  }

  // Clean up old assessments/ directory (previously caused directory conflict)
  const oldAssessmentsDir = resolve(distPublic, "assessments");
  if (existsSync(oldAssessmentsDir)) {
    rmSync(oldAssessmentsDir, { recursive: true, force: true });
    console.log(`  🗑  Removed old conflicting directory: assessments/`);
  }

  const resourcesDir = resolve(distPublic, "_resources");

  // ── Step 4: Ensure _resources/ directory exists ───────────────────────────
  mkdirSync(resourcesDir, { recursive: true });

  // ── Step 5: Pre-render per-article flat HTML files ────────────────────────
  console.log("\n▶  Pre-rendering full article pages…\n");

  const fullArticles = await loadFullArticles();
  if (!fullArticles) {
    console.warn("  ⚠ Full article data unavailable — article pages will be meta-only.\n");
  }

  let articleCount = 0;
  for (const article of ARTICLES) {
    const full = fullArticles?.find((a) => a.slug === article.slug) ?? null;
    const html = injectArticleMeta(baseHtml, article, full);
    writeFileSync(resolve(resourcesDir, `${article.slug}.html`), html, "utf-8");
    console.log(
      `  ✓ /resources/${article.slug}  →  _resources/${article.slug}.html${full ? "  (full body + JSON-LD)" : "  (meta only)"}`
    );
    articleCount++;
  }

  console.log(`\n  Pre-rendered ${articleCount} article pages.\n`);

  // ── Step 6: Generate sitemap.xml ─────────────────────────────────────────
  console.log("▶  Generating sitemap.xml…\n");
  const today = new Date().toISOString().split("T")[0];
  const sitemapXml = generateSitemap(today);
  const totalUrls =
    SITEMAP_EXTRA.length + PAGES.length + ARTICLES.length + LOADED_DESTINATIONS.length;
  writeFileSync(resolve(distPublic, "sitemap.xml"), sitemapXml, "utf-8");
  console.log(`  ✓ sitemap.xml  (${totalUrls} URLs, lastmod ${today})\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SITEMAP GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Site pages that appear in the sitemap in addition to PAGES and ARTICLES.
 * Includes the homepage and all canonical assessment routes.
 * Add new assessment slugs here when they go live.
 */
const SITEMAP_EXTRA = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/services-pricing-guide", changefreq: "monthly", priority: "0.7" },
  // NOTE: add "/craig-bilton" here once the Craig Bilton profile page
  // (src/pages/CraigBilton.tsx, currently uncommitted) is deployed.
];

/** Destination pages loaded at runtime from src/data/destinations.ts. */
let LOADED_DESTINATIONS = [];

/**
 * Priority and changefreq overrides for routes in PAGES.
 * Routes not listed here default to monthly / 0.8.
 */
const SITEMAP_PAGE_META = {
  "/what-we-offer":                              { changefreq: "monthly", priority: "0.9" },
  "/about-insight-recovery-network":             { changefreq: "monthly", priority: "0.9" },
  "/online-addiction-recovery-programme-uk":     { changefreq: "monthly", priority: "0.9" },
  "/private-rehab-alternative-uk":               { changefreq: "monthly", priority: "0.9" },
  "/assessments/alcohol-detox":                  { changefreq: "monthly", priority: "0.7" },
  "/assessments/alcohol-use":    { changefreq: "monthly", priority: "0.7" },
  "/assessments/drug-use":       { changefreq: "monthly", priority: "0.7" },
  "/assessments/detox":          { changefreq: "monthly", priority: "0.7" },
  "/assessments/anxiety":        { changefreq: "monthly", priority: "0.7" },
  "/assessments/depression":     { changefreq: "monthly", priority: "0.7" },
  "/assessments/adhd-impulsivity": { changefreq: "monthly", priority: "0.7" },
  "/treatment-placement":{ changefreq: "monthly", priority: "0.9" },
  "/online-programme":   { changefreq: "monthly", priority: "0.9" },
  "/insight-os":         { changefreq: "monthly", priority: "0.8" },
  "/about":              { changefreq: "monthly", priority: "0.8" },
  "/recovery-plan-checklist": { changefreq: "monthly", priority: "0.7" },
  "/resources":          { changefreq: "weekly",  priority: "0.8" },
  "/contact":            { changefreq: "monthly", priority: "0.8" },
  "/assessments":        { changefreq: "monthly", priority: "0.8" },
  "/privacy-policy":     { changefreq: "yearly",  priority: "0.4" },
  "/terms-of-service":   { changefreq: "yearly",  priority: "0.4" },
  "/cookie-policy":      { changefreq: "yearly",  priority: "0.4" },
  "/clinical-disclaimer":{ changefreq: "yearly",  priority: "0.4" },
};

function generateSitemap(today) {
  const urlEntry = (loc, changefreq, priority) =>
    `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const extraEntries = SITEMAP_EXTRA.map((p) =>
    urlEntry(p.url, p.changefreq, p.priority)
  );

  const pageEntries = PAGES.map((p) => {
    const meta = SITEMAP_PAGE_META[p.route] ?? { changefreq: "monthly", priority: "0.8" };
    return urlEntry(p.route, meta.changefreq, meta.priority);
  });

  const articleEntries = ARTICLES.map((a) =>
    urlEntry(`/resources/${a.slug}`, "monthly", "0.7")
  );

  const destinationEntries = LOADED_DESTINATIONS.map((d) =>
    urlEntry(`/${d.slug}`, "monthly", "0.9")
  );

  const allEntries = [...extraEntries, ...pageEntries, ...destinationEntries, ...articleEntries];
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ``,
    allEntries.join("\n"),
    ``,
    `</urlset>`,
    ``,
  ].join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
