import { test } from '../../utils/test-fixtures';
import { captureReport, assertWithinBudget } from '../../utils/performance-helpers';

test.describe('@performance Product page', () => {
  test('PTC-010 | Product page Core Web Vitals + navigation timing', async ({
    homePage,
    header,
    productPage,
    cookieBanner,
    page,
  }, testInfo) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
    await productPage.verifyProductPageLoaded();

    const report = await captureReport(page, testInfo, 'product-page');
    await assertWithinBudget(report);
  });
});
