import { expect, Locator, Page } from '@playwright/test';

export class BasketPage {
  readonly page: Page;

  readonly basketHeader: Locator;
  readonly productName: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  readonly checkoutNameInput: Locator;
  readonly checkoutAddressInput: Locator;
  readonly checkoutPostalCodeInput: Locator;
  readonly checkoutCityInput: Locator;
  readonly checkoutPhoneInput: Locator;
  readonly checkoutEmailInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.basketHeader = page.getByText(/you have \d+ item\(s\) in your basket/i);
    this.productName = page.getByText(/Zalando DK Gift Card/i);
    this.termsCheckbox = page.locator('input[name="acceptTerms"]').first();
    this.checkoutButton = page.locator('#checkoutButton');
    this.continueShoppingButton = page.getByText(/continue shopping/i);

    this.checkoutNameInput = page.locator('input[name="name"]');
    this.checkoutAddressInput = page.locator('input[name="line1"]');
    this.checkoutPostalCodeInput = page.locator('input[name="postCode"]');
    this.checkoutCityInput = page.locator('input[name="city"]');
    this.checkoutPhoneInput = page.getByLabel('Phone number');
    this.checkoutEmailInput = page.locator('input[name="email"]');
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

  async verifyCheckoutFormVisible() {
    await expect(this.checkoutNameInput).toBeVisible();
    await expect(this.checkoutAddressInput).toBeVisible();
    await expect(this.checkoutPostalCodeInput).toBeVisible();
    await expect(this.checkoutCityInput).toBeVisible();
    await expect(this.checkoutPhoneInput).toBeVisible();
    await expect(this.checkoutEmailInput).toBeVisible();
  }

  async goToPayment() {
    await this.acceptTerms();
    await this.verifyCheckoutEntryAvailable();
    await this.checkoutButton.click();
  }
}