import { test, expect } from '../../utils/test-fixtures';

test.beforeEach(async ({ homePage, cookieBanner }) => {
  await homePage.open();
  await cookieBanner.acceptAllCookies();
});

test(' @regression TC-001 | Homepage loads successfully', async ({ page }) => {
  await expect(page).toHaveURL(/shop\.gogift\.com/);
});

test(' @regression TC-003 | Header is visible', async ({ header }) => {
  await header.verifyHeaderVisible();
});

test(' @regression TC-008 | Main navigation is visible', async ({ homePage }) => {
  await homePage.verifyMainNavigationVisible();
});

test(' @regression TC-009 | Search input is available in header', async ({ page }) => {
  await expect(page.getByRole('searchbox', { name: /search products/i })).toBeVisible();
});

test(' @regression TC-010 | Homepage contains gift card content', async ({ page }) => {
  await expect(page.getByText(/gift card/i).first()).toBeVisible();
});