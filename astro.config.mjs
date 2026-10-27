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
  // 화면에 보이는 내부 링크의 HTML을 미리 받아 둔다. 클릭 시 네트워크 왕복 없이 바로 이동.
  // 데이터 절약 모드·느린 회선에서는 Astro가 알아서 건너뛴다.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  markdown: {
    processor: satteri({ hastPlugins: [inArticleAdPlugin] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
