# HANDOFF — '알짜' 블로그 인수인계 문서

> 이 문서는 이 프로젝트를 다른 개발 에이전트(Claude 등)에게 넘길 때
> 기억 없이도 이어서 작업할 수 있게 만든 것이다.
> 결정 사항은 전부 파일에 기록한다. 에이전트 개인의 기억에 의존하지 않는다.

## 프로젝트 개요

- **이름**: 알짜
- **도메인**: https://aljjatip.com (Cloudflare Registrar에서 구매 완료)
- **목적**: 생활·돈·행정 분야 롱테일 질문형 검색 유입 정보 블로그
- **수익 모델**: 광고만. AdSense 승인 전 쿠팡 파트너스 → 승인 후 AdSense로 완전히 전환 (글 10개쯤부터 신청 검토)
- **목표**: 매일 글 1개, 2026-11-28까지 하루 방문자 100명 (상세는 `.agents/product-marketing.md`)

## 현재 상태 (2026-10-27 기준)

- [x] UI 명세서 v2(`docs/design/알짜블로그-UI-명세서-v2.md`) 적용: 새 헤더·검색 토글·페이지 번호·푸터, 개인정보처리방침·404, OG 이미지
- [x] 명세서 맨 앞 "개발 필수 체크리스트" 6개 항목 확인 완료
- [x] GitHub 저장소 + Cloudflare Pages 자동 배포 연결 (소유자가 대시보드에서 설정)
- [x] 개인정보처리방침: 문의 메일(contact@·support@)이 소유자 Gmail로 전달되는 것 확인, 법령 대조 검토 후 정정 (2026-10-28). 전달된 메일이 Gmail 스팸함으로 가서 소유자가 Gmail 필터로 처리
- [ ] AI 카피 방어 문구·카나리아 문자열 입력 — 소유자가 careit.kr 패키지에서 제공
- [ ] Cloudflare Web Analytics 토큰 입력
- [ ] AdSense 승인 후 `ADS` 설정 입력 + `public/ads.txt` 추가
- [x] 로고 이미지 적용 (`Logo.astro`, `src/lib/og.ts`, `public/brand`·`icons`·`social`, `favicon.ico`, `apple-touch-icon.png`)
- [x] 블로그 기준 문서(`.agents/product-marketing.md`)와 글쓰기 스킬(`.agents/skills/write-post/`) 작성
- [x] 분야 7개(세금·일자리·혜택·쇼핑·살림·교통·행정) 사이트 적용 (2026-10-28). 기존 글: 쿠팡 알바 → 일자리, 연말정산 → 세금, 전입신고 → 행정
- [x] 테스트용이던 기존 글 3개(쿠팡 알바, 전입신고, 연말정산 미리보기) 삭제 (2026-10-28). 글 폴더는 `.gitkeep`으로 유지
- [x] Google Search Console 등록(도메인 속성, Cloudflare DNS로 소유 확인)·사이트맵 제출 (2026-10-28)
- [x] 네이버 서치어드바이저(`BaseHead.astro`의 `naver-site-verification` 메타 태그)·Daum 웹마스터도구(`public/robots.txt` 맨 끝 `#DaumWebMasterTool` 줄) 등록 (2026-10-28). 두 줄은 지우면 소유 확인이 풀린다. 사이트맵은 Google·네이버·Daum 모두 제출, RSS는 Daum만 제출
- [ ] 네이버 RSS 제출 (`https://aljjatip.com/rss.xml`): 글이 0개라 RSS가 비어 있어 "시스템 오류"로 실패. 첫 글 발행 후 서치어드바이저 → 요청 → RSS 제출에서 다시 (보안 문자는 소유자 입력)

## 기술 스택

- Astro 7 (SSG), Tailwind CSS v4, 마크다운은 Astro 기본 Sätteri 처리기
- 호스팅: Cloudflare Pages (서버 없음, DB 없음, 인증 없음). 빌드 설정은 대시보드에서 관리, 출력 `dist`
- 사이트 내 검색: Pagefind (빌드 시 정적 인덱스, 글 상세만 색인)
- 공유 이미지: satori + @resvg/resvg-js로 빌드 시 글마다 PNG 생성 (폰트: `src/assets/fonts/`)
- 분석: Cloudflare Web Analytics (토큰 설정 시에만 비콘 삽입)
- 댓글: 없음 (v2에서 Giscus 제거)

