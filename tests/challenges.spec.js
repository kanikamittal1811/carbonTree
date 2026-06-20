import { test, expect } from '@playwright/test';

test.describe('Eco Challenges Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to challenges and explore available challenges in Guest Mode', async ({ page }) => {
    const challengesTabButton = page.getByRole('button', { name: 'Challenges' });
    await expect(challengesTabButton).toBeVisible();
    await challengesTabButton.click();

    await expect(page.locator('.challenges-main-title')).toContainText('Eco Action Weekly Challenges');
    await expect(page.locator('.challenges-subtitle-text')).toContainText('Kickstart your carbon reductions.');

    const guestCta = page.locator('.guest-cta-panel');
    await expect(guestCta).toBeVisible();
    await expect(guestCta.locator('h3')).toContainText('Subscribe to start tracking challenges!');
    await expect(guestCta.locator('.btn-guest-login')).toBeVisible();

    await guestCta.locator('.btn-guest-login').click();
    await expect(page.locator('.auth-card')).toBeVisible();
    await page.getByLabel('Close modal').click();
    await expect(page.locator('.auth-card')).not.toBeVisible();

    const availableHeader = page.locator('.section-title', { hasText: 'Available Weekly Challenges' });
    await expect(availableHeader).toBeVisible();

    const discoveryCards = page.locator('.discovery-card');
    await expect(discoveryCards.first()).toBeVisible();

    const previewBtn = discoveryCards.first().getByRole('button', { name: /7-Day Tasks/i });
    await expect(previewBtn).toBeVisible();
    await previewBtn.click();

    await expect(discoveryCards.first().locator('.expanded-days-list')).toBeVisible();
    await expect(discoveryCards.first().locator('.expanded-day-row')).toHaveCount(7);

    await previewBtn.click();
    await expect(discoveryCards.first().locator('.expanded-days-list')).not.toBeVisible();

    const refreshBtn = page.getByRole('button', { name: 'Refresh List' });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    await expect(discoveryCards.first()).toBeVisible();
  });
});
