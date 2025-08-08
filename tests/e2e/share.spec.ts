import { test, expect } from '@playwright/test';

test('Share link preserves algorithm and speed across reload', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('select[aria-label="알고리즘 선택"]', 'sorting/bubble');

  // 속도 슬라이더 값을 2.00x로 변경
  const slider = page.getByLabel('속도');
  await slider.focus();
  // range 입력 변경 (value 설정 스크립트 실행 + input 이벤트 발행)
  await page.evaluate(() => {
    const el = document.getElementById('speed') as HTMLInputElement | null;
    if (el) {
      el.value = '2';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // URL의 s 파라미터가 존재하는지 확인
  const url = new URL(page.url());
  expect(url.searchParams.has('s')).toBe(true);
  expect(url.searchParams.get('algo')).toBe('sorting/bubble');

  // 새로고침 후에도 동일한 알고리즘/속도 유지 확인
  await page.reload();
  const selected = await page.$eval('select[aria-label="알고리즘 선택"]', (el: any) => el.value);
  expect(selected).toBe('sorting/bubble');

  // 속도 표시 텍스트에서 "2.00x" 확인
  await expect(page.getByText('2.00x')).toBeVisible();
});
