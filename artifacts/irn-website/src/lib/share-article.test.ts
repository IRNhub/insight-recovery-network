import assert from "node:assert/strict";
import test from "node:test";
import { copyArticleLink, publicArticleUrl, shareArticle } from "./share-article.ts";

test("shares the public website canonical link only", async () => {
  let payload;
  const result = await shareArticle("relapse-prevention-plan", "Article title", { share: async data => { payload = data; } });
  assert.equal(result, "shared");
  assert.deepEqual(payload, { title: "Article title", url: "https://www.insightrecoverynetwork.com/resources/relapse-prevention-plan" });
  assert.throws(() => publicArticleUrl("article?account=private"));
});

test("cancelling the share sheet is silent and does not copy anything", async () => {
  let copied = false;
  const result = await shareArticle("relapse-prevention-plan", "Article title", {
    share: async () => { const error = new Error("Cancelled"); error.name = "AbortError"; throw error; },
    copy: async () => { copied = true; },
  });
  assert.equal(result, "cancelled");
  assert.equal(copied, false);
});

test("unsupported or failed native share falls back to copying the canonical link", async () => {
  let copied = "";
  assert.equal(await shareArticle("relapse-prevention-plan", "Title", { copy: async url => { copied = url; } }), "copied");
  assert.equal(copied, publicArticleUrl("relapse-prevention-plan"));
  assert.equal(await shareArticle("relapse-prevention-plan", "Title", { share: async () => { throw new Error("Unsupported"); }, copy: async () => {} }), "copied");
});

test("blocked clipboard leaves a manual-copy option", async () => {
  assert.equal(await shareArticle("relapse-prevention-plan", "Title", {}), "manual");
  assert.equal(await shareArticle("relapse-prevention-plan", "Title", { copy: async () => { throw new Error("Denied"); } }), "manual");
});

test("explicit copy works independently while a native share is pending", async () => {
  let completeShare: (() => void) | undefined;
  const pendingShare = shareArticle("relapse-prevention-plan", "Title", {
    share: () => new Promise<void>(resolve => { completeShare = resolve; }),
  });
  let copied = "";
  assert.equal(await copyArticleLink("relapse-prevention-plan", async url => { copied = url; }), "copied");
  assert.equal(copied, "https://www.insightrecoverynetwork.com/resources/relapse-prevention-plan");
  assert.equal(await copyArticleLink("relapse-prevention-plan"), "manual");
  completeShare?.();
  assert.equal(await pendingShare, "shared");
});
