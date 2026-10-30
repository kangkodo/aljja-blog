// 홈 페이지 번호 생략 규칙 (UI 명세 5.1.1). 0은 생략 기호(…)를 뜻한다.
// 데스크톱 최대 7칸, 모바일 최대 6칸.
export function pageItems(cur: number, total: number, mobile = false): number[] {
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (total <= (mobile ? 5 : 7)) return range(1, total);
  const edge = mobile ? 4 : 5; // 앞쪽·뒤쪽일 때 이어서 보여 줄 번호 수
  if (cur <= edge - 1) return [...range(1, edge), 0, total];
  if (cur >= total - (edge - 2)) return [1, 0, ...range(total - edge + 1, total)];
  return mobile ? [1, 0, cur, 0, total] : [1, 0, cur - 1, cur, cur + 1, 0, total];
}

export const pageHref = (n: number, base = '/') => (n === 1 ? base : `${base}${n}/`);
