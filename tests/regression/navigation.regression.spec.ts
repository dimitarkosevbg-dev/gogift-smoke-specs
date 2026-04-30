import { test, expect } from '../../utils/test-fixtures';

test.beforeEach(async ({ homePage, cookieBanner }) => {
  await homePage.open();
  await cookieBanner.acceptAllCookies();
});

test(' @regression TC-013 | Main navigation items are visible', async ({ homePage }) => {
  await homePage.verifyMainNavigationVisible();
});

test(' @regression TC-015 | See all gifts navigation is visible', async ({ page }) => {
  await expect(page.getByText('See all gifts', { exact: true })).toBeVisible();
});

test(' @regression TC-019 | Redeem gift card navigation works', async ({ header, page }) => {
  await header.openRedeemGiftCardPage();

  await expect(page).toHaveURL(/redeem/);
});

test(' @regression TC-020 | Business button is visible', async ({ header }) => {
  await header.verifyBusinessLinkVisible();
});

test(' @regression TC-021 | Cart/Basket button is visible', async ({ page }) => {
  await expect(page.getByRole('link', { name: /basket|cart/i })).toBeVisible();
});