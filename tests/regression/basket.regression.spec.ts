import { test, expect } from '../../utils/test-fixtures';

test.describe('@regression Basket Regression Tests', () => {
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
  });

  test('TC-089 | Basket page loads correctly', async ({ basketPage }) => {
    await basketPage.verifyBasketLoaded();
  });

  test('TC-090 | Product is visible in basket', async ({ basketPage }) => {
    await basketPage.verifyProductIsVisible();
  });

  test('TC-094 | Terms checkbox can be selected', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await expect(basketPage.termsCheckbox).toBeChecked();
  });

  test('TC-095 | Checkout entry is available after accepting terms', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await basketPage.verifyCheckoutEntryAvailable();
  });
});