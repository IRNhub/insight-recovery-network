const SITE_URL = "https://www.insightrecoverynetwork.com";

export function publicArticleUrl(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid public article slug");
  return `${SITE_URL}/resources/${slug}`;
}

interface ShareActions {
  share?: (data: { title: string; url: string }) => Promise<void>;
  copy?: (url: string) => Promise<void>;
}

export async function copyArticleLink(slug: string, copy?: (url: string) => Promise<void>) {
  const url = publicArticleUrl(slug);
  if (copy) {
    try {
      await copy(url);
      return "copied" as const;
    } catch {
      // The visible, selectable URL remains available when clipboard access fails.
    }
  }
  return "manual" as const;
}

export async function shareArticle(slug: string, title: string, actions: ShareActions) {
  const url = publicArticleUrl(slug);
  if (actions.share) {
    try {
      await actions.share({ title, url });
      return "shared" as const;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "cancelled" as const;
    }
  }
  return copyArticleLink(slug, actions.copy);
}
