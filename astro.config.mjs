// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { inArticleAdPlugin } from './src/lib/ads.ts';
import { tableScrollPlugin } from './src/lib/table-scroll.ts';

// 글 파일명 → 마지막 수정일. 사이트맵 lastmod에 쓴다.
const POSTS_DIR = new URL('./src/content/posts/', import.meta.url);
const postDates = new Map(
  readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const text = readFileSync(new URL(file, POSTS_DIR), 'utf8');
      const match = text.match(/^updated:\s*(\S+)/m) ?? text.match(/^date:\s*(\S+)/m);
      return [file.slice(0, -3), match?.[1]];
    }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://aljjatip.com',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/search/'),
      serialize(item) {
        const slug = new URL(item.url).pathname.match(/^\/posts\/([^/]+)\/$/)?.[1];
        const date = slug && postDates.get(slug);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],
  // 화면에 보이는 내부 링크의 HTML을 미리 받아 둔다. 클릭 시 네트워크 왕복 없이 바로 이동.
  // 데이터 절약 모드·느린 회선에서는 Astro가 알아서 건너뛴다.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  markdown: {
    processor: satteri({ hastPlugins: [inArticleAdPlugin, tableScrollPlugin] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
