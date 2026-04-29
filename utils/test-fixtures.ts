import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { BasketPage } from '../pages/BasketPage';
import { CookieBannerComponent } from '../components/CookieBannerComponent';
import { HeaderComponent } from '../components/HeaderComponent';

type MyFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  basketPage: BasketPage;
  cookieBanner: CookieBannerComponent;
  header: HeaderComponent;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  basketPage: async ({ page }, use) => {
    await use(new BasketPage(page));
  },

  cookieBanner: async ({ page }, use) => {
    await use(new CookieBannerComponent(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
});


export { expect } from '@playwright/test';