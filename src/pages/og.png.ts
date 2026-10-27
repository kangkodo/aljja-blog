// 사이트 기본 공유 이미지 (홈·카테고리·기타 페이지)
import { SITE } from '../config';
import { renderOg, pngResponse } from '../lib/og';

export const GET = async () => pngResponse(await renderOg({ title: SITE.tagline }));
