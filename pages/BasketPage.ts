import { Page, Locator, expect } from '@playwright/test';

export class BasketPage {
  readonly page: Page;

  // Locators
  readonly goToPaymentButton: Locator;
  readonly emptyBasketMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToPaymentButton = page.getByRole('button', { name: 'Go to Payment' });
    this.emptyBasketMessage = page.getByText('You have no items in your basket');
  }

  // Actions
  async goToPayment() {
    await this.goToPaymentButton.click();
  }

  // Assertions
  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/\/basket/i);
  }

  async assertContainsProduct(productName: string) {
    await expect(this.page.locator('body')).toContainText(new RegExp(productName, 'i'));
  }

  async assertEmptyBasket() {
    await expect(this.emptyBasketMessage).toBeVisible();
    await expect(this.goToPaymentButton).not.toBeVisible();
  }
}