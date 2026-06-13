import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <Layout>
      <SEO
        title="Cookie Policy"
        fullTitle="Cookie Policy | Insight Recovery Network"
        description="Insight Recovery Network uses only essential session cookies. We do not use tracking, advertising or analytics cookies. Learn what cookies we set and how to manage them."
        canonical="/cookie-policy"
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
            Cookie Policy
          </h1>
          <p className="font-light text-sm text-muted-foreground">Last updated: May 2025</p>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: "#FAFAF8" }}>
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="flex flex-col gap-10 text-sm font-light leading-relaxed text-muted-foreground">

            <div>
              <p>
                This Cookie Policy explains what cookies are, which cookies Insight Recovery Network uses, and how you can manage them. If you have any questions, please contact us at{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">1. What are cookies?</h2>
              <p>Cookies are small text files that are stored on your device when you visit a website. They allow the website to remember certain information about your visit to improve your experience or enable specific functionality. Cookies can be &ldquo;session&rdquo; cookies (deleted when you close your browser) or &ldquo;persistent&rdquo; cookies (stored for a set period).</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">2. Cookies we use</h2>
              <p className="mb-4">We keep our use of cookies to an absolute minimum. We do not use tracking, advertising, behavioural, or analytics cookies of any kind.</p>

              <div className="border rounded" style={{ borderColor: "rgba(201,169,110,0.25)" }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "rgba(201,169,110,0.25)", background: "rgba(201,169,110,0.06)" }}>
                      <th className="text-left px-4 py-3 font-medium text-foreground/70">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground/70">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground/70">Purpose</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground/70">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: "rgba(201,169,110,0.15)" }}>
                      <td className="px-4 py-3 font-mono text-foreground/60">irn_admin_secret</td>
                      <td className="px-4 py-3">Session storage</td>
                      <td className="px-4 py-3">Maintains an authenticated admin session. Only set for logged-in admin users — never set for regular visitors.</td>
                      <td className="px-4 py-3">Browser session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-muted-foreground/60">
                Note: <code className="font-mono text-foreground/50">irn_admin_secret</code> is stored in <em>sessionStorage</em>, not as a browser cookie. It is never transmitted to third parties and is cleared when the browser tab is closed.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">3. What we do NOT use</h2>
              <ul className="flex flex-col gap-2 pl-4">
                <li>We do not use Google Analytics or any other analytics service.</li>
                <li>We do not use Facebook Pixel, Google Ads, or any advertising cookies.</li>
                <li>We do not use any third-party tracking or behavioural profiling cookies.</li>
                <li>We do not use cookies to identify individual users across sessions.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">4. Managing cookies</h2>
              <p className="mb-3">Because we only use strictly necessary session storage (which is not a cookie in the traditional sense and requires no consent under PECR), there is no cookie consent banner on this website.</p>
              <p className="mb-3">You can control and delete cookies through your browser settings. Here are links to cookie management guides for common browsers:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Microsoft Edge</a></li>
              </ul>
              <p className="mt-3">Disabling session storage in your browser may affect the functionality of the administrative area of this website but will not affect the experience of regular visitors.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-primary mb-3">5. Changes to this policy</h2>
              <p>If we introduce any new cookies or change how we use them, this page will be updated accordingly. The &ldquo;last updated&rdquo; date at the top of this page reflects the date of the most recent revision.</p>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
              <p className="text-xs text-muted-foreground/60">
                For any questions about cookies or data, contact{" "}
                <a href="mailto:info@insightrecoverynetwork.com" className="underline underline-offset-2 hover:text-primary transition-colors">
                  info@insightrecoverynetwork.com
                </a>
                . See also our{" "}
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