## 명령어

Node 22.23.4 이상 필요 (Astro 요구사항). 소유자 맥의 기본 `node`(`~/.local/bin/node`, v22.23.1)로는 빌드가 실패한다. `PATH=/opt/homebrew/bin:$PATH npm run build`처럼 Homebrew Node를 쓴다.

```bash
npm install
npm run dev      # 개발 서버
npm run build    # astro build → postbuild(Pagefind 인덱싱)
npm run preview  # 빌드 결과 미리보기
npm test         # 페이지 번호 생략 규칙 테스트
```

## 파일 지도

| 경로 | 역할 |
|---|---|
| `src/config.ts` | 사이트명·연락처·카테고리 순서·광고·분석 토큰·AI 방어 문구 — **설정은 전부 여기** |
| `src/content/posts/*.md` | 글 (마크다운 + frontmatter). 1파일 = 1글, 파일명이 주소 |
| `src/content.config.ts` | frontmatter 스키마 (필수값 누락 시 빌드 에러) |
| `src/styles/global.css` | 디자인 토큰(색·폰트·브레이크포인트), 타이포 8종(`t-display` … `t-label`), 본문 `.prose` |
| `src/lib/posts.ts` | 글 조회(발행일 내림차순)·카테고리 목록·URL·날짜 형식 — 페이지는 이것만 쓴다 |
| `src/lib/pagination.ts` | 페이지 번호 생략 규칙 (+ `pagination.test.ts`) |
| `src/lib/seo.ts` | Article·FAQPage JSON-LD |
| `src/lib/og.ts` | 공유 이미지 렌더링 |
| `src/lib/ads.ts` | AdSense 마크업, 본문 중간 광고 플러그인 |
| `src/layouts/Base.astro` | 모든 페이지 뼈대 (head + 헤더 + main + 푸터) |
| `src/layouts/Post.astro` | 글 상세 (요약 → 본문 → FAQ → 오류 제보 → 태그 → 이전/다음 → 관련 글) |
| `src/layouts/Archive.astro` | 카테고리·태그 목록 |
| `src/components/layout/` | `BaseHead`(메타·OG·폰트·스크립트), `Header`(메뉴·검색 토글), `Footer` |
| `src/components/list/` | `PostList`, `Pagination` |
| `src/components/post/` | `PostHeader`, `Faq`, `PostFooter` |
| `src/components/` | `Logo`(로고 이미지), `Icon` |
| `src/pages/` | 홈(`[...page]`), 글, 카테고리, 태그, 검색, 소개, 개인정보처리방침, 404, RSS, `llms.txt`, 글별 OG 이미지(`og/[slug].png`) |
| `public/robots.txt` | AI 크롤러 선별 차단 규칙 (학습용 차단 / 온디맨드 허용) |
| `docs/design/` | 디자인 시안 원본 + UI 명세서 v2 (구현 기준) |
| `docs/설계서.md` | 초기 설계 스펙 (라우트·스키마·SEO/GEO/AEO) |
| `.agents/product-marketing.md` | 블로그 방향·독자·말투·다루지 않는 주제 (마케팅 스킬이 읽는 기준 문서) |
| `.agents/topic-backlog.md` | 다음에 쓸 주제 목록 (발행 목표일·분야·검색어·상태). 글을 발행하면 상태를 갱신 |
| `.agents/skills/write-post/SKILL.md` | 글 작성·갱신·발행 절차. 글을 쓰는 에이전트는 반드시 따른다 (`AGENTS.md`에 안내) |

## 역할 분담 (2026-10-27 변경)

