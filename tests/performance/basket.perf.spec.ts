import { test } from '../../utils/test-fixtures';
import { captureReport, assertWithinBudget } from '../../utils/performance-helpers';

test.describe('@performance Basket page', () => {
  // Same reasoning as visual basket spec — end-to-end pipeline needs headroom
  test.setTimeout(60_000);

  test('PTC-020 | Basket page Core Web Vitals + navigation timing', async ({
    homePage,
    header,
    productPage,
    basketPage,
    cookieBanner,
    page,
  }, testInfo) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
    await header.search('Zalando');
    await homePage.openSearchResult('Zalando DK Gift Card');
    await productPage.selectGiftCardValue('DKK 150');
    await productPage.fillRecipientDetails('Test User', 'test@example.com');
    await productPage.clickAddToBasket();
    await productPage.goToBasket();
    await basketPage.verifyBasketLoaded();

    const report = await captureReport(page, testInfo, 'basket-page');
    await assertWithinBudget(report);
  });
});
