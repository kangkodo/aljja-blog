// AdSense 마크업. ADS.enabled가 꺼져 있거나 슬롯 ID가 없으면 아무것도 만들지 않는다.
// 본문 중간 광고는 마크다운 렌더링 단계에서 플러그인으로 넣는다 (astro.config.mjs).
import { defineHastPlugin } from 'satteri';
import { ADS } from '../config';

export type AdSlotName = keyof typeof ADS.slots;

export const adsOn = (slot?: AdSlotName) => ADS.enabled && !!ADS.client && (!slot || !!ADS.slots[slot]);

const INS_STYLE: Record<AdSlotName, string> = {
  inArticle: 'display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid',
  rail: 'display:inline-block;width:160px;height:600px',
};

export function adHtml(slot: AdSlotName): string {
  if (!adsOn(slot)) return '';
  return (
    '<p class="mb-1.5 t-label text-muted">광고</p>' +
    `<ins class="adsbygoogle" style="${INS_STYLE[slot]}" data-ad-client="${ADS.client}" data-ad-slot="${ADS.slots[slot]}"></ins>` +
    '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
  );
}

/** 두 번째 h2 앞에 본문 중간 광고를 넣는 Sätteri hast 플러그인. 광고가 꺼져 있으면 파이프라인에서 빠진다. */
export const inArticleAdPlugin = () => {
  const html = adHtml('inArticle');
  if (!html) return null;
  let h2Count = 0; // 팩토리는 문서마다 한 번 호출된다
  return defineHastPlugin({
    name: 'in-article-ad',
    element: {
      filter: ['h2'],
      visit(node, ctx) {
        if (ctx.parent(node).type !== 'root' || ++h2Count !== 2) return;
        ctx.insertBefore(node, { type: 'raw', value: `<aside aria-label="광고" class="my-10">${html}</aside>` });
      },
    },
  });
};
