import { test, expect } from '@playwright/test';

test('BFS enqueues nodes (Enq metric increases)', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('select[aria-label="알고리즘 선택"]', 'graph/bfs');

  // 끝까지 실행
  await page.getByRole('button', { name: '끝으로 (End)' }).click();

  // Enq 카드의 수치가 0보다 큰지 확인
  const enqText = await page.locator('text=Enq').locator('..').locator('div.text-lg').innerText();
  const enq = Number(enqText.trim());
  expect(Number.isFinite(enq) && enq > 0).toBe(true);
});
