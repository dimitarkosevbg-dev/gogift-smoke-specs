import { expect, Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  readonly productTitle: Locator;
  readonly deliveryMethodDropdown: Locator;
  readonly deliveryDateInput: Locator;
  readonly valueDropdown: Locator; 
  readonly recipientNameInput: Locator;
  readonly recipientEmailInput: Locator;
  readonly recipientEmailRepeatInput: Locator;
  readonly addToCartButton: Locator;

  readonly basketUpdatedMessage: Locator;
  readonly goToBasketButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.getByRole('heading', {
      name: /Zalando DK Gift Card/i,
    });

    this.deliveryDateInput = page.locator('input[name="datetime"]');
    this.deliveryMethodDropdown = page.getByLabel('Delivery method');
    this.valueDropdown = page.locator('input[name="AutoSuggestOption"]');
    this.recipientNameInput = page.locator('input[name="recipientName"]');
    this.recipientEmailInput = page.locator('input[name="recipientEmail"]');
    this.recipientEmailRepeatInput = page.locator('input[name="recipientEmailRepeat"]');

    this.addToCartButton = page.locator('#addToCart');

    this.basketUpdatedMessage = page.getByText('Your basket has been updated', {
      exact: false,
    });

    this.goToBasketButton = page
  .locator('a[href="/en/dk/dkk/basket"]').filter({ hasText: 'Go to basket' }).last();
    this.continueShoppingButton = page.getByText('Continue shopping', { exact: true });
  }

  valueOption(value: string): Locator {
    return this.page.getByRole('option', { name: value });
  }

  deliveryMethod(method: 'Email' | 'SMS' | 'Post'): Locator {
    return this.page.getByText(method, { exact: true });
  }

  async verifyProductPageLoaded() {
    await expect(this.productTitle).toBeVisible();
  }

  async selectDeliveryMethod(method: 'Email' | 'Sms' | 'Physical') {
  await this.deliveryMethodDropdown.selectOption(method);
}

  async selectDeliveryDate(date: string) {

  await this.page.locator('text=Choose a date').click();

  const dateInput = this.page.locator('input[name="datetime"]');
  await dateInput.waitFor({ state: 'visible' });
  await dateInput.fill(date);
}

  async openValueDropdown() {
    await this.addToCartButton.click();
  }

async selectGiftCardValue(value: string) {
  await this.valueDropdown.click();
  await this.page.getByRole('option', { name: value }).click();
}

  async fillRecipientName(name: string) {
    await this.recipientNameInput.fill(name);
  }

  async fillRecipientEmail(email: string) {
    await this.recipientEmailInput.fill(email);
  }

  async fillRecipientEmailRepeat(email: string) {
    await this.recipientEmailRepeatInput.fill(email);
  }

  async fillRecipientDetails(name: string, email: string) {
    await this.fillRecipientName(name);
    await this.fillRecipientEmail(email);
    await this.fillRecipientEmailRepeat(email);
  }

  async clickAddToBasket() {
    await expect(this.addToCartButton).toHaveText(/add to basket/i);
    await this.addToCartButton.click();
  }

  async verifyBasketUpdatedModal() {
    await expect(this.basketUpdatedMessage).toBeVisible();
    await expect(this.goToBasketButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async goToBasket() {
    await this.verifyBasketUpdatedModal();
    await this.goToBasketButton.click();
  }
async verifyEmailDeliveryFieldsVisible() {
  await expect(this.recipientNameInput).toBeVisible();
  await expect(this.recipientEmailInput).toBeVisible();
  await expect(this.recipientEmailRepeatInput).toBeVisible();
}

async verifySmsDeliveryFieldsVisible() {
  await expect(this.recipientNameInput).toBeVisible();
  await expect(
    this.page.locator('input[name*="phone"], input[name*="mobile"], input[type="tel"]').first()
  ).toBeVisible();
}

async verifyPostDeliveryFieldsVisible() {
  await expect(
    this.page.locator(
      'input[name*="address"], input[name*="postal"], input[name*="city"], input[name*="zip"]'
    ).first()
  ).toBeVisible();
}

async verifySelectedDeliveryDate(expectedDate: string) {
  await expect(this.deliveryDateInput).toHaveValue(expectedDate);
}


}