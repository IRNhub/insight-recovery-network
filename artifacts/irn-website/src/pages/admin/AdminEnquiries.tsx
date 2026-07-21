import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Loader2, LogOut, AlertTriangle, CheckCircle2, Mail, Phone } from "lucide-react";

interface AdminEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  message: string;
  consent: boolean;
  landingPage?: string | null;
  currentPage?: string | null;
  referrer?: string | null;
  pageSource?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  status: string;
  notificationSent: boolean;
  createdAt: string;
}

interface AdminEnquiriesProps {
  secret: string;
  onLogout: () => void;
}

const SUPPORT_TYPE_LABELS: Record<string, string> = {
  myself: "For myself",
  "someone-else": "For someone else",
  professional: "Professional",
  general: "General",
};

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="w-3 h-3" />,
  phone: <Phone className="w-3 h-3" />,
  whatsapp: <Phone className="w-3 h-3" />,
};

async function fetchAdminEnquiries(secret: string): Promise<AdminEnquiry[]> {
  const res = await fetch("/api/admin/enquiries", {
    headers: { "x-admin-secret": secret },
  });
  if (!res.ok) throw new Error("Failed to load enquiries");
  return res.json();
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminEnquiries({ secret, onLogout }: AdminEnquiriesProps) {
  const [location] = useLocation();

  const { data: enquiries = [], isLoading, isError } = useQuery({
    queryKey: ["admin-enquiries", secret],
    queryFn: () => fetchAdminEnquiries(secret),
  });

  const missedCount = enquiries.filter((e) => !e.notificationSent).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="border-b border-border/40 sticky top-0 z-40 bg-background"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}
      >
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-5 h-px" style={{ background: "#C9A96E" }} />
            <span className="font-serif text-primary text-lg">IRN Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs text-muted-foreground hover:text-primary transition-colors border border-border/50"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="container mx-auto px-6 md:px-12 flex gap-0 border-t border-border/20">
          <Link
            href="/admin/articles"
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors ${
              location === "/admin/articles" || location === "/admin"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Articles
          </Link>
          <Link
            href="/admin/enquiries"
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors flex items-center gap-2 ${
              location === "/admin/enquiries"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Enquiries
            {missedCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-px leading-tight">
                {missedCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/leads"
            className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 border-transparent text-muted-foreground hover:text-primary transition-colors"
          >
            Leads
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-10">
        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-light">Loading enquiries…</span>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-light">Failed to load enquiries.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Missed notification alert */}
            {missedCount > 0 && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3.5 border border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {missedCount} enquir{missedCount === 1 ? "y" : "ies"} without a team notification
                  </p>
                  <p className="text-xs text-red-600 mt-0.5 font-light">
                    The email notification failed for {missedCount === 1 ? "this enquiry" : "these enquiries"}.
                    Please review and follow up manually.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-primary">
                All enquiries
                <span className="text-muted-foreground/50 font-light text-base ml-2">
                  ({enquiries.length})
                </span>
              </h2>
            </div>

            {enquiries.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border/60">
                <p className="text-muted-foreground font-light">No enquiries yet.</p>
              </div>
            ) : (
              <div className="border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{ background: "rgba(246,244,240,0.8)" }}
                      className="border-b border-border/40"
                    >
                      <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">
                        Contact
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden md:table-cell">
                        Enquiry Type
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden lg:table-cell">
                        Submitted
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden xl:table-cell">
                        Source
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">
                        Notification
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden 2xl:table-cell">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enquiry, idx) => (
                      <tr
                        key={enquiry.id}
                        className={`border-b border-border/30 last:border-0 ${
                          !enquiry.notificationSent
                            ? "bg-red-50/60"
                            : idx % 2 === 0
                            ? ""
                            : "bg-muted/5"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-primary text-sm leading-snug">
                              {enquiry.name}
                            </p>
                            <a
                              href={`mailto:${enquiry.email}`}
                              className="text-xs text-muted-foreground/70 font-light hover:text-primary transition-colors"
                            >
                              {enquiry.email}
                            </a>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground/60">
                              {CONTACT_ICONS[enquiry.preferredContact]}
                              <span className="font-light">{enquiry.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {SUPPORT_TYPE_LABELS[enquiry.supportType] ?? enquiry.supportType}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(enquiry.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden xl:table-cell">
                          <div className="text-[11px] text-muted-foreground/70 leading-relaxed max-w-[260px]">
                            <p>
                              <span className="font-semibold text-primary/70">Current:</span>{" "}
                              {enquiry.currentPage ?? enquiry.pageSource ?? "Unknown"}
                            </p>
                            <p>
                              <span className="font-semibold text-primary/70">Landing:</span>{" "}
                              {enquiry.landingPage ?? "Unknown"}
                            </p>
                            <p>
                              <span className="font-semibold text-primary/70">Referrer:</span>{" "}
                              {enquiry.referrer || "Direct / unknown"}
                            </p>
                            {(enquiry.utmSource || enquiry.utmMedium || enquiry.utmCampaign) && (
                              <p>
                                <span className="font-semibold text-primary/70">UTM:</span>{" "}
                                {[enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {enquiry.notificationSent ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-red-50 text-red-700 border border-red-200">
                              <AlertTriangle className="w-3 h-3" />
                              Missed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 hidden 2xl:table-cell">
                          <p className="text-xs text-muted-foreground font-light line-clamp-2 max-w-xs">
                            {enquiry.message}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
