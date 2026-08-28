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
import {
  premiumTreatmentPages,
  PREMIUM_TREATMENT_REVIEW_DATE,
} from "../src/data/premium-treatment-pages.js";

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

const REHAB_COST_FAQS = [
  [
    "How much does private rehab cost in the UK?",
    "Private rehab in the UK often ranges from around £8,000 to £20,000+ for a 28-day stay, with longer or more clinically intensive admissions costing more. The final cost depends on detox needs, location, accommodation, clinical complexity and length of stay.",
  ],
  [
    "How much does alcohol rehab cost?",
    "Alcohol rehab costs vary because some people need medically supervised detox before residential therapy begins. Alcohol withdrawal can carry medical risk, so families should not choose a programme on price alone where dependency, previous seizures, delirium tremens or significant physical health concerns are present.",
  ],
  [
    "Is detox included in rehab cost?",
    "Sometimes, but not always. Some rehabs include detox in the package price, while others charge separately for medical assessment, medication, blood tests or additional clinical monitoring. Always ask what is included before committing.",
  ],
  [
    "Is overseas rehab cheaper than UK rehab?",
    "Overseas rehab can sometimes offer a longer residential stay at a lower monthly cost than UK private rehab. It is not suitable for everyone, and clinical risk, detox needs, travel, medication, mental health risk, family dynamics and legal or work issues must be considered first.",
  ],
  [
    "Can I get rehab through the NHS?",
    "Some people can access support through NHS or local authority-commissioned drug and alcohol services, though access to funded residential rehab can vary by area and assessment outcome. If there is immediate medical risk, contact a GP, NHS 111, 999 or A&E as appropriate.",
  ],
  [
    "How long should someone stay in rehab?",
    "There is no universal answer. A 28-day admission may suit some people, while others need 60–90 days or a stepped pathway including detox, residential treatment, secondary care and aftercare. The right duration depends on severity, risk, relapse history and support at home.",
  ],
  [
    "What is the lowest-cost private rehab option?",
    "The lowest-cost private route may be a shorter admission, detox-only pathway, structured online support, or overseas treatment where clinically appropriate. Lower cost is not automatically unsafe, but families should check governance, staffing, detox safety, therapeutic structure and aftercare before deciding.",
  ],
  [
    "Is online rehab a good alternative?",
    "Structured online recovery support can be a good alternative for people who are medically stable, have a safe home environment and do not need residential detox or 24-hour support. It is not a replacement for medically supervised detox or residential care where risk is high.",
  ],
  [
    "How do I know which rehab is right?",
    "The right option depends on clinical risk, substance use history, mental health, withdrawal risk, budget, family context and what has or has not worked before. A clinically informed assessment can help separate unsuitable options from those that genuinely fit.",
  ],
  [
    "Can Insight Recovery Network help me compare options?",
    "Yes. Insight Recovery Network helps individuals and families compare UK rehab, overseas treatment, online recovery support and family guidance options, with attention to safety, suitability and budget. We do not diagnose, prescribe or provide emergency care.",
  ],
];

const REHAB_COST_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/how-much-does-rehab-cost-uk#service`,
    name: "UK Rehab Cost and Treatment Options Guidance",
    serviceType: "Private rehab cost guidance and treatment placement support",
    description:
      "Clinically informed guidance for individuals and families comparing private rehab costs in the UK, alcohol detox costs, overseas treatment options and structured online recovery support.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "Thailand" },
      { "@type": "Country", name: "Spain" },
      { "@type": "Country", name: "Sri Lanka" },
    ],
    url: `${SITE_URL}/how-much-does-rehab-cost-uk`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: REHAB_COST_FAQS.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  },
];

/**
 * Metadata for each pre-rendered page route.
 * Keep title/description in sync with the SEO component props in each page.
 */
