import { expect, Locator, Page } from '@playwright/test';

export class BasketPage {
  readonly page: Page;

  readonly basketHeader: Locator;
  readonly productName: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.basketHeader = page.getByText(/you have \d+ item\(s\) in your basket/i);
    this.productName = page.getByText(/Zalando DK Gift Card/i);
    this.termsCheckbox = page.locator('input[name="acceptTerms"]').first();
    this.checkoutButton = page.locator('#checkoutButton');
    this.continueShoppingButton = page.getByText(/continue shopping/i);
  }

  async verifyBasketLoaded() {
    await expect(this.basketHeader).toBeVisible();
  }

  async verifyProductIsVisible() {
    await expect(this.productName).toBeVisible();
  }

  async acceptTerms() {
  await this.termsCheckbox.evaluate((checkbox: HTMLInputElement) => {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(this.termsCheckbox).toBeChecked();
}

  async verifyCheckoutEntryAvailable() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toHaveText(/go to payment/i);
  }

  async goToPayment() {
    await this.acceptTerms();
    await this.verifyCheckoutEntryAvailable();
    await this.checkoutButton.click();
  }
}