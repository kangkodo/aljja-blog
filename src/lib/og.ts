// 공유 이미지 1200×630 (UI 명세 8.2). 빌드 시 satori(SVG) → resvg(PNG)로 생성한다.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../config';

const font = (file: string) => readFile(resolve('src/assets/fonts', file));
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700 }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([font('IBMPlexSansKR-Regular.ttf'), font('IBMPlexSansKR-Bold.ttf')]).then(([r, b]) => [
    { name: 'Plex', data: r, weight: 400 },
    { name: 'Plex', data: b, weight: 700 },
  ]));

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (style: Record<string, unknown>, children?: unknown): Node => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

export async function renderOg({ title, category }: { title: string; category?: string }) {
  const tree = h(
    // satori 루트는 기본이 content-box라 padding만큼 캔버스 밖으로 밀린다
    {
      boxSizing: 'border-box', width: 1200, height: 630, padding: '64px 72px', flexDirection: 'column', justifyContent: 'space-between',
      background: '#0b6e4f', color: '#ffffff', fontFamily: 'Plex',
    },
    [
      h({ alignItems: 'center', justifyContent: 'space-between' }, [
        h({ alignItems: 'center', gap: 14 }, [
          h({ width: 44, height: 44, borderRadius: 12, background: '#ffffff', color: '#0b6e4f', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }, '알'),
          h({ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }, SITE.name),
        ]),
        category ? h({ padding: '8px 18px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 700 }, category) : null,
      ]),
      h({ maxWidth: 1000, fontSize: 64, lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.03em', whiteSpace: 'pre-line', wordBreak: 'keep-all', lineClamp: 3 }, title),
      h({ alignItems: 'center', justifyContent: 'space-between', fontSize: 22, color: '#d6eadf' }, [
        h({}, new URL(SITE.url).host),
        h({}, `${SITE.kicker} — ${SITE.tagline}`),
      ]),
    ],
  );
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg).render().asPng();
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
