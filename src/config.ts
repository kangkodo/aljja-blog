// 사이트 설정은 전부 여기에 둔다. 빈 문자열인 값은 "미설정"이며, 해당 기능은 렌더링되지 않는다.

export const SITE = {
  name: '알짜',
  url: 'https://aljjatip.com',
  description: '알아두면 쓸모있는 정보',
  tagline: '알아두면 쓸모있는 정보',
  author: 'DY',
};

// 사이트에 노출하는 메일 주소. privacy@는 외부 제출용이라 여기에 넣지 않는다 (UI 명세 7장).
export const CONTACT = {
  contact: 'contact@aljjatip.com', // 소개 페이지 문의
  support: 'support@aljjatip.com', // 글 상세 오류 제보
};

// 헤더 카테고리 메뉴 순서. 글에 있는 카테고리 중 여기 없는 것은 뒤에 가나다순으로 붙는다.
export const CATEGORY_ORDER = ['세금', '일자리', '혜택', '쇼핑', '살림', '교통', '행정'];

export const PAGE_SIZE = 10;

// AdSense: 승인 전에는 enabled=false. 꺼져 있으면 광고 마크업·스크립트를 출력하지 않는다.
// 켜면 개인정보처리방침 내용이 바뀌므로, 7일 전에 src/pages/privacy.astro의 변경 공지·EFFECTIVE_DATE부터 고친다.
export const ADS = {
  enabled: false,
  client: '', // ca-pub-XXXXXXXXXXXXXXXX
  slots: {
    inArticle: '', // 본문 중간 (두 번째 h2 앞)
    rail: '', // 데스크톱 사이드 레일 160×600, 화면 폭 1200px 이상
  },
};

// Cloudflare Web Analytics 토큰. 넣으면 개인정보처리방침에 방문 통계 항목이 생기므로 privacy.astro의 EFFECTIVE_DATE·변경 이력도 함께 고친다.
export const CF_ANALYTICS_TOKEN = '';

// AI 카피 방어 문구 / 카나리아 문자열: careit.kr 패키지에서 가져올 것
export const AI_DEFENSE_HTML = '';
export const CANARY_STRING = '';
