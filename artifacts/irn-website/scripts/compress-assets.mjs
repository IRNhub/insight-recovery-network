#!/usr/bin/env node
/**
 * Compress every compressible file in dist/public/ to .br and .gz variants.
 * Run once after `vite build && prerender-meta.mjs`.
 * The serve-compressed-static and serve-prerendered-html Vite plugins
 * detect these files at request time and send the compressed version.
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { brotliCompressSync, gzipSync, constants as zlibConstants } from "zlib";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "../dist/public");

const COMPRESSIBLE = /\.(html|css|js|mjs|json|xml|svg|txt|webmanifest)$/i;
const SKIP = /\.(br|gz)$/i;

let count = 0;

function compress(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      compress(full);
      continue;
    }
    if (SKIP.test(entry) || !COMPRESSIBLE.test(entry)) continue;
    const src = readFileSync(full);
    writeFileSync(
      full + ".br",
      brotliCompressSync(src, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 },
      }),
    );
    writeFileSync(full + ".gz", gzipSync(src, { level: 6 }));
    count++;
  }
}

compress(DIST);
console.log(`  ✓ Compressed ${count} files (brotli + gzip)`);
