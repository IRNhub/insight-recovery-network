import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { professionalPage as page, professionalSchemas } from "@/data/professional-page.js";
import onlineImage from "@/assets/wwo-online-programme.webp";
import placementImage from "@/assets/wwo-treatment-placement.webp";

const Arrow = () => <ArrowUpRight size={20} strokeWidth={1.4} aria-hidden="true" />;

export default function ForProfessionals() {
  return (
    <Layout>
      <SEO title={page.title} fullTitle={page.title} description={page.description}
        canonical={page.route} ogImage={page.ogImage}
        ogImageAlt="Craig Bilton, Insight Recovery Network" />
      <Helmet>{professionalSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}</Helmet>
      <div className="irn-professionals">
        <section className="pro-hero pro-wrap" aria-labelledby="professional-heading">
          <div className="pro-hero-copy">
            <nav className="pro-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>For professionals</span></nav>
            <p className="pro-eyebrow">For GPs &amp; healthcare professionals</p>
            <h1 id="professional-heading">Private addiction support.<br /><em>A considered next step.</em></h1>
            <p className="pro-lead">A Cornwall-based point of contact for adults exploring structured online recovery support or private residential treatment in the UK and internationally.</p>
            <div className="pro-actions">
              <a href="#professional-introduction" className="pro-button">Arrange an introduction <Arrow /></a>
              <a href={page.pdf} download="IRN-professional-guide.pdf" className="pro-text-link"><Download size={17} aria-hidden="true" /> Download the guide</a>
            </div>
            <p className="pro-small">Based in Newquay. Supporting adults and their families.</p>
          </div>
          <figure className="pro-portrait">
            <img src="/images/premium/craig-portrait.webp" width={1000} height={750}
              alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network"
              fetchPriority="high" loading="eager" />
            <figcaption><span><strong>Craig Bilton</strong><span>Founder &amp; Clinical Director</span></span><span className="pro-portrait-mark" aria-hidden="true">IRN</span></figcaption>
            <span className="pro-portrait-label">Personal guidance, from the first conversation.</span>
          </figure>
        </section>

        <div className="pro-facts pro-wrap" aria-label="Service overview">
          <p><strong>20+ years</strong><span>International addiction treatment experience</span></p>
          <p><strong>Two routes</strong><span>Online support and private treatment placement</span></p>
          <p><strong>One personal contact</strong><span>Speak directly with Craig Bilton</span></p>
        </div>

        <section className="pro-services pro-wrap pro-section" aria-labelledby="professional-services">
          <div className="pro-section-heading">
            <div><p className="pro-eyebrow">Support shaped around the person</p><h2 id="professional-services">Two routes.<br /><em>Individual needs.</em></h2></div>
            <p>Patients do not need to choose a service or a facility before contacting us. We help them understand the options and take a practical next step.</p>
          </div>
          <div className="pro-service-grid">
            <article className="pro-service" aria-labelledby="online-support-heading">
              <figure className="pro-service-image"><img src={onlineImage} width={1536} height={1024} loading="lazy" alt="Illustration of recovery planning with a laptop and notebook at home" /><figcaption>01 / Support at home</figcaption></figure>
              <div className="pro-service-copy">
                <h3 id="online-support-heading">Structured online<br />recovery support</h3>
                <p>Individual support for medically stable adults who need a structured approach to recovery alongside work, family or life after residential care.</p>
                <ul>
                  <li>One-to-one sessions focused on recovery needs and goals.</li>
                  <li>Practical recovery work, accountability and regular review.</li>
                  <li>Relapse-prevention planning, including triggers and warning signs.</li>
                  <li>Insight OS tools for reflection, check-ins and recovery planning.</li>
                </ul>
                <p className="pro-service-note">Frequency, availability, between-session support and fees are agreed after a suitability conversation. Family or supporter involvement can be discussed where appropriate and with consent.</p>
                <a className="pro-text-link" href="#professional-introduction">Discuss online support <Arrow /></a>
              </div>
            </article>
            <article className="pro-service" aria-labelledby="placement-heading">
              <figure className="pro-service-image"><img src={placementImage} width={1536} height={1024} loading="lazy" alt="Illustrative residential setting with a quiet courtyard, not a named treatment provider" /><figcaption>02 / Treatment placement</figcaption></figure>
              <div className="pro-service-copy">
                <h3 id="placement-heading">Private residential<br />treatment guidance</h3>
                <p>Personal guidance for adults and families considering private rehab, with support to compare providers and plan the move into care.</p>
                <ul>
                  <li>The level of care required and the provider’s clinical capabilities.</li>
                  <li>UK and selected international treatment options.</li>
                  <li>Complete costs, location, travel and practical arrangements.</li>
                  <li>Admission requirements and continuing support after treatment.</li>
                </ul>
                <p className="pro-service-note">IRN does not own or operate treatment facilities. The selected provider carries out its own clinical assessment, decides on admission and remains responsible for its treatment.</p>
                <a className="pro-text-link" href="#professional-introduction">Discuss treatment placement <Arrow /></a>
              </div>
            </article>
          </div>
          <div className="pro-destinations"><span>Options considered in</span><p>United Kingdom <span>·</span> South Africa <span>·</span> Thailand <span>·</span> Spain <span>·</span> Sri Lanka</p><small>Location is one part of the decision. Safety, needs, preferences and resources guide the discussion.</small></div>
        </section>

        <section className="pro-situations" aria-labelledby="introduction-suitability">
          <div className="pro-wrap pro-situations-layout">
            <div><p className="pro-eyebrow">Recognising the right moment</p><h2 id="introduction-suitability">When an introduction<br /><em>may help.</em></h2><p>Exploring a private option does not require someone to disengage from existing NHS or community support.</p><a href="#professional-introduction" className="pro-text-link">Talk through the service <Arrow /></a></div>
            <ol className="pro-situation-list">
              <li><span>01</span><p>A patient wants private addiction support but is unsure where to start.</p></li>
              <li><span>02</span><p>A medically stable adult needs more structure around recovery while remaining at home.</p></li>
              <li><span>03</span><p>Someone leaving residential treatment is exploring continuing support.</p></li>
              <li><span>04</span><p>A patient or family wants help comparing treatment options, costs and practical arrangements.</p></li>
            </ol>
          </div>
        </section>

        <section className="pro-process pro-wrap pro-section" aria-labelledby="introduction-process">
          <div className="pro-section-heading"><div><p className="pro-eyebrow">Clear from the start</p><h2 id="introduction-process">A straightforward<br /><em>way to introduce a patient.</em></h2></div><p>A simple first conversation, clear service boundaries and communication agreed around the patient.</p></div>
          <ol className="pro-process-grid">
            <li><span className="pro-step">01</span><h3>Start with a conversation</h3><p>Give the patient our details so they can enquire directly. For a professional introduction, contact us first to agree the appropriate route and consent arrangements.</p></li>
            <li><span className="pro-step">02</span><h3>Clarify the next step</h3><p>We discuss needs, preferences, circumstances and fees. Online support is subject to suitability; residential admission remains subject to the provider’s assessment and acceptance.</p></li>
            <li><span className="pro-step">03</span><h3>Agree communication</h3><p>Where the patient consents, we can agree what information to share with the GP or other professionals involved in their care, and how that communication should take place.</p></li>
          </ol>
          <p className="pro-privacy-note"><span aria-hidden="true">i</span>Please do not include patient-identifiable information or medical records in an initial professional enquiry. We will agree an appropriate way to share any information needed.</p>
        </section>

        <section className="pro-guide-section" aria-labelledby="professional-guide-heading">
          <div className="pro-wrap pro-guide-layout">
            <a className="pro-guide-preview" href={page.pdf} download="IRN-professional-guide.pdf" aria-label="Download the two-page IRN professional guide, PDF">
              <img className="pro-guide-back" src="/images/professionals/guide-page-2.webp" width={595} height={841} loading="lazy" alt="" />
              <img className="pro-guide-front" src="/images/professionals/guide-page-1.webp" width={595} height={841} loading="lazy" alt="First page of the IRN professional guide" />
              <span><Download size={16} aria-hidden="true" /> Two-page PDF · 1.3 MB</span>
            </a>
            <div className="pro-guide-copy"><p className="pro-eyebrow">For your practice</p><h2 id="professional-guide-heading">Something to keep.<br /><em>Something to share.</em></h2><p>A concise overview of both services, the introduction process and our contact details. Download it for your team, print a copy or keep it for a conversation with a patient.</p><a className="pro-button" href={page.pdf} download="IRN-professional-guide.pdf">Download the professional guide <Download size={19} aria-hidden="true" /></a><p className="pro-small">No registration required.</p></div>
          </div>
        </section>

        <section className="pro-responsibility pro-wrap pro-section" aria-labelledby="professional-boundaries">
          <div className="pro-section-heading"><div><p className="pro-eyebrow">Clarity and trust</p><h2 id="professional-boundaries">Clear about fees.<br /><em>Clear about responsibilities.</em></h2></div></div>
          <div className="pro-boundary-grid">
            <article><h3>Fees &amp; provider relationships</h3><p>IRN provides private services. Before anyone proceeds, we explain the scope and cost of our support, separate treatment-provider charges and any relevant commercial or referral relationship, including any payment IRN would receive from a provider for a placement.</p><p>Patients can ask how options were selected and whether a provider payment affects the price they pay. A written breakdown of proposed costs should be agreed before committing to care.</p></article>
            <article><h3>Care boundaries</h3><p>IRN is a private support and treatment-guidance service. We are not a regulated healthcare provider and do not provide medical diagnosis, prescribing, medical detox or emergency care.</p><p>Our involvement does not replace appropriate medical or psychiatric assessment or transfer clinical responsibility from existing professionals. Where medical assessment or a higher level of care is needed, that takes priority.</p><p className="pro-small">For urgent medical concerns, use the appropriate NHS pathway. In an emergency, call 999 or attend A&amp;E.</p></article>
          </div>
        </section>

        <section className="pro-contact" id="professional-introduction" aria-labelledby="professional-contact-heading">
          <div className="pro-wrap pro-contact-layout">
            <div><p className="pro-eyebrow">A personal point of contact</p><h2 id="professional-contact-heading">Let’s introduce<br /><em>ourselves.</em></h2><p>If your practice sees adults who want to explore private addiction support, Craig would welcome a brief introductory conversation. For practices in Cornwall, an in-person meeting can also be arranged.</p><a className="pro-button pro-button-light" href={page.email}><Mail size={18} aria-hidden="true" /> Arrange a professional introduction <Arrow /></a><p className="pro-contact-privacy">Professional enquiries only. Please leave patient information out of your first message.</p></div>
            <div className="pro-contact-person"><p className="pro-contact-name">Craig Bilton</p><p className="pro-contact-role">Founder &amp; Clinical Director</p><p>More than 20 years’ international experience in addiction treatment, recovery programme management, interventions and treatment placement, including work in South Africa, Thailand and Sri Lanka.</p><address><a href={page.email}><Mail size={17} aria-hidden="true" /><span>info@insightrecoverynetwork.com</span></a><a href="tel:+447415994475"><Phone size={17} aria-hidden="true" /><span>+44 7415 994475</span></a><span>Newquay, Cornwall</span></address><Link className="pro-text-link" href="/about">More about Craig <Arrow /></Link></div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
