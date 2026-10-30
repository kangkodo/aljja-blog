# 알짜 블로그 개발 인수인계 프롬프트 (Claude용)

> 아래 내용을 그대로 Claude에게 전달하면 개발을 이어받을 수 있다.
> 작성일: 2026-10-27. 소유자 결정: 개발은 Claude, 글 발행은 Muse가 담당한다.

너는 '알짜' 정보성 블로그의 개발을 이어받는다. 아래 정보를 기준으로 작업하라.

## 프로젝트 개요

- 이름: 알짜, 도메인: https://aljjatip.com
- 저장소: https://github.com/kangkodo/aljja-blog (main 브랜치, Public)
- 스택: Astro 7 + Tailwind CSS 4, 정적 사이트. 서버·DB·로그인·관리자 화면 없음.
- 호스팅: Cloudflare Workers 정적 에셋. main 푸시 시 GitHub App 연동으로 자동 배포.
- 언어: 한국어 전용. 글 주제: 생활·돈·행정 롱테일 질문형 정보글.
- 수익 계획: 글 20~30개 쌓인 뒤 Google AdSense 승인 신청. 발행 루틴: 주 5개, 6개월 지속.

## Cloudflare 설정 (대시보드에서 소유자가 직접 설정, API 토큰 없음)

- Workers & Pages 프로젝트명: aljja-blog
- 빌드 명령: `npm run build` / 배포 명령: `npx wrangler deploy` (Workers 흐름)
- Framework preset: Astro, Root directory: 기본값, 환경변수: 없음
- Preview builds: ON, Cloudflare Access 보호: OFF
- 커스텀 도메인: aljjatip.com (도메인이 같은 Cloudflare 계정에 있어 DNS 자동 설정)
- wrangler.toml 없음 (대시보드 관리).
- 주의: 존재하지 않는 경로는 홈페이지로 폴백되는 SPA 폴백 동작이 확인됨.
- 참고: Cloudflare API 토큰은 발급된 적 없다. 설정 변경은 대시보드에서 소유자가 직접 한다.

## 이메일 (Cloudflare Email Routing, 수신·전달 전용)

- support@aljjatip.com (문의), privacy@aljjatip.com (개인정보처리방침용), contact@aljjatip.com (대외 연락) — 3개 모두 동일 개인 받은편지함으로 전달하는 규칙 생성 중.
- postmaster@, abuse@는 선택 사항 (미결정).
- allja.tip 도메인은 RDAP 조회 결과 미등록 상태이나, 이메일 도메인으로는 사용하지 않기로 결정 (신뢰도·사이트와의 일관성 이유).
- 발송 기능 없음. 도메인 이름으로 메일을 보내려면 별도 SMTP(예: Resend) 필요 — 미설정.

## GitHub / 배포

- main 푸시 → Cloudflare 자동 배포. 배포 상태 확인은 대시보드 Deployments에서.
- 저장소 Discussions 활성화됨 (Giscus 댓글용).
- Muse(발행 담당)가 별도 PAT로 푸시한다. 개발 변경의 푸시는 소유자 경로로 별도 해결할 것 (Muse의 PAT은 공유되지 않는다).

## 코드 구조

- 글: `src/content/posts/*.md` 1파일 = 1글. frontmatter: title, description(1~200자), date, updated(선택), category, tags[](기본 빈 배열), draft(기본 false), summary(선택), faq[{q, a}](기본 빈 배열).
- 레이아웃: `src/layouts/Base.astro` (공통), `src/layouts/Post.astro` (글 상세).
- 페이지: `[...page].astro` (홈, 10개씩 페이지네이션), `posts/[...slug].astro`, `category/[name].astro`, `tag/[name].astro`, `about.astro`, `search.astro` (Pagefind, 입력 이벤트만 동작, 버튼·엔터 제출 없음), `rss.xml.ts`.
- 설정 집중: `src/config.ts` (사이트명·URL·Giscus·분석·방어 문구).
- 빌드 스크립트: prebuild (llms.txt 생성), build (astro build), postbuild (pagefind 인덱스 생성).

## 미설정 항목 (`src/config.ts`, 소유자가 값 제공 시 입력)

- GISCUS 4개 값 (repo, repoId, category, categoryId) — 미설정 시 댓글 영역 렌더링 안 됨.
- CF_ANALYTICS_TOKEN — 미설정 시 분석 비콘 없음.
- AI_DEFENSE_HTML, CANARY_STRING — careit.kr 패키지에서 가져올 예정, 미설정 시 숨김 div·카나리아 렌더링 안 됨.

## SEO / GEO

- robots.txt: AI 학습용 크롤러(GPTBot, CCBot, ClaudeBot, Bytespider, meta-externalagent, Applebot-Extended) 차단, 검색·답변용 봇(ChatGPT-User, OAI-SearchBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended) 허용, 모두에게 `Content-Signal: ai-train=no` 표시. Sitemap 주소는 `sitemap-index.xml`.
- llms.txt: 빌드 시 자동 생성 (카테고리별 글 목록).
- JSON-LD: Article 필수, FAQPage는 FAQ 있을 때만.

## UI / 디자인

- 상세 명세: `docs/UI-명세서.md` (페이지별 요소·링크·이동·로딩·빈 상태·존재하지 않는 기능까지 기록).
- 전체 스펙: `docs/설계서.md`, 배포·인수인계: `HANDOFF.md`.
- 디자인: 소유자가 Claude Design으로 시안 제작 중. 시안 적용 시 구조 유지 필수 (핵심 요약 박스, 목차, FAQ, 표 중심 본문, JSON-LD).
- 알려진 동작: 카테고리·태그 페이지는 날짜순 정렬 없음, FAQ는 아코디언이 아닌 항상 펼침, 사이트 전체에 `<button>` 없음, 소개 페이지의 댓글 안내 문구와 Giscus 미설정 간 불일치 있음.
- 색상 토큰 현재값: 본문 #1f2937, 보조 #6b7280, 강조 #2563eb, 경계 #e5e7eb, 연한 배경 #f9fafb, info #eff6ff, warn #fefce8, summary #f3f4f6. 폰트: 시스템 스택.

## 역할 분담

- 개발 (코드·디자인 적용·설정): Claude.
- 글 발행 (주제 받으면 글 작성·푸시·배포): Muse (별도 PAT 보유).
- 소유자 직접 처리: Cloudflare 대시보드 조작, 도메인·이메일 설정, 각종 값 제공 (Giscus, 분석, AI 방어 문구).

## 제약

- 정적 사이트 유지. 표준 npm 스크립트만 사용, 특정 에이전트 전용 도구 사용 금지 (이식성).
- GitHub이 원본. 모든 변경은 main 푸시로 배포됨.
- 향후 작업: Search Console·네이버 서치어드바이저 등록, 첫 글 발행 데드라인 결정 (소유자 결정 대기 중).
