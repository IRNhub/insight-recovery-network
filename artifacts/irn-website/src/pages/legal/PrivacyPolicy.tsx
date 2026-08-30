import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        fullTitle="Privacy Policy | Insight Recovery Network"
        description="How Insight Recovery Network collects, uses and protects your personal data under UK GDPR. All enquiries are handled with complete discretion."
        canonical="/privacy-policy"
      />

      <section
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-14 md:py-20">
          <div className="w-7 h-px mb-6" style={{ background: "#C9A96E" }} />
          <p className="text-[10px] font-semibold tracking-[0.20em] uppercase font-sans mb-4" style={{ color: "rgba(201,169,110,0.8)" }}>
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-4" style={{ color: "#162B3B" }}>
            Privacy Policy
          </h1>
          <p className="font-light text-sm text-muted-foreground">Last updated: 30 August 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: "#FAFAF8" }}>
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="flex flex-col gap-10 text-sm font-light leading-relaxed text-muted-foreground">

            <div>
              <p>
                Insight Recovery Network (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy of everyone who contacts us or uses our website. This policy explains what personal data we collect, how we use it, and your rights under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="mt-4">
                We are based in Newquay, Cornwall, UK. Our contact email is{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">1. Data we collect and how</h2>
              <p className="mb-3">We collect information you actively provide, data needed to operate the service securely, and optional analytics data where you have permitted it. The main assessment-related flows are:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Enquiry form (/contact):</strong> name, email address, phone number (optional), and the content of your message.</li>
                <li><strong className="font-medium text-foreground/70">Anonymous core self-assessment (/assessments/*):</strong> no name, email address or phone number is required. We store the answers you submit, the score or descriptive profile, derived safety and interpretation information, the assessment definition version, completion and delivery status, a hashed result-access token and a scheduled deletion date.</li>
                <li><strong className="font-medium text-foreground/70">Optional choices after the result:</strong> if you ask for an emailed result, we collect your email address and an optional name. If you request IRN follow-up, we also require your name and may collect an optional phone number. Marketing permission is a separate, optional choice.</li>
                <li><strong className="font-medium text-foreground/70">Website usage:</strong> with permission, GA4 receives privacy-screened page and interaction data on non-assessment pages. Google and Meta tracking are excluded throughout assessment and linked result journeys, regardless of an earlier cookie choice. Our web server or hosting provider may log standard access data for security and error diagnostics.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">2. How we use your data</h2>
              <ul className="flex flex-col gap-2 pl-4">
                <li>To respond to your enquiry and provide the support or information you have requested.</li>
                <li>To calculate, store and allow you to recover the rule-based result requested through the assessment.</li>
                <li>To email the complete result only if you select the result-email permission.</li>
                <li>To create an IRNOS follow-up record only if you separately ask IRN to contact you. The assessment path sends contact details and a derived clinical summary, not the raw answer set.</li>
                <li>To record marketing permission only if you separately select it. Marketing is not required for an emailed result or follow-up.</li>
                <li>The result uses fixed, versioned rules. Assessment AI is disabled. The result does not make a decision with legal or similarly significant effect, and we do not sell or rent your data.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">3. Legal basis for processing</h2>
              <p className="mb-3">The lawful basis must match each processing purpose. The currently documented bases and the assessment-specific issue still requiring approval are:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Legitimate interests (Article 6(1)(f)):</strong> responding to direct enquiries, maintaining a record of contacts for continuity of support, and improving our services.</li>
                <li><strong className="font-medium text-foreground/70">Consent (Article 6(1)(a)):</strong> for the separate result-email, IRN follow-up and marketing choices shown after an assessment. You can withdraw those permissions at any time by emailing us.</li>
                <li>Assessment answers and derived results may constitute <em>special category data</em> under Article 9. The applicable Article 6 lawful basis and Article 9 condition for the anonymous core assessment and optional disclosures of health-related results must be confirmed in IRN's approved privacy documentation before the workflow is released to production. Purpose-specific contact choices do not by themselves settle those legal bases.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">4. Data retention</h2>
              <p className="mb-3">New core assessment records are assigned a deletion date 730 days after completion. A scheduled server process deletes those assessment rows from the live website database after the deadline; linked delivery-queue rows are removed with them. The necessary result-access cookie lasts for up to 30 days.</p>
              <p className="mb-3">Legacy assessment rows without a deletion date are not silently placed on this schedule. Enquiry records, emails and any IRNOS record created after a requested follow-up are separate records and are not deleted by the website assessment job. They require the applicable IRN retention and erasure process.</p>
              <p>The 730-day technical setting is not a statement that this duration is legally required. IRN must approve the retention schedule against its documented policy and legal advice before production release. You may request erasure sooner, subject to any lawful reason data must be retained.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">5. Service providers and connected systems</h2>
              <p className="mb-3">The assessment implementation uses the following services and systems. Contractual and international-transfer safeguards must be maintained and verified as part of IRN's supplier governance:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Replit</strong> provides the website, API and database hosting infrastructure.</li>
                <li><strong className="font-medium text-foreground/70">Resend</strong> is used only when you request an emailed result. It processes the destination email address, optional name and the complete result email, which contains derived health-related information. Raw assessment answers are not included in that email.</li>
                <li><strong className="font-medium text-foreground/70">IRNOS</strong> is IRN's connected operational system. It receives contact details and a derived clinical summary only when you ask IRN to follow up. The current assessment path does not forward raw answers.</li>
                <li><strong className="font-medium text-foreground/70">Google</strong> provides optional analytics and tag management on non-assessment pages, loaded only after the relevant cookie choice.</li>
                <li><strong className="font-medium text-foreground/70">Meta</strong> provides optional marketing technology on non-assessment pages, loaded only after marketing consent. Automatic page views and health-context conversion events are disabled.</li>
              </ul>
              <p className="mt-3">We do not send names, email addresses, phone numbers, messages, assessment answers, scores, results or clinical information in analytics events. Google and Meta scripts are not loaded on assessment journeys. See the Cookie Policy for controls and categories.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">6. Your rights</h2>
              <p className="mb-3">Under UK GDPR you have the right to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Access</strong>, request a copy of the personal data we hold about you.</li>
                <li><strong className="font-medium text-foreground/70">Rectification</strong>, ask us to correct inaccurate data.</li>
                <li><strong className="font-medium text-foreground/70">Erasure</strong>, ask us to delete your personal data (&ldquo;right to be forgotten&rdquo;).</li>
                <li><strong className="font-medium text-foreground/70">Restriction</strong>, ask us to limit how we use your data.</li>
                <li><strong className="font-medium text-foreground/70">Portability</strong>, receive your data in a structured, machine-readable format.</li>
                <li><strong className="font-medium text-foreground/70">Objection</strong>, object to processing based on legitimate interests.</li>
                <li><strong className="font-medium text-foreground/70">Withdraw consent</strong>, at any time, without affecting the lawfulness of prior processing.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>. We will respond within 30 days.
              </p>
              <p className="mt-3">Withdrawing an optional result-email, follow-up or marketing permission stops future use for that purpose where applicable. It does not automatically erase the core assessment record or undo processing that already occurred. Erasure is a separate request and may be subject to lawful exceptions.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">7. Complaints</h2>
              <p>
                If you are not satisfied with how we handle your data, you have the right to lodge a complaint with the UK Information Commissioner&rsquo;s Office (ICO) at{" "}
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">
                  ico.org.uk
                </a>{" "}
                or by calling 0303 123 1113.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">8. Security</h2>
              <p>We use industry-standard security measures including encrypted connections (HTTPS), access-controlled databases, and minimal data storage. Only authorised staff have access to enquiry and assessment data.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">9. Changes to this policy</h2>
              <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
              <p className="text-xs text-muted-foreground/60">
                For all privacy-related queries, contact us at{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>
                . See also our{" "}
                <Link href="/clinical-disclaimer" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Clinical Disclaimer
                </Link>{" "}
                and{" "}
                <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
