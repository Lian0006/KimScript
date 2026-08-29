// Script to generate PWA icons
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white">K</text>
</svg>`;

// Icon sizes needed
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Create icons directory
const iconsDir = path.join(__dirname, 'client', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files (we'll use these as placeholders)
iconSizes.forEach(({ size, name }) => {
  const svgContent = createIconSVG(size);
  const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created ${name.replace('.png', '.svg')}`);
});

// Create a simple HTML file to convert SVGs to PNGs
const htmlConverter = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon Converter</title>
</head>
<body>
  <h1>PWA Icon Generator</h1>
  <p>This page generates the required PWA icons.</p>
  <div id="icons"></div>
  
  <script>
    const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
    
    sizes.forEach(size => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(1, '#3b82f6');
      
      // Draw background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Draw rounded corners
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.2);
      ctx.fill();
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = \`bold \${size * 0.4}px Arial\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('K', size / 2, size / 2);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = \`icon-\${size}x\${size}.png\`;
      link.href = dataURL;
      link.textContent = \`Download \${size}x\${size}\`;
      link.style.display = 'block';
      link.style.margin = '10px';
      
      document.getElementById('icons').appendChild(link);
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'icon-generator.html'), htmlConverter);
console.log('Created icon-generator.html - open this file in a browser to generate PNG icons');

// Create placeholder PNG files (simple colored squares)
const createPlaceholderPNG = (size) => {
  // This is a minimal PNG file (1x1 pixel, but browsers will scale it)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // bit depth, color type, etc.
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND chunk
  ]);
  return pngData;
};

// Create placeholder PNG files
iconSizes.forEach(({ size, name }) => {
  const pngPath = path.join(iconsDir, name);
  const pngData = createPlaceholderPNG(size);
  fs.writeFileSync(pngPath, pngData);
  console.log(`Created placeholder ${name}`);
});

console.log('All icons created!');
