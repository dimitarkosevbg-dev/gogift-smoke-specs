import { test } from '../../utils/test-fixtures';
import { snapshotFullPage } from '../../utils/visual-helpers';

test.describe('@visual Checkout', () => {
  // Checkout flow goes through the entire purchase pipeline before
  // capturing — give it room to breathe.
  test.setTimeout(60_000);

  test.beforeEach(async ({ homePage, header, productPage, basketPage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
    await productPage.selectGiftCardValue('DKK 150');
    await productPage.fillRecipientDetails('Test User', 'test@example.com');
    await productPage.clickAddToBasket();
    await productPage.goToBasket();
    await basketPage.verifyBasketLoaded();
    await basketPage.acceptTerms();
  });

  test('VTC-050 | Checkout form snapshot', async ({ basketPage, page }) => {
    await basketPage.verifyCheckoutEntryAvailable();
    await basketPage.checkoutButton.click();
    await basketPage.verifyCheckoutFormVisible();
    await snapshotFullPage(page, 'checkout-form.png');
  });
});
