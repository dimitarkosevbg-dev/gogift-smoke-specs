import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { BasketPage } from '../../pages/BasketPage';
import { test, expect } from '@playwright/test';

test('Smoke: user can add Zalando gift card to basket and reach checkout entry', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const basketPage = new BasketPage(page);

  await homePage.open();
  await homePage.acceptCookies();
  await homePage.verifyHeaderVisible();
  await homePage.verifyMainNavigationVisible();

  await homePage.search('zalando');
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