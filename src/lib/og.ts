// 글별 공유 이미지 1200×630 (UI 명세 8.2). 빌드 시 satori(SVG) → resvg(PNG)로 생성한다.
// 사이트 기본 공유 이미지는 public/social/alzza-og-1200x630.jpg를 그대로 쓴다.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../config';

const font = (file: string) => readFile(resolve('src/assets/fonts', file));
type Assets = { fonts: { name: string; data: Buffer; weight: 400 | 700 }[]; logo: string };
let assets: Promise<Assets> | undefined;
const loadAssets = () =>
  (assets ??= Promise.all([
    font('IBMPlexSansKR-Regular.ttf'),
    font('IBMPlexSansKR-Bold.ttf'),
    readFile(resolve('public/brand/alzza-logo-480.png')),
  ]).then(([r, b, logo]) => ({
    fonts: [
      { name: 'Plex', data: r, weight: 400 },
      { name: 'Plex', data: b, weight: 700 },
    ],
    logo: `data:image/png;base64,${logo.toString('base64')}`,
  })));

type Node = { type: string; props: Record<string, unknown> };
const h = (style: Record<string, unknown>, children?: unknown): Node => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

export async function renderOg({ title, category }: { title: string; category?: string }) {
  const { fonts, logo } = await loadAssets();
  const tree = h(
    // satori 루트는 기본이 content-box라 padding만큼 캔버스 밖으로 밀린다
    {
      boxSizing: 'border-box', width: 1200, height: 630, padding: '64px 72px', flexDirection: 'column', justifyContent: 'space-between',
      background: '#ffffff', color: '#17201b', fontFamily: 'Plex',
    },
    [
      h({ alignItems: 'center', justifyContent: 'space-between' }, [
        // 로고 원본 비율 1280×536
        { type: 'img', props: { src: logo, width: 160, height: 67 } },
        category ? h({ padding: '8px 18px', borderRadius: 999, border: '2px solid #d5dbd7', fontSize: 22, fontWeight: 700, color: '#3c4741' }, category) : null,
      ]),
      h({ maxWidth: 1000, fontSize: 64, lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.03em', whiteSpace: 'pre-line', wordBreak: 'keep-all', lineClamp: 3 }, title),
      h({ alignItems: 'center', justifyContent: 'space-between', fontSize: 22, color: '#5b665f' }, [
        h({}, new URL(SITE.url).host),
        h({}, `${SITE.kicker} — ${SITE.tagline}`),
      ]),
    ],
  );
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
