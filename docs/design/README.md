# 알짜 블로그 디자인 시안 (참고용 원본)

- `artboards/*.dc.html` : 디자인 캔버스의 각 화면 원본. 스타일이 인라인으로 적혀 있어 색·크기·간격의 정확한 값을 여기서 읽으면 된다.
  - 이 파일들은 캔버스 전용 런타임(`support.js`, `<x-dc>`, `{{ }}` 템플릿)용이라 브라우저에서 그대로 열면 깨진다. **실행용이 아니라 값 참고용**이다.
  - 그대로 복사하지 말고 Astro 컴포넌트 + CSS 변수로 다시 구현한다.
- `canvas.json` : 화면 목록과 크기.
- `알짜블로그-UI-명세서-v2.md` : 구현 기준 문서. 시안과 명세가 다르면 명세서를 따른다.

| 파일 | 화면 |
|---|---|
| Main / MobileHome | 홈 |
| Post / MobilePost | 글 상세 |
| Category / MobileCategory | 카테고리·태그 |
| Search / MobileSearch | 검색 |
| About / MobileAbout | 소개 |
| Privacy | 개인정보처리방침 |
| NotFound | 404 |
| OgImage | 공유 이미지 템플릿 |
