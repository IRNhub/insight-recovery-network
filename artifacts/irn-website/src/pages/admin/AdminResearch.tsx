/**
 * IRNOS – Research & Surveys admin section.
 *
 * Views:
 * - Survey list        (/admin/research)
 * - Survey dashboard + response table (/admin/research/:id)
 * - Individual response (/admin/research/:id/responses/:responseId)
 *
 * Access is restricted to holders of the admin secret (Admin / Clinical
 * Director). Raw IP addresses are never available here – the API does not
 * expose them and they are never stored.
 */
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Loader2, LogOut, Download, ExternalLink, Copy, ArrowLeft } from "lucide-react";

interface AdminSurveyListItem {
  id: number;
  slug: string;
  title: string;
  status: string;
  publicPath: string;
  opensAt: string | null;
  closesAt: string | null;
  createdAt: string;
  totalResponses: number;
  validResponses: number;
  excludedResponses: number;
  suspectedDuplicates: number;
  lastResponseAt: string | null;
}

interface AdminResponseRow {
  id: number;
  responseCode: string;
  submittedAt: string;
  quotationPermission: boolean;
  completionDurationSeconds: number | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  userAgentCategory: string | null;
  suspectedDuplicate: boolean;
  minimumTimeFlag: boolean;
  excludedFromAnalysis: boolean;
  exclusionReason: string | null;
  relationship: string | null;
  mainAddiction: string | null;
  country: string | null;
}

