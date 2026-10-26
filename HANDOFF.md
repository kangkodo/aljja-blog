# HANDOFF — '알짜' 블로그 인수인계 문서

> 이 문서는 이 프로젝트를 다른 개발 에이전트(Claude 등)에게 넘길 때
> Muse의 기억 없이도 이어서 작업할 수 있게 만든 것이다.
> 결정 사항은 전부 파일에 기록한다. 에이전트 개인의 기억에 의존하지 않는다.

## 프로젝트 개요

- **이름**: 알짜
- **도메인**: https://aljjatip.com (Cloudflare Registrar에서 구매 완료)
- **목적**: 생활·돈·행정 분야 롱테일 질문형 검색 유입 정보 블로그
- **수익 모델**: Google AdSense (글 20~30개 쌓인 뒤 승인 신청)

## 현재 상태 (2026-10-26 기준)

- [x] Astro 스캐폴딩 및 설계서대로 구현 완료
- [x] 빌드 검증 통과 (20페이지: 홈, 글 3개, 카테고리·태그·소개·검색 페이지)
- [x] sitemap, robots.txt, llms.txt 자동생성, RSS, Article+FAQPage JSON-LD, Pagefind 검색
- [x] 도메인 구매 완료 (aljjatip.com, Cloudflare)
- [ ] GitHub 푸시 — 소유자의 저장소 + PAT 전달 필요
- [ ] Cloudflare Pages 배포 + 커스텀 도메인 연결 — 소유자의 API 토큰 + Account ID 전달 필요
- [ ] Giscus 댓글 설정값 입력 — Discussions 활성화 후 repoId/categoryId 필요
- [ ] AI 카피 방어 문구·카나리아 문자열 입력 — 소유자가 careit.kr 패키지에서 제공

## 기술 스택

- Astro 7 (SSG, `output: 'static'`), Tailwind CSS v4
- 호스팅: Cloudflare Pages (서버 없음, DB 없음, 인증 없음)
- 댓글: Giscus (GitHub Discussions 기반)
- 사이트 내 검색: Pagefind (빌드 시 정적 인덱스)
- 분석: Cloudflare Web Analytics (토큰 설정 시에만 비콘 삽입)

## 명령어

```bash
npm install
npm run dev      # 개발 서버
npm run build    # prebuild(llms.txt 생성) → astro build → postbuild(Pagefind 인덱싱)
npm run preview  # 빌드 결과 미리보기
```

## 파일 지도

| 경로 | 역할 |
|---|---|
| `src/config.ts` | 사이트명·도메인·Giscus·분석 토큰·AI 방어 문구 — **설정은 전부 여기** |
| `src/content/posts/*.md` | 글 (마크다운 + frontmatter) |
| `src/content.config.ts` | frontmatter 스키마 (zod 검증, 필수값 누락 시 빌드 에러) |
| `src/layouts/Base.astro` | 공통 헤드 (SEO 메타, OG, canonical, JSON-LD 슬롯) |
| `src/layouts/Post.astro` | 글 상세 렌더링 순서 (요약 → 목차 → 본문 → FAQ → 관련 글 → 댓글) |
| `src/pages/` | 홈(페이지네이션), 글 상세, 카테고리, 태그, 소개, 검색, RSS |
| `scripts/generate-llms.mjs` | 빌드 시 글 목록에서 `public/llms.txt` 자동 생성 |
| `public/robots.txt` | AI 크롤러 선별 차단 규칙 (학습용 차단 / 온디맨드 허용) |
| `docs/설계서.md` | 전체 설계 스펙 (라우트·스키마·SEO/GEO/AEO·인수 기준) |

## 배포 절차

### A안: GitHub 연동 (확정, 소유자가 대시보드에서 직접 진행 — API 토큰 사용 안 함)

1. GitHub에 `aljja-blog` 저장소 생성 (Public) + Discussions 활성화
2. 이 프로젝트를 푸시 (소유자의 Fine-grained PAT 사용, 저장소 1개로 범위 제한)
3. Cloudflare 대시보드 → Workers & Pages → Create application → Pages → Connect to Git → 저장소 선택
4. 빌드 설정: Framework preset Astro, 빌드 명령 `npm run build`, 출력 디렉토리 `dist`
5. Custom domain에 `aljjatip.com` 연결 (도메인이 이미 Cloudflare에 있어 DNS 자동 설정)

### B안: wrangler 직접 업로드 (대안, API 토큰 필요 — 현재 사용 안 함)

```bash
npx wrangler pages deploy dist --project-name aljja-blog
```

## 소유자가 제공해야 하는 것

1. GitHub 저장소 + Fine-grained PAT (Contents 읽기/쓰기, 해당 저장소만)
2. Cloudflare 대시보드 직접 조작 (Pages 생성·GitHub 연결·커스텀 도메인) — API 토큰 사용 안 함 (2026-10-26 DY 결정)
3. Giscus repoId/categoryId (giscus.app에서 발급)
4. AI 방어 HTML 문구 + 카나리아 문자열 (careit.kr 패키지에서 가져옴)
5. 나중에: Pages-GitHub 자동 배포 연결 시 OAuth 클릭 1번, Search Console·서치어드바이저 소유 확인

## 결정 로그

- 호스팅은 Cloudflare Pages로 확정 (GitHub Pages도 가능하나 미리보기 배포·헤더 제어 때문에 Cloudflare 선택)
- 도메인은 aljjatip.com으로 확정 (.kr은 Cloudflare Registrar 미지원, 하이픈 도메인은 스팸 연상 때문에 제외)
- 서버·DB·인증·관리자 화면 전부 제외 (정적 사이트로 충분)
- 글은 마크다운으로 관리, Git이 원본 (로컬 위치는 각자 clone 위치로 정함)
