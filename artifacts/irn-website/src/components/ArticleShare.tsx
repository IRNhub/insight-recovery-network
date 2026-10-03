import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { copyArticleLink, publicArticleUrl, shareArticle } from "@/lib/share-article";

export function ArticleShare({ slug, title }: { slug: string; title: string }) {
  const [busy, setBusy] = useState(false);
  const [copying, setCopying] = useState(false);
  const [status, setStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);

  useEffect(() => {
    setStatus("");
    setManualCopy(false);
  }, [slug]);

  function showCopyResult(result: "copied" | "manual") {
    if (result === "copied") setStatus("Link copied. Anyone can read this article on the IRN website.");
    if (result === "manual") {
      setManualCopy(true);
      setStatus("Select and copy the article link below.");
    }
  }

  async function copy() {
    setCopying(true);
    setStatus("");
    setManualCopy(false);
    try {
      showCopyResult(await copyArticleLink(slug, navigator.clipboard ? url => navigator.clipboard.writeText(url) : undefined));
    } finally {
      setCopying(false);
    }
  }

  async function share() {
    setBusy(true);
    setStatus("");
    setManualCopy(false);
    try {
      const result = await shareArticle(slug, title, {
        share: navigator.share ? data => navigator.share(data) : undefined,
        copy: navigator.clipboard ? url => navigator.clipboard.writeText(url) : undefined,
      });
      if (result === "copied" || result === "manual") showCopyResult(result);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5" data-testid="article-share">
      <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={share}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
      >
        <Share2 size={16} aria-hidden="true" />
        {busy ? "Opening share options…" : "Share article"}
      </button>
      <button
        type="button"
        onClick={copy}
        disabled={copying}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
      >
        <Copy size={16} aria-hidden="true" />
        {copying ? "Copying…" : "Copy link"}
      </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-xs text-muted-foreground">{status}</p>
      {manualCopy && (
        <label className="mt-3 block text-sm text-primary">
          Public article link
          <input
            type="text"
            readOnly
            value={publicArticleUrl(slug)}
            onFocus={event => event.currentTarget.select()}
            className="mt-2 w-full rounded border border-input bg-background p-3 text-sm"
          />
        </label>
      )}
    </div>
  );
}
