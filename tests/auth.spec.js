import { test, expect } from '@playwright/test';

test.describe('Authentication Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open, toggle views, validate inputs, and close correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Challenges' }).click();

    const guestCta = page.locator('.guest-cta-panel');
    await expect(guestCta).toBeVisible();
    await guestCta.locator('.btn-guest-login').click();

    const authCard = page.locator('.auth-card');
    await expect(authCard).toBeVisible();
    await expect(authCard.locator('.auth-title')).toContainText('Join CarbonTree');

    const googleBtn = authCard.locator('.btn-google-auth');
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toContainText('Continue with Google');

    const toggleEmailBtn = authCard.locator('.btn-toggle-email');
    await expect(toggleEmailBtn).toBeVisible();
    await toggleEmailBtn.click();

    const emailForm = authCard.locator('.auth-email-form');
    await expect(emailForm).toBeVisible();

    const emailInput = emailForm.locator('input[type="email"]');
    const passwordInput = emailForm.locator('input[type="password"]');
    const submitBtn = emailForm.locator('.btn-submit-email');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Sign In');

    const modeToggleBtn = emailForm.locator('.btn-mode-toggle');
    await expect(modeToggleBtn).toBeVisible();
    await expect(modeToggleBtn).toContainText('Sign Up');
    await modeToggleBtn.click();

    await expect(submitBtn).toContainText('Create Account');

    await modeToggleBtn.click();
    await expect(submitBtn).toContainText('Sign In');

    await emailInput.fill('test@example.com');
    await passwordInput.fill('123');
    await submitBtn.click();

    const errorBox = authCard.locator('.auth-error-box');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('Password must be at least 6 characters.');

    const cancelEmailBtn = emailForm.locator('.btn-hide-email');
    await cancelEmailBtn.click();
    await expect(emailForm).not.toBeVisible();

    const closeBtn = authCard.locator('.auth-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(authCard).not.toBeVisible();
  });
});
