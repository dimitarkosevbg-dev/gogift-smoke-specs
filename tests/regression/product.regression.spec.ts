import { test, expect } from '../../utils/test-fixtures';

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

test('TC-087 | Switching delivery method preserves selected delivery date', async ({ productPage }) => {
  const date = '2026-05-01T10:00';

  await productPage.selectDeliveryDate(date);

  await productPage.selectDeliveryMethod('Email');
  await productPage.selectDeliveryMethod('Sms');
  await productPage.selectDeliveryMethod('Physical');

  await productPage.verifySelectedDeliveryDate(date);
});
 
});