const PAGES = [
  {
    route: "/about",
    file: "about.html",
    title: "About Craig Bilton | Founder, Insight Recovery Network",
    description:
      "Meet Craig Bilton, Founder and Clinical Director of Insight Recovery Network, and learn how his 20+ years in addiction treatment shaped IRN's approach.",
    ogImage: `${SITE_URL}/og-about.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/family-addiction-intervention-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Family Help</a>
          <a href="/how-much-does-rehab-cost-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Rehab Costs</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Support</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Discuss treatment options</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">
              About the founder
            </p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Craig Bilton, Founder of Insight Recovery Network
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Craig Bilton founded Insight Recovery Network after more than 20 years working across addiction treatment, recovery support, intervention and international placement. His aim is to help individuals and families make difficult recovery decisions with more clarity, dignity and continuity.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">About Craig Bilton, Founder</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:1.5rem;">
              With over 20 years of international addiction treatment experience, Craig Bilton founded Insight Recovery Network to provide clinically informed, assessment-led guidance. His background spans residential rehabilitation, online recovery support, and complex case management across the UK and internationally.
            </p>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;">
              Craig's approach is built on three principles: clarity, continuity, and practical support, providing honest guidance, long-term recovery planning, and tangible tools rather than generic advice.
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
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">
              All enquiries are handled with complete discretion. You do not need to have everything worked out before reaching out.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/what-we-offer",
    file: "what-we-offer.html",
    title: "Addiction Recovery Services | Placement, Online &amp; Family Support",
    description:
      "Compare assessment-led rehab placement, structured online recovery, family guidance and Insight OS tools from Insight Recovery Network.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Our Services</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Addiction Recovery Services for Individuals and Families
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Compare assessment-led treatment placement, structured online recovery, family guidance and digital continuing-care tools, with a clear explanation of who each route is for.
            </p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;">
              <article style="padding:1.75rem;border:1px solid rgba(201,169,110,0.3);background:#fff;">
                <h2 style="font-size:1.15rem;font-weight:500;margin-bottom:0.75rem;">Treatment Placement</h2>
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">Confidential, assessment-led guidance for finding a suitable detox or residential rehabilitation facility in the UK or internationally, matched to individual need and risk.</p>
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
                <p style="font-family:sans-serif;font-size:0.9rem;color:#4a5568;line-height:1.7;margin-bottom:1rem;">A discreet, expert resource for professionals, EAPs, HR teams, and legal counsel, assessing, advising, and coordinating a clinical response to sensitive substance or mental health issues.</p>
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
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">Not sure where to start? A private conversation can help clarify the most appropriate pathway for you or your family.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/treatment-placement",
    file: "treatment-placement.html",
    title: "Help Choosing a Rehab | Assessment-Led Placement",
    description:
      "Assessment-led help choosing a private rehab or detox provider. Compare suitable UK and international options, provider relationships and admission planning.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Treatment Placement</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Find a Suitable Private Rehab or Detox Provider Without a Rushed Decision
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">
              Insight Recovery Network helps individuals and families assess their needs, compare appropriate treatment options and access suitable programmes in the UK and internationally.
            </p>
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.8;max-width:600px;color:#4a5568;margin-bottom:2rem;">IRN may have partner or referral relationships with some providers. Any relevant relationship is explained before a decision, and the provider retains responsibility for its clinical assessment and admission decision.</p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.5rem;">How the Placement Process Works</h2>
            <ol style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><strong style="color:#162B3B;">Understand the situation</strong>, Assess urgency, risk, substance use history, mental health needs, family context, and practical requirements.</li>
              <li><strong style="color:#162B3B;">Identify suitable options</strong>, Match needs against trusted providers, considering clinical fit, location, budget, length of stay, and environment.</li>
              <li><strong style="color:#162B3B;">Present and clarify</strong>, Share a clear shortlist of appropriate facilities with honest assessments of each, without pressure or sales tactics.</li>
              <li><strong style="color:#162B3B;">Manage the transition</strong>, Coordinate directly with the chosen facility to ensure a smooth and structured admission.</li>
              <li><strong style="color:#162B3B;">Aftercare planning</strong>, Ensure a clear plan is in place before discharge, including ongoing support through Insight OS and the Online Recovery Programme.</li>
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
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">
              All enquiries are handled with complete discretion. There is no obligation and no pressure.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
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
      "A structured online addiction recovery programme with group therapy, one-to-one support, daily accountability, and relapse prevention planning, available without residential care. Delivered by Insight Recovery Network.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
              For those who need clinical-grade recovery support but cannot or choose not to enter residential treatment, our online programme delivers structured group therapy, one-to-one sessions, daily accountability, and relapse prevention planning, wherever you are in the world.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
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
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;">Daily check-ins, mood tracking, journaling, and Anchor recovery guidance, integrated throughout the programme.</p>
              </article>
            </div>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">Ready to take the next step? A private conversation can help clarify whether the online programme is the right fit.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/insight-os",
    file: "insight-os.html",
    title: "Insight OS: The Operating System for Your Recovery | Insight Recovery Network",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/contact",
    file: "contact.html",
    title: "Contact Us | Book a confidential call | Insight Recovery Network",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Contact</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:640px;">
              Tell us what is happening. We will help you identify the next step.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:580px;color:#4a5568;margin-bottom:2rem;">
              Contact us privately about rehab placement, family concerns, detox, online recovery support or an urgent treatment decision. You do not need to know which service you need before making contact.
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
              Your first contact will be a confidential, no-obligation conversation. We will listen carefully, ask relevant questions, and help you understand the most appropriate pathway forward, whether that is treatment placement, an online programme, Insight OS, or simply more information.
            </p>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Our Services</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/treatment-placement" style="color:#162B3B;">Treatment Placement</a>, Private rehab and detox guidance, UK and internationally</li>
              <li><a href="/online-programme" style="color:#162B3B;">Online Recovery Programme</a>, Structured group and one-to-one support</li>
              <li><a href="/insight-os" style="color:#162B3B;">Insight OS</a>, Digital recovery tools and daily structure</li>
              <li><a href="/family-addiction-intervention-uk" style="color:#162B3B;">Family &amp; Intervention Guidance</a>, A practical plan when someone is refusing help</li>
              <li><a href="/assessments" style="color:#162B3B;">Free Assessments</a>, Confidential self-assessments for alcohol, drugs, and mental health</li>
            </ul>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/family-addiction-intervention-uk",
    file: "family-addiction-intervention-uk.html",
    title: "Family Addiction Help &amp; Intervention UK | Insight Recovery Network",
    description:
      "Confidential family addiction consultations and intervention guidance in the UK. Get a clear plan when someone you love is drinking, using drugs, refusing help or may need private treatment.",
    ogImage: `${SITE_URL}/addiction-intervention-uk.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;color:#fff;">
        <a href="/" style="color:#fff;text-decoration:none;font-family:Georgia,serif;font-size:1.1rem;">Insight Recovery Network</a>
        <nav style="margin-top:0.75rem;display:flex;gap:1rem;flex-wrap:wrap;font-family:sans-serif;font-size:0.85rem;">
          <a href="/treatment-placement" style="color:#fff;">Treatment Placement</a>
          <a href="/family-addiction-intervention-uk" style="color:#fff;">Family Help</a>
          <a href="/how-much-does-rehab-cost-uk" style="color:#fff;">Rehab Costs</a>
          <a href="/contact" style="color:#fff;">Contact</a>
        </nav>
      </header>
      <main style="font-family:sans-serif;background:#F6F4EF;color:#162B3B;padding:3rem 2rem;">
        <div style="max-width:900px;margin:0 auto;">
          <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.18em;color:#9A7440;">Confidential help for families</p>
          <h1 style="font-family:Georgia,serif;font-size:clamp(2.2rem,5vw,3.5rem);line-height:1.08;max-width:760px;">You do not have to wait for them to ask for help.</h1>
          <p style="font-size:1.1rem;line-height:1.8;max-width:720px;">When someone you love is drinking, using drugs, refusing treatment or creating repeated crises, the family needs a plan, not another argument. Speak confidentially about risk, boundaries, treatment options and how to approach the next conversation.</p>
          <p><a href="/contact" style="display:inline-block;background:#162B3B;color:#fff;padding:0.9rem 1.5rem;text-decoration:none;">Discuss your family situation</a></p>
          <section style="margin-top:3rem;border-top:1px solid #ddd;padding-top:2rem;">
            <h2 style="font-family:Georgia,serif;font-size:2rem;">A clear plan before the next crisis</h2>
            <ul style="line-height:2;max-width:760px;">
              <li>Understand immediate risk, withdrawal and safeguarding priorities</li>
              <li>Create one consistent family plan</li>
              <li>Prepare a calm, non-confrontational conversation</li>
              <li>Clarify suitable detox, rehab or online treatment routes</li>
              <li>Support the practical move into treatment where appropriate</li>
            </ul>
          </section>
          <section style="margin-top:3rem;border-top:1px solid #ddd;padding-top:2rem;">
            <h2 style="font-family:Georgia,serif;font-size:2rem;">Can I call before they agree?</h2>
            <p style="line-height:1.8;max-width:720px;">Yes. Families are often the first to make contact. A consultation can help you plan the next step before the person has agreed to treatment.</p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/confidential-addiction-help-professionals",
    file: "confidential-addiction-help-professionals.html",
    title: "Confidential Addiction Help for Professionals UK | Insight Recovery Network",
    description:
      "Discreet addiction treatment guidance for executives, professionals and business owners. Compare structured online support, private detox and residential rehab confidentially.",
    ogImage: `${SITE_URL}/og-treatment-placement.png`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;color:#fff;"><a href="/" style="color:#fff;text-decoration:none;font-family:Georgia,serif;">Insight Recovery Network</a></header>
      <main style="font-family:sans-serif;background:#F6F4EF;color:#162B3B;padding:3rem 2rem;">
        <div style="max-width:900px;margin:0 auto;">
          <p style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.18em;color:#9A7440;">Private support for professionals</p>
          <h1 style="font-family:Georgia,serif;font-size:clamp(2.2rem,5vw,3.5rem);line-height:1.08;max-width:760px;">Get help before the problem decides for you.</h1>
          <p style="font-size:1.1rem;line-height:1.8;max-width:720px;">Confidential addiction guidance for professionals, executives and business owners who need a credible plan without unnecessary exposure. Compare online support, medically supervised detox and discreet residential treatment.</p>
          <p><a href="/contact" style="display:inline-block;background:#162B3B;color:#fff;padding:0.9rem 1.5rem;text-decoration:none;">Arrange a discreet consultation</a></p>
          <section style="margin-top:3rem;border-top:1px solid #ddd;padding-top:2rem;">
            <h2 style="font-family:Georgia,serif;font-size:2rem;">High-functioning does not mean low-risk</h2>
            <p style="line-height:1.8;max-width:720px;">We consider safety, confidentiality, work and family responsibilities together, then identify the least disruptive route that remains clinically appropriate.</p>
            <p><a href="/online-programme">Structured online support</a> · <a href="/treatment-placement">Private treatment placement</a></p>
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
    title: "About Insight Recovery Network | Addiction Support Model",
    description:
      "Learn how IRN provides assessment-led treatment placement, online recovery and family guidance, including its scope, provider relationships and clinical boundaries.",
    ogImage: `${SITE_URL}/about-insight-recovery-network-hero.webp`,
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">About Insight Recovery Network</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              How Insight Recovery Network supports recovery decisions.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Insight Recovery Network is a UK-based treatment-placement, online recovery and advisory service. We help individuals and families assess needs, compare suitable programmes and build continuing recovery support. We do not own or operate the treatment centres we discuss, and any relevant provider or referral relationship is explained before a decision is made.
            </p>
            <img src="/about-insight-recovery-network-hero.webp" width="1717" height="916" alt="Insight Recovery Network brand mark beside a calm private room overlooking a sunlit coastline" style="display:block;width:100%;height:auto;margin-top:2.5rem;border-radius:0.75rem;box-shadow:0 18px 50px -16px rgba(22,43,59,0.28);" fetchpriority="high" decoding="async" />
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Service details</h2>
            <dl style="font-family:sans-serif;font-size:0.9rem;line-height:1.8;color:#4a5568;max-width:600px;">
              <dt style="font-weight:600;color:#162B3B;">Service type</dt><dd style="margin-bottom:0.75rem;">Private addiction recovery and mental health support</dd>
              <dt style="font-weight:600;color:#162B3B;">Location</dt><dd style="margin-bottom:0.75rem;">Newquay, Cornwall, UK</dd>
              <dt style="font-weight:600;color:#162B3B;">Service delivery</dt><dd style="margin-bottom:0.75rem;">Online only, telephone, video call, and Insight OS digital platform</dd>
              <dt style="font-weight:600;color:#162B3B;">Face-to-face appointments</dt><dd style="margin-bottom:0.75rem;">Not available</dd>
              <dt style="font-weight:600;color:#162B3B;">General enquiries</dt><dd style="margin-bottom:0.75rem;"><a href="mailto:info@insightrecoverynetwork.com" style="color:#162B3B;">info@insightrecoverynetwork.com</a></dd>
              <dt style="font-weight:600;color:#162B3B;">Clinical enquiries</dt><dd style="margin-bottom:0.75rem;"><a href="mailto:craig@insightrecoverynetwork.com" style="color:#162B3B;">craig@insightrecoverynetwork.com</a></dd>
              <dt style="font-weight:600;color:#162B3B;">Telephone</dt><dd><a href="tel:+447415994475" style="color:#162B3B;">+44 7415 994475</a></dd>
            </dl>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What we offer</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/treatment-placement" style="color:#162B3B;">Private Treatment Placement</a>, confidential guidance on private rehab, detox, and residential treatment in the UK and internationally</li>
              <li><a href="/online-programme" style="color:#162B3B;">Online Recovery Programme</a>, structured group sessions, one-to-one therapy, and relapse prevention planning</li>
              <li><a href="/what-we-offer" style="color:#162B3B;">Family Intervention Guidance</a>, support for families navigating addiction crises</li>
              <li><a href="/assessments" style="color:#162B3B;">Free Self-Assessments</a>, confidential assessments for alcohol use, drug use, anxiety, depression, and ADHD</li>
              <li><a href="/insight-os" style="color:#162B3B;">Insight OS</a>, a structured digital recovery system for daily check-ins and relapse prevention</li>
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Online Recovery Support, UK</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              Structured online addiction recovery support, built around your life.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Professional, clinically informed recovery support delivered online, for individuals in the UK who need structure, accountability, and professional guidance without residential treatment.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
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
              <dd>Insight Recovery Network's online programme is clinically structured and professionally led, not automated content or anonymous peer support. It provides clinical oversight, individual therapeutic work, and structured relapse prevention planning.</dd>
            </dl>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/private-rehab-alternative-uk",
    file: "private-rehab-alternative-uk.html",
    title: "Private Rehab Alternatives UK | Online, Outpatient &amp; NHS Options",
    description:
      "Compare private rehab alternatives in the UK, including structured online recovery, outpatient, NHS and family support, plus when residential care is safer.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Private Rehab Alternatives, UK</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              Private Rehab Alternatives in the UK: What Can Work Instead?
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Private residential rehab is not always the right answer. There are other routes, and being honest about which one is appropriate makes the difference between recovery that works and recovery that does not.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What Insight Recovery Network can offer</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/online-programme" style="color:#162B3B;">Structured online recovery support</a>, clinically led group sessions, individual therapeutic work, and relapse prevention planning</li>
              <li>Structured relapse prevention planning built around the individual's history, patterns, and goals</li>
              <li><a href="/what-we-offer" style="color:#162B3B;">Family intervention guidance</a>, support for families navigating addiction crises</li>
              <li><a href="/treatment-placement" style="color:#162B3B;">Treatment placement guidance</a>, where residential detox or rehab is needed, confidential guidance on appropriate settings</li>
              <li><a href="/assessments" style="color:#162B3B;">Free self-assessments</a>, understand what you are experiencing without obligation</li>
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
              <dd>For some people, structured online recovery support can be clinically appropriate, particularly where physical dependency does not require medical detox and the home environment is stable. For others, residential rehab is the safer choice.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">When would you recommend treatment placement over online support?</dt>
              <dd>Where there is significant physical dependency, an unsafe home environment, repeated residential relapse, or a need for around-the-clock support. We make this recommendation honestly when it is the right call.</dd>
            </dl>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/private-rehab-uk",
    file: "private-rehab-uk.html",
    title: "Private Rehab UK | Assessment-Led Guidance Before Choosing Treatment | Insight Recovery Network",
    description:
      "Considering private rehab in the UK? Insight Recovery Network helps individuals and families compare UK rehab, overseas treatment, detox needs, online recovery support and aftercare before committing to a treatment route.",
    ogImage: `${SITE_URL}/private-rehab-uk-hero.png`,
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Private Rehab UK: Assessment-Led Guidance</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:700px;">
              Private Rehab UK: Assessment-Led Guidance Before You Choose
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:640px;color:#4a5568;margin-bottom:2rem;">
              Many people begin by searching for private rehab in the UK. Before committing to a costly admission, it is worth understanding whether UK rehab, overseas residential treatment, medically supervised detox, structured online support, family intervention or aftercare planning is the right fit. Insight Recovery Network provides clinically informed guidance, with any relevant provider or commercial relationship explained transparently.
            </p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
            </div>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">When residential rehab may be appropriate</h2>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li>Alcohol dependence where a medically supervised detox may be required</li>
              <li>Drug dependence, including prescription, stimulant, or opioid use</li>
              <li>Relapse after previous attempts to stop or after community treatment</li>
              <li>Co-occurring anxiety, depression, trauma, or chronic stress alongside substance use</li>
              <li>A family crisis where a rapid, structured assessment is needed</li>
              <li>A need for treatment close to home or close to family</li>
            </ul>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">What does private rehab cost in the UK?</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:680px;margin-bottom:1rem;">There is no single price. Costs vary significantly depending on detox needs, location, clinical intensity, accommodation, length of stay, and whether specialist mental health input is required. Private UK rehab can range from several thousand pounds for shorter admissions to considerably higher costs for premium or specialist programmes. We provide assessment-led guidance and will tell you honestly when a less expensive option, including <a href="/treatment-placement" style="color:#162B3B;">overseas treatment</a>, is clinically appropriate.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">UK or overseas rehab?</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:680px;margin-bottom:1rem;">UK private rehab can be appropriate for proximity, family involvement, ease of travel and continuity with existing care. Overseas treatment may be more appropriate when longer treatment duration, better value, privacy, distance from triggers or extended care is needed. The right decision depends on clinical need, risk, budget, family situation and recovery history. Consider whether <a href="/online-programme" style="color:#162B3B;">structured online recovery support</a> could meet the need, or explore international options:</p>
            <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;">
              <li><a href="/private-rehab-south-africa" style="color:#162B3B;">Private rehab in South Africa</a>: best value for longer-term and secondary care</li>
              <li><a href="/private-rehab-spain" style="color:#162B3B;">Private rehab in Spain</a>: close to the UK, easy family involvement</li>
              <li><a href="/private-rehab-thailand" style="color:#162B3B;">Private rehab in Thailand</a>: established centres, distance from triggers</li>
              <li><a href="/private-rehab-sri-lanka" style="color:#162B3B;">Private rehab in Sri Lanka</a>: intimate, highly personalised settings</li>
            </ul>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1.25rem;">Frequently Asked Questions</h2>
            <dl style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:720px;">
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">How much does private rehab cost in the UK?</dt>
              <dd>There is no single figure. Costs depend on detox needs, location, clinical intensity, accommodation, length of stay, and specialist input. We help you understand what a given level of care involves rather than quoting a fixed price.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">Is UK private rehab always the best option?</dt>
              <dd>No. UK rehab suits some situations, but overseas residential treatment, medically supervised detox, structured online recovery support or family intervention may be more appropriate for others. An assessment-led view helps work out which route fits before money is committed.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">Should I choose UK rehab or overseas rehab?</dt>
              <dd>It depends on clinical need, safety, budget, family situation, and recovery history. UK suits proximity and continuity; overseas can offer better value, longer duration, or more distance from triggers. An assessment-led comparison is worth having first.</dd>
              <dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">Can Insight Recovery Network help me understand my options before contacting a rehab?</dt>
              <dd>Yes. We give a clinically informed view and help you compare realistic routes before you decide. We explain any relevant provider or commercial relationship transparently.</dd>
            </dl>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/how-much-does-rehab-cost-uk",
    file: "how-much-does-rehab-cost-uk.html",
    title: "Rehab Costs UK: Private Rehab Prices Explained",
    description:
      "Compare UK private rehab costs, typical 28-day prices, detox fees, what affects the final price and lower-cost or overseas treatment alternatives.",
    ogImage: `${SITE_URL}/how-much-does-rehab-cost-uk-hero.webp`,
    jsonLd: REHAB_COST_JSONLD,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/private-rehab-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Private Rehab UK</a>
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/online-addiction-recovery-programme-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Recovery</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Speak to us</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;margin-bottom:1.25rem;">Rehab cost guide, UK</p>
            <h1 style="font-size:clamp(2.2rem,5vw,4rem);line-height:1.05;font-weight:500;margin-bottom:1.5rem;max-width:760px;">How Much Does Rehab Cost in the UK?</h1>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;max-width:720px;color:#162B3B;margin-bottom:1.25rem;border-left:4px solid #C9A96E;background:#fff;padding:1rem 1.25rem;"><strong>Direct answer:</strong> a 28-day UK private rehab stay is commonly within the approved guide range of £8,000 to £20,000+, while detox-only, longer residential, overseas and online options vary substantially. These are guide figures, not quotes or financial advice.</p>
            <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;max-width:720px;color:#4a5568;margin-bottom:1.25rem;">Private rehab costs vary depending on detox needs, length of stay, clinical intensity, location, accommodation level and whether treatment is in the UK or overseas.</p>
            <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;max-width:720px;color:#4a5568;margin-bottom:2rem;">Insight Recovery Network helps you understand the real cost, what is included, what level of care is needed, and which options are clinically appropriate before you commit.</p>
            <p style="margin-bottom:2rem;"><a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;margin-right:0.75rem;">Speak to us about treatment options</a><a href="/services-pricing-guide" style="font-family:sans-serif;color:#162B3B;">View services and pricing</a></p>
            <img src="/how-much-does-rehab-cost-uk-hero.webp" width="1717" height="916" alt="Insight Recovery Network private rehab cost guide for the UK" style="display:block;width:100%;height:auto;margin:2.5rem 0;border-radius:0.5rem;box-shadow:0 18px 50px -16px rgba(22,43,59,0.28);" fetchpriority="high" decoding="async" />
          </section>
          <section style="padding:2rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;font-family:sans-serif;">
              <div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">Who this is for</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">Individuals and families comparing private alcohol rehab, detox, residential treatment, online support or overseas options.</p></div>
              <div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">What it helps solve</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">Explains realistic cost ranges, what affects price and how to compare options without choosing on price alone.</p></div>
              <div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">Where it applies</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">UK private rehab, alcohol detox, overseas residential treatment and structured online recovery support.</p></div>
              <div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">Next step</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">Speak to us about treatment options.</p></div>
            </div>
            <p style="font-family:sans-serif;font-size:0.78rem;line-height:1.7;color:#4a5568;margin-top:1.5rem;">Written by <a href="/craig-bilton" style="color:#162B3B;">Craig Bilton, Founder &amp; Clinical Director</a>, drawing on 20+ years' international addiction and mental health experience. Last reviewed 9 July 2026. Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">Families often search for rehab costs under pressure.</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;margin-bottom:1rem;">Cost searches usually happen at a difficult moment: someone is worried about safety, the family is unsure how serious the situation is, and treatment options all seem to use different language.</p>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;">We help you understand the real cost of care, what is included, whether detox is needed, what level of support is appropriate, and how UK, overseas and online options compare. The aim is not to find the lowest price. It is to avoid unsuitable placements and make a calm, informed decision.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">Private rehab price ranges in the UK and overseas</h2>
            <div style="overflow-x:auto;border:1px solid rgba(22,43,59,0.15);background:#fff;">
              <table style="width:100%;min-width:760px;border-collapse:collapse;font-family:sans-serif;font-size:0.9rem;">
                <thead style="background:#162B3B;color:#fff;"><tr><th style="text-align:left;padding:1rem;">Treatment option</th><th style="text-align:left;padding:1rem;">Typical cost range</th><th style="text-align:left;padding:1rem;">What it usually includes</th><th style="text-align:left;padding:1rem;">Best suited for</th></tr></thead>
                <tbody>
                  <tr><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">UK alcohol detox only</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">£2,000–£6,000</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Medical assessment and supervised withdrawal planning.</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">People who need withdrawal managed safely before therapy or aftercare.</td></tr>
                  <tr><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">28-day UK private rehab</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">£8,000–£20,000+</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Accommodation, meals, group programme, individual sessions and recovery planning.</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">People needing a structured residential reset close to home or existing care.</td></tr>
                  <tr><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">60–90 day UK residential treatment</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">£18,000–£45,000+</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Longer residential care, extended therapy and more time for stabilisation.</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Complex cases, repeated relapse or dual-diagnosis needs.</td></tr>
                  <tr><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Overseas residential rehab</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">From around £2,200–£8,000+ per month</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Residential treatment abroad; inclusions vary by country and provider.</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">People who may benefit from longer stays, privacy or distance from triggers.</td></tr>
                  <tr><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Online recovery programme</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">£950–£1,950 per month</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Structured online support, accountability and relapse prevention planning.</td><td style="padding:1rem;border-bottom:1px solid rgba(22,43,59,0.12);">Medically stable clients who do not need residential treatment or who need aftercare.</td></tr>
                  <tr><td style="padding:1rem;">Treatment placement support</td><td style="padding:1rem;">Enquire for guidance</td><td style="padding:1rem;">Assessment-led guidance to compare suitable UK, overseas, online and family support options.</td><td style="padding:1rem;">Individuals and families who need help understanding fit, budget and next steps.</td></tr>
                </tbody>
              </table>
            </div>
            <p style="font-family:sans-serif;font-size:0.8rem;line-height:1.7;color:#4a5568;margin-top:1rem;">These figures are broad guide prices only. Actual costs depend on clinical needs, detox requirements, risk, location, accommodation level and length of stay.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">What affects the cost of rehab?</h2>
            <p style="font-family:sans-serif;line-height:2;color:#4a5568;">Detox requirements · Length of stay · Clinical complexity · Level of accommodation · Location · Staff-to-client ratio · Medical and psychiatric involvement · Aftercare and family support</p>
          </section>
          <section id="uk-vs-overseas" style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">Why UK private rehab costs more, and when overseas rehab may cost less</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;margin-bottom:1rem;">UK rehab can be more expensive because safe residential care is staff-intensive, often involving 24-hour staffing, clinical governance, regulated facilities, detox capacity, accommodation, food, therapy and medical input where required.</p>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;margin-bottom:1rem;">Overseas treatment can sometimes offer longer stays at a lower monthly cost, but it is not suitable for everyone. Travel, detox needs, medication, mental health risk, family dynamics, safeguarding and legal issues all matter.</p>
            <p style="font-family:sans-serif;line-height:2;"><a href="/private-rehab-south-africa" style="color:#162B3B;margin-right:1rem;">South Africa treatment placement</a><a href="/private-rehab-thailand" style="color:#162B3B;margin-right:1rem;">Thailand rehab options</a><a href="/private-rehab-spain" style="color:#162B3B;margin-right:1rem;">Spain rehab options</a><a href="/private-rehab-sri-lanka" style="color:#162B3B;">Sri Lanka rehab options</a></p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">How much does alcohol rehab cost?</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;">Alcohol rehab costs vary because alcohol dependence may require medically supervised detox before therapy begins. Costs are influenced by severity of dependence, withdrawal history, previous seizures or delirium tremens, physical health, psychiatric risk and medication needs. Families should not choose alcohol rehab based only on price if detox risk is present.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">What is usually included, and what may cost extra?</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;">Common inclusions: accommodation, meals, assessment, group therapy, individual therapy, recovery planning, relapse prevention, psychoeducation, family communication where appropriate and aftercare planning. Medical detox may or may not be included.</p>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;">Ask about: detox fees, psychiatric appointments, medication, blood tests, airport transfers, family sessions, aftercare, extended stay fees, private room upgrades, travel insurance and flights for overseas placements.</p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">How Insight Recovery Network helps</h2>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;margin-bottom:1rem;">We help individuals and families understand what level of care is needed, compare UK and overseas options, avoid unsuitable placements, consider clinical risk, match budget with appropriate care, coordinate assessment and placement, and support families before, during and after treatment.</p>
            <p><a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;">Request a confidential treatment options call</a></p>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:1.9rem;font-weight:500;margin-bottom:1rem;">Frequently asked questions about rehab cost</h2>
            <dl style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:820px;">
              ${REHAB_COST_FAQS.map(([question, answer]) => `<dt style="font-weight:600;color:#162B3B;margin-top:1.5rem;">${question}</dt><dd>${answer}</dd>`).join("")}
            </dl>
          </section>
          <section style="padding:2rem 0;">
            <h2 style="font-size:1.6rem;font-weight:500;margin-bottom:1rem;">Related rehab cost and treatment guidance</h2>
            <p style="font-family:sans-serif;line-height:2;"><a href="/treatment-placement" style="color:#162B3B;margin-right:1rem;">Treatment placement support</a><a href="/private-rehab-uk" style="color:#162B3B;margin-right:1rem;">Private rehab in the UK</a><a href="/online-addiction-recovery-programme-uk" style="color:#162B3B;margin-right:1rem;">Online recovery programme</a><a href="/private-rehab-alternative-uk" style="color:#162B3B;margin-right:1rem;">Private rehab alternative UK</a><a href="/assessments/detox" style="color:#162B3B;margin-right:1rem;">Detox suitability assessment</a><a href="/contact" style="color:#162B3B;">Speak to Insight Recovery Network</a></p>
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
      "Confidential self-assessments for alcohol use, drug use, detox suitability, anxiety, depression, and ADHD. Start a free clinical assessment and receive personalised guidance, no registration required.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
              These assessments are designed to help individuals and families understand their situation more clearly. Each one takes 7–15 minutes, is completely confidential, and requires no registration. Results are designed to provide personalised guidance, not a diagnosis.
            </p>
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              These tools are for informational purposes only and do not constitute medical advice. If you are in crisis or require urgent support, please contact your GP or emergency services.
            </p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call Instead</a>
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
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">A private conversation with Craig Bilton can help clarify the most appropriate level of support for you or your family, without pressure or obligation.</p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Alcohol &amp; Detox Suitability Assessment, free and confidential.
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
      "Free confidential alcohol use self-assessment. Reflect on how drinking may be affecting your health, relationships, and daily life, personalised results sent to your email. No registration required.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Alcohol Use Assessment, understand your relationship with alcohol.
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Drug Use &amp; Substance Assessment, free and confidential.
            </h1>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;max-width:620px;color:#4a5568;margin-bottom:2rem;">
              This free assessment explores your relationship with substances, including recreational drugs, prescription medications, and stimulants, and helps you understand whether the level of use may be causing harm or whether professional support is appropriate. Takes 7–10 minutes and requires no registration.
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Detox Suitability Assessment, understand what level of support you may need.
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
    title: "Anxiety Screening Assessment | Free &amp; Confidential | Insight Recovery Network",
    description:
      "Free confidential anxiety self-assessment based on GAD-7 criteria. Understand how anxiety may be affecting your thoughts, physical symptoms, and daily functioning, results sent to your email.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Anxiety Screening Assessment, free and confidential.
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
    title: "Depression Screening Assessment | Free &amp; Confidential | Insight Recovery Network",
    description:
      "Free confidential depression self-assessment based on PHQ-9 criteria. Understand how low mood may be affecting your energy, motivation, and wellbeing, personalised results sent to your email.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              Depression Screening Assessment, free and confidential.
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1200px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1.25rem;">Free Clinical Assessment</p>
            <h1 style="font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;max-width:680px;">
              ADHD &amp; Impulsivity Assessment, free and confidential.
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
    title: "Addiction &amp; Recovery Resources | Clinical Articles | Insight Recovery Network",
    description:
      "Authoritative articles on addiction, recovery, treatment options, and mental health, written by Craig Bilton to help individuals and families make informed decisions about addiction support and treatment.",
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
              Authoritative articles on addiction, recovery, treatment options, and mental health, written by Craig Bilton to help individuals and families understand their situation and make informed decisions.
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
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Compare private rehab and NHS addiction treatment in the UK, including access, cost, detox, confidentiality, aftercare and support, and understand which route may be more appropriate for your situation.</p>
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
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Addiction is not a moral failing or a lack of willpower. Understanding the neuroscience and psychology of compulsive use can help individuals and families make sense of what is happening, and why change is often so difficult without support.</p>
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
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/mental-health-and-addiction" style="color:#162B3B;text-decoration:none;">Mental Health and Addiction: A Complete UK Guide</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Understand how mental health and addiction interact, what a safe assessment covers, urgent warning signs and how to find coordinated UK support.</p>
                <a href="/resources/mental-health-and-addiction" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Family &amp; Relationships</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/supporting-a-loved-one-through-recovery" style="color:#162B3B;text-decoration:none;">Supporting a Loved One Through Recovery</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">When someone close to you is in recovery, knowing how to help, and how not to, can make a significant difference to their long-term wellbeing and your own.</p>
                <a href="/resources/supporting-a-loved-one-through-recovery" style="font-family:sans-serif;font-size:0.85rem;color:#162B3B;text-decoration:underline;">Read article</a>
              </article>
              <article style="padding:1.75rem 0;border-bottom:1px solid rgba(201,169,110,0.2);">
                <p style="font-family:sans-serif;font-size:0.75rem;color:#888;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.1em;">Recovery &amp; Wellbeing</p>
                <h3 style="font-size:1.2rem;font-weight:500;margin-bottom:0.5rem;"><a href="/resources/managing-relapse-part-of-recovery" style="color:#162B3B;text-decoration:none;">Managing Relapse as Part of Recovery</a></h3>
                <p style="font-family:sans-serif;font-size:0.875rem;color:#4a5568;line-height:1.65;max-width:680px;margin-bottom:0.75rem;">Relapse does not mean failure. Understanding how and why relapse happens, and how to respond to it, is one of the most important parts of sustainable recovery.</p>
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
            <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">You do not need to have everything worked out before reaching out. A private conversation can help clarify the most appropriate support for you or your family.</p>
            <div style="display:flex;gap:0.875rem;flex-wrap:wrap;">
              <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
              <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
      "Terms governing use of the Insight Recovery Network website and services. We provide private online support and guidance, not regulated medical treatment or emergency care.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
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
    route: "/editorial-policy",
    file: "editorial-policy.html",
    title: "Editorial Policy | Insight Recovery Network",
    description:
      "How Insight Recovery Network researches, writes, sources, reviews and updates addiction and mental health information.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Trust and transparency</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Editorial Policy</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:2rem;max-width:680px;">Insight Recovery Network publishes addiction, recovery and treatment information under Craig Bilton's authorship. Factual claims are checked against authoritative NHS, NICE, government, regulatory and research sources wherever possible.</p>
          <h2 style="font-size:1.5rem;font-weight:500;margin:2rem 0 0.75rem;">Research and sources</h2>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;">Priority health articles display their principal sources. Safety-critical information is revisited when guidance changes or a reliable new source becomes available.</p>
          <h2 style="font-size:1.5rem;font-weight:500;margin:2rem 0 0.75rem;">Corrections and transparency</h2>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;">Digital or AI-assisted tools may support research organisation, drafting and quality checks, but they do not replace editorial responsibility. To report an error, email <a href="mailto:info@insightrecoverynetwork.com" style="color:#162B3B;">info@insightrecoverynetwork.com</a>.</p>
        </div>
      </main>
    `,
  },
  {
    route: "/clinical-disclaimer",
    file: "clinical-disclaimer.html",
    title: "Clinical Disclaimer | Insight Recovery Network",
    description:
      "Insight Recovery Network provides private online support and guidance, not regulated medical treatment. Read our full clinical disclaimer including emergency service contacts.",
    ogImage: DEFAULT_OG_IMAGE,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/what-we-offer" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">What We Offer</a>
          <a href="/assessments" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Assessments</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Book a confidential call</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:780px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.8);margin-bottom:1rem;">Legal</p>
          <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:500;margin-bottom:1rem;">Clinical Disclaimer</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:1.5rem;max-width:640px;">
            Insight Recovery Network is not a regulated medical provider, not registered with the CQC, and not an emergency service. If you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E. For 24/7 emotional support, contact the Samaritans on <strong>116 123</strong>.
          </p>
          <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
        </div>
      </main>
    `,
  },
  {
    route: "/media",
    file: "media.html",
    title: "Media &amp; Expert Commentary | Craig Bilton",
    description:
      "Media enquiries and expert commentary from Craig Bilton on addiction, recovery, treatment, families and crypto-trading addiction.",
    ogImage: `${SITE_URL}/media-hero.webp`,
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/craig-bilton" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Craig Bilton</a>
          <a href="mailto:craig@insightrecoverynetwork.com?subject=Media%20enquiry" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Request expert comment</a>
        </nav>
      </header>
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:900px;margin:0 auto;padding:4rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;margin-bottom:1rem;">Media enquiries</p>
          <h1 style="font-size:clamp(2.25rem,6vw,4rem);line-height:1.05;font-weight:500;margin-bottom:1.5rem;">Clear, responsible commentary on addiction and recovery.</h1>
          <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;color:#4a5568;max-width:760px;margin-bottom:2.5rem;">Craig Bilton is available to journalists seeking practical, evidence-conscious context on addiction, treatment decisions, family impact, relapse risk and emerging behavioural addictions.</p>
          <img src="/media-hero.webp" width="1693" height="929" alt="Insight Recovery Network media and expert commentary studio" style="display:block;width:100%;height:auto;margin:2.5rem 0;border-radius:0.75rem;box-shadow:0 18px 50px -16px rgba(22,43,59,0.28);" fetchpriority="high" decoding="async" />
          <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Topics Craig can discuss</h2>
          <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;margin-bottom:2.5rem;">
            <li>Addiction, recovery and relapse risk</li>
            <li>Crypto trading, day trading and gambling-like behaviour</li>
            <li>The impact of addiction on partners and families</li>
            <li>Treatment suitability, online recovery and continuity of support</li>
          </ul>
          <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">External publications and media contributions</h2>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;margin-bottom:1.5rem;">External articles and media contributions from Craig Bilton and Insight Recovery Network.</p>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;margin-bottom:0.75rem;"><a href="https://www.businessinsider.com/crypto-trading-addicts-gambling-therapy-marriage-conflicts-financial-losses-lawsuits-2025-2" style="color:#162B3B;">Business Insider: crypto-trading addiction, relationships and financial harm</a></p>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;margin-bottom:2.5rem;"><a href="https://www.sbs.com.au/news/insight/article/there-is-a-part-of-crypto-which-is-so-dark-bobs-trading-addiction-cost-him-800-000/bkm938fgi" style="color:#162B3B;">SBS Insight: hidden harm and treatment needs associated with crypto-trading addiction</a></p>
          <div style="font-family:sans-serif;border:1px solid rgba(22,43,59,0.15);background:#fff;padding:1.5rem;margin-bottom:2.5rem;">
            <p style="font-size:0.7rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#9B7844;margin-bottom:0.75rem;">Psychreg</p>
            <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:500;line-height:1.4;margin-bottom:0.5rem;"><a href="https://www.psychreg.org/when-families-are-trying-hold-recovery-together-before-treatment/" target="_blank" rel="noopener noreferrer" style="color:#162B3B;">When Families Are Trying to Hold Recovery Together Before Treatment</a></h3>
            <p style="font-size:0.85rem;font-weight:600;color:#4a5568;margin-bottom:0.75rem;">By Craig Bilton</p>
            <p style="font-size:0.9rem;line-height:1.7;color:#4a5568;">Craig Bilton contributed an article exploring how families often try to hold recovery together before formal treatment begins, and why support, boundaries and professional guidance matter during this stage.</p>
          </div>
          <p style="margin-bottom:2rem;"><a href="mailto:craig@insightrecoverynetwork.com?subject=Media%20enquiry" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;">Request expert comment</a></p>
          <p style="font-family:sans-serif;font-size:0.78rem;line-height:1.7;color:#4a5568;max-width:760px;">Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service. Media commentary is general information and does not replace individual clinical assessment or medical advice.</p>
        </div>
      </main>
    `,
  },
  {
    route: "/addiction-help-cornwall",
    file: "addiction-help-cornwall.html",
    title: "Addiction Help in Cornwall: Online Support &amp; Rehab Placement",
    description:
      "Confidential addiction help in Cornwall, including online assessment, recovery support, family guidance and assessment-led UK or international rehab placement.",
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/addiction-help-cornwall#service`,
        name: "Addiction Help in Cornwall",
        serviceType: "Addiction assessment, online recovery support and treatment placement guidance",
        description: "Confidential addiction assessment, online recovery support, family guidance and assessment-led rehab placement for people in Cornwall.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "AdministrativeArea", name: "Cornwall" },
        url: `${SITE_URL}/addiction-help-cornwall`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Addiction Help in Cornwall", item: `${SITE_URL}/addiction-help-cornwall` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          ["Does Insight Recovery Network operate a rehab centre in Cornwall?", "No. Insight Recovery Network is an online support, treatment-placement and advisory network based in Newquay. We do not claim to own or operate a residential rehab centre in Cornwall, and we explain any relevant provider relationship before a placement decision."],
          ["Can I get addiction support online from Cornwall?", "Yes, if online support is appropriate for your needs and you can remain medically and psychologically safe at home. Structured online support is not a substitute for medically supervised detox or round-the-clock residential care where those are needed."],
          ["How do I find alcohol or drug rehab from Cornwall?", "Begin with an assessment of substance use, withdrawal risk, mental health, previous treatment, home circumstances and budget. IRN can then help compare clinically suitable UK, overseas, residential and online routes."],
          ["Can you help families in Truro, Redruth or elsewhere in Cornwall?", "Yes. Assessment, family guidance and online recovery support are delivered remotely across Newquay, Truro, Redruth, Falmouth, St Austell and surrounding areas."],
          ["What if alcohol withdrawal may be dangerous?", "Do not stop suddenly without medical advice if there may be physical dependence, severe withdrawal or significant health concerns. Contact a GP or NHS 111 for urgent advice, and call 999 or attend A&E in an emergency."],
        ].map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
    body: `
      <header style="background:#162B3B;padding:1rem 2rem;"><a href="/" style="font-family:Georgia,serif;color:#F6F4F0;text-decoration:none;font-size:1.1rem;">Insight Recovery Network</a></header>
      <main style="font-family:Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:1100px;margin:0 auto;padding:3rem 2rem;">
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;">Cornwall addiction support</p>
            <h1 style="font-size:clamp(2rem,5vw,3.5rem);line-height:1.08;font-weight:500;max-width:800px;">Addiction Help in Cornwall: Assessment, Online Support and Rehab Placement</h1>
            <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;color:#4a5568;max-width:760px;">Insight Recovery Network helps individuals and families across Cornwall understand what level of addiction support may be appropriate, access structured online recovery and compare suitable detox or residential treatment options in the UK and internationally.</p>
            <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:760px;">We are an online-only advisory and recovery network based in Newquay. We do not own or operate a residential rehab centre in Cornwall, and we explain any relevant provider relationship before a placement decision.</p>
            <p><a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;">Book a confidential call</a></p>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;">What support is available from Cornwall?</h2>
            <p style="font-family:sans-serif;line-height:1.8;color:#4a5568;max-width:760px;">The right route depends on medical safety, severity, home circumstances, previous relapse, mental health and the support already around the person.</p>
            <ul style="font-family:sans-serif;line-height:2;color:#4a5568;"><li><a href="/assessments">Confidential online assessment</a></li><li><a href="/online-programme">Structured online recovery support</a></li><li><a href="/treatment-placement">Assessment-led rehab and detox placement</a></li><li><a href="/family-addiction-intervention-uk">Family and intervention guidance</a></li></ul>
          </section>
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-size:2rem;font-weight:500;">Online support or residential care?</h2>
            <p style="font-family:sans-serif;line-height:1.8;color:#4a5568;max-width:760px;">Online support may suit someone who is medically stable and can remain safe at home. Detox or residential care may be needed where withdrawal could be dangerous, repeated relapse continues, home is unsafe or mental health and safeguarding risks need closer assessment.</p>
            <p style="font-family:sans-serif;line-height:1.8;color:#4a5568;max-width:760px;">Alcohol, benzodiazepine and opioid withdrawal can carry medical risks. Seek medical advice before stopping suddenly. Use NHS 111 for urgent non-emergency advice, and call 999 or attend A&amp;E in an emergency.</p>
          </section>
          <section style="padding:3rem 0;">
            <h2 style="font-size:2rem;font-weight:500;">Questions about addiction help in Cornwall</h2>
            <h3>Does Insight Recovery Network operate a rehab centre in Cornwall?</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">No. IRN is an online support, treatment-placement and advisory network based in Newquay. We explain any relevant provider relationship before a placement decision.</p>
            <h3>Can I get addiction support online from Cornwall?</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">Yes, where online support is appropriate and the person can remain medically and psychologically safe at home.</p>
            <h3>How do I find alcohol or drug rehab from Cornwall?</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">Begin with an assessment. IRN can then help compare clinically suitable UK, overseas, residential and online routes.</p>
            <h3>Can you help families across Cornwall?</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">Yes. Remote services are available in Newquay, Truro, Redruth, Falmouth, St Austell and surrounding areas.</p>
            <h3>What if alcohol withdrawal may be dangerous?</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">Seek medical advice before stopping suddenly. Contact NHS 111 for urgent advice and call 999 in an emergency.</p>
          </section>
        </div>
      </main>
    `,
  },
  {
    route: "/services-pricing-guide",
    file: "services-pricing-guide.html",
    title: "Services &amp; Pricing Guide | Insight Recovery Network",
    description:
      "A private guide to Insight Recovery Network services, treatment placement, online recovery programme options, and support pricing.",
    ogImage: `${SITE_URL}/og-what-we-offer.png`,
    noIndex: true,
    body: `
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:900px;margin:0 auto;padding:4rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;margin-bottom:1rem;">Private guide</p>
          <h1 style="font-size:clamp(2rem,5vw,3.75rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;">Services &amp; Pricing Guide</h1>
          <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;color:#4a5568;max-width:680px;margin-bottom:2rem;">A clear overview of treatment placement, online recovery programmes, family guidance, assessment and ongoing support.</p>
          <p style="margin-bottom:2.5rem;"><a href="/services-pricing-guide-2026.pdf" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;">View the guide</a></p>
          <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">What is inside</h2>
          <ul style="font-family:sans-serif;font-size:0.95rem;line-height:2;color:#4a5568;padding-left:1.25rem;margin-bottom:2.5rem;">
            <li>Treatment placement, detox, residential rehab and longer-term care options</li>
            <li>Online recovery programme levels and monthly pricing</li>
            <li>Family guidance, assessment, crisis support and ongoing case support</li>
          </ul>
          <a href="/contact" style="font-family:sans-serif;color:#162B3B;">Contact Insight Recovery Network</a>
        </div>
      </main>
    `,
  },
  {
    route: "/craig-bilton",
    file: "craig-bilton.html",
    title: "Craig Bilton | Founder of Insight Recovery Network",
    description:
      "Craig Bilton is the Founder and Clinical Director of Insight Recovery Network, supporting individuals and families with addiction recovery, treatment placement, and structured online support.",
    ogImage: `${SITE_URL}/craig-bilton-hero.webp`,
    body: `
      <main style="font-family:'Playfair Display',Georgia,serif;background:linear-gradient(160deg,#F2EDE3,#F6F4EF,#EEE9DF);color:#162B3B;">
        <div style="max-width:900px;margin:0 auto;padding:4rem 2rem;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;margin-bottom:1rem;">Founder &amp; Clinical Director</p>
          <h1 style="font-size:clamp(2.25rem,6vw,4rem);line-height:1.05;font-weight:500;margin-bottom:1.5rem;">Craig Bilton</h1>
          <p style="font-family:sans-serif;font-size:1.05rem;line-height:1.8;color:#4a5568;max-width:720px;margin-bottom:2rem;">Craig Bilton founded Insight Recovery Network to provide clear, practical and confidential guidance for individuals and families navigating addiction, treatment decisions, relapse risk and long-term recovery structure.</p>
          <img src="/craig-bilton-hero.webp" width="1693" height="929" alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network" style="display:block;width:100%;height:auto;margin:2.5rem 0;border-radius:0.75rem;box-shadow:0 18px 50px -16px rgba(22,43,59,0.28);" fetchpriority="high" decoding="async" />
          <h2 style="font-size:1.75rem;font-weight:500;margin-bottom:1rem;">Experience and approach</h2>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:720px;margin-bottom:1rem;">His background spans more than 20 years across addiction treatment, mental health support, residential rehabilitation, programme leadership, intervention work and international treatment placement.</p>
          <p style="font-family:sans-serif;font-size:0.95rem;line-height:1.8;color:#4a5568;max-width:720px;margin-bottom:2.5rem;">His work focuses on treatment suitability, family guidance, relapse prevention, aftercare structure and recovery support that fits the person rather than a single rigid model.</p>
          <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;">Contact Craig</a>
        </div>
      </main>
    `,
  },
  {
    route: "/thank-you",
    file: "thank-you.html",
    title: "Enquiry Received | Insight Recovery Network",
    description: "Thank you for contacting Insight Recovery Network. Your confidential enquiry has been received.",
    ogImage: DEFAULT_OG_IMAGE,
    noIndex: true,
    body: `<main style="font-family:sans-serif;background:#F6F4F0;color:#162B3B;min-height:60vh;padding:4rem 2rem;"><div style="max-width:700px;margin:0 auto;"><h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2.5rem;margin-bottom:1rem;">Enquiry received</h1><p style="line-height:1.8;color:#4a5568;">Thank you for contacting Insight Recovery Network. We will review your enquiry and respond confidentially.</p></div></main>`,
  },
  {
    route: "/recovery-plan-checklist/checklist",
    file: "recovery-plan-checklist-app.html",
    title: "Recovery Plan Checklist | Insight Recovery Network",
    description: "A private checklist for assessing whether a recovery plan, treatment programme, or aftercare structure is the right fit.",
    ogImage: DEFAULT_OG_IMAGE,
    noIndex: true,
    body: `<main style="font-family:sans-serif;background:#F6F4F0;color:#162B3B;min-height:60vh;padding:4rem 2rem;"><div style="max-width:700px;margin:0 auto;"><h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2.5rem;margin-bottom:1rem;">Recovery Plan Checklist</h1><p style="line-height:1.8;color:#4a5568;">A private interactive checklist for reviewing recovery planning and aftercare structure.</p></div></main>`,
  },
  {
    route: "/get-help",
    file: "get-help.html",
    title: "Free, Confidential Addiction Support | Insight Recovery Network",
    description: "Confidential guidance for people affected by their own or a loved one's addiction.",
    ogImage: `${SITE_URL}/get-help-hero.png`,
    noIndex: true,
    body: `<main style="font-family:sans-serif;background:#F6F4F0;color:#162B3B;min-height:60vh;padding:4rem 2rem;"><div style="max-width:700px;margin:0 auto;"><h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2.5rem;margin-bottom:1rem;">Free, confidential addiction support</h1><p style="line-height:1.8;color:#4a5568;margin-bottom:2rem;">Clear guidance for you or someone you love, without pressure or judgement.</p><a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;">Book a confidential call</a></div></main>`,
  },
  {
    route: "/admin",
    file: "admin.html",
    title: "IRN Admin | Insight Recovery Network",
    description: "Private administration area.",
    ogImage: DEFAULT_OG_IMAGE,
    noIndex: true,
    body: `<main style="font-family:sans-serif;background:#F6F4F0;color:#162B3B;min-height:100vh;padding:4rem 2rem;"><div style="max-width:420px;margin:0 auto;"><h1 style="font-family:'Playfair Display',Georgia,serif;font-size:2rem;margin-bottom:1rem;">Article Management</h1><p style="line-height:1.8;color:#4a5568;">Sign in to continue.</p></div></main>`,
  },
  {
    route: "/404",
    file: "404.html",
    title: "Page Not Found | Insight Recovery Network",
    description: "The requested page could not be found.",
    ogImage: `${SITE_URL}/og-home.png`,
    noIndex: true,
    body: `
      <main style="font-family:'Playfair Display',Georgia,serif;background:#F6F4F0;color:#162B3B;min-height:70vh;display:flex;align-items:center;">
        <div style="max-width:680px;margin:0 auto;padding:4rem 2rem;text-align:center;">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#6B7280;margin-bottom:1rem;">404, Page Not Found</p>
          <h1 style="font-size:clamp(2rem,5vw,3.25rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;">We couldn't find that page.</h1>
          <p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#4a5568;margin-bottom:2rem;">The page may have moved or no longer exists. You can return to the homepage or contact us for help.</p>
          <a href="/" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:600;margin-right:0.75rem;">Back to Homepage</a>
          <a href="/contact" style="font-family:sans-serif;color:#162B3B;">Contact Us</a>
        </div>
      </main>
    `,
  },
];

