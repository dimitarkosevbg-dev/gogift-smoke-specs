import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // HEADER
  readonly header: Locator;
  readonly logo: Locator;
  readonly menuButton: Locator;
  readonly basketButton: Locator;
  readonly businessLink: Locator;

  // NAVIGATION
  readonly mainMenu: Locator;
  readonly superGiftCardLink: Locator;
  readonly seeAllGiftsLink: Locator;
  readonly categoriesLink: Locator;
  readonly occasionsLink: Locator;
  readonly brandsLink: Locator;
  readonly superGiftCardMenu: Locator;
  readonly buySuperGiftCardLink: Locator;
  readonly redeemSuperGiftCardLink: Locator;

  // SEARCH
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('header');
    this.logo = page.locator('#logo');
    this.menuButton = page.getByRole('button', { name: 'Menu' });
    this.basketButton = page.locator('#basketButton');
    this.businessLink = page.getByRole('link', { name: 'Business' });

    this.mainMenu = page.getByLabel('Main menu bar');

    this.superGiftCardLink = page.getByRole('link', { name: 'Super Gift Card' });
    this.seeAllGiftsLink = page.getByRole('link', { name: 'See all gifts' });
    this.categoriesLink = page.getByRole('link', { name: 'Categories' });
    this.occasionsLink = page.getByRole('link', { name: 'Occasions' });
    this.brandsLink = page.getByRole('link', { name: 'Brands' });

    this.superGiftCardMenu = page.locator('#menu-super_gift_card');
    this.buySuperGiftCardLink = page.getByRole('link', { name: 'Buy Super Gift Card' });
    this.redeemSuperGiftCardLink = page.getByRole('link', { name: 'Redeem Super Gift Card' });

    this.searchInput = page.locator('#searchBox');
  }

  searchResult(productName: string) {
    return this.page.getByRole('link', {
      name: new RegExp(productName, 'i'),
    });
  }

  async open() {
    await this.page.goto('https://shop.gogift.com/en/dk/dkk');
  }

  async acceptCookies() {
    const allowCookiesButton = this.page.getByRole('button', {
      name: /allow all cookies/i,
    });

    if (await allowCookiesButton.isVisible().catch(() => false)) {
      await allowCookiesButton.click();
    }
  }

  async verifyHeaderVisible() {
    await expect(this.header).toBeVisible();
    await expect(this.logo).toBeVisible();
    await expect(this.basketButton).toBeVisible();
  }

  async verifyMainNavigationVisible() {
    await expect(this.mainMenu).toBeVisible();
    await expect(this.superGiftCardLink).toBeVisible();
    await expect(this.seeAllGiftsLink).toBeVisible();
    await expect(this.categoriesLink).toBeVisible();
    await expect(this.occasionsLink).toBeVisible();
    await expect(this.brandsLink).toBeVisible();
  }

  async search(product: string) {
    await this.searchInput.click();
    await this.searchInput.fill(product);
  }

  async openSearchResult(productName: string) {
    const result = this.searchResult(productName);

    await expect(result).toBeVisible();
    await result.click();
  }

  async openSeeAllGifts() {
    await this.seeAllGiftsLink.click();
  }

  async openBrands() {
    await this.brandsLink.click();
  }

  async openSuperGiftCardFromMenu() {
    await this.superGiftCardMenu.hover();
    await expect(this.buySuperGiftCardLink).toBeVisible();
    await this.buySuperGiftCardLink.click();
  }

  async openRedeemSuperGiftCardFromMenu() {
    await this.superGiftCardMenu.hover();
    await expect(this.redeemSuperGiftCardLink).toBeVisible();
    await this.redeemSuperGiftCardLink.click();
  }

  async openBasket() {
    await this.basketButton.click();
  }
}