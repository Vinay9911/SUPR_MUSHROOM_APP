// Generates branded 1200x630 cover images for each blog post.
// Run: node scripts/gen-blog-covers.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/blog', { recursive: true });

const posts = [
  { slug: 'health-benefits-of-oyster-mushrooms', label: 'NUTRITION',     title: '7 Proven Health Benefits of Oyster Mushrooms', accent: [224, 146, 47] },
  { slug: 'how-to-store-fresh-mushrooms',        label: 'STORAGE GUIDE',  title: 'How to Store Fresh Mushrooms',                accent: [47, 143, 107] },
  { slug: 'types-of-mushrooms-cooking-guide',    label: 'COOKING GUIDE',  title: 'Button vs Cremini vs Oyster vs King Oyster',  accent: [199, 93, 58] },
  { slug: 'aeroponic-mushroom-farming',          label: 'OUR FARM',       title: 'How Aeroponic Vertical Farming Works',        accent: [59, 143, 79] },
  { slug: 'easy-mushroom-recipes-indian',        label: 'RECIPES',        title: '5 Quick & Healthy Indian Mushroom Recipes',   accent: [210, 85, 46] },
  { slug: 'how-supr-mushrooms-works',            label: 'ABOUT US',       title: 'How Supr Mushrooms Works: Farm to Your Door', accent: [188, 108, 37] },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(title, max = 20) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { if (line) lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svg({ label, title, accent }) {
  const [r, g, b] = accent;
  const lines = wrap(title, 19);
  const startY = 300 - (lines.length - 1) * 35;
  const titleSvg = lines
    .map((ln, i) => `<text x="90" y="${startY + i * 78}" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-weight="bold" fill="#33271b">${esc(ln)}</text>`)
    .join('');

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFDF6"/>
      <stop offset="1" stop-color="#F3E4C6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1060" cy="120" r="300" fill="rgb(${r},${g},${b})" opacity="0.13"/>
  <circle cx="150" cy="600" r="190" fill="rgb(${r},${g},${b})" opacity="0.09"/>
  <!-- mushroom mark -->
  <g transform="translate(980,360)">
    <path d="M-95,10 Q0,-120 95,10 Q0,40 -95,10 Z" fill="rgb(${r},${g},${b})"/>
    <rect x="-26" y="10" width="52" height="120" rx="22" fill="rgb(${r},${g},${b})" opacity="0.78"/>
    <circle cx="-40" cy="-18" r="11" fill="#FFFDF6" opacity="0.85"/>
    <circle cx="18" cy="-34" r="8" fill="#FFFDF6" opacity="0.85"/>
    <circle cx="50" cy="-8" r="7" fill="#FFFDF6" opacity="0.85"/>
  </g>
  <rect x="90" y="150" width="${label.length * 13 + 36}" height="42" rx="21" fill="rgb(${r},${g},${b})"/>
  <text x="108" y="178" font-family="Arial, sans-serif" font-size="20" font-weight="bold" letter-spacing="2" fill="#ffffff">${esc(label)}</text>
  ${titleSvg}
  <text x="92" y="560" font-family="Arial, sans-serif" font-size="24" font-weight="bold" letter-spacing="3" fill="rgb(${r},${g},${b})">SUPR MUSHROOMS</text>
  <text x="92" y="592" font-family="Arial, sans-serif" font-size="19" fill="#8a7355">Fresh organic mushrooms · Delhi NCR</text>
</svg>`;
}

for (const p of posts) {
  await sharp(Buffer.from(svg(p))).png().toFile(`public/blog/${p.slug}.png`);
  console.log('✓ public/blog/' + p.slug + '.png');
}
console.log('Done.');