function buildPremiumTreatmentJsonLd(page) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}${page.route}#service`,
      name: page.h1,
      serviceType: "Assessment-led private addiction treatment placement guidance",
      description: page.metaDescription,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        "United Kingdom",
        "Thailand",
        "South Africa",
        "Spain",
        "Sri Lanka",
      ].map((name) => ({ "@type": "Country", name })),
      url: `${SITE_URL}${page.route}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Treatment Placement",
          item: `${SITE_URL}/treatment-placement`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.title,
          item: `${SITE_URL}${page.route}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];
}

function buildPremiumTreatmentBody(page) {
  const sectionHtml = page.sections
    .map(
      (section) => `
        <section style="padding:3rem 0;border-bottom:1px solid rgba(22,43,59,0.12);">
          <h2 style="font-size:2rem;font-weight:500;margin-bottom:1.25rem;">${esc(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p style="font-family:sans-serif;font-size:0.95rem;line-height:1.85;color:#4a5568;max-width:800px;margin-bottom:1rem;">${esc(paragraph)}</p>`).join("")}
          ${section.bullets?.length ? `<ul style="font-family:sans-serif;font-size:0.9rem;line-height:1.8;color:#4a5568;padding-left:1.25rem;columns:2;column-gap:2rem;">${section.bullets.map((item) => `<li style="margin-bottom:0.5rem;break-inside:avoid;">${esc(item)}</li>`).join("")}</ul>` : ""}
        </section>`
    )
    .join("");

  return `
    <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
      <a href="/" style="font-family:Georgia,serif;color:#F6F4F0;text-decoration:none;font-size:1.1rem;">Insight Recovery Network</a>
      <nav aria-label="Main navigation" style="display:flex;gap:1rem;flex-wrap:wrap;"><a href="/treatment-placement" style="color:#F6F4F0;font-family:sans-serif;font-size:0.85rem;">Treatment Placement</a><a href="/how-much-does-rehab-cost-uk" style="color:#F6F4F0;font-family:sans-serif;font-size:0.85rem;">Rehab Costs</a><a href="/contact" style="color:#fff;font-family:sans-serif;font-size:0.85rem;">Discuss treatment options</a></nav>
    </header>
    <main style="font-family:Georgia,serif;background:#F6F4F0;color:#162B3B;">
      <div style="max-width:1200px;margin:0 auto;padding:2rem;">
        <img src="${esc(page.heroImage)}" width="1600" height="900" alt="${esc(page.heroAlt)}" style="display:block;width:100%;height:auto;background:#162B3B;" fetchpriority="high" decoding="async" />
        <p style="font-family:sans-serif;font-size:0.72rem;color:#6B7280;margin:0.65rem 0 2rem;">Illustrative setting. Insight Recovery Network does not claim to own or operate the depicted property.</p>
        <nav aria-label="Breadcrumb" style="font-family:sans-serif;font-size:0.75rem;margin-bottom:2rem;"><a href="/">Home</a> / <a href="/treatment-placement">Treatment placement</a> / ${esc(page.title)}</nav>
        <section style="padding:1rem 0 3rem;border-bottom:1px solid rgba(22,43,59,0.12);">
          <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#9B7844;">${esc(page.eyebrow)}</p>
          <h1 style="font-size:clamp(2.2rem,5vw,4rem);line-height:1.08;font-weight:500;max-width:900px;">${esc(page.h1)}</h1>
          ${page.intro.map((paragraph) => `<p style="font-family:sans-serif;font-size:1rem;line-height:1.85;color:#4a5568;max-width:820px;">${esc(paragraph)}</p>`).join("")}
          <p><a href="/contact" style="display:inline-block;padding:0.875rem 1.5rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;">Discuss treatment options</a> <a href="/assessments" style="display:inline-block;padding:0.875rem 1.5rem;color:#162B3B;font-family:sans-serif;">Request a confidential assessment</a></p>
        </section>
        <section aria-label="Service summary" style="padding:2rem 0;border-bottom:1px solid rgba(22,43,59,0.12);font-family:sans-serif;">
          <h2 style="position:absolute;left:-9999px;">Service summary</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;">${[
            ["Who this is for", page.summary.who],
            ["What it helps solve", page.summary.problem],
            ["Where it applies", page.summary.applies],
            ["Next step", page.summary.nextStep],
          ].map(([label, value]) => `<div style="border:1px solid rgba(22,43,59,0.12);background:#fff;padding:1.25rem;"><strong style="display:block;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.12em;color:#9B7844;margin-bottom:0.5rem;">${esc(label)}</strong><span style="font-size:0.9rem;line-height:1.6;">${esc(value)}</span></div>`).join("")}</div>
          <p style="font-size:0.78rem;line-height:1.7;color:#4a5568;margin-top:1.5rem;">Written by <a href="/craig-bilton">Craig Bilton, Founder &amp; Clinical Director</a>, drawing on 20+ years' international addiction and mental health experience. Last reviewed ${esc(PREMIUM_TREATMENT_REVIEW_DATE)}.</p>
          <p style="font-size:0.78rem;line-height:1.7;color:#4a5568;">Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service. In an emergency call 999 or attend A&amp;E.</p>
        </section>
        <section style="padding:3rem 0;border-bottom:1px solid rgba(22,43,59,0.12);display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">${page.highlights.map((item) => `<article style="border:1px solid rgba(22,43,59,0.12);background:#fff;padding:1.5rem;"><h2 style="font-size:1.25rem;font-weight:500;">${esc(item.title)}</h2><p style="font-family:sans-serif;font-size:0.9rem;line-height:1.75;color:#4a5568;">${esc(item.body)}</p></article>`).join("")}</section>
        ${sectionHtml}
        <section style="padding:3rem 0;border-bottom:1px solid rgba(22,43,59,0.12);">
          <h2 style="font-size:2rem;font-weight:500;">${esc(page.comparison.title)}</h2>
          <p style="font-family:sans-serif;line-height:1.8;color:#4a5568;max-width:800px;">${esc(page.comparison.introduction)}</p>
          <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:0.85rem;"><thead><tr>${page.comparison.columns.map((column) => `<th style="text-align:left;padding:0.85rem;border:1px solid rgba(22,43,59,0.15);background:#162B3B;color:#fff;">${esc(column)}</th>`).join("")}</tr></thead><tbody>${page.comparison.rows.map((row) => `<tr>${row.map((cell) => `<td style="vertical-align:top;padding:0.85rem;border:1px solid rgba(22,43,59,0.15);line-height:1.6;">${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
        </section>
        <section style="padding:3rem 0;border-bottom:1px solid rgba(22,43,59,0.12);"><h2 style="font-size:2rem;font-weight:500;">From assessment to a practical treatment plan</h2><ol style="font-family:sans-serif;line-height:1.8;color:#4a5568;">${page.process.map(([title, body]) => `<li style="margin-bottom:0.85rem;"><strong style="color:#162B3B;">${esc(title)}:</strong> ${esc(body)}</li>`).join("")}</ol><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;border-left:4px solid #C9A96E;padding:1rem 1.25rem;">${esc(page.transparency)}</p></section>
        <section style="padding:3rem 0;border-bottom:1px solid rgba(22,43,59,0.12);"><h2 style="font-size:2rem;font-weight:500;">Compare related private treatment routes</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">${page.relatedLinks.map(([title, description, href]) => `<article style="border:1px solid rgba(22,43,59,0.12);padding:1.25rem;background:#fff;"><h3 style="font-size:1.15rem;font-weight:500;"><a href="${esc(href)}">${esc(title)}</a></h3><p style="font-family:sans-serif;font-size:0.85rem;line-height:1.7;color:#4a5568;">${esc(description)}</p></article>`).join("")}</div></section>
        <section style="padding:3rem 0;"><h2 style="font-size:2rem;font-weight:500;">Questions about ${esc(page.title.toLowerCase())}</h2>${page.faqs.map(([question, answer]) => `<article style="max-width:820px;margin-bottom:1.5rem;"><h3 style="font-size:1.2rem;font-weight:500;">${esc(question)}</h3><p style="font-family:sans-serif;line-height:1.8;color:#4a5568;">${esc(answer)}</p></article>`).join("")}</section>
        <section style="padding:3rem 2rem;background:#162B3B;color:#fff;text-align:center;"><h2 style="font-size:2rem;font-weight:500;">${esc(page.cta.heading)}</h2><p style="font-family:sans-serif;line-height:1.8;color:rgba(255,255,255,0.75);">${esc(page.cta.description)}</p><a href="${esc(page.cta.primary[1])}" style="display:inline-block;padding:0.875rem 1.5rem;background:#fff;color:#162B3B;text-decoration:none;font-family:sans-serif;">${esc(page.cta.primary[0])}</a> <a href="${esc(page.cta.secondary[1])}" style="display:inline-block;padding:0.875rem 1.5rem;color:#fff;font-family:sans-serif;">${esc(page.cta.secondary[0])}</a></section>
      </div>
    </main>`;
}

PAGES.push(
  ...premiumTreatmentPages.map((page) => ({
    route: page.route,
    file: `${page.slug}.html`,
    title: page.fullTitle,
    description: page.metaDescription,
    ogImage: `${SITE_URL}${page.heroImage}`,
    ogImageWidth: 1600,
    ogImageHeight: 900,
    ogImageAlt: page.heroAlt,
    jsonLd: buildPremiumTreatmentJsonLd(page),
    body: buildPremiumTreatmentBody(page),
  })),
);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: inject page-specific meta tags into index.html
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_SERVICE_SUMMARIES = {
  "/treatment-placement": [
    "Individuals or families considering private detox or residential rehabilitation.",
    "Clarifies treatment choices and supports an appropriate placement decision.",
    "Across the UK and selected international treatment destinations.",
  ],
  "/private-rehab-uk": [
    "People considering private detox or residential addiction treatment in the UK.",
    "Explains when residential care may fit and how to compare regulated providers.",
    "Private treatment settings across the United Kingdom.",
  ],
  "/private-rehab-alternative-uk": [
    "People seeking structured support who may not need or want residential rehab.",
    "Compares online, community and residential routes while keeping detox safety clear.",
    "Online across the UK and internationally; regulated care is arranged separately.",
  ],
  "/online-programme": [
    "Adults who are medically stable and want structured recovery support at home.",
    "Provides routine, accountability and relapse-prevention support in everyday life.",
    "Delivered online across the UK and internationally; detox is not provided.",
  ],
  "/what-we-offer": [
    "Individuals, families and professionals seeking private recovery guidance.",
    "Clarifies the appropriate support route and provides continuity through recovery.",
    "Online across the UK and internationally, with UK and overseas placement guidance.",
  ],
  "/contact": [
    "Individuals, families and professionals who want a private first conversation.",
    "Creates a clear, low-pressure starting point when the next step is uncertain.",
    "Online and by telephone across the UK and internationally.",
  ],
};

const STATIC_VISIBLE_FAQS = {
  "/treatment-placement": [
    ["How does treatment placement work?", "We clarify needs, risks, preferences, location and budget, then explain suitable options and support the practical steps towards admission. The chosen provider remains responsible for its own assessment and care."],
    ["Can you arrange medical detox?", "Insight Recovery Network does not provide or prescribe detox. Where medically assisted withdrawal may be needed, we help identify an appropriately regulated provider and encourage medical assessment."],
  ],
  "/online-programme": [
    ["Who is the online recovery programme for?", "It is designed for adults who are medically stable and want structured support without entering residential treatment. A confidential conversation helps establish whether this level of support fits."],
    ["Does the programme provide detox or emergency care?", "No. Insight Recovery Network does not provide medical detox, diagnosis, prescribing or emergency care. Call 999 in an emergency."],
  ],
  "/what-we-offer": [
    ["Where should I start?", "Start with a confidential call or a free assessment. We can explain whether online support, family guidance, treatment placement or a regulated service appears to be the most appropriate route."],
    ["Can families ask for guidance?", "Yes. Families can seek support around boundaries, communication, safety and realistic options even when the person they are worried about is not ready to engage."],
  ],
  "/contact": [
    ["What happens after I submit an enquiry?", "We review the information you choose to share and respond to arrange a private conversation. There is no pressure or obligation."],
    ["Can you help in an emergency or prescribe medication?", "No. Insight Recovery Network is not an emergency service and does not diagnose or prescribe. Call 999 or attend A&E in an emergency."],
  ],
};

function buildStaticServiceEnhancement(route) {
  const summary = STATIC_SERVICE_SUMMARIES[route];
  if (!summary) return "";
  const labels = ["Who this is for", "What it helps solve", "Where it applies"];
  const links = [
    ["Rehab Cost UK Guide", "/how-much-does-rehab-cost-uk"],
    ["Treatment Placement", "/treatment-placement"],
    ["Private Rehab UK", "/private-rehab-uk"],
    ["Private Rehab Alternatives", "/private-rehab-alternative-uk"],
    ["Luxury Rehab", "/luxury-rehab"],
    ["Executive Rehab", "/executive-rehab"],
    ["Destination Rehab", "/destination-rehab"],
    ["Online Recovery Programme", "/online-programme"],
    ["Family Guidance", "/what-we-offer#family-guidance"],
    ["Detox Suitability Assessment", "/assessments/detox"],
  ];
  const faqs = STATIC_VISIBLE_FAQS[route] ?? [];
  return `
    <section aria-label="Service summary" style="font-family:sans-serif;background:#F6F4F0;border-top:1px solid rgba(22,43,59,0.12);border-bottom:1px solid rgba(22,43,59,0.12);padding:2rem;">
      <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;">
        ${summary.map((value, index) => `<div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">${labels[index]}</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">${value}</p></div>`).join("")}
        <div style="background:#fff;border:1px solid rgba(22,43,59,0.12);padding:1.25rem;"><p style="font-size:0.68rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9B7844;margin-bottom:0.5rem;">Next step</p><p style="font-size:0.9rem;line-height:1.6;color:#162B3B;">Book a confidential call</p></div>
      </div>
      <div style="max-width:1200px;margin:1.25rem auto 0;font-size:0.78rem;line-height:1.7;color:#4a5568;"><p>Written by <a href="/craig-bilton" style="color:#162B3B;">Craig Bilton, Founder &amp; Clinical Director</a>, drawing on 20+ years' international addiction and mental health experience. Last reviewed 30 June 2026.</p><p>Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service. In an emergency call 999 or attend A&amp;E.</p></div>
    </section>
    <section style="font-family:sans-serif;max-width:1200px;margin:0 auto;padding:2.5rem 2rem;">
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin-bottom:1rem;">Related support and guidance</h2>
      <p style="line-height:2;">${links.filter(([, href]) => href !== route).map(([title, href]) => `<a href="${href}" style="color:#162B3B;margin-right:1.25rem;">${title}</a>`).join("")}</p>
      ${faqs.length ? `<h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin:2.5rem 0 1rem;">Frequently asked questions</h2>${faqs.map(([question, answer]) => `<div style="margin-bottom:1.25rem;max-width:720px;"><h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:500;color:#162B3B;margin-bottom:0.4rem;">${question}</h3><p style="font-size:0.9rem;line-height:1.7;color:#4a5568;">${answer}</p></div>`).join("")}` : ""}
    </section>`;
}

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

  if (page.noIndex) {
    out = out.replace(
      /(<meta\s+name="robots"\s+content=")[^"]*(")/,
      "$1noindex, nofollow$2"
    );
  }

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

  if (page.ogImageWidth) {
    out = out.replace(
      /(<meta\s+property="og:image:width"\s+content=")[^"]*(")/,
      `$1${page.ogImageWidth}$2`
    );
  }

  if (page.ogImageHeight) {
    out = out.replace(
      /(<meta\s+property="og:image:height"\s+content=")[^"]*(")/,
      `$1${page.ogImageHeight}$2`
    );
  }

  // og:image:alt
  out = out.replace(
    /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
    `$1${esc(page.ogImageAlt ?? SITE_NAME)}$2`
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
  const staticEnhancement = buildStaticServiceEnhancement(page.route);
  const bodyReplaced = out.replace(
    /(<div id="root">)[\s\S]*(<\/div>)(\s*\n\s*<!-- React mounts here)/,
    `$1\n${page.body}\n${staticEnhancement}\n${STATIC_FOOTER}\n    $2$3`
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

  return markPrerenderedMetadata(bodyReplaced);
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
      slug: "relapse-meaning",
      pageTitle: "Relapse Meaning in Addiction Recovery",
      ogTitle: "Relapse Meaning: What Relapse Really Means in Addiction Recovery",
      description: "Understand what relapse really means in addiction recovery, why it happens, and how to respond without shame or denial.",
      image: `${SITE_URL}/relapse-meaning-addiction-recovery.png`,
      imageAlt: "Recovery roadmap showing relapse as part of a wider addiction recovery journey",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "relapsing-does-not-mean-you-have-failed",
      pageTitle: "Relapsing Does Not Mean You Have Failed",
      ogTitle: "Relapsing Does Not Mean You Have Failed",
      description: "Relapse is serious, but it does not mean recovery has failed. Learn how to respond, reset, and rebuild support quickly.",
      image: `${SITE_URL}/relapsing-does-not-mean-you-have-failed.png`,
      imageAlt: "Person standing calmly on a recovery path after a setback with warm light ahead",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "slip-lapse-relapse-difference",
      pageTitle: "Slip, Lapse and Relapse: Key Differences",
      ogTitle: "Slip, Lapse and Relapse: What Is the Difference?",
      description: "Learn the difference between a slip, lapse, and relapse, and why the way you respond can shape your recovery.",
      image: `${SITE_URL}/slip-lapse-relapse-difference.png`,
      imageAlt: "Three connected stages explaining the difference between a slip, lapse and relapse",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "why-relapse-happens-before-substance-use",
      pageTitle: "Why Relapse Starts Before Substance Use",
      ogTitle: "Why Relapse Happens Before the Substance Is Used",
      description: "Relapse often begins before drinking, drug use, or addictive behaviour. Learn the emotional and mental stages that come first.",
      image: `${SITE_URL}/why-relapse-happens-before-substance-use.png`,
      imageAlt: "Iceberg metaphor showing emotions, thoughts, triggers and behaviours beneath relapse",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "relapse-prevention-plan",
      pageTitle: "Relapse Prevention Plan: What to Include",
      ogTitle: "Relapse Prevention Plan: What Should Actually Be Included?",
      description: "Learn what a relapse prevention plan should include, from warning signs and triggers to support, structure, and clear action steps.",
      image: `${SITE_URL}/relapse-prevention-plan-what-to-include.png`,
      imageAlt: "Structured relapse prevention plan with warning signs, triggers, coping strategies and support contacts",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "addiction-warning-signs",
      pageTitle: "Addiction Warning Signs: Spot Relapse Risk Early",
      ogTitle: "Addiction Warning Signs: How to Spot Relapse Risk Early",
      description: "Learn how to spot early addiction warning signs, identify relapse risk, and respond before things escalate, for yourself or a loved one.",
      image: `${SITE_URL}/addiction-warning-signs-relapse-risk.png`,
      imageAlt: "Recovery dashboard showing early warning signs, mood tracking and relapse risk indicators",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "what-to-do-after-relapse",
      pageTitle: "What to Do After a Relapse",
      ogTitle: "What to Do After a Relapse",
      description: "A calm, practical guide to what to do after a relapse: stay safe, reduce harm, rebuild support, and get back on track quickly.",
      image: `${SITE_URL}/what-to-do-after-a-relapse.png`,
      imageAlt: "Person creating a recovery action plan after relapse with support phone nearby",
      date: "2026-06-12",
      type: "article"
  },
  {
      slug: "how-structured-support-prevents-relapse",
      pageTitle: "How Structured Recovery Support Prevents Relapse",
      ogTitle: "How Structured Recovery Support Helps Prevent Relapse",
      description: "Learn how routine, accountability, groups, one-to-one support, and recovery planning work together to reduce relapse risk.",
      image: `${SITE_URL}/structured-recovery-support-prevent-relapse.png`,
      imageAlt: "Structured recovery support system showing journaling, groups, accountability and progress tracking",
      date: "2026-06-12",
      type: "article"
  },
  {
    slug: "alcohol-withdrawal-symptoms-when-you-need-medical-help",
    pageTitle: "Alcohol Withdrawal Symptoms: When You Need Medical Help",
    ogTitle: "Alcohol Withdrawal Symptoms: When You Need Medical Help",
    description: "A clear guide to alcohol withdrawal symptoms, from mild to severe, and how to know when you need medical help or urgent care.",
    image: `${SITE_URL}/article-alcohol-withdrawal-symptoms-medical-help.png`,
    imageAlt: "Private consultation setting representing alcohol withdrawal symptoms and medical guidance",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "how-long-does-alcohol-stay-in-your-system",
    pageTitle: "How Long Does Alcohol Stay in Your System?",
    ogTitle: "How Long Does Alcohol Stay in Your System?",
    description: "How long alcohol stays in your blood, breath, urine, and hair, what affects it, and why you cannot rely on it to judge if you are safe to drive.",
    image: `${SITE_URL}/article-how-long-does-alcohol-stay-in-your-system.png`,
    imageAlt: "Abstract timeline showing how long alcohol stays in the body",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "can-i-stop-drinking-without-rehab",
    pageTitle: "Can I Stop Drinking Without Rehab?",
    ogTitle: "Can I Stop Drinking Without Rehab?",
    description: "Yes, many people stop drinking without rehab, but not everyone can do it safely. Learn who can, who needs medical help, and what stopping really takes.",
    image: `${SITE_URL}/article-can-i-stop-drinking-without-rehab.png`,
    imageAlt: "Person at a forked path representing stopping drinking with or without rehab",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "do-i-need-alcohol-rehab-or-online-support",
    pageTitle: "Do I Need Alcohol Rehab or Online Support?",
    ogTitle: "Do I Need Alcohol Rehab or Online Support?",
    description: "Not sure whether you need residential rehab or online recovery support? Learn the signs that point to each, and how to choose the right level of help.",
    image: `${SITE_URL}/article-do-i-need-alcohol-rehab-or-online-support.png`,
    imageAlt: "Person comparing residential rehab and online alcohol recovery support",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "private-alcohol-rehab-uk-costs-options-alternatives",
    pageTitle: "Private Alcohol Rehab UK: Costs, Options and Alternatives",
    ogTitle: "Private Alcohol Rehab UK: Costs, Options and Alternatives",
    description: "What private alcohol rehab costs in the UK, what drives the price, and the alternatives, including international placement and online recovery.",
    image: `${SITE_URL}/article-private-alcohol-rehab-uk-costs-options-alternatives.png`,
    imageAlt: "Desk with recovery plan and cost comparison representing private alcohol rehab options in the UK",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "alcohol-rehab-alternatives-uk",
    pageTitle: "Alcohol Rehab Alternatives UK: What Are Your Options?",
    ogTitle: "Alcohol Rehab Alternatives UK: What Are Your Options?",
    description: "A clear guide to alcohol rehab alternatives in the UK, from online programmes and outpatient care to therapy, peer support, and international options.",
    image: `${SITE_URL}/article-alcohol-rehab-alternatives-uk-options.png`,
    imageAlt: "Connected recovery pathways representing alcohol rehab alternatives in the UK",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "online-alcohol-recovery-programme-uk",
    pageTitle: "Online Alcohol Recovery Programme UK: How It Works",
    ogTitle: "Online Alcohol Recovery Programme UK: How It Works and Who It Helps",
    description: "How an online alcohol recovery programme works, what is included, and who it helps, a structured, affordable alternative to residential rehab.",
    image: `${SITE_URL}/article-online-alcohol-recovery-programme-uk.png`,
    imageAlt: "Person using a laptop for an online alcohol recovery programme from home",
    date: "2026-06-12",
    type: "article",
  },
  {
    slug: "why-cant-i-stop-how-addiction-works",
    pageTitle:
      "Why Can't I Stop Using? | Insight Recovery",
    ogTitle:
      "Why Can't I Stop Drinking or Using, Even When I Want To?",
    description:
      "If you have tried to stop and willpower was never enough, the problem was never your character. Here is how addiction actually works, and how recovery is possible.",
    image: `${SITE_URL}/article-why-cant-i-stop-og.jpg`,
    imageAlt: "A person sitting at a desk torn between the pull of addiction and the life they want, freedom, connection, purpose, peace.",
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
    pageTitle: "What Happens in Residential Rehab? A UK Guide",
    ogTitle: "What Happens in Residential Rehabilitation?",
    description: "What happens in residential rehab? Understand assessment, detox, therapy, daily routines, programme length, discharge and aftercare in the UK.",
    image: `${SITE_URL}/opengraph.jpg`,
    imageAlt: "Insight Recovery Network",
    date: "2026-04-14",
    updatedDate: "2026-06-30",
    type: "article",
  },
  {
    slug: "managing-relapse-part-of-recovery",
    pageTitle:
      "Managing Relapse in Recovery | Insight Recovery",
    ogTitle:
      "Managing Relapse: Why It Is Part of Recovery, Not the End of It",
    description:
      "Relapse is one of the most misunderstood aspects of addiction. Understanding it clinically, rather than morally, changes everything about how we respond to it.",
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
    slug: "ketamine-addiction",
    pageTitle: "Ketamine Addiction: Signs, Harms & Treatment | IRN",
    ogTitle: "Ketamine Addiction: Signs, Harms and Treatment",
    description:
      "Understand ketamine addiction, bladder and mental-health harms, urgent warning signs, assessment and evidence-based UK treatment options.",
    image: `${SITE_URL}/ketamine-addiction-uk-hero-og.webp`,
    imageAlt: "Adult discussing ketamine use and health symptoms with a recovery practitioner",
    date: "2026-08-28",
    updatedDate: "2026-08-28",
    type: "article",
  },
  {
    slug: "benzodiazepine-addiction",
    pageTitle:
      "Benzodiazepine Addiction and Dependence: UK Guide | IRN",
    ogTitle: "Benzodiazepine Addiction and Dependence: UK Guide",
    description:
      "Understand benzodiazepine dependence, addiction and withdrawal risks, when urgent help is needed, and how safe UK assessment and treatment work.",
    image: `${SITE_URL}/benzodiazepine-addiction-uk-hero-og.webp`,
    imageAlt: "Adult discussing benzodiazepine dependence with a healthcare professional",
    date: "2026-08-25",
    updatedDate: "2026-08-25",
    type: "article",
  },
  {
    slug: "mental-health-and-addiction",
    pageTitle:
      "Mental Health and Addiction: UK Guide | IRN",
    ogTitle: "Mental Health and Addiction: A Complete UK Guide",
    description:
      "Understand how mental health and addiction interact, what a safe assessment covers, urgent warning signs and how to find coordinated UK support.",
    image: `${SITE_URL}/mental-health-and-addiction-uk-hero-og.webp`,
    imageAlt: "Adult discussing mental health and addiction with two coordinated support practitioners",
    date: "2026-02-24",
    updatedDate: "2026-08-18",
    type: "article",
  },
  {
    slug: "online-recovery-programmes",
    pageTitle:
      "Online Addiction Recovery Programme: UK Guide | IRN",
    ogTitle:
      "Online Addiction Recovery Programme: Evidence & Safety",
    description:
      "Learn how online addiction recovery programmes work, who they may suit, safety limits, evidence and how to choose credible UK support.",
    image: `${SITE_URL}/online-addiction-recovery-programme-uk-hero-og.webp`,
    imageAlt:
      "Adult taking part in a confidential online addiction recovery session at home.",
    date: "2026-02-10",
    updatedDate: "2026-08-13",
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
    imageAlt: "Why Willpower Is Not a Recovery Plan, Insight Recovery Network branded editorial image with navy and gold design showing a mug reading 'Recovery Is a Plan Not a Promise'",
    date: "2026-05-29",
    type: "article",
  },
];

let LOADED_ARTICLES = ARTICLES;

function siteImageUrl(image) {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

function articleToPrerenderMeta(article) {
  return {
    slug: article.slug,
    pageTitle: article.seoTitle ?? article.title,
    ogTitle: article.ogTitle ?? article.title,
    description: article.metaDescription ?? article.ogDescription ?? article.excerpt,
    image: siteImageUrl(article.ogImage ?? article.image),
    imageAlt: article.imageAlt ?? SITE_NAME,
    date: article.date,
    updatedDate: article.updatedDate ?? article.date,
    type: "article",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2b. FULL ARTICLE BODY PRE-RENDERING + STRUCTURED DATA (JSON-LD)
//
// Previously article pages only had their <meta> tags swapped, which meant
// crawlers without JavaScript (Google first-pass, Bing, ChatGPT, Claude,
// Perplexity, etc.) saw the home-page body on every /resources/* URL, // i.e. 11 duplicates of the home page. The functions below render the full
// article content statically and embed Article / FAQPage / BreadcrumbList /
// Organization / Person JSON-LD so both search engines and LLMs can read
// the real content without executing JS.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the full article data (content, faq, author, readingTime) from
 * src/data/articles.ts. Tries native TS import first (Node >= 23), then
 * falls back to bundling via esbuild so local data-module imports are followed. Returns null on
 * failure so the build degrades gracefully to meta-only prerendering.
 */
async function loadTsModule(relPath) {
  const tsPath = resolve(root, relPath);
  try {
    return await import(pathToFileURL(tsPath).href);
  } catch {
    /* fall through to Vite's TypeScript transform */
  }
  try {
    const { transformWithEsbuild } = await import("vite");
    const tmpPath = resolve(distPublic, `.tmp-${relPath.replace(/[^a-z0-9]/gi, "_")}.mjs`);
    const source = readFileSync(tsPath, "utf8");
    const transformed = await transformWithEsbuild(source, tsPath, {
      loader: "ts",
      format: "esm",
      target: "node20",
    });
    let code = transformed.code;
    const temporaryDependencies = [];

    if (relPath === "src/data/articles.ts") {
      const approvedPath = resolve(root, "src/data/approved-articles.ts");
      const approvedSource = readFileSync(approvedPath, "utf8");
      const approvedTransformed = await transformWithEsbuild(approvedSource, approvedPath, {
        loader: "ts",
        format: "esm",
        target: "node20",
      });
      const articleEightPath = resolve(root, "src/data/article-008-mental-health-and-addiction.ts");
      const articleEightSource = readFileSync(articleEightPath, "utf8");
      const articleEightTransformed = await transformWithEsbuild(articleEightSource, articleEightPath, {
        loader: "ts",
        format: "esm",
        target: "node20",
      });
      const articleEightTmpPath = resolve(distPublic, ".tmp-article-008-mental-health-and-addiction.mjs");
      writeFileSync(articleEightTmpPath, articleEightTransformed.code, "utf8");
      temporaryDependencies.push(articleEightTmpPath);
      const articleNinePath = resolve(root, "src/data/article-009-benzodiazepine-addiction.ts");
      const articleNineSource = readFileSync(articleNinePath, "utf8");
      const articleNineTransformed = await transformWithEsbuild(articleNineSource, articleNinePath, {
        loader: "ts",
        format: "esm",
        target: "node20",
      });
      const articleNineTmpPath = resolve(distPublic, ".tmp-article-009-benzodiazepine-addiction.mjs");
      writeFileSync(articleNineTmpPath, articleNineTransformed.code, "utf8");
      temporaryDependencies.push(articleNineTmpPath);
      const articleTenPath = resolve(root, "src/data/article-010-ketamine-addiction.ts");
      const articleTenSource = readFileSync(articleTenPath, "utf8");
      const articleTenTransformed = await transformWithEsbuild(articleTenSource, articleTenPath, {
        loader: "ts",
        format: "esm",
        target: "node20",
      });
      const articleTenTmpPath = resolve(distPublic, ".tmp-article-010-ketamine-addiction.mjs");
      writeFileSync(articleTenTmpPath, articleTenTransformed.code, "utf8");
      temporaryDependencies.push(articleTenTmpPath);
      const approvedTmpPath = resolve(distPublic, ".tmp-approved-articles.mjs");
      const approvedCode = approvedTransformed.code
        .replace(
          /from\s+["']\.\/article-008-mental-health-and-addiction["']/,
          'from "./.tmp-article-008-mental-health-and-addiction.mjs"',
        )
        .replace(
          /from\s+["']\.\/article-009-benzodiazepine-addiction["']/,
          'from "./.tmp-article-009-benzodiazepine-addiction.mjs"',
        )
        .replace(
          /from\s+["']\.\/article-010-ketamine-addiction["']/,
          'from "./.tmp-article-010-ketamine-addiction.mjs"',
        );
      writeFileSync(approvedTmpPath, approvedCode, "utf8");
      temporaryDependencies.push(approvedTmpPath);
      code = code.replace(
        /from\s+["']\.\/approved-articles["']/,
        'from "./.tmp-approved-articles.mjs"',
      );
    }

    writeFileSync(tmpPath, code, "utf8");
    try {
      return await import(`${pathToFileURL(tmpPath).href}?v=${Date.now()}`);
    } finally {
      rmSync(tmpPath, { force: true });
      for (const dependencyPath of temporaryDependencies) {
        rmSync(dependencyPath, { force: true });
      }
    }
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

function headingId(heading) {
  return heading
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Convert the article markdown-ish content (same dialect rendered by
 * src/pages/ResourceDetail.tsx: ## / ### headings, "- " lists, | tables |,
 * **bold**, [links](url), paragraphs) into static inline-styled HTML.
 */
function markdownToHtml(content, supportingImages = []) {
  const lines = content.split("\n");
  const html = [];
  let listItems = null;
  let orderedItems = null;
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

  const flushOrderedList = () => {
    if (orderedItems?.length) {
      html.push(
        `<ol style="font-family:sans-serif;font-size:0.95rem;line-height:1.9;color:#4a5568;padding-left:1.5rem;margin:1rem 0;max-width:680px;">${orderedItems
          .map((li) => `<li style="margin-bottom:0.35rem;padding-left:0.25rem;">${li}</li>`)
          .join("")}</ol>`
      );
    }
    orderedItems = null;
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

    // [CTA:/path:Button Label] ... [/CTA], inline CTA callout block
    // (mirrors the block parser in src/pages/ResourceDetail.tsx)
    if (line.startsWith("[CTA:")) {
      flushList();
      flushOrderedList();
      flushTable();
      const tagMatch = line.match(/^\[CTA:([^:\]]+):([^\]]+)\]$/);
      const ctaHref = tagMatch ? tagMatch[1] : "/contact";
      const ctaLabel = tagMatch ? tagMatch[2] : "Book a confidential call";
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
      flushOrderedList();
      (tableRows ??= []).push(line);
      continue;
    }
    flushTable();

    if (!line) {
      flushList();
      flushOrderedList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      flushOrderedList();
      html.push(`<h3 style="${H3_STYLE}">${inlineMd(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      flushOrderedList();
      const heading = line.slice(3);
      html.push(`<h2 id="${headingId(heading)}" style="${H2_STYLE}">${inlineMd(heading)}</h2>`);
      const supportingImage = supportingImages.find(
        (image) => image.afterHeading.toLowerCase() === heading.toLowerCase(),
      );
      if (supportingImage) {
        html.push(
          `<figure style="margin:2rem 0;max-width:680px;">` +
            `<img src="${escText(supportingImage.src)}" alt="${esc(supportingImage.alt)}" loading="lazy" style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:0.75rem;" />` +
            (supportingImage.caption
              ? `<figcaption style="font-family:sans-serif;font-size:0.85rem;line-height:1.6;color:#4a5568;margin-top:0.75rem;">${escText(supportingImage.caption)}</figcaption>`
              : "") +
            `</figure>`
        );
      }
      continue;
    }
    if (line.startsWith("- ")) {
      flushOrderedList();
      (listItems ??= []).push(inlineMd(line.slice(2)));
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushList();
      (orderedItems ??= []).push(inlineMd(line.replace(/^\d+\.\s+/, "")));
      continue;
    }
    if (/^\*\*[^*]+\*\*$/.test(line)) {
      flushList();
      flushOrderedList();
      html.push(
        `<p style="font-family:sans-serif;font-weight:600;color:#162B3B;margin:1.5rem 0 0.5rem;max-width:680px;">${escText(line.replace(/^\*\*|\*\*$/g, ""))}</p>`
      );
      continue;
    }
    flushList();
    flushOrderedList();
    if (line.startsWith("**Concise answer:**")) {
      const answer = line.replace("**Concise answer:**", "").trim();
      html.push(
        `<aside aria-label="Concise answer" style="margin:1.75rem 0;padding:1.25rem 1.5rem;border-left:4px solid #C9A96E;background:rgba(242,237,227,0.75);max-width:680px;">` +
          `<p style="font-family:sans-serif;font-size:1rem;line-height:1.8;color:#162B3B;margin:0;"><strong>Concise answer:</strong> ${inlineMd(answer)}</p>` +
          `</aside>`
      );
    } else {
      html.push(`<p style="${P_STYLE}">${inlineMd(line)}</p>`);
    }
  }
  flushList();
  flushOrderedList();
  flushTable();
  return html.join("\n");
}

