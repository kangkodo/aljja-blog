// npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPost, isValidSlug, newPost, nextTopic, sourceUrls } from './post-check.ts';

const GOOD = `---
title: "2027 최저임금 10,700원: 시급 계산"
description: "2027년 최저임금은 시급 10,700원, 주 40시간 월급 2,236,300원입니다. 근무시간별 월급과 주휴수당 표를 조건별로 나눠 정리했습니다. 수습 감액 조건까지 함께 봅니다."
date: 2026-10-29
category: "일자리"
tags: []
summary: "2027년 최저임금은 시간당 10,700원입니다."
faq:
  - q: "질문 1"
    a: "답이에요."
  - q: "질문 2"
    a: "답이에요."
  - q: "질문 3"
    a: "답이에요."
---

> 2026년 10월 29일 기준입니다.

## 첫 소제목

시급은 **10,700원**입니다.

## 둘째 소제목

\`주휴수당 = (시간 ÷ 5) × 시급\`

## 출처

- 고용노동부, [고시](https://www.example.go.kr/a) (2026-10-29 확인)
- 대법원, [판결](https://www.law.go.kr/판례/(2022다291153)) (2026-10-29 확인)
- 한국경제, [기사](https://www.example.com/b) (2025-10-09 보도, 2026-10-29 확인)
`;

const check = (slug: string, text: string) => checkPost(slug, text, '2026-10-31');
const errors = (text: string, slug = 'minimum-wage') => check(slug, text).errors;

test('잘 쓴 글은 오류가 없다', () => {
  assert.deepEqual(check('minimum-wage', GOOD), { errors: [], warnings: [] });
});

test('새 초안은 스키마 값을 채우되 TODO로 막힌다', () => {
  const draft = newPost('2027 제목', '일자리', '2026-10-31');
  assert.match(draft, /> 2026년 10월 31일 기준입니다\./);
  assert.match(draft, /^draft: true$/m);
  assert.match(newPost('2027 "큰" 제목', '일자리', '2026-10-31'), /^title: "2027 \\"큰\\" 제목"$/m);
  assert.ok(errors(draft).includes('TODO가 남아 있습니다.'));
});

test('frontmatter와 파일명', () => {
  assert.ok(errors(GOOD.replace('2027 최저임금 10,700원', '최저임금'))[0].includes('연도'));
  assert.ok(errors(GOOD.replace('"일자리"', '"돈"'))[0].includes('CATEGORY_ORDER'));
  assert.ok(errors(GOOD.replace(/^summary:.*\n/m, ''))[0].includes('summary'));
  assert.ok(errors(GOOD.replace(/  - q: "질문 3"\n.*\n/, ''))[0].includes('faq가 2개'));
  assert.ok(errors(GOOD, 'Minimum_Wage')[0].includes('파일명'));
  assert.match(check('minimum-wage-2027', GOOD).warnings[0], /연도/);
});

test('description 길이', () => {
  const long = GOOD.replace(/^description:.*$/m, `description: "${'가'.repeat(201)}"`);
  assert.ok(errors(long)[0].includes('201자'));
  const short = check('minimum-wage', GOOD.replace(/^description:.*$/m, 'description: "짧은 설명"'));
  assert.deepEqual(short.errors, []);
  assert.match(short.warnings[0], /권장/);
});

test('본문 구조', () => {
  assert.ok(errors(GOOD.replace('> 2026년 10월 29일 기준입니다.\n', ''))[0].includes('기준일'));
  assert.ok(errors(GOOD.replace('## 첫 소제목', '# 첫 소제목')).some((e) => e.includes('# 제목')));
  assert.ok(errors(GOOD.replace('## 출처', '## 참고')).some((e) => e.includes('## 출처')));
  assert.ok(errors(GOOD.replace('## 둘째 소제목', '본문')).some((e) => e.includes('2개 이상')));
});

test('출처', () => {
  assert.ok(errors(GOOD.replace(' (2026-10-29 확인)\n- 대법원', '\n- 대법원'))[0].includes('확인 날짜'));
  assert.ok(errors(GOOD.replace('https://www.example.com/b', 'https://namu.wiki/w/x')).some((e) => e.includes('namu.wiki')));
  assert.deepEqual(sourceUrls(GOOD), [
    'https://www.example.go.kr/a',
    'https://www.law.go.kr/판례/(2022다291153)',
    'https://www.example.com/b',
  ]);
});

