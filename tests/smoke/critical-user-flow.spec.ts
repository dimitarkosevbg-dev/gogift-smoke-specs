import { test } from '../../utils/test-fixtures';

test('@smoke Critical user flow up to checkout boundary', async ({
  homePage,
  productPage,
  basketPage,
  cookieBanner,
  header,
}) => {
  await homePage.open();
  await cookieBanner.acceptAllCookies();

  await header.verifyHeaderVisible();

  await header.search('zalando');
  await homePage.openSearchResult('Zalando DK Gift Card');

  await productPage.verifyProductPageLoaded();
  await productPage.selectDeliveryDate('2026-05-01T10:00');
  await productPage.selectGiftCardValue('DKK 150');
  await productPage.fillRecipientDetails('Test User', 'test@example.com');
  await productPage.clickAddToBasket();
  await productPage.goToBasket();

  await basketPage.verifyBasketLoaded();
  await basketPage.verifyProductIsVisible();
  await basketPage.acceptTerms();
});