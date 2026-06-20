import { test, expect } from '@playwright/test';

test.describe('Footer Share Button', () => {
  test('should copy URL to clipboard when share button is clicked', async ({ page, context }, testInfo) => {
    const browserName = testInfo.project.name;
    
    // Grant clipboard permissions for Chromium specifically
    if (browserName === 'chromium') {
      try {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      } catch (err) {
        console.warn('Could not grant clipboard permissions:', err);
      }
    }

    await page.goto('/');

    const shareBtn = page.locator('footer').getByRole('button', { name: 'Share website link' });
    await expect(shareBtn).toBeVisible();

    // Click the button
    await shareBtn.click();

    // Verify confirmation label and change in state
    const copiedLabel = page.locator('footer').locator('text=Link copied!');
    await expect(copiedLabel).toBeVisible();

    // Verify clipboard content matches the current URL (Chromium only)
    if (browserName === 'chromium') {
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(page.url());
    }
  });
});
