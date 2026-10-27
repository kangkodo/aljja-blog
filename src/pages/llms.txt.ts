// /llms.txt: 카테고리별 글 목록. 빌드 시 글에서 자동 생성된다.
import { SITE } from '../config';
import { getPosts, getCategories, postUrl } from '../lib/posts';

export async function GET() {
  const posts = await getPosts();
  let out = `# ${SITE.name}\n> ${SITE.description}\n`;
  for (const cat of getCategories(posts)) {
    out += `\n## ${cat}\n`;
    for (const p of posts.filter((p) => p.data.category === cat)) {
      out += `- [${p.data.title}](${new URL(postUrl(p), SITE.url).href}): ${p.data.description}\n`;
    }
  }
  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
