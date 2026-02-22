import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'height-harmony.js'),
      name: 'heightHarmony',
      fileName: (format) =>
        format === 'umd' ? 'height-harmony-min.js' : `height-harmony.${format}.js`,
      formats: ['es', 'umd'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        passes: 2,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        // For UMD/IIFE, expose as global `heightHarmony`
        name: 'heightHarmony',
        exports: 'named',
      },
    },
  },
});