test('오래된 출처 확인일은 경고', () => {
  assert.deepEqual(checkPost('minimum-wage', GOOD, '2026-11-05').warnings, []);
  const warnings = checkPost('minimum-wage', GOOD, '2026-11-06').warnings;
  assert.equal(warnings.length, 3);
  assert.match(warnings[0], /7일/);
});

test('말투와 금지 표현', () => {
  const add = (line: string) => GOOD.replace('## 둘째 소제목', `${line}\n\n## 둘째 소제목`);
  assert.ok(errors(add('역대급 혜택입니다.'))[0].includes('역대급'));
  assert.ok(errors(add('오늘은 최저임금에 대해 알아보겠습니다.'))[0].includes('서론'));
  assert.ok(errors(add('이 글은 AI가 작성했습니다.'))[0].includes('AI'));
  assert.match(check('minimum-wage', add('직접 가 보니 좋습니다.')).warnings[0], /체험담/);
  assert.match(check('minimum-wage', add('테무 할인입니다.')).warnings[0], /다루지 않는/);
  assert.match(check('minimum-wage', add('시급이 올라요.')).warnings[0], /어미/);
  assert.match(check('minimum-wage', GOOD.replace('"답이에요."', '"답입니다."')).warnings[0], /faq/);
  assert.deepEqual(errors(GOOD.replace('`주휴수당', '`역대급 주휴수당')), []);
});

test('넓은 표는 경고', () => {
  const table = (columns: number) => `| ${'칸 | '.repeat(columns)}\n|${'---|'.repeat(columns)}\n`;
  const add = (columns: number) => GOOD.replace('## 둘째 소제목', `${table(columns)}\n## 둘째 소제목`);
  assert.deepEqual(check('minimum-wage', add(5)).warnings, []);
  assert.match(check('minimum-wage', add(6)).warnings[0], /6열/);
});

test('굵게 깨짐', () => {
  const broken = GOOD.replace('**10,700원**입니다', '**11월 19일(목)**이고');
  assert.ok(errors(broken)[0].includes('굵게'));
  assert.deepEqual(errors(GOOD.replace('**10,700원**입니다', '**11월 19일**(목)이고')), []);
});

test('쿠팡 링크', () => {
  const notice = '> 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.\n\n';
  const link = (rel: string) => `<a href="https://link.coupang.com/a/x"${rel}>보기</a>`;
  const add = (html: string, withNotice = true) => GOOD.replace('## 첫 소제목', `${withNotice ? notice : ''}## 첫 소제목\n\n${html}`);
  assert.deepEqual(errors(add(link(' rel="sponsored nofollow"'))), []);
  assert.ok(errors(add(link(' rel="sponsored nofollow"'), false))[0].includes('고지문'));
  assert.ok(errors(add(link('')))[0].includes('rel='));
  assert.ok(errors(add('[보기](https://link.coupang.com/a/x)'))[0].includes('HTML'));
});

test('다음 주제는 대기 중 가장 이른 날짜', () => {
  const backlog = `| 1 | 10-29 | 첫째 | 혜택 | 1 | 검색어1 | 이유 | | 8 | 초안 (a) |
| 2 | 11-02 | 둘째 | 살림 | 1 | 검색어2 | 이유 | | 8 | 대기 |
| 3 | 10-31 | 셋째 | 일자리 | 5 | 검색어3 | 이유 | O | 8 | 대기 |
| 4 | 10-30 | 넷째 | 교통 | 4 | 검색어4 | 이유 | | 8 | 발행 (b) |`;
  assert.deepEqual(nextTopic(backlog), { no: '3', target: '10-31', title: '셋째', category: '일자리', keywords: '검색어3' });
  assert.equal(nextTopic('없음'), undefined);
  const priority = `${backlog}\n| 5 | 11-20 | 다섯째 | 쇼핑 | 3 | 검색어5 | 이유 | | - | 우선 |`;
  assert.equal(nextTopic(priority)?.no, '5');
});

test('파일명 규칙', () => {
  assert.ok(isValidSlug('coupang-alba-pay'));
  assert.ok(!isValidSlug('Coupang-Alba'));
  assert.ok(!isValidSlug('-alba'));
  assert.ok(!isValidSlug('최저임금'));
});
