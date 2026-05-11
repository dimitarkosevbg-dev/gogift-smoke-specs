import { test } from '../../utils/test-fixtures';
import { snapshotFullPage, stabilizeForSnapshot } from '../../utils/visual-helpers';

test.describe('@visual Basket page', () => {
  // Basket flow includes search → product → fill recipient → add to basket → navigate.
  // The default 30s isn't enough headroom for an end-to-end visual test like this,
  // particularly on slower networks. Give it 60s — still fast, but won't false-fail.
  test.setTimeout(60_000);

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

  test('VTC-040 | Basket page snapshot — item added', async ({ page }) => {
    await snapshotFullPage(page, 'basket-with-item.png');
  });

  test('VTC-041 | Basket page snapshot — terms accepted', async ({ basketPage, page }) => {
    await basketPage.acceptTerms();
    await stabilizeForSnapshot(page);
    await snapshotFullPage(page, 'basket-terms-accepted.png');
  });
});
