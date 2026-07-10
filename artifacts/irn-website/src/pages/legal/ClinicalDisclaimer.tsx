import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";

export default function ClinicalDisclaimer() {
  return (
    <Layout>
      <SEO
        title="Clinical Disclaimer"
        fullTitle="Clinical Disclaimer | Insight Recovery Network"
        description="Insight Recovery Network provides private online support and guidance, not regulated medical treatment. Read our full clinical disclaimer including emergency service contacts."
        canonical="/clinical-disclaimer"
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
            Clinical Disclaimer
          </h1>
          <p className="font-light text-sm text-muted-foreground">Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: "#FAFAF8" }}>
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="flex flex-col gap-10 text-sm font-light leading-relaxed text-muted-foreground">

            <div
              className="p-5 rounded"
              style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.3)" }}
            >
              <p className="font-medium text-primary text-base leading-relaxed">
                If you are in immediate danger or experiencing a medical emergency, stop reading this page and call{" "}
                <strong>999</strong> or go to your nearest A&amp;E immediately.
              </p>
              <p className="mt-3 text-sm">
                For emotional support available around the clock: <strong className="text-foreground/70">Samaritans 116 123</strong> (free, 24/7) &middot; <strong className="text-foreground/70">Shout 85258</strong> (text, 24/7) &middot; <strong className="text-foreground/70">CALM 0800 585858</strong> (5pm–midnight)
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">1. Nature of our service</h2>
              <p className="mb-3">Insight Recovery Network is a private, online-only support and guidance service based in Newquay, Cornwall, UK. We provide:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li>Confidential guidance on addiction, recovery, and mental health support options.</li>
                <li>Independent treatment placement guidance for private detox and residential rehabilitation.</li>
                <li>Online recovery programmes and digital recovery tools.</li>
                <li>Informational self-assessment tools to help individuals reflect on their situation.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">2. Not a regulated medical provider</h2>
              <p className="mb-3">Insight Recovery Network is <strong className="font-medium text-foreground/70">not a regulated healthcare provider</strong>. We are not registered with the Care Quality Commission (CQC) and do not provide:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li>Regulated medical treatment or clinical intervention.</li>
                <li>Psychiatric assessment, diagnosis, or prescribing.</li>
                <li>Nursing, medical, or therapeutic services as defined under health regulation.</li>
                <li>NHS-funded services of any kind.</li>
              </ul>
              <p className="mt-3">Where clinical or regulated treatment is required, including medically supervised detox, we will guide you towards the appropriate regulated providers.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">3. This is not an emergency service</h2>
              <p className="mb-3">
                <strong className="font-medium text-foreground/70">Insight Recovery Network cannot provide crisis intervention or emergency support.</strong> We operate standard business hours and cannot guarantee a response within any particular timeframe.
              </p>
              <p className="mb-2">If you are in a mental health crisis, experiencing suicidal thoughts, or need urgent support, please contact:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><strong className="font-medium text-foreground/70">Emergency services:</strong> 999 (or 112 within the EU)</li>
                <li><strong className="font-medium text-foreground/70">Samaritans:</strong> 116 123, free, 24 hours a day, 7 days a week</li>
                <li><strong className="font-medium text-foreground/70">Shout:</strong> text 85258, free crisis text service, 24/7</li>
                <li><strong className="font-medium text-foreground/70">CALM:</strong> 0800 58 58 58, open 5pm to midnight daily</li>
                <li><strong className="font-medium text-foreground/70">Your GP or NHS 111:</strong> for urgent but non-emergency medical situations</li>
                <li><strong className="font-medium text-foreground/70">A&amp;E:</strong> attend your nearest emergency department for immediate risk situations</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">4. Assessment tools</h2>
              <p>The self-assessment tools available on this website are informational aids designed to help you reflect on your current situation. They are <strong className="font-medium text-foreground/70">not diagnostic instruments</strong> and must not be used as a substitute for a full clinical assessment by a qualified medical professional, psychiatrist, or psychologist. Results indicate areas worth exploring with a professional, they do not constitute a diagnosis, clinical recommendation, or treatment plan.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">5. Information on this website</h2>
              <p>Articles, guides, and other content published on this website are for general educational and informational purposes only. They are written to help individuals and families understand addiction and mental health topics and make more informed decisions. Nothing on this website constitutes medical, psychiatric, psychological, legal, or financial advice. Always consult a qualified professional before acting on information you read here.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">6. Treatment placement guidance</h2>
              <p>Where we assist with treatment placement, our role is to provide independent, informational guidance on available options. We do not endorse specific treatment facilities, accept referral fees, or make clinical placement decisions. The ultimate choice of treatment provider is yours, and you should carry out your own due diligence including verifying CQC registration, staff qualifications, and programme structure with the provider directly.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">7. Medical detox and withdrawal</h2>
              <p>
                <strong className="font-medium text-foreground/70">Stopping or reducing the use of alcohol, benzodiazepines, or certain other substances without medical supervision can be life-threatening.</strong> If you are physically dependent on alcohol or any substance, please seek medical advice from your GP or an NHS substance misuse service before making any changes to your use. Do not attempt to detox alone without professional guidance.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">8. No clinical relationship</h2>
              <p>Contacting Insight Recovery Network, whether through a form, email, phone, or assessment, does not create a regulated clinical relationship. Craig Bilton and any other individuals associated with Insight Recovery Network act in an advisory and supportive capacity, not in a regulated clinical capacity unless explicitly and separately agreed in writing.</p>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
              <p className="text-xs text-muted-foreground/60">
                Questions about this disclaimer can be directed to{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>
                . See also our{" "}
                <Link href="/terms-of-service" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
