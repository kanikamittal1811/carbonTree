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

  test('should support sticky navigation and scroll spy active tab highlighting on About page', async ({ page }) => {
    // 1. Navigate to About
    const footerAboutLink = page.locator('footer').getByRole('link', { name: 'About' });
    await footerAboutLink.click();

    // 2. Locate sticky tab navigator buttons
    const pillarsTab = page.locator('.about-nav-tabs').getByRole('button', { name: 'Core Pillars' });
    const scienceTab = page.locator('.about-nav-tabs').getByRole('button', { name: 'The Science' });
    const pledgeTab = page.locator('.about-nav-tabs').getByRole('button', { name: 'Climate Pledge' });

    await expect(pillarsTab).toBeVisible();
    await expect(scienceTab).toBeVisible();
    await expect(pledgeTab).toBeVisible();

    // 3. By default, "Core Pillars" should be active
    await expect(pillarsTab).toHaveClass(/active/);

    // 4. Click "The Science" and verify it scroll-navigates and highlights
    await scienceTab.click();
    await page.waitForTimeout(600);
    await expect(scienceTab).toHaveClass(/active/);
    await expect(pillarsTab).not.toHaveClass(/active/);

    // 5. Scroll manually to "Climate Pledge" and check scroll spy highlight
    const pledgeSection = page.locator('#pledge');
    await pledgeSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(pledgeTab).toHaveClass(/active/);
    await expect(scienceTab).not.toHaveClass(/active/);
  });

  test('should support Resources page scroll spy active tab highlighting', async ({ page }) => {
    // 1. Navigate to Resources (Methodology) from footer
    const footerMethodologyLink = page.locator('footer').getByRole('link', { name: 'Methodology' });
    await expect(footerMethodologyLink).toBeVisible();
    await footerMethodologyLink.click();

    // 2. Check tab navigator buttons
    const methodologyTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Methodology' });
    const blogTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Climate Blog' });
    const offsetTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Offset Guide' });

    await expect(methodologyTab).toBeVisible();
    await expect(blogTab).toBeVisible();
    await expect(offsetTab).toBeVisible();

    // 3. By default, Methodology is highlighted
    await expect(methodologyTab).toHaveClass(/active/);

    // 4. Scroll to Climate Blog and check scroll spy updates
    const blogSection = page.locator('#blog');
    await blogSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(blogTab).toHaveClass(/active/);
    await expect(methodologyTab).not.toHaveClass(/active/);

    // 5. Scroll to Offset Guide and check scroll spy updates
    const offsetSection = page.locator('#offset');
    await offsetSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(offsetTab).toHaveClass(/active/);
    await expect(blogTab).not.toHaveClass(/active/);
  });
});
