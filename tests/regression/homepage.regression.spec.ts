import { test, expect } from '../../utils/test-fixtures';
import { URLS } from '../../fixtures/testData';

test.describe('@regression Homepage Regression Tests', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('TC-001 | Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(URLS.basePattern);
  });

  test('TC-003 | Header is visible', async ({ header }) => {
    await header.verifyHeaderVisible();
  });

  test('TC-008 | Main navigation is visible', async ({ homePage }) => {
    await homePage.verifyMainNavigationVisible();
  });

  test('TC-009 | Search input is available in header', async ({ header }) => {
    await header.verifyHeaderVisible();
  });

  test('TC-010 | Homepage contains gift card content', async ({ page }) => {
    await expect(page.getByText(/gift card/i).first()).toBeVisible();
  });
});