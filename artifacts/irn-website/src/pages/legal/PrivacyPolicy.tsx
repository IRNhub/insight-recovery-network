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
          <p className="font-light text-sm text-muted-foreground">Last updated: May 2025</p>
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
              <p className="mb-3">We collect personal data only when you actively provide it to us. The main ways this happens are:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Enquiry form (/contact):</strong> name, email address, phone number (optional), and the content of your message.</li>
                <li><strong className="font-medium text-foreground/70">Self-assessment forms (/assessments/*):</strong> name, email address, phone number (optional), your assessment answers, and your consent to receive results by email.</li>
                <li><strong className="font-medium text-foreground/70">Website usage:</strong> we do not use tracking or advertising cookies. Our web server may log standard access data (IP address, browser type, pages visited) for security and error diagnostics. This data is not linked to individual identities.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">2. How we use your data</h2>
              <ul className="flex flex-col gap-2 pl-4">
                <li>To respond to your enquiry and provide the support or information you have requested.</li>
                <li>To send you your assessment results and any associated guidance.</li>
                <li>To store a record of your contact for case continuity if you follow up with us.</li>
                <li>To send you service information you have specifically requested.</li>
                <li>We do not use your data for automated decision-making or profiling, and we do not sell or rent your data to any third party.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">3. Legal basis for processing</h2>
              <p className="mb-3">Under UK GDPR, we rely on the following lawful bases:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Legitimate interests (Article 6(1)(f)):</strong> responding to direct enquiries, maintaining a record of contacts for continuity of support, and improving our services.</li>
                <li><strong className="font-medium text-foreground/70">Consent (Article 6(1)(a)):</strong> when you choose to share sensitive health-related information in your assessment or enquiry message. You can withdraw consent at any time by emailing us.</li>
                <li>Where data relates to health or addiction, it constitutes <em>special category data</em> under Article 9. We process it solely on the basis of your explicit consent and limit access strictly to the people needed to respond to you.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">4. Data retention</h2>
              <p>We retain enquiry and assessment data for up to two years from the date of your last contact, or until you request deletion, whichever is sooner. After that period, personal data is permanently deleted from our systems.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">5. Third-party processors</h2>
              <p className="mb-3">We use a small number of trusted third-party services to operate our website. Each is bound by appropriate data processing agreements:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Resend</strong> (email delivery service) — used to send notification and acknowledgement emails. Resend may transiently process your name and email address as part of email delivery. Resend is GDPR-compliant.</li>
                <li><strong className="font-medium text-foreground/70">Replit</strong> (hosting infrastructure) — our website and database are hosted on Replit&rsquo;s infrastructure, which is SOC 2 compliant.</li>
              </ul>
              <p className="mt-3">We do not use Google Analytics, Facebook Pixel, or any other advertising or behavioural tracking service.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">6. Your rights</h2>
              <p className="mb-3">Under UK GDPR you have the right to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Access</strong> — request a copy of the personal data we hold about you.</li>
                <li><strong className="font-medium text-foreground/70">Rectification</strong> — ask us to correct inaccurate data.</li>
                <li><strong className="font-medium text-foreground/70">Erasure</strong> — ask us to delete your personal data (&ldquo;right to be forgotten&rdquo;).</li>
                <li><strong className="font-medium text-foreground/70">Restriction</strong> — ask us to limit how we use your data.</li>
                <li><strong className="font-medium text-foreground/70">Portability</strong> — receive your data in a structured, machine-readable format.</li>
                <li><strong className="font-medium text-foreground/70">Objection</strong> — object to processing based on legitimate interests.</li>
                <li><strong className="font-medium text-foreground/70">Withdraw consent</strong> — at any time, without affecting the lawfulness of prior processing.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>. We will respond within 30 days.
              </p>
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
