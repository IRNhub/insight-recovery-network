import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { CATEGORIES } from "@/data/articles";

interface ArticleEditorProps {
  secret: string;
  articleId?: number;
}

interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: number;
  category: string;
  content: string;
  image: string | null;
  published: boolean;
}

interface ArticleForm {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: number;
  category: string;
  content: string;
  image: string;
  published: boolean;
}

const EMPTY_FORM: ArticleForm = {
  slug: "",
  title: "",
  excerpt: "",
  author: "Craig Bilton",
  authorRole: "Founder & Clinical Director",
  date: new Date().toISOString().slice(0, 10),
  readingTime: 5,
  category: "Addiction & Substances",
  content: "",
  image: "",
  published: false,
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fetchArticleById(secret: string, id: number): Promise<ArticleRecord> {
  const res = await fetch("/api/admin/articles", {
    headers: { "x-admin-secret": secret },
  });
  if (!res.ok) throw new Error("Failed to load articles");
  const articles: ArticleRecord[] = await res.json();
  const article = articles.find((a) => a.id === id);
  if (!article) throw new Error("Article not found");
  return article;
}

export default function ArticleEditor({ secret, articleId }: ArticleEditorProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const isEditing = !!articleId;

  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [serverError, setServerError] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [formLoaded, setFormLoaded] = useState(!isEditing);

  const { data: existingArticle, isLoading: loadingExisting } = useQuery({
    queryKey: ["admin-article-edit", articleId],
    queryFn: () => fetchArticleById(secret, articleId!),
    enabled: isEditing,
    staleTime: 0,
  });

  useEffect(() => {
    if (existingArticle && !formLoaded) {
      setForm({
        slug: existingArticle.slug ?? "",
        title: existingArticle.title ?? "",
        excerpt: existingArticle.excerpt ?? "",
        author: existingArticle.author ?? "Craig Bilton",
        authorRole: existingArticle.authorRole ?? "Founder & Clinical Director",
        date: existingArticle.date ?? new Date().toISOString().slice(0, 10),
        readingTime: existingArticle.readingTime ?? 5,
        category: existingArticle.category ?? "Addiction & Substances",
        content: existingArticle.content ?? "",
        image: existingArticle.image ?? "",
        published: existingArticle.published ?? false,
      });
      setSlugManual(true);
      setFormLoaded(true);
    }
  }, [existingArticle, formLoaded]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        image: form.image.trim() || null,
      };
      const url = isEditing ? `/api/admin/articles/${articleId}` : "/api/admin/articles";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to save article");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/articles");
    },
    onError: (err: Error) => {
      setServerError(err.message);
    },
  });

  function setField<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setServerError("");
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugManual) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  if (isEditing && loadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading article…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="border-b border-border/40 sticky top-0 z-40 bg-background"
        style={{ borderBottom: "1px solid rgba(201,169,110,0.2)" }}
      >
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate("/admin/articles")}
              className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <ArrowLeft size={13} />
              Articles
            </button>
            <div className="w-px h-4 bg-border/60 flex-shrink-0" />
            <span className="font-serif text-primary text-base truncate">
              {isEditing ? "Edit article" : "New article"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setField("published", !form.published)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold border transition-colors ${
                form.published
                  ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                  : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {form.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {form.published ? "Published" : "Draft"}
            </button>
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "#162B3B" }}
            >
              {saveMutation.isPending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Save className="w-3.5 h-3.5" />
              }
              {saveMutation.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-8 max-w-4xl">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Article title"
                className="w-full h-11 px-4 text-sm border border-border/60 bg-white text-primary placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Slug (URL path)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 flex-shrink-0">/resources/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  placeholder="article-url-slug"
                  className="flex-1 h-9 px-3 text-sm border border-border/60 bg-white text-primary placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="A short summary displayed on article cards and in search results…"
                rows={3}
                className="w-full px-4 py-3 text-sm border border-border/60 bg-white text-primary placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded resize-y"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Content</label>
                <div className="flex text-[11px] gap-1">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-2.5 py-1 border transition-colors ${activeTab === "edit" ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:text-primary"}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-2.5 py-1 border transition-colors ${activeTab === "preview" ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:text-primary"}`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "edit" ? (
                <textarea
                  value={form.content}
                  onChange={(e) => setField("content", e.target.value)}
                  placeholder={`Use ## for headings, - for bullet lists, **bold text**, and [Link text](/path) for internal links.\n\nFor CTA blocks:\n[CTA:/contact:Button Label]\nYour CTA text here.\n[/CTA]`}
                  rows={24}
                  className="w-full px-4 py-3 text-sm border border-border/60 bg-white text-primary placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded resize-y font-mono leading-relaxed"
                />
              ) : (
                <div className="min-h-[350px] px-4 py-4 border border-border/60 bg-white/60 rounded text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                  {form.content.slice(0, 600) || <span className="italic opacity-50">No content yet.</span>}
                  {form.content.length > 600 && (
                    <p className="text-xs text-muted-foreground/40 mt-2 italic">…and {form.content.length - 600} more characters</p>
                  )}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground/50">
                Supports: ## headings, - bullet lists, **bold**, [text](url) links, and [CTA:/path:Label]…[/CTA] call-to-action blocks.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div
              className="p-5 rounded-lg border border-border/40 flex flex-col gap-4"
              style={{ background: "rgba(246,244,240,0.6)" }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Details</p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary focus:outline-none focus:border-primary/50 rounded"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary focus:outline-none focus:border-primary/50 rounded"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Reading time (minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readingTime}
                  onChange={(e) => setField("readingTime", Number(e.target.value))}
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary focus:outline-none focus:border-primary/50 rounded"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Author name</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setField("author", e.target.value)}
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary focus:outline-none focus:border-primary/50 rounded"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Author role</label>
                <input
                  type="text"
                  value={form.authorRole}
                  onChange={(e) => setField("authorRole", e.target.value)}
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary focus:outline-none focus:border-primary/50 rounded"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Featured image path</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setField("image", e.target.value)}
                  placeholder="/article-image.png"
                  className="h-9 px-3 text-sm border border-border/60 bg-white text-primary placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded font-mono"
                />
                <p className="text-[11px] text-muted-foreground/50">Optional. Use a path to an existing public image.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
