import { defineConfig } from 'vite';

export default defineConfig({
  base: "/progress-web-component",
  build: {
    minify: false,
    target: 'esnext',
    modulePreload: { polyfill: false,  },
  },
});
