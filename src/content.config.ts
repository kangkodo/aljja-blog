import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(1).max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    summary: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    ogTitle: z.string().optional(), // 공유 이미지용 짧은 제목, 줄바꿈(\n) 가능. 없으면 title
  }),
});

export const collections = { posts };
