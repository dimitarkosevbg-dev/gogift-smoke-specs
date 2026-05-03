import { test } from '../../utils/test-fixtures';
import { SEARCH_TERMS, PRODUCTS, RECIPIENT } from '../../fixtures/testData';
import { futureDate } from '../../utils/test-date';

test.describe('@smoke', () => {
  test('Critical user flow up to checkout boundary', async ({
    homePage,
    productPage,
    basketPage,
    cookieBanner,
    header,
  }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();

    await header.verifyHeaderVisible();

    await header.search(SEARCH_TERMS.validBrandLowercase);
    await homePage.openSearchResult(PRODUCTS.zalandoDk.name);

    await productPage.verifyProductPageLoaded();
    await productPage.selectDeliveryDate(futureDate(7));
    await productPage.selectGiftCardValue(PRODUCTS.zalandoDk.defaultValue);
    await productPage.fillRecipientDetails(RECIPIENT.name, RECIPIENT.email);
    await productPage.clickAddToBasket();
    await productPage.goToBasket();

    await basketPage.verifyBasketLoaded();
    await basketPage.verifyProductIsVisible();
    await basketPage.acceptTerms();
  });
});
