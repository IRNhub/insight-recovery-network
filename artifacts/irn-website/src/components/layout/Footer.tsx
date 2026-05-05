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
          </div>

          <div className="lg:col-span-2 lg:col-start-7 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Pathways</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/treatment-placement" className="hover:text-accent transition-colors">
                  Treatment Placement
                </Link>
              </li>
              <li>
                <Link href="/online-programme" className="hover:text-accent transition-colors">
                  Online Programme
                </Link>
              </li>
              <li>
                <Link href="/insight-os" className="hover:text-accent transition-colors">
                  Insight OS
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Organisation</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
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

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-serif text-lg text-primary-foreground/90">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <li>
                <span className="cursor-not-allowed opacity-70">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© {currentYear} Insight Recovery Network. All rights reserved.</p>
          <p>Discreet, private support.</p>
        </div>
      </div>
    </footer>
  );
}