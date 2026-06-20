import { test, expect } from '@playwright/test';

test.describe('About Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to About page via footer and interact with the elements', async ({ page }) => {
    // 1. Locate the About footer link and click it
    const footerAboutLink = page.locator('footer').getByRole('link', { name: 'About' });
    await expect(footerAboutLink).toBeVisible();
    await footerAboutLink.click();

    // 2. Verify About Page renders
    const headerTitle = page.locator('.about-hero h1');
    await expect(headerTitle).toContainText('About Carbon Tree');

    // 3. Verify pillars are rendered
    const pillarCards = page.locator('.pillar-card');
    await expect(pillarCards).toHaveCount(3);
    await expect(pillarCards.nth(0)).toContainText('Science-First Estimates');
    await expect(pillarCards.nth(1)).toContainText('Privacy-First Design');
    await expect(pillarCards.nth(2)).toContainText('Action-Oriented');

    // 4. Verify Science & Tree statistics
    const stats = page.locator('.stat-item');
    await expect(stats.nth(0)).toContainText('22 kg');
    await expect(stats.nth(0)).toContainText('CO₂ / Tree / Year');

    // 5. Interact with Pledge Options and verify pledge description updates
    const pledgeCard = page.locator('.about-pledge-card');
    await expect(pledgeCard).toBeVisible();

    const starterPledgeBtn = page.getByRole('button', { name: '🌱 Eco Starter (10%)' });
    const climateGuardPledgeBtn = page.getByRole('button', { name: '🌿 Climate Guard (25%)' });
    const netZeroPledgeBtn = page.getByRole('button', { name: '🌳 Net-Zero Hero (50%+)' });

    await expect(starterPledgeBtn).toBeVisible();
    await expect(climateGuardPledgeBtn).toBeVisible();
    await expect(netZeroPledgeBtn).toBeVisible();

    // Select Net-Zero Hero
    await netZeroPledgeBtn.click();
    await expect(pledgeCard).toContainText('Pledge to go Carbon Neutral');

    // Select Eco Starter
    await starterPledgeBtn.click();
    await expect(pledgeCard).toContainText('Pledge to reduce emissions by 10%');

    // 6. Click CTA button and ensure we return to the Calculator view
    const ctaBtn = page.getByRole('button', { name: 'Calculate Your Footprint Now' });
    await expect(ctaBtn).toBeVisible();
    await ctaBtn.click();

    // The calculator layout should now be visible
    await expect(page.locator('.intro-title')).toContainText('Carbon Footprint Calculator');
  });
});
