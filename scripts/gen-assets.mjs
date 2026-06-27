// One-off asset generator: PWA icons + OG share image from the brand logo.
// Run: node scripts/gen-assets.mjs
import sharp from 'sharp';

const LOGO = 'public/logo.svg';
const CREAM = { r: 254, g: 250, b: 224, alpha: 1 };
const LOGO_RATIO = 500 / 1536; // height / width of logo.svg

async function makeIcon(size, out, pad) {
  const innerW = Math.round(size * (1 - pad));
  const logo = await sharp(LOGO, { density: 400 })
    .resize(innerW, Math.round(innerW * LOGO_RATIO), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
  console.log('✓', out);
}

async function makeOg() {
  const logoW = 640;
  const logo = await sharp(LOGO, { density: 400 })
    .resize(logoW, Math.round(logoW * LOGO_RATIO), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const text = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
       <text x="600" y="410" font-family="Georgia, serif" font-size="44" fill="#7a4a1e" text-anchor="middle" font-weight="bold">Fresh Organic Mushrooms — Delhi NCR</text>
       <text x="600" y="470" font-family="Arial, sans-serif" font-size="26" fill="#9a7b52" text-anchor="middle">Farm-fresh delivery in 24 hours · 100% pesticide-free</text>
     </svg>`
  );
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
    .composite([
      { input: logo, top: 140, left: Math.round((1200 - logoW) / 2) },
      { input: text, top: 0, left: 0 },
    ])
    .png()
    .toFile('public/og-image.png');
  console.log('✓ public/og-image.png');
}

await makeIcon(192, 'public/icon-192.png', 0.18);
await makeIcon(512, 'public/icon-512.png', 0.18);
await makeIcon(512, 'public/icon-maskable.png', 0.36);
await makeOg();
console.log('Done.');