/** Remove a legacy FAQ block from article copy before the canonical FAQ array is rendered. */
function withoutEmbeddedFaq(content) {
  const lines = content.split("\n");
  const faqStart = lines.findIndex((line) =>
    /^## Frequently Asked Questions(?:\b.*)?$/i.test(line.trim())
  );
  if (faqStart === -1) return content;

  let nextSection = faqStart + 1;
  while (nextSection < lines.length && !lines[nextSection].startsWith("## ")) {
    nextSection++;
  }

  return [...lines.slice(0, faqStart), ...lines.slice(nextSection)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Shared site header used in statically rendered article bodies. */
const STATIC_HEADER = `
      <header style="background:#162B3B;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <a href="/" style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:#F6F4F0;text-decoration:none;letter-spacing:0.02em;">Insight Recovery Network</a>
        <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;">
          <a href="/treatment-placement" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a>
          <a href="/family-addiction-intervention-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Family Help</a>
          <a href="/how-much-does-rehab-cost-uk" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Rehab Costs</a>
          <a href="/online-programme" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Support</a>
          <a href="/resources" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources</a>
          <a href="/about" style="font-family:sans-serif;font-size:0.85rem;color:#F6F4F0;text-decoration:none;opacity:0.85;">About</a>
          <a href="/contact" style="font-family:sans-serif;font-size:0.85rem;color:#fff;text-decoration:none;background:#C9A96E;padding:0.5rem 1.25rem;font-weight:600;">Discuss treatment options</a>
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
            <p style="font-size:0.8rem;line-height:1.7;opacity:0.75;">Confidential guidance for private rehab, detox, family intervention and structured online recovery support. Based in Newquay, Cornwall, UK.</p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Services</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="/treatment-placement" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Treatment Placement</a><br><a href="/family-addiction-intervention-uk" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Family &amp; Intervention Help</a><br><a href="/how-much-does-rehab-cost-uk" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Rehab Costs UK</a><br><a href="/addiction-help-cornwall" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Addiction Help Cornwall</a><br><a href="/online-programme" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Online Recovery Programme</a></p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Free Assessments</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="/assessments/alcohol-use" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Alcohol Use</a><br><a href="/assessments/drug-use" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Drug Use</a><br><a href="/assessments/detox" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Detox Suitability</a><br><a href="/assessments" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">All Assessments</a></p>
          </div>
          <div>
            <p style="font-size:0.75rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;margin-bottom:0.75rem;">Contact</p>
            <p style="font-size:0.85rem;line-height:2.1;"><a href="tel:+447415994475" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">+44 7415 994475</a><br><a href="mailto:info@insightrecoverynetwork.com" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">info@insightrecoverynetwork.com</a><br><a href="/contact" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Book a confidential call</a><br><a href="/resources" style="color:#F6F4F0;text-decoration:none;opacity:0.85;">Resources &amp; Articles</a></p>
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
  const updatedDateFormatted = full.updatedDate
    ? new Date(full.updatedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const faqHtml = full.faq?.length
    ? `
          <section style="padding:3rem 0;border-top:1px solid rgba(201,169,110,0.25);" aria-labelledby="frequently-asked-questions">
            <h2 id="frequently-asked-questions" style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin-bottom:1.5rem;">Frequently Asked Questions</h2>
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

  const sourcesHtml = full.sources?.length
    ? `
          <aside style="padding:3rem 0;border-top:1px solid rgba(201,169,110,0.25);" aria-labelledby="article-sources">
            <h2 id="article-sources" style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;color:#162B3B;margin-bottom:0.75rem;">Sources and further reading</h2>
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#4a5568;max-width:680px;margin-bottom:1rem;">We use current clinical guidance and authoritative public-health information to support factual claims. Sources are checked when the article is updated.</p>
            <ul style="font-family:sans-serif;font-size:0.9rem;line-height:1.7;color:#4a5568;padding-left:1.25rem;max-width:680px;">
              ${full.sources
                .map(
                  (source) => `<li style="margin-bottom:0.6rem;"><a href="${escText(source.url)}" rel="noopener noreferrer" style="color:#162B3B;text-decoration:underline;">${escText(source.title)}</a>, ${escText(source.publisher)}</li>`
                )
                .join("")}
            </ul>
            <p style="font-family:sans-serif;font-size:0.75rem;line-height:1.6;color:#4a5568;margin-top:1.25rem;max-width:680px;">This article provides general information, not a diagnosis or individual medical advice. See our <a href="/clinical-disclaimer" style="color:#162B3B;text-decoration:underline;">clinical disclaimer</a>.</p>
          </aside>`
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
            <p style="font-family:sans-serif;font-size:0.85rem;color:#4a5568;margin-bottom:2.5rem;">By <a href="/craig-bilton" style="color:#162B3B;">${escText(full.author)}</a>, ${escText(full.authorRole)} · ${updatedDateFormatted ? `Updated ${updatedDateFormatted}` : dateFormatted} · ${full.readingTime} min read</p>
            ${full.image ? `<figure style="margin:0 0 2.5rem;max-width:720px;"><img src="${escText(full.image)}" alt="${esc(full.imageAlt ?? full.title)}" style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:0.75rem;" /></figure>` : ""}
            ${markdownToHtml(withoutEmbeddedFaq(full.content), full.supportingImages)}
          </article>
          ${faqHtml}
          ${sourcesHtml}
          <section style="padding:3rem 0;border-top:1px solid rgba(201,169,110,0.25);">
            <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;font-weight:500;margin-bottom:1rem;">Book a confidential call</h2>
            <p style="font-family:sans-serif;font-size:1rem;line-height:1.7;color:#4a5568;margin-bottom:2rem;max-width:580px;">If anything in this article resonates with your situation, a private conversation can help clarify the most appropriate support for you or your family. All enquiries are handled with complete discretion.</p>
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;margin-right:0.75rem;">Book a confidential call</a>
            <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
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
          <section aria-label="Service summary" style="font-family:sans-serif;margin-bottom:2rem;border:1px solid rgba(22,43,59,0.12);background:#fff;padding:1.5rem;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;">
              <div><strong>Who this is for</strong><p>People comparing private residential addiction treatment in ${escText(d.country)}, and families supporting that decision.</p></div>
              <div><strong>What it helps solve</strong><p>Clarifies likely fit, practical considerations and questions to ask before contacting a facility.</p></div>
              <div><strong>Where it applies</strong><p>Private treatment in ${escText(d.country)}; the chosen provider makes final admission and medical decisions.</p></div>
              <div><strong>Next step</strong><p>Book a confidential call</p></div>
            </div>
            <p style="font-size:0.78rem;line-height:1.7;color:#4a5568;margin-top:1rem;">Written by <a href="/craig-bilton" style="color:#162B3B;">Craig Bilton, Founder &amp; Clinical Director</a>, drawing on 20+ years' international addiction and mental health experience. Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency service.</p>
          </section>
          <section style="padding:2rem 0 3rem;border-bottom:1px solid rgba(201,169,110,0.25);">
            <img src="${escText(d.heroImage)}" alt="${escText(d.heroImageAlt)}" style="display:block;width:100%;height:auto;border:1px solid rgba(22,43,59,0.12);background:#162B3B;margin-bottom:2rem;" />
            <div style="max-width:760px;">
              <p style="font-family:sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,169,110,0.9);margin-bottom:1.25rem;">${escText(d.heroEyebrow)}</p>
              <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:500;margin-bottom:1.5rem;">${escText(d.heroHeading)}</h1>
              ${p(d.heroIntro)}
              <div style="display:flex;gap:0.875rem;flex-wrap:wrap;margin-top:1rem;">
                <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;">Book a confidential call</a>
                <a href="/treatment-placement" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">How Placement Works</a>
              </div>
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
          ${d.detailSections?.length ? `
          <section style="padding:3rem 0;border-bottom:1px solid rgba(201,169,110,0.25);">
            ${h2(`What to check before choosing rehab in ${d.country}`)}
            ${d.detailSections.map((section) => `
              <article style="margin-bottom:2.5rem;max-width:760px;">
                <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:500;color:#162B3B;margin-bottom:0.75rem;">${escText(section.heading)}</h3>
                ${section.paragraphs.map((paragraph) => p(paragraph)).join("")}
                ${section.points?.length ? ul(section.points) : ""}
              </article>
            `).join("")}
          </section>` : ""}
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
            ${h2("Related support and treatment routes")}
            <p style="font-family:sans-serif;font-size:0.9rem;line-height:2;margin-bottom:2rem;"><a href="/treatment-placement" style="color:#162B3B;margin-right:1rem;">Treatment Placement</a><a href="/private-rehab-uk" style="color:#162B3B;margin-right:1rem;">Private Rehab UK</a><a href="/private-rehab-alternative-uk" style="color:#162B3B;margin-right:1rem;">Private Rehab Alternatives</a><a href="/luxury-rehab" style="color:#162B3B;margin-right:1rem;">Luxury Rehab</a><a href="/executive-rehab" style="color:#162B3B;margin-right:1rem;">Executive Rehab</a><a href="/destination-rehab" style="color:#162B3B;margin-right:1rem;">Destination Rehab Guide</a><a href="/online-programme" style="color:#162B3B;margin-right:1rem;">Online Recovery Programme</a><a href="/assessments/detox" style="color:#162B3B;">Detox Suitability Assessment</a></p>
            ${h2(`Considering treatment in ${d.country}?`)}
            ${p("A confidential conversation can clarify whether this is the right setting for your situation, clinically and practically. No pressure, with relevant provider relationships explained transparently.")}
            <a href="/contact" style="display:inline-block;padding:0.875rem 2rem;background:#162B3B;color:#fff;text-decoration:none;font-family:sans-serif;font-size:0.875rem;font-weight:500;margin-right:0.75rem;">Book a confidential call</a>
            <a href="/assessments" style="display:inline-block;padding:0.875rem 2rem;border:1px solid rgba(22,43,59,0.25);color:#162B3B;text-decoration:none;font-family:sans-serif;font-size:0.875rem;">Take a free assessment</a>
          </section>
        </div>
      </main>`;
}

function buildDestinationJsonLd(d) {
  const canonicalUrl = `${SITE_URL}/${d.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: `Private Rehab Placement, ${d.country}`,
      serviceType: "Addiction treatment placement guidance",
      description: d.metaDescription,
      image: `${SITE_URL}${d.heroImage}`,
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
  url: `${SITE_URL}/craig-bilton`,
  image: `${SITE_URL}/craig-bilton-hero.webp`,
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
    dateModified: `${full?.updatedDate ?? meta.updatedDate ?? meta.date}T00:00:00+00:00`,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#craig-bilton`,
      name: "Craig Bilton",
      jobTitle: "Founder & Clinical Director",
      url: `${SITE_URL}/craig-bilton`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    ...(full?.sources?.length
      ? { citation: full.sources.map((source) => source.url) }
      : {}),
  };
}

function buildMedicalWebPageJsonLd(meta, full) {
  if (!full?.medicalWebPage) return null;
  const canonicalUrl = `${SITE_URL}/resources/${meta.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#medical-webpage`,
    name: full.title,
    description: meta.description,
    url: canonicalUrl,
    inLanguage: "en-GB",
    datePublished: `${meta.date}T00:00:00+00:00`,
    dateModified: `${full.updatedDate ?? meta.updatedDate ?? meta.date}T00:00:00+00:00`,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#craig-bilton`,
      name: "Craig Bilton",
      jobTitle: "Founder & Clinical Director",
      url: `${SITE_URL}/craig-bilton`,
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
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
        `<script type="application/ld+json" data-prerendered-jsonld="true">${JSON.stringify(obj).replace(/<\//g, "<\\/")}</script>`
    )
    .join("\n    ");
  if (!scripts) return html;
  return html.replace("</head>", `    ${scripts}\n  </head>`);
}

