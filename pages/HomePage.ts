import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly logo: Locator;
  readonly menuButton: Locator;
  readonly basketButton: Locator;
  readonly businessLink: Locator;

  readonly mainMenu: Locator;
  readonly superGiftCardLink: Locator;
  readonly seeAllGiftsLink: Locator;
  readonly categoriesLink: Locator;
  readonly occasionsLink: Locator;
  readonly brandsLink: Locator;
  readonly superGiftCardMenu: Locator;
  readonly buySuperGiftCardLink: Locator;
  readonly redeemSuperGiftCardLink: Locator;

  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('#logo');
    this.menuButton = page.getByRole('button', { name: 'Menu' });
    this.basketButton = page.locator('#basketButton');
    this.businessLink = page.getByRole('link', { name: 'Business' });

    this.mainMenu = page.getByLabel('Main menu bar');

    this.superGiftCardLink = page.locator('#menu-super_gift_card > a');
    this.seeAllGiftsLink = page.locator('#menu-see_all_gifts > a');
    this.categoriesLink = page.locator('#menu-categories > a');
    this.occasionsLink = page.locator('#menu-occasions > a');
    this.brandsLink = page.locator('#menu-brands > a');

    this.superGiftCardMenu = page.locator('#menu-super_gift_card');
    this.buySuperGiftCardLink = page.getByRole('link', { name: 'Buy Super Gift Card' });
    this.redeemSuperGiftCardLink = page.getByRole('link', { name: 'Redeem Super Gift Card' });

    this.searchInput = page.locator('#searchBox');
  }

  searchResult(productName: string): Locator {
    return this.page.getByRole('link', {
      name: new RegExp(productName, 'i'),
    });
  }

  async open() {
    await this.page.goto('https://shop.gogift.com/en/dk/dkk');
    await expect(this.logo).toBeVisible();
  }

  

  async verifyMainNavigationVisible() {
    await expect(this.mainMenu).toBeVisible();
    await expect(this.superGiftCardLink).toBeVisible();
    await expect(this.seeAllGiftsLink).toBeVisible();
    await expect(this.categoriesLink).toBeVisible();
    await expect(this.occasionsLink).toBeVisible();
    await expect(this.brandsLink).toBeVisible();
  }

  async openSearchResult(productName: string) {
    const result = this.searchResult(productName);

    await expect(result).toBeVisible();

    const href = await result.getAttribute('href');

    if (!href) {
      throw new Error(`No href found for search result: ${productName}`);
    }

    await this.page.goto(href);
  }

  async openSeeAllGifts() {
    await expect(this.seeAllGiftsLink).toBeVisible();
    await this.seeAllGiftsLink.click();
  }

  async openBrands() {
    await expect(this.brandsLink).toBeVisible();
    await this.brandsLink.click();
  }

  async openSuperGiftCardFromMenu() {
    await expect(this.superGiftCardMenu).toBeVisible();
    await this.superGiftCardMenu.hover();

    await expect(this.buySuperGiftCardLink).toBeVisible();
    await this.buySuperGiftCardLink.click();
  }

  async openRedeemSuperGiftCardFromMenu() {
    await expect(this.superGiftCardMenu).toBeVisible();
    await this.superGiftCardMenu.hover();

    await expect(this.redeemSuperGiftCardLink).toBeVisible();
    await this.redeemSuperGiftCardLink.click();
  }

  async openBasket() {
    await expect(this.basketButton).toBeVisible();
    await this.basketButton.click();
  }
}