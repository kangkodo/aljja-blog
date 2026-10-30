// 본문 표를 가로 스크롤 영역으로 감싼다. 폭이 좁은 화면에서 표가 페이지 전체를 밀어내지 않게 한다.
import { defineHastPlugin } from 'satteri';

export const tableScrollPlugin = () =>
  defineHastPlugin({
    name: 'table-scroll',
    element: {
      filter: ['table'],
      visit(node, ctx) {
        ctx.wrapNode(node, {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: '표, 좌우로 스크롤할 수 있습니다' },
          children: [],
        });
      },
    },
  });
