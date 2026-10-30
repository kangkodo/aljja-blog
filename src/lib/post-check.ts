// 글 파일 도구의 판단 로직. write-post 9번 체크리스트 중 코드로 가릴 수 있는 것만 본다.
import { ADS, CATEGORY_ORDER } from '../config.ts';

export type Report = { errors: string[]; warnings: string[] };
export type Topic = { no: string; target: string; title: string; category: string; keywords: string };

const HYPE = ['역대급', '무조건', '꿀팁 대방출', '필수 시청', '모르면 손해', '많은 분들이 궁금해'];
const AI_MENTION = ['AI가 작성', 'AI가 쓴', 'AI로 작성', 'ChatGPT로 작성'];
const FAKE_EXPERIENCE = ['직접 가 보니', '직접 가보니', '써 보니', '써보니', '제가 해 보니', '제가 해보니'];
const CHINA = ['알리익스프레스', '테무', '중국'];
const BAD_SOURCES = ['namu.wiki', 'tistory.com', 'blog.naver.com', 'velog.io', 'brunch.co.kr'];
const SOURCE_MAX_DAYS = 7;
const COUPANG_NOTICE = '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

/** Asia/Seoul 기준 YYYY-MM-DD */
export function today(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

function koreanDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/** 스키마를 통과하면서 check에는 걸리도록 TODO를 채운 초안 */
export function newPost(title: string, category: string, date: string): string {
  return `---
title: ${JSON.stringify(title)}
description: "TODO"
date: ${date}
category: "${category}"
tags: []
summary: "TODO"
faq:
  - q: "TODO"
    a: "TODO"
draft: true
---

> ${koreanDate(date)} 기준입니다.

## TODO

## TODO

## 출처

- 기관명, [문서 제목](https://TODO) (${date} 확인)
`;
}

/** 상태가 대기인 주제 중 발행 목표일이 가장 이른 것 */
export function nextTopic(backlog: string): Topic | undefined {
  const rows = backlog
    .split('\n')
    .filter((line) => /^\| \d+ \| \d\d-\d\d \|/.test(line))
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .filter((cells) => cells[10] === '대기')
    .sort((a, b) => a[2].localeCompare(b[2]));
  const row = rows[0];
  return row && { no: row[1], target: row[2], title: row[3], category: row[4], keywords: row[6] };
}

/** 출처 줄에서 링크 주소를 꺼낸다. 주소 안의 괄호(판례 주소 등)도 살린다. */
export function sourceUrls(body: string): string[] {
  const section = body.split(/^## 출처\s*$/m)[1] ?? '';
  return [...section.matchAll(/\]\((https?:\/\/.*?)\)(?=\s*\(|\s*$)/gm)].map((m) => m[1]);
}

// ponytail: frontmatter는 이 블로그 형식의 한 줄 값만 읽는다. 형식 자체는 빌드 스키마가 검사한다.
function field(frontmatter: string, key: string): string {
  return frontmatter.match(new RegExp(`^${key}:[ \\t]*"?(.*?)"?[ \\t]*$`, 'm'))?.[1] ?? '';
}

export function checkPost(slug: string, text: string, now = today()): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parts = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!parts) return { errors: ['frontmatter를 찾을 수 없습니다.'], warnings };
  const [, frontmatter, body] = parts;

  if (!isValidSlug(slug)) errors.push('파일명은 영문 소문자, 숫자, 하이픈만 씁니다.');
  if (/20\d\d/.test(slug)) warnings.push('해마다 반복되는 주제면 파일명에서 연도를 뺍니다.');
  if (text.includes('TODO')) errors.push('TODO가 남아 있습니다.');
  if (field(frontmatter, 'draft') === 'true') warnings.push('draft: true라 사이트에 나오지 않습니다.');

  const title = field(frontmatter, 'title');
  const description = field(frontmatter, 'description');
  const summary = field(frontmatter, 'summary');
  const category = field(frontmatter, 'category');
  if (!/20\d\d/.test(title)) errors.push('title에 연도가 없습니다.');
  if (description.length < 1 || description.length > 200) errors.push(`description이 ${description.length}자입니다 (1~200자).`);
  else if (description.length < 80 || description.length > 120) warnings.push(`description이 ${description.length}자입니다 (권장 80~120자).`);
  if (!summary) errors.push('summary가 없습니다.');
  else if (!/\d/.test(summary)) warnings.push('summary에 숫자가 없습니다.');
  if (!CATEGORY_ORDER.includes(category)) errors.push(`분야 "${category}"는 CATEGORY_ORDER에 없습니다.`);

  const faqCount = frontmatter.match(/^\s+- q:/gm)?.length ?? 0;
  if (faqCount < 3 || faqCount > 5) errors.push(`faq가 ${faqCount}개입니다 (3~5개).`);
  for (const [, answer] of frontmatter.matchAll(/^\s+a:\s*"(.*)"\s*$/gm)) {
    if (/니다\.?$/.test(answer)) warnings.push(`faq 답은 "-요"로 씁니다: ${answer.slice(0, 30)}`);
  }

  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  if (!/^\s*> \d{4}년 \d{1,2}월 \d{1,2}일 기준/.test(body)) errors.push('본문 첫 줄에 기준일 인용문이 없습니다.');
  if (/^# /m.test(prose)) errors.push('본문에 # 제목을 쓰지 않습니다.');
  const headings = [...prose.matchAll(/^## (.*)$/gm)].map((m) => m[1].trim());
  if (headings.length < 3) errors.push('출처를 빼고 ## 소제목이 2개 이상이어야 합니다.');
  if (headings.at(-1) !== '출처') errors.push('마지막 소제목이 ## 출처가 아닙니다.');

  const sources = (body.split(/^## 출처\s*$/m)[1] ?? '').split('\n').filter((line) => line.startsWith('- '));
  if (sources.length === 0) errors.push('출처 목록이 비어 있습니다.');
  for (const line of sources) {
    if (!/\]\(https?:\/\//.test(line)) errors.push(`출처에 링크가 없습니다: ${line.slice(0, 40)}`);
    if (!/\d{4}-\d{2}-\d{2}[^)]*확인\)\s*$/.test(line)) errors.push(`출처에 확인 날짜가 없습니다: ${line.slice(0, 40)}`);
    const checked = line.match(/(\d{4}-\d{2}-\d{2}) 확인\)\s*$/)?.[1];
    if (checked && (Date.parse(now) - Date.parse(checked)) / 86_400_000 > SOURCE_MAX_DAYS) {
      warnings.push(`출처 확인일이 ${SOURCE_MAX_DAYS}일 넘었습니다. 다시 확인합니다: ${checked}`);
    }
    const bad = BAD_SOURCES.find((domain) => line.includes(domain));
    if (bad) errors.push(`출처로 쓸 수 없는 곳입니다: ${bad}`);
  }

  for (const word of HYPE) if (prose.includes(word)) errors.push(`과장·상투 표현: ${word}`);
  for (const word of AI_MENTION) if (text.includes(word)) errors.push(`AI 작성 언급: ${word}`);
  if (/오늘은 .{1,40}알아보겠습니다/.test(prose)) errors.push('서론 상투어: 오늘은 ~ 알아보겠습니다');
  for (const word of FAKE_EXPERIENCE) if (prose.includes(word)) warnings.push(`체험담 표현인지 확인: ${word}`);
  for (const word of CHINA) if (text.includes(word)) warnings.push(`다루지 않는 주제인지 확인: ${word}`);
  if (/(1위|최고의)/.test(prose)) warnings.push('주관적 순위 표현인지 확인: 1위, 최고의');

  if (/\*\*[^*\n]*[)\]"'%”’」』]\*\*[가-힣]/.test(prose)) {
    errors.push('닫는 ** 앞이 문장부호이고 뒤가 한글이라 굵게가 깨집니다.');
  }
  const widest = Math.max(0, ...[...prose.matchAll(/^\|(?:\s*:?-+:?\s*\|)+$/gm)].map((m) => m[0].split('|').length - 2));
  if (widest > 5) warnings.push(`표가 ${widest}열입니다. 휴대폰에서는 5열 이하가 읽기 쉽습니다.`);

  const friendly = prose.match(/[가-힣]+(?<![세필중])요\./g); // 확인하세요, 필요, 중요는 빼고 본다
  if (friendly) warnings.push(`본문 어미가 섞였는지 확인: ${[...new Set(friendly)].join(', ')}`);

  if (/link\.coupang\.com|coupa\.ng/.test(body)) {
    if (ADS.enabled) errors.push('AdSense가 켜져 있어 쿠팡 링크를 넣지 않습니다.');
    if (!body.includes(COUPANG_NOTICE)) errors.push('쿠팡 파트너스 고지문이 없습니다.');
    if (/\]\(https?:\/\/(link\.coupang\.com|coupa\.ng)/.test(body)) errors.push('쿠팡 링크는 HTML <a>로 씁니다.');
    for (const [tag] of body.matchAll(/<a [^>]*(?:coupang|coupa\.ng)[^>]*>/g)) {
      if (!tag.includes('rel="sponsored nofollow"')) errors.push('쿠팡 링크에 rel="sponsored nofollow"가 없습니다.');
    }
  }

  return { errors, warnings };
}