interface AdminSurveySummary {
  survey: {
    id: number;
    slug: string;
    title: string;
    status: string;
    publicPath: string;
    opensAt: string | null;
    closesAt: string | null;
  };
  totals: {
    total: number;
    included: number;
    excluded: number;
    suspectedDuplicates: number;
    quotationPermission: number;
    averageCompletionSeconds: number | null;
  };
  bySource: { source: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byDay: { day: string; count: number }[];
}

interface AdminResponseDetail {
  response: {
    id: number;
    surveyId: number;
    responseCode: string;
    consentAccepted: boolean;
    quotationPermission: boolean;
    startedAt: string | null;
    submittedAt: string;
    completionDurationSeconds: number | null;
    source: string | null;
    medium: string | null;
    campaign: string | null;
    referralUrl: string | null;
    userAgentCategory: string | null;
    suspectedDuplicate: boolean;
    minimumTimeFlag: boolean;
    excludedFromAnalysis: boolean;
    exclusionReason: string | null;
    adminNotes: string | null;
  };
  answers: {
    questionKey: string;
    section: string;
    questionOrder: number;
    questionText: string;
    questionType: string;
    answerValue: string | null;
    answerValues: string[] | null;
  }[];
}

interface CommonProps {
  secret: string;
  onLogout: () => void;
}

async function adminFetch<T>(secret: string, path: string): Promise<T> {
  const res = await fetch(path, { headers: { "x-admin-secret": secret } });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

async function adminPost(secret: string, path: string, body?: unknown): Promise<Response> {
  return fetch(path, {
    method: "POST",
    headers: { "x-admin-secret": secret, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "–";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  open: "bg-emerald-100 text-emerald-800",
  closed: "bg-amber-100 text-amber-800",
  archived: "bg-muted text-muted-foreground/60",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}

function ResearchHeader({ onLogout, location }: { onLogout: () => void; location: string }) {
  const tabs = [
    { href: "/admin/articles", label: "Articles" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/research", label: "Research & Surveys" },
  ];
  return (
    <header className="border-b sticky top-0 z-40 bg-background" style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
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
      <div className="container mx-auto px-6 md:px-12 flex gap-0 border-t border-border/20 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${
              location.startsWith(tab.href)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

// ── Survey list ────────────────────────────────────────────────────────────

export default function AdminResearch({ secret, onLogout }: CommonProps) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  const { data: surveys = [], isLoading, isError } = useQuery({
    queryKey: ["admin-surveys", secret],
    queryFn: () => adminFetch<AdminSurveyListItem[]>(secret, "/api/admin/research/surveys"),
  });

  async function changeStatus(surveyId: number, status: string) {
    setActionError("");
    const res = await adminPost(secret, `/api/admin/research/surveys/${surveyId}/status`, { status });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setActionError((data && data.error) || "Failed to change survey status.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-surveys"] });
  }

  function copyLink(survey: AdminSurveyListItem) {
    const url = `https://www.insightrecoverynetwork.com${survey.publicPath}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(survey.id);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <ResearchHeader onLogout={onLogout} location={location} />
      <main className="container mx-auto px-6 md:px-12 py-10">
        <div className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/70 mb-2">IRNOS</p>
          <h1 className="font-serif text-2xl text-primary">Research &amp; Surveys</h1>
        </div>

        {actionError && (
          <div role="alert" className="border border-destructive/40 bg-destructive/5 p-4 mb-6 text-sm text-destructive">
            {actionError}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading surveys…
          </div>
        )}
        {isError && <p className="text-sm text-destructive py-8">Failed to load surveys.</p>}

        {!isLoading && !isError && surveys.length === 0 && (
          <p className="text-sm text-muted-foreground py-8">No surveys yet.</p>
        )}

        <div className="space-y-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="border border-border/60 bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-serif text-lg text-primary">{survey.title}</h2>
                    <StatusBadge status={survey.status} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{survey.publicPath}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/research/${survey.id}`}
                    className="h-9 px-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary-foreground"
                    style={{ background: "#162B3B" }}
                  >
                    View responses
                  </Link>
                  <a
                    href={survey.publicPath}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 px-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border/50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open page
                  </a>
                  <button
                    onClick={() => copyLink(survey)}
                    className="h-9 px-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border/50"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied === survey.id ? "Copied" : "Copy link"}
                  </button>
                  {(survey.status === "draft" || survey.status === "closed") && (
                    <button
                      onClick={() => {
                        if (window.confirm("Open this survey to the public? It will start accepting responses immediately.")) {
                          changeStatus(survey.id, "open");
                        }
                      }}
                      className="h-9 px-3 text-xs text-emerald-700 hover:text-emerald-900 border border-emerald-300"
                    >
                      Open survey
                    </button>
                  )}
                  {survey.status === "open" && (
                    <button
                      onClick={() => {
                        if (window.confirm("Close this survey? The page stays visible but stops accepting responses.")) {
                          changeStatus(survey.id, "closed");
                        }
                      }}
                      className="h-9 px-3 text-xs text-amber-700 hover:text-amber-900 border border-amber-300"
                    >
                      Close survey
                    </button>
                  )}
                  {survey.status === "closed" && (
                    <button
                      onClick={() => {
                        if (window.confirm("Archive this survey? It will be hidden from the default list; data is retained.")) {
                          changeStatus(survey.id, "archived");
                        }
                      }}
                      className="h-9 px-3 text-xs text-muted-foreground hover:text-primary border border-border/50"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-5 pt-5 border-t border-border/40 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Total responses</p>
                  <p className="text-primary font-medium">{survey.totalResponses}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valid</p>
                  <p className="text-primary font-medium">{survey.validResponses}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Excluded</p>
                  <p className="text-primary font-medium">{survey.excludedResponses}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Opened</p>
                  <p className="text-primary font-medium">{formatDateTime(survey.opensAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Closed</p>
                  <p className="text-primary font-medium">{formatDateTime(survey.closesAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last response</p>
                  <p className="text-primary font-medium">{formatDateTime(survey.lastResponseAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ── Survey dashboard + response table ──────────────────────────────────────

export function AdminSurveyDetail({ secret, onLogout, surveyId }: CommonProps & { surveyId: number }) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    country: "",
    relationship: "",
    addiction: "",
    source: "",
    quotation: "",
    included: "",
    duplicate: "",
  });
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState("");

  const filterQuery = useMemo(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    return params.toString();
  }, [filters]);

  const { data: summary } = useQuery({
    queryKey: ["admin-survey-summary", secret, surveyId],
    queryFn: () => adminFetch<AdminSurveySummary>(secret, `/api/admin/research/surveys/${surveyId}/summary`),
  });

  const { data: responses = [], isLoading } = useQuery({
    queryKey: ["admin-survey-responses", secret, surveyId, filterQuery],
    queryFn: () =>
      adminFetch<AdminResponseRow[]>(
        secret,
        `/api/admin/research/surveys/${surveyId}/responses${filterQuery ? `?${filterQuery}` : ""}`,
      ),
  });

  const filterOptions = useMemo(() => {
    const unique = (values: (string | null)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
    return {
      countries: unique(responses.map((r) => r.country)),
      relationships: unique(responses.map((r) => r.relationship)),
      addictions: unique(responses.map((r) => r.mainAddiction)),
      sources: unique(responses.map((r) => r.source)),
    };
  }, [responses]);

  async function toggleExclusion(row: AdminResponseRow) {
    setActionError("");
    let res: Response;
    if (row.excludedFromAnalysis) {
      res = await adminPost(secret, `/api/admin/research/responses/${row.id}/restore`);
    } else {
      const reason = window.prompt("Reason for excluding this response from analysis (optional):") ?? "";
      res = await adminPost(secret, `/api/admin/research/responses/${row.id}/exclude`, { reason });
    }
    if (!res.ok) {
      setActionError("Action failed. Please try again.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-survey-responses"] });
    queryClient.invalidateQueries({ queryKey: ["admin-survey-summary"] });
    queryClient.invalidateQueries({ queryKey: ["admin-surveys"] });
  }

  async function downloadCsv(includeExcluded: boolean) {
    setExporting(true);
    setActionError("");
    try {
      const params = new URLSearchParams(filterQuery);
      if (includeExcluded) params.set("includeExcluded", "true");
      const res = await fetch(`/api/admin/research/surveys/${surveyId}/export.csv?${params.toString()}`, {
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-${surveyId}-responses.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setActionError("CSV export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ResearchHeader onLogout={onLogout} location={location} />
      <main className="container mx-auto px-6 md:px-12 py-10">
        <Link href="/admin/research" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> All surveys
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-serif text-2xl text-primary">{summary?.survey.title ?? "Survey"}</h1>
              {summary && <StatusBadge status={summary.survey.status} />}
            </div>
            {summary && <p className="text-xs text-muted-foreground font-mono">{summary.survey.publicPath}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadCsv(false)}
              disabled={exporting}
              className="h-9 px-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
              style={{ background: "#162B3B" }}
            >
              <Download className="w-3.5 h-3.5" /> Export valid (CSV)
            </button>
            <button
              onClick={() => downloadCsv(true)}
              disabled={exporting}
              className="h-9 px-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border/50 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Include excluded
            </button>
          </div>
        </div>

        {actionError && (
          <div role="alert" className="border border-destructive/40 bg-destructive/5 p-4 mb-6 text-sm text-destructive">
            {actionError}
          </div>
        )}

        {/* Summary cards */}
        {summary && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {[
                { label: "Total responses", value: summary.totals.total },
                { label: "Included in analysis", value: summary.totals.included },
                { label: "Excluded", value: summary.totals.excluded },
                { label: "Possible duplicates", value: summary.totals.suspectedDuplicates },
                { label: "Quotation permitted", value: summary.totals.quotationPermission },
                { label: "Avg completion", value: formatDuration(summary.totals.averageCompletionSeconds) },
              ].map((card) => (
                <div key={card.label} className="border border-border/60 bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className="font-serif text-xl text-primary">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="border border-border/60 bg-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Responses by source</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {summary.bySource.length === 0 && (
                      <tr><td className="text-muted-foreground py-1">No responses yet</td></tr>
                    )}
                    {summary.bySource.map((row) => (
                      <tr key={row.source}>
                        <td className="py-1 text-foreground">{row.source}</td>
                        <td className="py-1 text-right text-primary font-medium">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-border/60 bg-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Responses by country</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {summary.byCountry.length === 0 && (
                      <tr><td className="text-muted-foreground py-1">No responses yet</td></tr>
                    )}
                    {summary.byCountry.map((row) => (
                      <tr key={row.country}>
                        <td className="py-1 text-foreground">{row.country}</td>
                        <td className="py-1 text-right text-primary font-medium">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-border/60 bg-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Responses over time</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {summary.byDay.length === 0 && (
                      <tr><td className="text-muted-foreground py-1">No responses yet</td></tr>
                    )}
                    {summary.byDay.slice(-10).map((row) => (
                      <tr key={row.day}>
                        <td className="py-1 text-foreground">{row.day}</td>
                        <td className="py-1 text-right text-primary font-medium">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Filters */}
        <div className="border border-border/60 bg-card p-5 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm">
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              From
              <input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              To
              <input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Country
              <select value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                {filterOptions.countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Relationship
              <select value={filters.relationship} onChange={(e) => setFilters((f) => ({ ...f, relationship: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                {filterOptions.relationships.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Addiction / behaviour
              <select value={filters.addiction} onChange={(e) => setFilters((f) => ({ ...f, addiction: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                {filterOptions.addictions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Source
              <select value={filters.source} onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                {filterOptions.sources.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Quotation permission
              <select value={filters.quotation} onChange={(e) => setFilters((f) => ({ ...f, quotation: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                <option value="true">Permission given</option>
                <option value="false">No permission</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Included / excluded
              <select value={filters.included} onChange={(e) => setFilters((f) => ({ ...f, included: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                <option value="true">Included</option>
                <option value="false">Excluded</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Suspected duplicate
              <select value={filters.duplicate} onChange={(e) => setFilters((f) => ({ ...f, duplicate: e.target.value }))} className="h-9 px-2 border border-border/60 bg-background text-foreground">
                <option value="">All</option>
                <option value="true">Flagged only</option>
              </select>
            </label>
          </div>
        </div>

        {/* Response table */}
        <div className="border border-border/60 bg-card overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center gap-3 p-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading responses…
            </div>
          ) : responses.length === 0 ? (
            <p className="p-8 text-sm text-muted-foreground">No responses match the current filters.</p>
          ) : (
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Relationship</th>
                  <th className="px-4 py-3">Addiction / behaviour</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Quote</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((row) => (
                  <tr key={row.id} className={`border-b border-border/20 ${row.excludedFromAnalysis ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs">{row.responseCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(row.submittedAt)}</td>
                    <td className="px-4 py-3">{row.country ?? "–"}</td>
                    <td className="px-4 py-3">{row.relationship ?? "–"}</td>
                    <td className="px-4 py-3">{row.mainAddiction ?? "–"}</td>
                    <td className="px-4 py-3">{row.source ?? "direct"}</td>
                    <td className="px-4 py-3">{formatDuration(row.completionDurationSeconds)}</td>
                    <td className="px-4 py-3 text-xs">
                      {row.suspectedDuplicate && <span className="text-amber-700">Duplicate? </span>}
                      {row.minimumTimeFlag && <span className="text-amber-700">Fast</span>}
                      {!row.suspectedDuplicate && !row.minimumTimeFlag && "–"}
                    </td>
                    <td className="px-4 py-3 text-xs">{row.excludedFromAnalysis ? "Excluded" : "Included"}</td>
                    <td className="px-4 py-3 text-xs">{row.quotationPermission ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/admin/research/${surveyId}/responses/${row.id}`}
                        className="text-xs text-primary underline mr-3"
                      >
                        View
                      </Link>
                      <button onClick={() => toggleExclusion(row)} className="text-xs text-muted-foreground hover:text-primary underline">
                        {row.excludedFromAnalysis ? "Restore" : "Exclude"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Exports respect the active filters. Raw IP addresses are never stored or shown.
        </p>
      </main>
    </div>
  );
}

// ── Individual response ────────────────────────────────────────────────────

export function AdminSurveyResponseView({
  secret,
  onLogout,
  surveyId,
  responseId,
}: CommonProps & { surveyId: number; responseId: number }) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<string | null>(null);
  const [notesSaved, setNotesSaved] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-survey-response", secret, responseId],
    queryFn: () => adminFetch<AdminResponseDetail>(secret, `/api/admin/research/responses/${responseId}`),
  });

  const sections = useMemo(() => {
    if (!data) return [] as { name: string; answers: AdminResponseDetail["answers"] }[];
    const sorted = [...data.answers].sort((a, b) => a.questionOrder - b.questionOrder);
    const result: { name: string; answers: AdminResponseDetail["answers"] }[] = [];
    for (const answer of sorted) {
      const last = result[result.length - 1];
      if (last && last.name === answer.section) last.answers.push(answer);
      else result.push({ name: answer.section, answers: [answer] });
    }
    return result;
  }, [data]);

  async function saveNotes() {
    if (notes === null) return;
    const res = await adminPost(secret, `/api/admin/research/responses/${responseId}/notes`, { notes });
    if (res.ok) {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 1500);
      queryClient.invalidateQueries({ queryKey: ["admin-survey-response"] });
    }
  }

  const r = data?.response;

  return (
    <div className="min-h-screen bg-background">
      <ResearchHeader onLogout={onLogout} location={location} />
      <main className="container mx-auto px-6 md:px-12 py-10 max-w-4xl">
        <Link
          href={`/admin/research/${surveyId}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to responses
        </Link>

        {isLoading && (
          <div className="flex items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading response…
          </div>
        )}
        {isError && <p className="text-sm text-destructive py-8">Failed to load this response.</p>}

        {r && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <h1 className="font-serif text-2xl text-primary font-mono">{r.responseCode}</h1>
              {r.excludedFromAnalysis && (
                <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800">
                  Excluded from analysis
                </span>
              )}
            </div>

            <div className="border border-border/60 bg-card p-6 mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Submission information</h3>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><dt className="text-xs text-muted-foreground">Submitted</dt><dd className="text-foreground">{formatDateTime(r.submittedAt)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Completion time</dt><dd className="text-foreground">{formatDuration(r.completionDurationSeconds)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Device category</dt><dd className="text-foreground capitalize">{r.userAgentCategory ?? "–"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Consent accepted</dt><dd className="text-foreground">{r.consentAccepted ? "Yes" : "No"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Quotation permission</dt><dd className="text-foreground">{r.quotationPermission ? "Given" : "Not given"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Source / medium / campaign</dt><dd className="text-foreground">{[r.source, r.medium, r.campaign].filter(Boolean).join(" / ") || "direct"}</dd></div>
                <div className="col-span-2"><dt className="text-xs text-muted-foreground">Referral URL</dt><dd className="text-foreground break-all">{r.referralUrl || "–"}</dd></div>
              </dl>
            </div>

            {(r.suspectedDuplicate || r.minimumTimeFlag || r.excludedFromAnalysis) && (
              <div className="border border-amber-300 bg-amber-50 p-5 mb-6 text-sm text-amber-900">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2">Data-quality flags</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {r.suspectedDuplicate && <li>Possible duplicate submission (matched a recent submission signature).</li>}
                  {r.minimumTimeFlag && <li>Completed unusually quickly (under the minimum realistic completion time).</li>}
                  {r.excludedFromAnalysis && <li>Excluded from analysis{r.exclusionReason ? ` – ${r.exclusionReason}` : ""}.</li>}
                </ul>
              </div>
            )}

            {sections.map((section) => (
              <div key={section.name} className="border border-border/60 bg-card p-6 mb-6">
                <h3 className="font-serif text-lg text-primary mb-4">{section.name}</h3>
                <dl className="space-y-4">
                  {section.answers.map((answer) => (
                    <div key={answer.questionKey}>
                      <dt className="text-sm text-muted-foreground font-light">{answer.questionText}</dt>
                      <dd className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">
                        {answer.answerValue ?? (answer.answerValues ? answer.answerValues.join("; ") : "Not answered")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <div className="border border-border/60 bg-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Admin notes</h3>
              <textarea
                rows={3}
                value={notes ?? r.adminNotes ?? ""}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-border/60 bg-background p-3 text-sm text-foreground"
                placeholder="Internal notes about this response (never shown publicly)"
              />
              <button
                onClick={saveNotes}
                className="mt-3 h-9 px-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground"
                style={{ background: "#162B3B" }}
              >
                {notesSaved ? "Saved" : "Save notes"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
