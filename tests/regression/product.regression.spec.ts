import { test, expect } from '../../utils/test-fixtures';
import { futureDate } from '../../utils/test-date';
import { PRODUCTS, RECIPIENT, SEARCH_TERMS } from '../../fixtures/testData';

test.describe('Product Page Regression Tests', () => {
  test.beforeEach(async ({ homePage, header, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();

    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
  });

  test('TC-084 | Product page loads correctly', async ({ productPage }) => {
    await productPage.verifyProductPageLoaded();
  });

  test('TC-085 | Gift card value can be selected', async ({ productPage }) => {
    await productPage.selectGiftCardValue('DKK 150');
  });
  test('TC-086 | Delivery method shows correct fields', async ({ productPage }) => {
    await productPage.selectDeliveryMethod('Email');
    await productPage.verifyEmailDeliveryFieldsVisible();

    await productPage.selectDeliveryMethod('Sms');
    await productPage.verifySmsDeliveryFieldsVisible();

    await productPage.selectDeliveryMethod('Physical');
    await productPage.verifyPostDeliveryFieldsVisible();
  });

  test('TC-087 | Add to Basket', async ({ productPage, basketPage }) => {
    await productPage.verifyProductPageLoaded();

    await productPage.selectDeliveryDate(futureDate(7));
    await productPage.selectGiftCardValue(PRODUCTS.zalandoDk.defaultValue);
    await productPage.fillRecipientDetails(RECIPIENT.name, RECIPIENT.email);

    await productPage.clickAddToBasket();
    await productPage.goToBasket();

    await basketPage.verifyBasketLoaded();
    await basketPage.verifyProductIsVisible();
  });
});