- 개발 (코드·디자인 적용·설정): Claude가 담당. 개발 변경의 푸시는 소유자 경로로 별도 해결 (Muse의 PAT 공유 불가).
- 글쓰기 에이전트용 기반·도구 (`.agents/product-marketing.md`, `.agents/skills/write-post/`, `AGENTS.md` 안내): Claude가 이 저장소에서 구축·관리 (2026-10-28 추가).
- 글 발행 (주제 받으면 글 작성·푸시·배포): Muse가 담당 (별도 PAT 보유). 글쓰기 에이전트는 바뀔 수 있으며, 어떤 에이전트든 `AGENTS.md` → write-post 스킬 순서로 읽고 따른다. Muse 지시문에 "작업 전 `AGENTS.md`를 읽을 것"을 넣어 둔다.
- 마케팅 스킬 17개(coreyhaines31/marketingskills)는 소유자 맥의 `.claude/skills/`에만 설치돼 있다 (git 제외). 다른 환경에서 필요하면 `npx skills add coreyhaines31/marketingskills --skill <이름> -a <에이전트>`로 설치. write-post 스킬은 AI 말버릇 제거에 그중 copy-editing을 쓴다.
- humanize-korean 스킬(epoko77-ai/im-not-ai, 커밋 고정)도 write-post 8번에서 쓴다. git에는 올라가지 않으므로 새 환경에서는 `bash .agents/setup-humanize-korean.sh claude`(Codex면 `codex`)로 프로젝트 안에 설치한다. 작업 폴더 `_workspace/`는 git 제외.
- 소유자 직접 처리: Cloudflare 대시보드 조작, 도메인·이메일 설정, 각종 값 제공.

## 배포

- main 푸시 → Cloudflare Pages가 `npm run build` 후 `dist`를 배포. 다른 브랜치 푸시는 미리보기 배포 (`<브랜치>.aljja-blog.pages.dev`).
- 없는 주소는 Pages가 `dist/404.html`을 404 상태로 응답한다 (404.html이 없으면 홈으로 폴백되던 것이 v1의 SPA 폴백 원인).
- 배포 상태는 대시보드 Workers & Pages → aljja-blog → Deployments에서 확인.

## 소유자가 제공해야 하는 것

1. AI 방어 HTML 문구 + 카나리아 문자열 (careit.kr 패키지에서 가져옴)
2. Cloudflare Web Analytics 토큰
3. 나중에: AdSense 클라이언트·슬롯 ID, Search Console·서치어드바이저 소유 확인

## 결정 로그

- 호스팅은 Cloudflare로 확정 (미리보기 배포·헤더 제어). GitHub 연동 Cloudflare Pages (2026-10-27 미리보기 빌드 check 이름으로 확인)
- 도메인은 aljjatip.com으로 확정 (.kr은 Cloudflare Registrar 미지원, 하이픈 도메인은 스팸 연상 때문에 제외)
- 서버·DB·인증·관리자 화면 전부 제외 (정적 사이트로 충분)
- 글은 마크다운으로 관리, Git이 원본
- 2026-10-27: UI 명세서 v2 적용. 목차·Giscus 댓글 제거, privacy@는 사이트에 노출하지 않음
- 2026-10-27: llms.txt는 `scripts/` 대신 Astro 엔드포인트(`src/pages/llms.txt.ts`)로 생성 (글 스키마를 그대로 사용)
- 2026-10-27: 404 페이지 추가로 SPA 폴백 해소. wrangler 설정 파일은 두지 않는다 (Pages 대시보드 관리)
- 2026-10-28: 블로그 기준 문서·글쓰기 스킬 도입. 다루지 않는 주제(법률 해석·건강/의료·투자 권유·중국 관련), 웹 리서치 필수, 출처 표기, 체험담·AI 작성 언급 금지는 `.agents/product-marketing.md`와 write-post 스킬에 기록
- 2026-10-28: 분야를 `돈 계산기`·`행정 서류`에서 7개로 교체. 예전 분야 주소(`/category/돈 계산기/` 등)는 리다이렉트 없이 404 (Search Console 등록 전이라 색인됐을 가능성이 낮음)
- 2026-10-28: 쿠팡 파트너스 링크는 마크다운 안에 HTML `<a rel="sponsored nofollow">`로 쓴다 (Sätteri가 raw HTML을 그대로 출력하는 것 확인)
