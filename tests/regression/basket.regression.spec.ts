import { test, expect } from '../../utils/test-fixtures';
import { PRODUCTS, RECIPIENT, SEARCH_TERMS } from '../../fixtures/testData';

test.describe('@regression Basket Regression Tests', () => {
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
  });

  test('TC-089 | Basket page loads correctly', async ({ basketPage }) => {
    await basketPage.verifyBasketLoaded();
  });

  test('TC-090 | Product is visible in basket', async ({ basketPage }) => {
    await basketPage.verifyProductIsVisible();
  });

  test('TC-094 | Accepting terms enables checkout', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await expect(basketPage.checkoutButton).toBeVisible();
    await expect(basketPage.checkoutButton).toHaveText(/go to payment/i);
  });

  test('TC-095 | Checkout entry is available after accepting terms', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await basketPage.verifyCheckoutEntryAvailable();
  });
});
