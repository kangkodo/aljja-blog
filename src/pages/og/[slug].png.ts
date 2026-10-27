// 글별 공유 이미지 /og/[slug].png
import type { APIRoute } from 'astro';
import { renderOg, pngResponse } from '../../lib/og';
import { getPosts, postSlug, type Post } from '../../lib/posts';

export async function getStaticPaths() {
  return (await getPosts()).map((post) => ({ params: { slug: postSlug(post) }, props: { post } }));
}

export const GET: APIRoute<{ post: Post }> = async ({ props: { post } }) =>
  pngResponse(await renderOg({ title: post.data.ogTitle ?? post.data.title, category: post.data.category }));
