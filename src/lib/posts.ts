// 글 조회·URL·표시 형식 공통 함수. 페이지는 getCollection 대신 이것만 쓴다.
import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORY_ORDER } from '../config';

export type Post = CollectionEntry<'posts'>;

/** 발행된 글 전체, 발행일 내림차순 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 글에 실제로 있는 카테고리, CATEGORY_ORDER 순서 우선 */
export function getCategories(posts: Post[]): string[] {
  const found = new Set(posts.map((p) => p.data.category));
  const ordered = CATEGORY_ORDER.filter((c) => found.has(c));
  const rest = [...found].filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, 'ko'));
  return [...ordered, ...rest];
}

export const postSlug = (p: Post) => p.id.replace(/\.md$/, '');
export const postUrl = (p: Post) => `/posts/${postSlug(p)}/`;
export const categoryUrl = (name: string) => `/category/${encodeURIComponent(name)}/`;
export const tagUrl = (name: string) => `/tag/${encodeURIComponent(name)}/`;
export const ogImageUrl = (p: Post) => `/og/${postSlug(p)}.png`;

/** 2026.10.24 */
export const formatDate = (d: Date) => d.toISOString().slice(0, 10).replaceAll('-', '.');

/** 글자수 ÷ 600, 최소 1분 */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.length / 600));
