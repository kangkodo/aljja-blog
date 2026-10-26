// 빌드 시 src/content/posts의 글 목록에서 public/llms.txt를 자동 생성한다.
// 수동 관리 금지. npm run build의 prebuild 단계에서 실행된다.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src/content/posts');
const outFile = join(root, 'public/llms.txt');

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));
const posts = files
  .map((f) => {
    const fm = parseFrontmatter(readFileSync(join(postsDir, f), 'utf-8'));
    return { slug: f.replace(/\.md$/, ''), ...fm };
  })
  .filter((p) => p.title && p.draft !== 'true');

const byCategory = new Map();
for (const p of posts) {
  const cat = p.category || '기타';
  if (!byCategory.has(cat)) byCategory.set(cat, []);
  byCategory.get(cat).push(p);
}

let out = `# 알짜\n> 생활·돈·행정 — 알아두면 쓸모있는 정보\n`;
for (const [cat, list] of byCategory) {
  out += `\n## ${cat}\n`;
  for (const p of list) {
    out += `- [${p.title}](https://aljjatip.com/posts/${p.slug}/): ${p.description || ''}\n`;
  }
}

writeFileSync(outFile, out);
console.log(`llms.txt generated: ${posts.length} posts`);
