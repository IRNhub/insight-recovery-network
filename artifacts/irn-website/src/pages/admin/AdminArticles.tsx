import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, Loader2, LogOut } from "lucide-react";
import { formatDate } from "@/data/articles";

interface AdminArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  published: boolean;
  updatedAt: string;
}

interface AdminArticlesProps {
  secret: string;
  onLogout: () => void;
}

async function fetchAdminArticles(secret: string): Promise<AdminArticle[]> {
  const res = await fetch("/api/admin/articles", {
    headers: { "x-admin-secret": secret },
  });
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}

export default function AdminArticles({ secret, onLogout }: AdminArticlesProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading, isError } = useQuery({
    queryKey: ["admin-articles", secret],
    queryFn: () => fetchAdminArticles(secret),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Failed to update article");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Failed to delete article");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  function confirmDelete(id: number, title: string) {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteArticle.mutate(id);
    }
  }

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
            <span className="font-serif text-primary text-lg">Article Management</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/articles/new")}
              className="inline-flex items-center gap-2 h-9 px-4 text-xs font-semibold tracking-wide text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ background: "#162B3B" }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New article
            </button>
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
      </header>

      <main className="container mx-auto px-6 md:px-12 py-10">
        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-light">Loading articles…</span>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-light">Failed to load articles.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-primary">
                All articles
                <span className="text-muted-foreground/50 font-light text-base ml-2">
                  ({articles.length})
                </span>
              </h2>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border/60 rounded-lg">
                <p className="text-muted-foreground font-light mb-4">No articles yet.</p>
                <button
                  onClick={() => navigate("/admin/articles/new")}
                  className="inline-flex items-center gap-2 h-9 px-5 text-xs font-semibold text-primary-foreground"
                  style={{ background: "#162B3B" }}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create your first article
                </button>
              </div>
            ) : (
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "rgba(246,244,240,0.8)" }} className="border-b border-border/40">
                      <th className="text-left px-5 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden md:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70 hidden lg:table-cell">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, idx) => (
                      <tr
                        key={article.id}
                        className={`border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-primary text-sm leading-snug line-clamp-1">{article.title}</p>
                            <p className="text-xs text-muted-foreground/60 font-light mt-0.5">/resources/{article.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{article.category}</span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                              article.published
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {article.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => togglePublish.mutate({ id: article.id, published: !article.published })}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                              title={article.published ? "Unpublish" : "Publish"}
                            >
                              {article.published
                                ? <EyeOff className="w-4 h-4" />
                                : <Eye className="w-4 h-4" />
                              }
                            </button>
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(article.id, article.title)}
                              className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
