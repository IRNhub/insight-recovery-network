import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { AlertTriangle, CheckCircle2, Loader2, LogOut, Mail } from "lucide-react";

interface AdminResourceLead {
  id: number;
  firstName: string;
  email: string;
  resourceSlug: string;
  consent: boolean;
  landingPage?: string | null;
  currentPage?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  emailSent: boolean;
  createdAt: string;
}

interface AdminResourceLeadsProps {
  secret: string;
  onLogout: () => void;
}

async function fetchAdminResourceLeads(secret: string): Promise<AdminResourceLead[]> {
  const res = await fetch("/api/admin/resource-leads", {
    headers: { "x-admin-secret": secret },
  });
  if (!res.ok) throw new Error("Failed to load leads");
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

function resourceLabel(slug: string): string {
  if (slug === "recovery-plan-checklist") return "Recovery Plan Checklist";
  return slug;
}

export default function AdminResourceLeads({ secret, onLogout }: AdminResourceLeadsProps) {
  const [location] = useLocation();

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ["admin-resource-leads", secret],
    queryFn: () => fetchAdminResourceLeads(secret),
  });

  const missedCount = leads.filter((lead) => !lead.emailSent).length;

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b border-border/40 sticky top-0 z-40 bg-background"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}
      >
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-5 h-px" style={{ background: "#C9A96E" }} />
            <span className="font-serif text-primary text-lg">IRN Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs text-muted-foreground hover:text-primary transition-colors border border-border/50"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>

        <div className="container mx-auto px-6 md:px-12 flex gap-0 border-t border-border/20">
          <Link
            href="/admin/articles"
            className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 border-transparent text-muted-foreground hover:text-primary transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 border-transparent text-muted-foreground hover:text-primary transition-colors"
          >
            Enquiries
          </Link>
          <Link
            href="/admin/leads"
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors flex items-center gap-2 ${
              location === "/admin/leads"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            Leads
            {missedCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-px leading-tight">
                {missedCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-10">
        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-light">Loading leads...</span>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-light">Failed to load leads.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {missedCount > 0 && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3.5 border border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {missedCount} lead{missedCount === 1 ? "" : "s"} without a visitor email
                  </p>
                  <p className="text-xs text-red-600 mt-0.5 font-light">
                    The checklist email failed for {missedCount === 1 ? "this lead" : "these leads"}.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-primary">
                Resource leads
                <span className="text-muted-foreground/50 font-light text-base ml-2">
                  ({leads.length})
                </span>
              </h2>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border/60">
                <p className="text-muted-foreground font-light">No resource leads yet.</p>
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
                        Resource
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden lg:table-cell">
                        Submitted
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden xl:table-cell">
                        Source
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => (
                      <tr
                        key={lead.id}
                        className={`border-b border-border/30 last:border-0 ${
                          !lead.emailSent
                            ? "bg-red-50/60"
                            : idx % 2 === 0
                            ? ""
                            : "bg-muted/5"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-primary text-sm leading-snug">
                            {lead.firstName}
                          </p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-xs text-muted-foreground/70 font-light hover:text-primary transition-colors inline-flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {resourceLabel(lead.resourceSlug)}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(lead.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden xl:table-cell">
                          <div className="text-[11px] text-muted-foreground/70 leading-relaxed max-w-[260px]">
                            <p>
                              <span className="font-semibold text-primary/70">Current:</span>{" "}
                              {lead.currentPage ?? "Unknown"}
                            </p>
                            <p>
                              <span className="font-semibold text-primary/70">Landing:</span>{" "}
                              {lead.landingPage ?? "Unknown"}
                            </p>
                            <p>
                              <span className="font-semibold text-primary/70">Referrer:</span>{" "}
                              {lead.referrer || "Direct / unknown"}
                            </p>
                            {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
                              <p>
                                <span className="font-semibold text-primary/70">UTM:</span>{" "}
                                {[lead.utmSource, lead.utmMedium, lead.utmCampaign]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {lead.emailSent ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 border border-green-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-2 py-1 border border-red-200">
                              <AlertTriangle className="w-3 h-3" />
                              Failed
                            </span>
                          )}
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
