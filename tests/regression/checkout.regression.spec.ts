import { test, expect } from '../../utils/test-fixtures';

test.describe('Checkout Regression Tests', () => {
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

  test('TC-096 | Checkout entry button is available', async ({ basketPage }) => {
    await basketPage.verifyCheckoutEntryAvailable();
  });

 test('TC-097 | User can proceed towards checkout/payment step', async ({ basketPage }) => {
  await basketPage.verifyCheckoutEntryAvailable();
  await basketPage.checkoutButton.click();

  await basketPage.verifyCheckoutFormVisible();
});

});