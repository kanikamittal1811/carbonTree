import { test, expect } from '@playwright/test';

test.describe('Climate Resources Hub E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resources');
  });

  test('should display the page title and initial sections', async ({ page }) => {
    // 1. Verify page heading and intro
    await expect(page.locator('.resources-hero h1')).toContainText('Climate Resources Hub');
    await expect(page.locator('.resources-hero p')).toContainText('Empowering your carbon-neutral journey');

    // 2. Verify all three sections exist in the DOM
    await expect(page.locator('#methodology')).toBeVisible();
    await expect(page.locator('#blog')).toBeVisible();
    await expect(page.locator('#offset')).toBeVisible();
  });

  test('should navigate between sections via tab buttons', async ({ page }) => {
    const methodologyTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Methodology' });
    const blogTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Climate Blog' });
    const offsetTab = page.locator('.resources-nav-tabs').getByRole('button', { name: 'Offset Guide' });

    // Click "Climate Blog" tab
    await blogTab.click();
    await page.waitForTimeout(600); // Allow smooth scroll to finish
    await expect(blogTab).toHaveClass(/active/);
    await expect(methodologyTab).not.toHaveClass(/active/);

    // Click "Offset Guide" tab
    await offsetTab.click();
    await page.waitForTimeout(600); // Allow smooth scroll to finish
    await expect(offsetTab).toHaveClass(/active/);
    await expect(blogTab).not.toHaveClass(/active/);

    // Click "Methodology" tab
    await methodologyTab.click();
    await page.waitForTimeout(600);
    await expect(methodologyTab).toHaveClass(/active/);
  });

  test('should open, read, and close a blog article modal', async ({ page }) => {
    // 1. Verify blog cards exist
    const blogCards = page.locator('.blog-card');
    await expect(blogCards).toHaveCount(3);

    // 2. Click the first blog card
    const firstBlogCard = blogCards.first();
    await expect(firstBlogCard).toBeVisible();
    await firstBlogCard.click();

    // 3. Verify the modal overlay is displayed
    const modal = page.locator('.blog-modal-overlay');
    await expect(modal).toBeVisible();

    // 4. Verify modal contains the correct article content
    await expect(modal.locator('.blog-modal-title')).toContainText('The Digital Phantom');
    await expect(modal.locator('.blog-modal-body')).toContainText('Every time we click "Buy Now" on our screens');

    // 5. Close the modal
    const closeBtn = modal.locator('.blog-modal-close');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // 6. Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should verify calculations and offset guide structures are rendered', async ({ page }) => {
    // Verify methodology cards are visible
    const methodologyCards = page.locator('.methodology-card');
    await expect(methodologyCards).toHaveCount(4);
    await expect(methodologyCards.nth(0)).toContainText('Residential Energy Calculations');

    // Verify offset cards are visible
    const offsetCards = page.locator('.offset-project-card');
    await expect(offsetCards).toHaveCount(4);
    await expect(offsetCards.nth(0)).toContainText('Reforestation');
  });
});
