import { test, expect } from '@playwright/test';

test('QuickSort sorts the array', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('select[aria-label="알고리즘 선택"]', 'sorting/quick');

  // 끝까지 실행
  await page.getByRole('button', { name: '끝으로 (End)' }).click();

  // BarArray 막대의 data-value를 읽어 정렬 여부 확인
  const values = await page.$$eval('svg g[role="img"] rect[data-value]', nodes =>
    nodes.map((n: Element) => Number((n as HTMLElement).getAttribute('data-value') || '0'))
  );

  // 배열이 오름차순인지 확인
  const sorted = values.every((v, i, a) => i === 0 || a[i - 1] <= v);
  expect(sorted).toBe(true);
});