/** Mark static SEO elements so React can replace them cleanly after hydration. */
function markPrerenderedMetadata(html) {
  return html
    .replace("<title>", '<title data-prerendered-meta="true">')
    .replace(
      '<link rel="canonical"',
      '<link data-prerendered-meta="true" rel="canonical"',
    )
    .replace(
      /<meta\s+(?=(?:name="description"|name="twitter:[^"]+"|property="(?:og|article):[^"]+"))/g,
      '<meta data-prerendered-meta="true" ',
    );
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

  // og:image:width, set to 1200
  out = out.replace(
    /(<meta\s+property="og:image:width"\s+content=")[^"]*(")/,
    `$11200$2`
  );

  // og:image:height, set to 630
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

  // og:type, website → article
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
        `  ⚠ Body replacement failed for /resources/${article.slug}, root marker not found.`
      );
    } else {
      out = bodyReplaced;
    }
  }

  // Structured data: Article + Breadcrumb (+ FAQ where present) + entity graph
  out = injectJsonLd(out, [
    buildArticleJsonLd(article, full),
    buildMedicalWebPageJsonLd(article, full),
    buildFaqJsonLd(article, full),
    buildBreadcrumbJsonLd(article, full),
    ORGANIZATION_JSONLD,
    PERSON_JSONLD,
  ]);

  return markPrerenderedMetadata(out);
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
    console.warn("  ⚠ sharp unavailable on this platform, skipping OG image generation.");
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
      ...(page.jsonLd ?? []),
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
        ogImage: `${SITE_URL}${d.heroImage}`,
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
    console.warn("  ⚠ Destination data unavailable, skipping destination pages.\n");
  }

  // ── Step 1b: Inject Organization + Person JSON-LD into the home page ──────
  if (!baseHtml.includes("#organization")) {
    const homeHtml = markPrerenderedMetadata(
      injectJsonLd(baseHtml, [ORGANIZATION_JSONLD, PERSON_JSONLD]),
    );
    writeFileSync(indexPath, homeHtml, "utf-8");
    console.log("  ✓ index.html, injected Organization + Person JSON-LD\n");
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
    console.warn("  ⚠ Full article data unavailable, article pages will be meta-only.\n");
  } else {
    LOADED_ARTICLES = fullArticles
      .filter((article) => article.publishedStatus !== "draft")
      .map(articleToPrerenderMeta);
  }

  let articleCount = 0;
  for (const article of LOADED_ARTICLES) {
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
  const sitemapXml = generateSitemap();
  const totalUrls =
    SITEMAP_EXTRA.length +
    PAGES.filter((page) => !page.noIndex).length +
    LOADED_ARTICLES.length +
    LOADED_DESTINATIONS.length;
  writeFileSync(resolve(distPublic, "sitemap.xml"), sitemapXml, "utf-8");
  console.log(`  ✓ sitemap.xml  (${totalUrls} URLs, content-aware lastmod values)\n`);
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
  "/private-rehab-uk":                           { changefreq: "monthly", priority: "0.9" },
  "/how-much-does-rehab-cost-uk":                { changefreq: "monthly", priority: "0.9" },
  "/addiction-help-cornwall":                    { changefreq: "monthly", priority: "0.9" },
  "/luxury-rehab":                              { changefreq: "monthly", priority: "0.9" },
  "/executive-rehab":                           { changefreq: "monthly", priority: "0.9" },
  "/destination-rehab":                         { changefreq: "monthly", priority: "0.9" },
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
  "/editorial-policy":   { changefreq: "yearly",  priority: "0.5" },
  "/media":              { changefreq: "monthly", priority: "0.7" },
};

