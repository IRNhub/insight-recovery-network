import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const logoPath = resolve(__dirname, "../../../attached_assets/IRN_Logo_(500_x_300_px)_1778827901167.png");

const NAVY = { r: 22, g: 43, b: 59, alpha: 1 };

async function makeNavyBackground(size) {
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: NAVY,
    },
  })
    .png()
    .toBuffer();
}

async function compositeLogoOntoNavy(size, padding = 0.08) {
  const innerSize = Math.round(size * (1 - padding * 2));
  const offset = Math.round(size * padding);

  const resizedLogo = await sharp(logoPath)
    .resize(innerSize, innerSize, { fit: "contain", background: { r: 22, g: 43, b: 59, alpha: 255 } })
    .png()
    .toBuffer();

  const background = await makeNavyBackground(size);

  return sharp(background)
    .composite([{ input: resizedLogo, top: offset, left: offset }])
    .png()
    .toBuffer();
}

async function main() {
  console.log("Generating IRN favicons from logo…");

  // 16x16 favicon
  const px16 = await compositeLogoOntoNavy(16, 0.06);
  writeFileSync(resolve(publicDir, "favicon-16x16.png"), px16);
  console.log("✓ favicon-16x16.png");

  // 32x32 favicon
  const px32 = await compositeLogoOntoNavy(32, 0.06);
  writeFileSync(resolve(publicDir, "favicon-32x32.png"), px32);
  console.log("✓ favicon-32x32.png");

  // 48x48 (used as ICO payload, saved as .ico, browsers accept PNG-encoded ICO)
  const px48 = await compositeLogoOntoNavy(48, 0.06);
  writeFileSync(resolve(publicDir, "favicon.ico"), px48);
  console.log("✓ favicon.ico (48x48 PNG-encoded)");

  // Apple touch icon 180x180
  const px180 = await compositeLogoOntoNavy(180, 0.1);
  writeFileSync(resolve(publicDir, "apple-touch-icon.png"), px180);
  console.log("✓ apple-touch-icon.png");

  // Web app icon 192x192
  const px192 = await compositeLogoOntoNavy(192, 0.1);
  writeFileSync(resolve(publicDir, "icon-192.png"), px192);
  console.log("✓ icon-192.png");

  // Web app icon 512x512
  const px512 = await compositeLogoOntoNavy(512, 0.1);
  writeFileSync(resolve(publicDir, "icon-512.png"), px512);
  console.log("✓ icon-512.png");

  console.log("\nAll favicon assets generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
