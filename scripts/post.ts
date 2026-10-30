// 글 작업 도구. 사용법은 npm run post 로 본다.
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CATEGORY_ORDER } from '../src/config.ts';
import { checkPost, isValidSlug, newPost, nextTopic, sourceUrls, today } from '../src/lib/post-check.ts';

const ROOT = resolve(import.meta.dirname, '..');
const USAGE = `사용법
  npm run post -- next                                   다음에 쓸 주제
  npm run post -- new <파일명> --title 제목 --category 분야   draft 초안 만들기
  npm run post -- check <파일명> [--links]                 발행 전 검사 (--links: 출처 링크 접속)`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { title: { type: 'string' }, category: { type: 'string' }, links: { type: 'boolean', default: false } },
});
const [command, slug] = positionals;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function postPath(name: string): string {
  return resolve(ROOT, 'src/content/posts', `${name}.md`);
}

function next() {
  const topic = nextTopic(readFileSync(resolve(ROOT, '.agents/topic-backlog.md'), 'utf8'));
  if (!topic) fail('대기 중인 주제가 없습니다.');
  console.log(`#${topic.no} (${topic.target}) ${topic.title}\n분야: ${topic.category}\n검색어: ${topic.keywords}`);
}

function create() {
  if (!slug || !values.title || !values.category) fail(USAGE);
  if (!isValidSlug(slug)) fail('파일명은 영문 소문자, 숫자, 하이픈만 씁니다.');
  if (!CATEGORY_ORDER.includes(values.category)) fail(`분야는 ${CATEGORY_ORDER.join(', ')} 중 하나입니다.`);
  const path = postPath(slug);
  if (existsSync(path)) fail(`이미 있는 글입니다: ${path}`);
  writeFileSync(path, newPost(values.title, values.category, today()));
  console.log(`만들었습니다: src/content/posts/${slug}.md`);
}

async function brokenLink(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20_000) });
    return response.ok ? undefined : `출처 링크가 열리지 않습니다 (${response.status}): ${url}`;
  } catch (error) {
    return `출처 링크가 열리지 않습니다 (${(error as Error).name}): ${url}`;
  }
}

async function check() {
  if (!slug) fail(USAGE);
  const path = postPath(slug);
  if (!existsSync(path)) fail(`글이 없습니다: ${path}`);
  const text = readFileSync(path, 'utf8');
  const { errors, warnings } = checkPost(slug, text);

  if (!/^draft: true$/m.test(text)) {
    const page = resolve(ROOT, 'dist/posts', slug, 'index.html');
    if (!existsSync(page)) warnings.push('빌드된 페이지가 없습니다. npm run build 후 다시 검사합니다.');
    else {
      if (statSync(page).mtimeMs < statSync(path).mtimeMs) warnings.push('글이 빌드보다 새롭습니다. npm run build 후 다시 검사합니다.');
      if (readFileSync(page, 'utf8').includes('**')) errors.push('빌드된 페이지에 **가 글자 그대로 보입니다.');
    }
  }
  if (values.links) {
    const results = await Promise.all(sourceUrls(text).map(brokenLink));
    errors.push(...results.filter((result) => result !== undefined));
  }

  for (const message of errors) console.log(`오류  ${message}`);
  for (const message of warnings) console.log(`확인  ${message}`);
  console.log(`\n${slug}: 오류 ${errors.length}개, 확인 ${warnings.length}개${values.links ? '' : ' (출처 링크는 --links로 검사)'}`);
  console.log('사실 검증, copy-editing, humanize-korean은 이 도구가 대신하지 않습니다.');
  if (errors.length > 0) process.exitCode = 1;
}

if (command === 'next') next();
else if (command === 'new') create();
else if (command === 'check') await check();
else fail(USAGE);
