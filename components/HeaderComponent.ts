import { expect, Locator, Page } from '@playwright/test';

export class HeaderComponent {
  private searchInput: Locator;
  private cartLink: Locator;
  private redeemGiftCardLink: Locator;
  private seeAllGiftsNavItem: Locator;
  private businessLink: Locator; // 👈 добавяш това

  constructor(private page: Page) {
    this.searchInput = page.getByRole('searchbox', { name: /search products/i });
    this.cartLink = page.getByRole('link', { name: /basket|cart/i });
    this.redeemGiftCardLink = page.getByRole('link', { name: /redeem gift card/i });
    this.seeAllGiftsNavItem = page.getByText('See all gifts', { exact: true });

   
    this.businessLink = page.locator(
      'header a[href="https://corporate.gogift.com"]'
    );
  }

  async verifyHeaderVisible() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.redeemGiftCardLink).toBeVisible();
    await expect(this.seeAllGiftsNavItem).toBeVisible();
  }


  async verifyBusinessLinkVisible() {
    await expect(this.businessLink).toBeVisible();
  }

  async search(productName: string) {
  await this.searchInput.waitFor({ state: 'visible' });
  await this.searchInput.click({ force: true }); // 🔥 ключово
  await this.searchInput.fill(productName);
  await this.page.keyboard.press('Enter');
}

  async openRedeemGiftCardPage() {
    await this.redeemGiftCardLink.click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}