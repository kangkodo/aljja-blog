// npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageHref, pageItems } from './pagination.ts';

test('데스크톱 7칸', () => {
  assert.deepEqual(pageItems(1, 1), [1]);
  assert.deepEqual(pageItems(3, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(pageItems(4, 12), [1, 2, 3, 4, 5, 0, 12]);
  assert.deepEqual(pageItems(5, 12), [1, 0, 4, 5, 6, 0, 12]);
  assert.deepEqual(pageItems(9, 12), [1, 0, 8, 9, 10, 11, 12]);
});

test('모바일 6칸', () => {
  assert.deepEqual(pageItems(2, 5, true), [1, 2, 3, 4, 5]);
  assert.deepEqual(pageItems(3, 12, true), [1, 2, 3, 4, 0, 12]);
  assert.deepEqual(pageItems(6, 12, true), [1, 0, 6, 0, 12]);
  assert.deepEqual(pageItems(10, 12, true), [1, 0, 9, 10, 11, 12]);
});

test('페이지 주소', () => {
  assert.equal(pageHref(1), '/');
  assert.equal(pageHref(3), '/3/');
  assert.equal(pageHref(1, '/category/jobs/'), '/category/jobs/');
  assert.equal(pageHref(3, '/category/jobs/'), '/category/jobs/3/');
});
