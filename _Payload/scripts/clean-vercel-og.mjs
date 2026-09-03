import fs from 'fs';
import path from 'path';

function traverse(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name === 'og' && dir.endsWith('@vercel')) {
        console.log('Found @vercel/og at:', fullPath);
        // Replace files
        const nodeJs = path.join(fullPath, 'index.node.js');
        if (fs.existsSync(nodeJs)) {
          fs.writeFileSync(nodeJs, 'module.exports = { ImageResponse: function() {} };');
          console.log('Mocked index.node.js');
        }
        const edgeJs = path.join(fullPath, 'index.edge.js');
        if (fs.existsSync(edgeJs)) {
          fs.writeFileSync(edgeJs, 'module.exports = { ImageResponse: function() {} };');
          console.log('Mocked index.edge.js');
        }
        // Truncate wasm and ttf files instead of deleting them to avoid OpenNext build errors
        for (const ext of ['.wasm', '.ttf', '.bin']) {
          const filesInOg = fs.readdirSync(fullPath);
          for (const f of filesInOg) {
            if (f.endsWith(ext)) {
              fs.writeFileSync(path.join(fullPath, f), '');
              console.log('Truncated to 0 bytes:', f);
            }
          }
        }
      } else {
        traverse(fullPath);
      }
    }
  }
}

// Clean in standalone
const standaloneDir = path.resolve('.next/standalone');
if (fs.existsSync(standaloneDir)) {
  traverse(standaloneDir);
}

// Clean in main node_modules
const mainNodeModules = path.resolve('node_modules');
if (fs.existsSync(mainNodeModules)) {
  traverse(mainNodeModules);
}

console.log('Successfully cleaned up @vercel/og in all locations.');
