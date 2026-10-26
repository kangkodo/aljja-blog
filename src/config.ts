export const SITE = {
  name: '알짜',
  url: 'https://aljjatip.com',
  description: '생활·돈·행정 — 알아두면 쓸모있는 정보',
  author: 'DY',
};

// Giscus 설정값: DY가 GitHub Discussions에서 발급받아 입력
// 비어 있으면 댓글 영역이 렌더링되지 않음
export const GISCUS = {
  repo: '',
  repoId: '',
  category: '',
  categoryId: '',
};

// Cloudflare Web Analytics 토큰: 비어 있으면 비콘을 삽입하지 않음
export const CF_ANALYTICS_TOKEN = '';

// AI 카피 방어 문구: 발주자가 별도 제공 (careit.kr 패키지에서 가져올 것)
// 비어 있으면 숨김 div를 렌더링하지 않음
export const AI_DEFENSE_HTML = '';

// 카나리아 문자열 (무단 복제 탐지용): 발주자가 별도 제공
export const CANARY_STRING = '';
