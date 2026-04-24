import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  // Locators
  readonly valueDropdown: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly repeatEmailInput: Locator;
  readonly addToBasketButton: Locator;
  readonly goToBasketLink: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.valueDropdown = page.getByRole('textbox', { name: 'Gift card value and quantity*' });
    this.fullNameInput = page.getByRole('textbox', { name: 'Full name (first and last)*' });
    this.emailInput = page.getByRole('textbox', { name: 'E-mail*', exact: true });
    this.repeatEmailInput = page.getByRole('textbox', { name: 'Repeat e-mail*' });
    this.addToBasketButton = page.getByRole('button', { name: 'Add to basket' });
    this.goToBasketLink = page.getByRole('link', { name: 'Go to basket' });
    this.toast = page.locator('.Toastify__toast-container');
  }

  // Actions
  async selectValue(value: string) {
    await this.valueDropdown.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async fillRecipientForm(name: string, email: string) {
    await this.fullNameInput.fill(name);
    await this.emailInput.fill(email);
    await this.repeatEmailInput.fill(email);
  }

  async addToBasket() {
    await this.addToBasketButton.click();
    await this.toast.waitFor({ state: 'hidden' });
  }

  async goToBasket() {
    await this.goToBasketLink.click();
  }

  // Assertions

async assertPageLoaded() {
  await expect(this.page).toHaveURL(/gift-card/i); 
  await expect(this.valueDropdown).toBeVisible();

  }

  async assertFormValues(name: string, email: string) {
    await expect(this.fullNameInput).toHaveValue(name);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.repeatEmailInput).toHaveValue(email);
  }
}