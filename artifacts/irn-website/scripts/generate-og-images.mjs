import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const publicDir = resolve(root, "public");
const assetsDir = resolve(__dirname, "../../../attached_assets");

const NAVY = "#162B3B";
const GOLD = "#C9A96E";
const SITE = "insightrecoverynetwork.com";

const PAGES = [
  {
    file: "og-home.png",
    title: "Private Addiction Recovery Support",
  },
  {
    file: "og-about.png",
    title: "About Insight Recovery Network",
  },
  {
    file: "og-contact.png",
    title: "Speak Confidentially",
  },
  {
    file: "og-treatment-placement.png",
    title: "Private Rehab Placement",
    subtitle: "UK & International",
  },
  {
    file: "og-online-programme.png",
    title: "Online Addiction Recovery Programme",
  },
  {
    file: "og-insight-os.png",
    title: "Insight OS",
    subtitle: "The Operating System for Your Recovery",
  },
];

function buildTemplate(logoDataUrl, { title, subtitle }) {
  const titleSize = subtitle ? 66 : 76;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: 1200,
        height: 630,
        backgroundColor: NAVY,
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Subtle gold radial glow — top-right corner
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: -180,
              right: -180,
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 65%)",
            },
          },
        },
        // Bottom-left secondary glow
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: -200,
              left: -100,
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 65%)",
            },
          },
        },
        // Content column
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 80px",
              width: "100%",
              position: "relative",
            },
            children: [
              // Logo — top left
              {
                type: "img",
                props: {
                  src: logoDataUrl,
                  width: 168,
                  height: 101,
                  style: { objectFit: "contain" },
                },
              },
              // Title block
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                  },
                  children: [
                    // Page title
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: titleSize,
                          fontWeight: 700,
                          fontFamily: "Playfair Display",
                          color: "#ffffff",
                          lineHeight: 1.12,
                          maxWidth: 960,
                        },
                        children: title,
                      },
                    },
                    // Gold accent rule
                    {
                      type: "div",
                      props: {
                        style: {
                          width: 64,
                          height: 3,
                          backgroundColor: GOLD,
                        },
                      },
                    },
                    // Optional subtitle
                    ...(subtitle
                      ? [
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: 26,
                                fontWeight: 400,
                                fontFamily: "Playfair Display",
                                color: GOLD,
                                letterSpacing: 1,
                              },
                              children: subtitle,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              // Footer — domain
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 21,
                    fontWeight: 400,
                    fontFamily: "Playfair Display",
                    color: "rgba(201,169,110,0.60)",
                    letterSpacing: 1,
                  },
                  children: SITE,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  console.log("Generating OG social share images…");

  // Logo — remove white background pixels, then composite onto navy so it
  // blends seamlessly into the card without a white box.
  const logoPath = resolve(
    assetsDir,
    "IRN_Logo_(500_x_300_px)_1778827901167.png"
  );
  const LOGO_W = 168;
  const LOGO_H = 101;

  // 1. Make white / near-white pixels transparent
  const { data: rawPixels, info: rawInfo } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(rawPixels);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    if (r > 230 && g > 230 && b > 230) pixels[i + 3] = 0;
  }
  const transparentLogo = await sharp(pixels, {
    raw: { width: rawInfo.width, height: rawInfo.height, channels: 4 },
  })
    .resize(LOGO_W, LOGO_H, {
      fit: "contain",
      background: { r: 22, g: 43, b: 59, alpha: 0 },
    })
    .png()
    .toBuffer();

  // 2. Composite onto solid navy background
  const logoBg = await sharp({
    create: {
      width: LOGO_W,
      height: LOGO_H,
      channels: 4,
      background: { r: 22, g: 43, b: 59, alpha: 255 },
    },
  })
    .composite([{ input: transparentLogo }])
    .png()
    .toBuffer();
  const logoDataUrl = `data:image/png;base64,${logoBg.toString("base64")}`;

  // Fonts — read from @fontsource/playfair-display (no network dependency)
  const fontsDir = resolve(
    root,
    "node_modules/@fontsource/playfair-display/files"
  );
  const fontBold = readFileSync(
    resolve(fontsDir, "playfair-display-latin-700-normal.woff")
  );
  const fontRegular = readFileSync(
    resolve(fontsDir, "playfair-display-latin-400-normal.woff")
  );

  const fonts = [
    { name: "Playfair Display", data: fontBold, weight: 700, style: "normal" },
    {
      name: "Playfair Display",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
  ];

  for (const page of PAGES) {
    const svg = await satori(buildTemplate(logoDataUrl, page), {
      width: 1200,
      height: 630,
      fonts,
    });

    await sharp(Buffer.from(svg)).png().toFile(resolve(publicDir, page.file));
    console.log(`  ✓ ${page.file}`);
  }

  console.log("\nAll OG images generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
