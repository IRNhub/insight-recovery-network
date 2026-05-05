import { Link } from "wouter";
import { Article, formatDate } from "@/data/articles";
import { Clock, Calendar } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex flex-col border border-border/50 bg-background hover:border-accent/40 transition-colors duration-300">
      <div className="p-7 md:p-8 flex flex-col flex-1 gap-5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-accent/80">
            {article.category}
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <h2 className="font-serif text-xl md:text-2xl text-primary leading-snug group-hover:text-primary/80 transition-colors duration-200">
            <Link href={`/resources/${article.slug}`}>
              {article.title}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-primary/80">{article.author}</span>
            <span className="text-[11px] text-muted-foreground font-light">{article.authorRole}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={1.5} />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={1.5} />
              {article.readingTime} min read
            </span>
          </div>
        </div>
      </div>

      <div className="px-7 md:px-8 pb-7 md:pb-8">
        <Link
          href={`/resources/${article.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary/70 hover:text-primary transition-colors duration-200"
          data-testid={`link-article-${article.slug}`}
        >
          Read article
          <span className="w-6 h-px bg-current transition-all duration-300 group-hover:w-10" />
        </Link>
      </div>
    </article>
  );
}
