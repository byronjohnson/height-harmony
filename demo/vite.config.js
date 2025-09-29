import { defineConfig } from 'vite';

export default defineConfig({
  root: '..',
  publicDir: 'demo',
  server: {
    open: '/demo/index.html'
  }
});