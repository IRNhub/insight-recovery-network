import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import type { Article } from "@/data/articles";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch("/api/articles");
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}

function scoreArticle(article: Article, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (article.title.toLowerCase().includes(q)) score += 10;
  if (article.excerpt.toLowerCase().includes(q)) score += 4;
  if (article.category.toLowerCase().includes(q)) score += 3;
  if (article.content.toLowerCase().includes(q)) score += 1;
  return score;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 5 * 60_000,
  });

  const results = query.trim()
    ? articles
        .map((a) => ({ article: a, score: scoreArticle(a, query.trim()) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ article }) => article)
    : [];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center pt-[10vh] px-4 sm:px-6"
      style={{ background: "rgba(22,43,59,0.88)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      data-testid="search-modal-overlay"
    >
      <div
        className="w-full max-w-2xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="search-modal"
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search
            className="w-5 h-5 text-muted-foreground flex-shrink-0"
            strokeWidth={1.5}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="flex-1 text-base bg-transparent outline-none text-primary placeholder:text-muted-foreground"
            data-testid="search-input"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={onClose}
            className="hidden sm:flex text-[11px] font-mono text-muted-foreground border border-border/60 px-2 py-0.5 hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Close search"
          >
            esc
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[55vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground font-light">
              Start typing to search articles…
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground font-light">
                No articles found for{" "}
                <span className="font-medium text-primary">"{query}"</span>
              </p>
            </div>
          ) : (
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/resources/${article.slug}`}
                    onClick={onClose}
                    className="flex flex-col gap-1 px-5 py-4 border-b border-border/40 hover:bg-accent/5 transition-colors cursor-pointer"
                    data-testid={`search-result-${article.slug}`}
                  >
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-accent/80">
                      {article.category}
                    </span>
                    <span className="font-serif text-primary text-base leading-snug">
                      {article.title}
                    </span>
                    <span className="text-xs text-muted-foreground font-light line-clamp-2 mt-0.5">
                      {article.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Results count footer */}
        {results.length > 0 && (
          <div className="px-5 py-2.5 border-t border-border/40 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
