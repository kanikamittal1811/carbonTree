import { test, expect } from '@playwright/test';

test.describe('Carbon Footprint Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should walk through the questionnaire and view results in local mode', async ({ page }) => {
    await expect(page.locator('.intro-title')).toContainText('Carbon Footprint Calculator');
    const startButton = page.getByRole('button', { name: 'Start Assessment' });
    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(page.locator('.wizard-question-title')).toContainText('What type of home do you live in?');
    const singleFamilyCard = page.getByRole('button', { name: 'Single-Family House' });
    await singleFamilyCard.click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How many people live in your household?');
    await page.getByRole('button', { name: 'Living Alone' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How intense is your heating & cooling usage?');
    await page.getByRole('button', { name: 'Comfort / Continuous' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('Do you use green energy in your home?');
    const toggleCheckbox = page.getByRole('checkbox', { name: 'We use solar power / 100% green energy tariffs' });
    await expect(toggleCheckbox).toBeVisible();
    await toggleCheckbox.click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How do you usually commute or travel locally?');
    await page.getByRole('button', { name: 'Petrol / Diesel Car' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How much time do you spend commuting weekly?');
    await page.getByRole('button', { name: 'Heavy Commuter' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How often do you take flights?');
    await page.getByRole('button', { name: 'Long-Haul International Flights' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('Which of these best describes your eating habits?');
    await page.getByRole('button', { name: 'Vegetarian' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('How would you describe your food sourcing and waste habits?');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('What are your retail and shopping habits?');
    await page.getByRole('button', { name: 'Minimalist / Second-Hand' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.wizard-question-title')).toContainText('What are your recycling and sorting habits?');
    await page.getByRole('button', { name: 'Recycle Everything' }).click();

    const analyzeButton = page.getByRole('button', { name: 'Analyze Impact' });
    await expect(analyzeButton).toBeVisible();
    await analyzeButton.click();

    await expect(page.locator('.results-container')).toBeVisible();
    await expect(page.locator('.tree-cut-number')).toBeVisible();
    await expect(page.locator('.co2-total-badge')).toBeVisible();
    await expect(page.locator('.breakdown-card')).toBeVisible();
    await expect(page.locator('.forest-card')).toBeVisible();

    const startFreshButton = page.getByRole('button', { name: 'Start Fresh' });
    await expect(startFreshButton).toBeVisible();
    await startFreshButton.click();

    await expect(page.locator('.intro-title')).toContainText('Carbon Footprint Calculator');
  });

  test('should allow navigating back and forth within the wizard', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Assessment' }).click();
    await expect(page.locator('.wizard-question-title')).toContainText('What type of home do you live in?');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.wizard-question-title')).toContainText('How many people live in your household?');

    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.locator('.wizard-question-title')).toContainText('What type of home do you live in?');

    await page.getByLabel('Close Assessment').click();
    await expect(page.locator('.intro-title')).toContainText('Carbon Footprint Calculator');
  });
});
