import assert from "node:assert/strict";
import test from "node:test";
import { buildResourceLibrary, loadResourceLibrary, type ResourceArticleSource, type ResourceLibrarySource } from "./resource-library.ts";

const article = (slug: string, extra: Partial<ResourceArticleSource> = {}): ResourceArticleSource => ({
  slug, title: slug, excerpt: "Public summary", category: "Recovery & Wellbeing", readingTime: 5,
  date: "2026-09-16", image: "/example.webp", ...extra,
});
const source: ResourceLibrarySource = {
  articles: [article("approved", { title: "Approved editorial version" }), article("legacy"), article("static-only"), article("draft", { publishedStatus: "draft" })],
  approvedSlugs: ["approved", "draft"],
  assessments: [{ slug: "alcohol-use", title: "Alcohol Use", description: "Public description", duration: "8 minutes" }],
};

test("approved source wins, DB overrides legacy source and drafts remain excluded", () => {
  const result = buildResourceLibrary([
    article("approved", { title: "Outdated DB version" }),
    article("legacy", { title: "Current DB version" }),
    article("new-db"), article("draft"), article("unpublished", { published: false }),
  ], source);
  assert.deepEqual(result.articles.map(item => item.slug), ["approved", "legacy", "new-db", "static-only"]);
  assert.equal(result.articles.find(item => item.slug === "approved")?.title, "Approved editorial version");
  assert.equal(result.articles.find(item => item.slug === "legacy")?.title, "Current DB version");
});

test("metadata explicitly excludes bodies, admin fields and arbitrary data", () => {
  const result = buildResourceLibrary([{ ...article("public"), content: "PRIVATE BODY", accountId: "secret" } as ResourceArticleSource], { ...source, articles: [] });
  assert.deepEqual(Object.keys(result.articles[0]), ["id", "slug", "title", "excerpt", "category", "imageUrl", "readingTime", "publishedAt", "url"]);
  assert.equal(JSON.stringify(result).includes("PRIVATE BODY"), false);
  assert.equal(JSON.stringify(result).includes("secret"), false);
  assert.equal(result.articles[0].url, "https://www.insightrecoverynetwork.com/resources/public");
});

test("repeated static slugs resolve once to the first article, as the detail page does", () => {
  const result = buildResourceLibrary([], { ...source, articles: [article("same", { title: "Canonical version" }), article("same", { title: "Duplicate" })] });
  assert.equal(result.articles.length, 1);
  assert.equal(result.articles[0].title, "Canonical version");
});

test("sort uses real dates with stable slug ties and never invents a current date", () => {
  const result = buildResourceLibrary([
    article("z", { date: "2026-09-17" }), article("b"), article("a"), article("undated", { date: "" }),
  ], { ...source, articles: [] });
  assert.deepEqual(result.articles.map(item => item.slug), ["z", "a", "b", "undated"]);
  assert.equal(result.articles[3].publishedAt, null);
});

test("unsafe slugs and external or credentialed images do not enter the public feed", () => {
  const result = buildResourceLibrary([
    article("../account?token=secret"), article("remote", { image: "https://external.example/track" }),
    article("credentials", { image: "https://secret@www.insightrecoverynetwork.com/private.png" }),
    article("public", { image: "https://insightrecoverynetwork.com/photo.webp?token=secret#private" }),
  ], { ...source, articles: [] });
  assert.equal(result.articles.length, 3);
  assert.equal(result.articles.find(item => item.slug === "remote")?.imageUrl, null);
  assert.equal(result.articles.find(item => item.slug === "credentials")?.imageUrl, null);
  assert.equal(result.articles.find(item => item.slug === "public")?.imageUrl, "https://www.insightrecoverynetwork.com/photo.webp");
});

test("database outage retains a finite static catalogue with original dates and seven public assessments", async () => {
  let warnings = 0;
  const result = await loadResourceLibrary(async () => { throw new Error("offline"); }, () => { warnings++; });
  assert.equal(warnings, 1);
  assert.deepEqual(result, buildResourceLibrary([]));
  assert.ok(result.articles.length > 20 && result.articles.length < 500);
  assert.equal(result.assessments.length, 7);
  assert.equal(result.version, 1);
  assert.ok(result.assessments.every(item => item.url === `https://www.insightrecoverynetwork.com/assessments/${item.slug}`));
  assert.equal(new Set(result.articles.map(item => item.id)).size, result.articles.length);
});
