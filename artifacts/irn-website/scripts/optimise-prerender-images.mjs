import fs from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../dist/public");
const manifest = JSON.parse(
  await fs.readFile(path.join(dist, "responsive/manifest.json"), "utf8"),
);
const assets = await fs.readdir(path.join(dist, "assets"));
const images = new Map();
for (const [source, image] of Object.entries(manifest)) {
  if (source.startsWith("/")) images.set(source, image);
  else {
    const name = path.basename(source, path.extname(source));
    for (const file of assets.filter(
      (file) => file.startsWith(`${name}-`) && /\.(png|jpe?g|webp)$/.test(file),
    ))
      images.set(`/assets/${file}`, image);
  }
}
async function walk(directory) {
  return (
    await Promise.all(
      (await fs.readdir(directory, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? walk(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}
let replaced = 0;
for (const file of (await walk(dist)).filter((file) =>
  file.endsWith(".html"),
)) {
  let html = await fs.readFile(file, "utf8");
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const image = images.get(src);
    if (!image) return tag;
    replaced++;
    const clean = tag.replace(
      /\s(?:src|srcset|sizes|width|height)=["'][^"']*["']/gi,
      "",
    );
    return clean.replace(
      /\s*\/?>$/,
      ` src="${image.src}" srcset="${image.srcSet}" sizes="(min-width: 1200px) 1120px, 100vw" width="${image.width}" height="${image.height}">`,
    );
  });
  if (file === path.join(dist, "index.html")) {
    const portrait = manifest["@/assets/craig-bilton.jpg"];
    if (!portrait)
      throw new Error("Homepage portrait missing from responsive manifest");
    html = html.replace(
      "</head>",
      `<link rel="preload" as="image" href="${portrait.src}" imagesrcset="${portrait.srcSet}" imagesizes="(min-width: 1024px) 440px, (min-width: 640px) 448px, calc(100vw - 48px)" fetchpriority="high"></head>`,
    );
  }
  await fs.writeFile(file, html);
}
console.log(
  `[responsive HTML] Optimised ${replaced} images; homepage portrait preload included.`,
);
