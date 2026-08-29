// Simple script to create PWA icons
import fs from 'fs';
import path from 'path';

// Create icons directory
const iconsDir = path.join(process.cwd(), 'client', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon
const createIconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
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
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG files
iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created icon-${size}x${size}.svg`);
});

// Create a simple HTML file for manual conversion
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>PWA Icon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .icon { margin: 10px; display: inline-block; }
    canvas { border: 1px solid #ccc; margin: 5px; }
  </style>
</head>
<body>
  <h1>PWA Icon Generator</h1>
  <p>Right-click on each icon and "Save image as..." to download as PNG</p>
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
      
      // Add to page
      const container = document.createElement('div');
      container.className = 'icon';
      container.innerHTML = \`
        <div>\${size}x\${size}</div>
        <canvas></canvas>
      \`;
      container.querySelector('canvas').getContext('2d').drawImage(canvas, 0, 0);
      document.getElementById('icons').appendChild(container);
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'icon-generator.html'), htmlContent);
console.log('Created icon-generator.html - open this file in a browser to generate PNG icons');

console.log('All SVG icons created!');
