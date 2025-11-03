import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://domain-generator.example.com',
  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],
  output: 'hybrid', // Changed from 'static' to support API endpoints
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser'
    }
  }
});
