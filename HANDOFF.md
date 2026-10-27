# HANDOFF — '알짜' 블로그 인수인계 문서

> 이 문서는 이 프로젝트를 다른 개발 에이전트(Claude 등)에게 넘길 때
> 기억 없이도 이어서 작업할 수 있게 만든 것이다.
> 결정 사항은 전부 파일에 기록한다. 에이전트 개인의 기억에 의존하지 않는다.

## 프로젝트 개요

- **이름**: 알짜
- **도메인**: https://aljjatip.com (Cloudflare Registrar에서 구매 완료)
- **목적**: 생활·돈·행정 분야 롱테일 질문형 검색 유입 정보 블로그
- **수익 모델**: Google AdSense (글 20~30개 쌓인 뒤 승인 신청)

## 현재 상태 (2026-10-27 기준)

- [x] UI 명세서 v2(`docs/design/알짜블로그-UI-명세서-v2.md`) 적용: 새 헤더·검색 토글·페이지 번호·푸터, 개인정보처리방침·404, OG 이미지
- [x] 명세서 맨 앞 "개발 필수 체크리스트" 6개 항목 확인 완료
- [x] GitHub 저장소 + Cloudflare Workers 자동 배포 연결 (소유자가 대시보드에서 설정)
- [ ] 개인정보처리방침 `[ ]` 항목 채우기 + 법률 검토 (`src/pages/privacy.astro`)
- [ ] AI 카피 방어 문구·카나리아 문자열 입력 — 소유자가 careit.kr 패키지에서 제공
- [ ] Cloudflare Web Analytics 토큰 입력
- [ ] AdSense 승인 후 `ADS` 설정 입력 + `public/ads.txt` 추가
- [ ] 로고 이미지 받으면 교체 (`Logo.astro`, `src/lib/og.ts`, `public/favicon.svg`)

## 기술 스택

- Astro 7 (SSG), Tailwind CSS v4, 마크다운은 Astro 기본 Sätteri 처리기
- 호스팅: Cloudflare Workers 정적 에셋 (서버 없음, DB 없음, 인증 없음). 설정은 `wrangler.jsonc`
- 사이트 내 검색: Pagefind (빌드 시 정적 인덱스, 글 상세만 색인)
- 공유 이미지: satori + @resvg/resvg-js로 빌드 시 글마다 PNG 생성 (폰트: `src/assets/fonts/`)
- 분석: Cloudflare Web Analytics (토큰 설정 시에만 비콘 삽입)
- 댓글: 없음 (v2에서 Giscus 제거)

## 명령어

Node 22.23.4 이상 필요 (Astro 요구사항).

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
| `src/components/` | `Logo`(임시 로고), `Icon` |
| `src/pages/` | 홈(`[...page]`), 글, 카테고리, 태그, 검색, 소개, 개인정보처리방침, 404, RSS, `llms.txt`, OG 이미지(`og.png`, `og/[slug].png`) |
| `public/robots.txt` | AI 크롤러 선별 차단 규칙 (학습용 차단 / 온디맨드 허용) |
| `wrangler.jsonc` | Workers 배포 설정 (없는 주소 → `404.html`) |
| `docs/design/` | 디자인 시안 원본 + UI 명세서 v2 (구현 기준) |
| `docs/설계서.md` | 초기 설계 스펙 (라우트·스키마·SEO/GEO/AEO) |

## 역할 분담 (2026-10-27 변경)

- 개발 (코드·디자인 적용·설정): Claude가 담당. 개발 변경의 푸시는 소유자 경로로 별도 해결 (Muse의 PAT 공유 불가).
- 글 발행 (주제 받으면 글 작성·푸시·배포): Muse가 담당 (별도 PAT 보유).
- 소유자 직접 처리: Cloudflare 대시보드 조작, 도메인·이메일 설정, 각종 값 제공.

## 배포

- main 푸시 → Cloudflare Workers Builds가 `npm run build` 후 `npx wrangler deploy` 실행.
- `wrangler.jsonc`의 `name`은 대시보드 프로젝트명 `aljja-blog`와 같아야 한다.
- 배포 상태는 대시보드 Workers & Pages → aljja-blog → Deployments에서 확인.

## 소유자가 제공해야 하는 것

1. AI 방어 HTML 문구 + 카나리아 문자열 (careit.kr 패키지에서 가져옴)
2. Cloudflare Web Analytics 토큰
3. 개인정보처리방침 빈칸 값 (시행일, 보유 기간, 분석 도구, 위탁, 책임자·연락처)
4. 나중에: AdSense 클라이언트·슬롯 ID, Search Console·서치어드바이저 소유 확인

## 결정 로그

- 호스팅은 Cloudflare로 확정 (미리보기 배포·헤더 제어). 현재 Workers 정적 에셋 흐름
- 도메인은 aljjatip.com으로 확정 (.kr은 Cloudflare Registrar 미지원, 하이픈 도메인은 스팸 연상 때문에 제외)
- 서버·DB·인증·관리자 화면 전부 제외 (정적 사이트로 충분)
- 글은 마크다운으로 관리, Git이 원본
- 2026-10-27: UI 명세서 v2 적용. 목차·Giscus 댓글 제거, privacy@는 사이트에 노출하지 않음
- 2026-10-27: llms.txt는 `scripts/` 대신 Astro 엔드포인트(`src/pages/llms.txt.ts`)로 생성 (글 스키마를 그대로 사용)
- 2026-10-27: `wrangler.jsonc` 추가 — 대시보드 기본값의 SPA 폴백(없는 주소 → 홈) 대신 404 페이지 응답
