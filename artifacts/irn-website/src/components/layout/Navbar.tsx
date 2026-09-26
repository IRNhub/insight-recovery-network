import { Link, useLocation } from "wouter";
import { Menu, X, Search, ArrowUpRight } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { useEnquiryJourney } from "@/components/forms/EnquiryJourney";

const SearchModal = lazy(() => import("@/components/search/SearchModal").then(module => ({ default: module.SearchModal })));

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { open } = useEnquiryJourney();
  const hideContactBar = /^\/(assessments|assessment|research|admin|thank-you|get-help|contact)(\/|$)/.test(location);
  useEffect(() => { setMobileMenuOpen(false); }, [location]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButton.current?.focus();
      }
      const target = event.target as HTMLElement;
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) {
        event.preventDefault(); setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);
  const requestConversation = (event: MouseEvent<HTMLAnchorElement>, fromMenu = false) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (fromMenu) { setMobileMenuOpen(false); menuButton.current?.focus(); }
    open({ direct: true, service: location === "/treatment-placement" ? "placement" : undefined });
  };
  const navLinks = [
    { href: "/treatment-placement", label: "Treatment placement" },
    { href: "/what-we-offer", label: "How we help" },
    { href: "/about", label: "About Craig" },
  ];
  const mobileLinks = [...navLinks,
    { href: "/family-addiction-intervention-uk", label: "Family support" },
    { href: "/how-much-does-rehab-cost-uk", label: "Rehab costs" },
    { href: "/online-programme", label: "Online support" },
    { href: "/resources", label: "Resources" },
  ];
  return <>
    <header className="irn-header">
      <Link href="/" className="irn-wordmark" aria-label="Insight Recovery Network home" data-testid="link-home">Insight<span>Recovery Network</span></Link>
      <nav className="irn-desktop-nav" aria-label="Main navigation">
        {navLinks.map(link => <Link key={link.href} href={link.href} aria-current={location === link.href ? "page" : undefined}>{link.label}</Link>)}
      </nav>
      <button className="irn-search" onClick={() => setSearchOpen(true)} aria-label="Search articles" data-testid="button-search"><Search size={20} strokeWidth={1.5} /></button>
      <a href="/get-help" className="irn-contact-button irn-header-contact" onClick={requestConversation} data-testid="link-nav-contact" data-analytics-event="get_help_click" data-cta-location="header" data-service-interest="general-support">Request a conversation<ArrowUpRight size={21} strokeWidth={1} aria-hidden="true" /></a>
      <button ref={menuButton} className="irn-menu-toggle" onClick={() => setMobileMenuOpen(value => !value)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" data-testid="button-mobile-menu">{mobileMenuOpen ? <X size={25} strokeWidth={1} /> : <Menu size={27} strokeWidth={1} />}</button>
      {mobileMenuOpen && <nav className="irn-mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
        <Link href="/">Home</Link>
        {mobileLinks.map(link => <Link key={link.href} href={link.href} aria-current={location === link.href ? "page" : undefined}>{link.label}</Link>)}
        <a href="/get-help" className="irn-contact-button" onClick={event => requestConversation(event, true)} data-testid="link-mobile-contact" data-analytics-event="get_help_click" data-cta-location="mobile_menu" data-service-interest="general-support">Request a conversation<ArrowUpRight size={21} strokeWidth={1} aria-hidden="true" /></a>
        <p>Private treatment guidance for adults and families.</p>
      </nav>}
    </header>
    {!hideContactBar && <div className="irn-mobile-contact" aria-label="Contact Insight Recovery Network">
      <a className="irn-mobile-whatsapp" href="https://wa.me/447723486235" target="_blank" rel="noopener noreferrer" aria-label="Contact IRN on WhatsApp (opens in a new tab)" data-cta-location="mobile_contact_bar">WhatsApp</a>
      <a href="/get-help" className="irn-contact-button" onClick={requestConversation} data-analytics-event="get_help_click" data-cta-location="mobile_contact_bar" data-service-interest="general-support">Talk to Craig<ArrowUpRight size={23} strokeWidth={1} aria-hidden="true" /></a>
    </div>}
    {searchOpen && <Suspense fallback={null}><SearchModal isOpen onClose={() => setSearchOpen(false)} /></Suspense>}
  </>;
}
