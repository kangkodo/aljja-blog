# 알짜 — 롱테일 질문형 정보 블로그

생활·돈·행정 분야에서 사람들이 가끔 검색하는 질문에 정확한 숫자·표·FAQ로 답하는 정적 블로그.

- **도메인**: https://aljjatip.com
- **스택**: Astro 7 (SSG) + Tailwind CSS 4 + Cloudflare Workers 정적 에셋
- **서버 없음** · DB 없음 · 인증 없음

## 시작하기

```bash
npm install
npm run dev
npm run build
```

## 구조

```
src/
  config.ts          설정 전부 (사이트·연락처·카테고리 순서·광고·분석)
  content/posts/     글 (1파일 = 1글)
  styles/global.css  디자인 토큰 + 타이포 8종 + 본문 스타일
  lib/               글 조회·페이지 번호·SEO·OG 이미지·광고 (화면과 무관한 로직)
  components/        layout/ (헤더·푸터·head), list/ (목록·페이지 이동), post/ (글 상세 부품)
  layouts/           Base(공통 뼈대), Post(글 상세), Archive(카테고리·태그)
  pages/             라우트
```

## 글 쓰기

`src/content/posts/<주소>.md` 파일을 만든다. frontmatter: `title`, `description`(1~200자), `date`, `category` 필수 / `updated`, `tags`, `summary`, `faq`, `ogTitle`, `draft` 선택.

## 인수인계

다른 에이전트에게 넘길 때는 [HANDOFF.md](./HANDOFF.md)를 먼저 읽을 것.
UI 구현 기준은 [docs/design/알짜블로그-UI-명세서-v2.md](./docs/design/알짜블로그-UI-명세서-v2.md).
