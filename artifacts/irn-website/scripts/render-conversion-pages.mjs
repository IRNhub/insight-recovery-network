import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(import.meta.dirname, "..");
await build({
  root,
  build: {
    ssr: path.join(root, "scripts/render-entry.tsx"),
    outDir: path.join(root, "dist/ssr"),
    emptyOutDir: true,
  },
});
const { renderConversionPages } = await import(
  pathToFileURL(path.join(root, "dist/ssr/render-entry.js"))
);
for (const [route, body] of Object.entries(renderConversionPages())) {
  const file = path.join(
    root,
    "dist/public",
    route === "/" ? "index.html" : `${route.slice(1)}.html`,
  );
  const html = await fs.readFile(file, "utf8");
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf("<!-- React mounts here");
  if (start < 0 || end < 0)
    throw new Error(`Missing prerender shell markers for ${route}`);
  // Render the real visible components, retaining the validated per-route head.
  // Avoid React's automatic image hints here: the dedicated optimiser supplies
  // the exact same responsive homepage preload as the browser component.
  const visible = body
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<(?:meta|link)\b[^>]*\/?>/gi, "")
    .replace(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );
  await fs.writeFile(
    file,
    html.slice(0, start) +
      `<div id="root">${visible}</div>\n    ` +
      html.slice(end),
  );
  console.log(`[conversion prerender] ${route}`);
}
