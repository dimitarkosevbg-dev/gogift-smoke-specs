import { test } from '../../utils/test-fixtures';
import { runLighthouse } from '../../utils/lighthouse-helpers';

test.describe('@performance @lighthouse Lighthouse audits', () => {
  // Lighthouse runs take 20-40s each
  test.setTimeout(90_000);

  test('PTC-100 | Lighthouse audit — Homepage', async ({ homePage, cookieBanner }, testInfo) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();

    await runLighthouse(homePage.page, testInfo, 'homepage');
  });

  test('PTC-101 | Lighthouse audit — Product page', async ({
    homePage,
    header,
    productPage,
    cookieBanner,
  }, testInfo) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
    await productPage.verifyProductPageLoaded();

    await runLighthouse(productPage.page, testInfo, 'product-page');
  });
});
