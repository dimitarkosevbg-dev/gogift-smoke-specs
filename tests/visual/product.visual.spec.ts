import { test } from '../../utils/test-fixtures';
import { snapshotFullPage, stabilizeForSnapshot } from '../../utils/visual-helpers';

test.describe('@visual Product page', () => {
  test.beforeEach(async ({ homePage, header, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
  });

  test('VTC-030 | Product page initial state snapshot', async ({ productPage, page }) => {
    await productPage.verifyProductPageLoaded();
    await snapshotFullPage(page, 'product-page-initial.png');
  });

  test('VTC-031 | Product page with value selected', async ({ productPage, page }) => {
    await productPage.selectGiftCardValue('DKK 150');
    await stabilizeForSnapshot(page);
    await snapshotFullPage(page, 'product-page-value-selected.png');
  });

  test('VTC-032 | Product page Email delivery fields snapshot', async ({ productPage, page }) => {
    await productPage.selectDeliveryMethod('Email');
    await productPage.verifyEmailDeliveryFieldsVisible();
    await snapshotFullPage(page, 'product-page-email-delivery.png');
  });

  test('VTC-033 | Product page SMS delivery fields snapshot', async ({ productPage, page }) => {
    await productPage.selectDeliveryMethod('Sms');
    await productPage.verifySmsDeliveryFieldsVisible();
    await snapshotFullPage(page, 'product-page-sms-delivery.png');
  });
});
