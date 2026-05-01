import { test, expect } from '../../utils/test-fixtures';

test.describe('@regression Navigation', () => { 
test.beforeEach(async ({ homePage, cookieBanner }) => {
  await homePage.open();
  await cookieBanner.acceptAllCookies();
});

test(' TC-013 | Main navigation items are visible', async ({ homePage }) => {
  await homePage.verifyMainNavigationVisible();
});

test('TC-015 | See all gifts navigation is visible', async ({ page }) => {
  await expect(page.getByText('See all gifts', { exact: true })).toBeVisible();
});

test('TC-019 | Redeem gift card navigation works', async ({ header, page }) => {
  await header.openRedeemGiftCardPage();

  await expect(page).toHaveURL(/redeem/);
});

test(' TC-020 | Business button is visible', async ({ header }) => {
  await header.verifyBusinessLinkVisible();
});

test('TC-021 | Cart/Basket button is visible', async ({ page }) => {
  await expect(page.getByRole('link', { name: /basket|cart/i })).toBeVisible();

})


});