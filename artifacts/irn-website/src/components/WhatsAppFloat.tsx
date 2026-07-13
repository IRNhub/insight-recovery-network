import { useLocation } from "wouter";

/**
 * Floating WhatsApp button, shown on every public page.
 * Opens a chat to the IRN WhatsApp Business line (+44 7723 486235) with a
 * prefilled message, the visitor initiates contact, which opens the 24-hour
 * free-form reply window so staff can respond from IRN OS.
 * Click tracking is handled centrally so every WhatsApp link uses the same GTM event.
 */

const WA_URL =
  "https://wa.me/447723486235?text=" +
  encodeURIComponent("Hi Craig, I'd like to speak confidentially.");

export default function WhatsAppFloat() {
  const [location] = useLocation();

  // Keep the button off internal/admin screens
  if (location.startsWith("/admin")) return null;

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat privately with us on WhatsApp"
      data-testid="button-whatsapp-float"
      className="group fixed z-[60] flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform duration-150 hover:scale-105 hover:shadow-xl motion-reduce:transition-none"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className="h-7 w-7 flex-shrink-0">
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4.6 28l6.3-1.6c1.6.9 3.3 1.3 5.1 1.3 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.8c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-3.7 1 1-3.6-.2-.3c-1.3-1.6-2-3.7-2-5.7 0-5.4 4.4-9.9 9.9-9.9s9.9 4.4 9.9 9.9-4.5 10-10 10zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-200 group-hover:max-w-[220px] group-hover:pr-1.5 motion-reduce:transition-none">
        Chat privately on WhatsApp
      </span>
    </a>
  );
}
