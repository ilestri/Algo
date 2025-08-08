import { test, expect } from '@playwright/test';

test('App loads and shows metrics panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('지표')).toBeVisible();
});
