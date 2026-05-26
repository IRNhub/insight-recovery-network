import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-16 md:py-24 border-t border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="inline-block" data-testid="link-footer-home">
              <span className="font-serif text-2xl font-medium tracking-tight">
                Insight Recovery Network
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm leading-relaxed text-sm">
              Confidential addiction and mental health support. Treatment placement, digital tools, and ongoing recovery programmes.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <a href="mailto:info@insightrecoverynetwork.com" className="hover:text-accent transition-colors">
                info@insightrecoverynetwork.com
              </a>
              <a href="tel:+447415994475" className="hover:text-accent transition-colors">
                +44 7415 994475
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-5 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Treatment Guidance</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/treatment-placement" className="hover:text-accent transition-colors">
                  Treatment Placement
                </Link>
              </li>
              <li>
                <Link href="/online-addiction-recovery-programme-uk" className="hover:text-accent transition-colors">
                  Online Recovery Programme UK
                </Link>
              </li>
              <li>
                <Link href="/private-rehab-alternative-uk" className="hover:text-accent transition-colors">
                  Private Rehab Alternative
                </Link>
              </li>
              <li>
                <Link href="/assessments" className="hover:text-accent transition-colors">
                  Self-Assessments
                </Link>
              </li>
              <li>
                <Link href="/insight-os" className="hover:text-accent transition-colors">
                  Insight OS
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-7 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Organisation</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about-insight-recovery-network" className="hover:text-accent transition-colors">
                  About IRN
                </Link>
              </li>
              <li>
                <Link href="/what-we-offer" className="hover:text-accent transition-colors">
                  What We Offer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-9 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Resources</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/resources" className="hover:text-accent transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/resources/private-rehab-vs-nhs-addiction-treatment" className="hover:text-accent transition-colors">
                  Private Rehab vs NHS
                </Link>
              </li>
              <li>
                <Link href="/resources/how-to-choose-private-rehab-centre-uk" className="hover:text-accent transition-colors">
                  How to Choose Rehab
                </Link>
              </li>
              <li>
                <Link href="/resources/understanding-alcohol-dependency" className="hover:text-accent transition-colors">
                  Alcohol Dependency
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-11 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/clinical-disclaimer" className="hover:text-accent transition-colors">
                  Clinical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/35 leading-relaxed max-w-3xl mb-6">
            <strong className="font-medium text-primary-foreground/45">Important:</strong> Insight Recovery Network is not an emergency or crisis service. If you or someone else is in immediate danger, please call <strong className="font-medium text-primary-foreground/45">999</strong> or attend your nearest A&amp;E. For emotional support at any time, the Samaritans are available on <strong className="font-medium text-primary-foreground/45">116 123</strong> (free, 24/7). Our services are private support and treatment guidance, not regulated medical treatment.
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-primary-foreground/50">
            <p>© {currentYear} Insight Recovery Network. All rights reserved.</p>
            <p>Newquay, Cornwall, UK &middot; Discreet, private support.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}