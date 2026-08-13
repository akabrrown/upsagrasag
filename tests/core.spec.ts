import { test, expect } from '@playwright/test';

test.describe('Core Application Flows', () => {
  test('Homepage loads correctly with key elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check if the page title is correct (adjust based on actual title)
    await expect(page).toHaveTitle(/GRASAG/i);

    // Verify main navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Verify Hero section exists
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('Admin login page renders securely', async ({ page }) => {
    // Navigate to admin sign-in
    await page.goto('/signin');

    // Verify login form exists
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});
