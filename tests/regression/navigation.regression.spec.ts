import { test, expect } from '../../utils/test-fixtures';

test.describe('@regression Navigation Regression Tests', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('TC-013 | Main navigation items are visible', async ({ homePage }) => {
    await homePage.verifyMainNavigationVisible();
  });

  test('TC-015 | See all gifts navigation is visible', async ({ homePage }) => {
    await homePage.verifySeeAllGiftsVisible();
  });

  test('TC-019 | Redeem gift card navigation works', async ({ header, page }) => {
    await header.openRedeemGiftCardPage();
    await expect(page).toHaveURL(/redeem/);
  });

  test('TC-020 | Business button is visible', async ({ header }) => {
    await header.verifyBusinessLinkVisible();
  });

  test('TC-021 | Cart/Basket button is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /basket|cart/i })).toBeVisible();
  });
});
