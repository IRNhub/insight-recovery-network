import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/what-we-offer", label: "What We Offer" },
    { href: "/treatment-placement", label: "Treatment Placement" },
    { href: "/online-programme", label: "Online Programme" },
    { href: "/insight-os", label: "Insight OS" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled || mobileMenuOpen ? "bg-background/95 backdrop-blur-md border-border/50 py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0" data-testid="link-home">
            <span className="font-serif text-xl font-medium tracking-tight text-primary transition-colors group-hover:text-primary/80">
              Insight Recovery Network
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 ml-10">
            <ul className="flex items-center gap-5 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="h-4 w-px bg-border"></div>
            <Link href="/contact" data-testid="link-nav-contact">
              <Button variant="default" className="rounded-none font-medium h-10 px-6">
                Speak Confidentially
              </Button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 -mr-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
            <ul className="flex flex-col gap-4 text-base font-medium">
              <li>
                <Link 
                  href="/" 
                  className={`block transition-colors ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
                >
                  Home
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`block transition-colors ${
                      location === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-border">
              <Link href="/contact" className="block w-full" data-testid="link-mobile-contact">
                <Button variant="default" className="w-full rounded-none font-medium h-12">
                  Speak Confidentially
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}