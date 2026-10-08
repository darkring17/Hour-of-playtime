import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Exact Mob Games / Poppy Playtime "P in a hole" SVG
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <!-- Bright Yellow Square -->
  <rect width="500" height="500" fill="#FDCD02" />

  <!-- Black Pit / Hole -->
  <ellipse cx="256" cy="364" rx="144" ry="42" fill="#000000" />

  <!-- Red Stylized 'P' -->
  <path fill="#EA2F3D" fill-rule="evenodd" d="
    M 188 404
    C 184 315 178 220 168 172
    C 160 135 186 72 262 72
    C 336 72 356 136 356 195
    C 356 262 320 298 238 298
    L 242 360
    C 246 384 252 405 252 405
    C 230 408 205 407 188 404
    Z
    M 220 188
    C 220 232 235 252 268 252
    C 298 252 312 232 312 188
    C 312 144 298 116 268 116
    C 235 116 220 144 220 188
    Z
  "/>
</svg>
`;

async function generateAll() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent);

  const buffer = Buffer.from(svgContent);

  await sharp(buffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(buffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(buffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(buffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(buffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));

  console.log('✅ Icons updated successfully!');
}

generateAll().catch(console.error);
