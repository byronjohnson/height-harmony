import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Root is the demo/ directory itself, so index.html is the entry point
  root: __dirname,

  build: {
    // Output goes to demo-dist/ at the project root (sibling of demo/)
    outDir: resolve(__dirname, '../demo-dist'),
    emptyOutDir: true,
  },

  server: {
    // Dev server: open at / (which is demo/index.html since root = demo/)
    open: '/',
    fs: {
      // Allow the dev server to serve files from the parent directory
      // so ../dist/height-harmony-min.js resolves correctly in dev mode
      allow: [resolve(__dirname, '..')],
    },
  },
});