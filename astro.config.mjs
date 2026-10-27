// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { inArticleAdPlugin } from './src/lib/ads.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://aljjatip.com',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [inArticleAdPlugin] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
