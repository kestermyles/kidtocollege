import sharp from 'sharp';

const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0b1f3a"/>
  <text
    x="16"
    y="23"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="22"
    font-weight="700"
    fill="#f2a900"
  >K</text>
</svg>`);

await sharp(svg)
  .resize(32, 32)
  .png()
  .toFile('./public/favicon-32x32.png');

await sharp(svg)
  .resize(16, 16)
  .png()
  .toFile('./public/favicon-16x16.png');

await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile('./public/apple-touch-icon.png');

console.log('Favicons generated');