/**
 * Explicit content-update dates for non-article routes. Unknown dates are
 * omitted rather than being changed on every deployment.
 */
const SITEMAP_LASTMOD = {
  "/": "2026-07-13",
  "/about": "2026-07-13",
  "/about-insight-recovery-network": "2026-07-13",
  "/what-we-offer": "2026-07-13",
  "/treatment-placement": "2026-07-13",
  "/private-rehab-uk": "2026-07-13",
  "/private-rehab-alternative-uk": "2026-07-13",
  "/how-much-does-rehab-cost-uk": "2026-07-13",
  "/addiction-help-cornwall": "2026-07-13",
  "/private-rehab-thailand": "2026-07-13",
  "/clinical-disclaimer": "2026-07-13",
  "/luxury-rehab": "2026-07-13",
  "/executive-rehab": "2026-07-13",
  "/destination-rehab": "2026-07-13",
};

function generateSitemap() {
  const urlEntry = (loc, changefreq, priority, lastmod) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  };

  const extraEntries = SITEMAP_EXTRA.map((p) =>
    urlEntry(p.url, p.changefreq, p.priority, SITEMAP_LASTMOD[p.url])
  );

  const pageEntries = PAGES.filter((p) => !p.noIndex).map((p) => {
    const meta = SITEMAP_PAGE_META[p.route] ?? { changefreq: "monthly", priority: "0.8" };
    return urlEntry(p.route, meta.changefreq, meta.priority, SITEMAP_LASTMOD[p.route]);
  });

  const articleEntries = LOADED_ARTICLES.map((a) =>
    urlEntry(`/resources/${a.slug}`, "monthly", "0.7", a.updatedDate ?? a.date)
  );

  const destinationEntries = LOADED_DESTINATIONS.map((d) => {
    const route = `/${d.slug}`;
    return urlEntry(route, "monthly", "0.9", SITEMAP_LASTMOD[route]);
  });

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
