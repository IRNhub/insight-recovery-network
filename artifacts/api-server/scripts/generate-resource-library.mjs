import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const artifactDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Rebuild public metadata from the same local sources used by the website. */
export async function generateResourceLibrary() {
  const result = await build({
    stdin: {
      contents: `
        import { articles, isApprovedArticleSlug } from './articles';
        import { assessmentDirectory } from './assessment-directory';
        export const snapshot = {
          articles: articles.map(({ slug, title, excerpt, category, image, readingTime, date, publishedStatus }) =>
            ({ slug, title, excerpt, category, image, readingTime, date, publishedStatus })),
          approvedSlugs: articles.filter(article => isApprovedArticleSlug(article.slug)).map(article => article.slug),
          assessments: assessmentDirectory.map(({ href, title, description, duration }) =>
            ({ slug: href.split('/').pop(), title, description, duration })),
        };
      `,
      resolveDir: resolve(artifactDir, "../irn-website/src/data"),
      sourcefile: "resource-library-source.ts",
      loader: "ts",
    },
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    logLevel: "silent",
  });
  const { snapshot } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
  const destination = resolve(artifactDir, "src/lib/resource-library-static.json");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(snapshot, null, 2)}\n`);
  return snapshot;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const snapshot = await generateResourceLibrary();
  console.log(`Resource library: ${snapshot.articles.length} source articles and ${snapshot.assessments.length} assessments.`);
}
