import { test } from '../../utils/test-fixtures';
import { PRODUCTS, RECIPIENT, SEARCH_TERMS } from '../../fixtures/testData';

test.describe('@regression Checkout Regression Tests', () => {
  test.beforeEach(async ({ homePage, header, productPage, basketPage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();

    await header.search(SEARCH_TERMS.validBrand);
    await homePage.openSearchResult(PRODUCTS.zalandoDk.name);

    await productPage.selectGiftCardValue(PRODUCTS.zalandoDk.defaultValue);
    await productPage.fillRecipientDetails(RECIPIENT.name, RECIPIENT.email);

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
