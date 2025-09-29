import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'height-harmony.js'),
      name: 'heightHarmony',
      fileName: 'height-harmony-min',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true
    },
    rollupOptions: {
      output: {
        // Ensure the function is available globally for traditional script usage
        name: 'heightHarmony',
        entryFileNames: 'height-harmony-min.js',
        extend: true
      }
    }
  }
});