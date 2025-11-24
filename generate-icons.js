import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

function generateIconSVG(size) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7f13ec;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5e0eb3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="42%" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">TCG</text>
  <text x="50%" y="68%" font-family="Arial, sans-serif" font-size="${size * 0.15}" font-weight="normal" fill="white" text-anchor="middle" dominant-baseline="middle">FORGE</text>
</svg>`;
  
  const filePath = path.join(iconDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated icon-${size}x${size}.svg`);
}

// Generate all icon sizes
sizes.forEach(generateIconSVG);

// Generate favicon SVG
const faviconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7f13ec;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5e0eb3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="5" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">TCG</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSVG);
console.log('Generated favicon.svg');

console.log('\nAll icons generated successfully!');
console.log('\nNote: SVG icons are generated. For PNG conversion, you can:');
console.log('1. Use an online converter, or');
console.log('2. Install sharp: npm install -D sharp');
console.log('3. Or keep SVG (modern browsers support SVG icons)');
