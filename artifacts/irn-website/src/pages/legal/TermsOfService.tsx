import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <Layout>
      <SEO
        title="Terms of Service"
        fullTitle="Terms of Service | Insight Recovery Network"
        description="Terms governing use of the Insight Recovery Network website and services. We provide private online support and guidance — not regulated medical treatment or emergency care."
        canonical="/terms-of-service"
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
            Terms of Service
          </h1>
          <p className="font-light text-sm text-muted-foreground">Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: "#FAFAF8" }}>
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="flex flex-col gap-10 text-sm font-light leading-relaxed text-muted-foreground">

            <div>
              <p>
                These Terms of Service govern your use of the Insight Recovery Network website at{" "}
                <a href="https://www.insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  insightrecoverynetwork.com
                </a>{" "}
                and any services accessed through it. By using this website you agree to these terms. If you do not agree, please do not use the website.
              </p>
              <p className="mt-4">
                Insight Recovery Network is based in Newquay, Cornwall, UK. For any queries contact{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">1. Nature of our services</h2>
              <p className="mb-3">Insight Recovery Network is an online-only private support and guidance service. We provide:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li>Confidential consultation and treatment guidance for individuals and families affected by addiction and mental health challenges.</li>
                <li>Private treatment placement guidance for detox and residential rehabilitation in the UK and internationally.</li>
                <li>Online recovery programmes, relapse prevention support, and digital recovery tools.</li>
                <li>Informational self-assessment tools designed to help individuals understand their situation.</li>
              </ul>
              <p className="mt-4 font-medium text-foreground/70">
                We do not provide regulated medical treatment, clinical diagnosis, prescriptions, or crisis intervention services. We are not registered with or regulated by the Care Quality Commission (CQC). We are not an NHS service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">2. Emergency and crisis situations</h2>
              <p className="mb-2">
                <strong className="font-medium text-foreground/70">Insight Recovery Network is not an emergency service.</strong> If you or someone else is in immediate danger or experiencing a medical emergency, please call <strong className="font-medium text-foreground/70">999</strong> or attend your nearest A&amp;E immediately.
              </p>
              <p>For emotional support available 24 hours a day, contact the Samaritans on <strong className="font-medium text-foreground/70">116 123</strong> (free, 24/7) or by email at jo@samaritans.org. You can also text Shout on <strong className="font-medium text-foreground/70">85258</strong>.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">3. Assessment tools</h2>
              <p>The self-assessment tools on this website are for informational and educational purposes only. They are not diagnostic tools, they do not constitute a clinical assessment, and they do not replace professional medical, psychiatric, or psychological evaluation. Results are intended to help you reflect on your situation and identify whether professional support may be appropriate — not to provide a diagnosis or treatment recommendation.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">4. No professional relationship</h2>
              <p>Use of this website and submission of a contact form or assessment does not create a clinical or professional relationship between you and Insight Recovery Network, or between you and any individual associated with Insight Recovery Network. A professional relationship is established only through a formal, agreed engagement.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">5. Accuracy of information</h2>
              <p>We take care to keep the information on this website accurate and up to date. However, the information is provided for general guidance only and may not reflect the most current treatment guidance or clinical best practice. Nothing on this website constitutes medical, psychiatric, legal, or financial advice.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">6. Acceptable use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li>Use this website for any unlawful purpose or in a way that could harm, disable, or impair it.</li>
                <li>Submit false, misleading, or fraudulent information through any form.</li>
                <li>Attempt to access any administrative or restricted areas of the website without authorisation.</li>
                <li>Use automated tools to scrape, copy, or republish content from this website without our written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">7. Intellectual property</h2>
              <p>All content on this website — including text, images, logos, assessment tools, and programme materials — is the intellectual property of Insight Recovery Network and is protected by UK copyright law. You may not reproduce, distribute, or republish any content without our prior written consent.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">8. Limitation of liability</h2>
              <p className="mb-3">To the fullest extent permitted by law, Insight Recovery Network shall not be liable for:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li>Any loss or damage arising from your use of, or inability to use, this website or its content.</li>
                <li>Any reliance placed on information or guidance provided through this website.</li>
                <li>Any harm arising from your failure to seek appropriate professional, medical, or emergency assistance.</li>
              </ul>
              <p className="mt-3">Nothing in these terms excludes or limits our liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded under English law.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">9. External links</h2>
              <p>This website may contain links to external websites. We do not endorse and are not responsible for the content, accuracy, or privacy practices of any external sites.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">10. Governing law</h2>
              <p>These terms are governed by the laws of England and Wales. Any disputes arising from these terms or your use of this website shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">11. Changes to these terms</h2>
              <p>We reserve the right to update these terms at any time. The &ldquo;last updated&rdquo; date at the top of this page will reflect any changes. Continued use of the website after changes constitutes your acceptance of the revised terms.</p>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
              <p className="text-xs text-muted-foreground/60">
                For queries about these terms, contact{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>
                . See also our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/clinical-disclaimer" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Clinical Disclaimer
                </Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
