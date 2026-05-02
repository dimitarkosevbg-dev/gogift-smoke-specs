import { expect, Locator, Page } from '@playwright/test';
import { isMobileLayout } from '../utils/viewport';

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

  // Mobile — bottom CTA that opens the product-form modal
  readonly mobileChooseButton: Locator;
  readonly productFormModal: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.getByRole('heading', {
  level: 1,
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
      .locator('a[href="/en/dk/dkk/basket"]')
      .filter({ hasText: 'Go to basket' })
      .last();
    this.continueShoppingButton = page.getByText('Continue shopping', { exact: true });

    // Mobile-only locators
    // Bottom CTA "Choose" — opens the product form modal on mobile/tablet.
    this.mobileChooseButton = page.getByRole('button', { name: /^choose$/i });
    // Product form modal container (uses ReactModal, same pattern as hamburger drawer).
    this.productFormModal = page.locator('[role="dialog"]').filter({
      has: page.locator('input[name="AutoSuggestOption"]'),
    });
  }

  valueOption(value: string): Locator {
    return this.page.getByRole('option', { name: value });
  }

  deliveryMethod(method: 'Email' | 'SMS' | 'Post'): Locator {
    return this.page.getByText(method, { exact: true });
  }

  async verifyProductPageLoaded(): Promise<void> {
    await expect(this.productTitle).toBeVisible();
  }

  async openMobileProductForm(): Promise<void> {
  if (!(await isMobileLayout(this.page))) return;

  const modalOpen = await this.productFormModal.isVisible().catch(() => false);
  if (modalOpen) return;

  await expect(this.mobileChooseButton).toBeVisible();
  await this.mobileChooseButton.click();
  await expect(this.productFormModal).toBeVisible({ timeout: 10_000 });
  await expect(this.valueDropdown).toBeVisible({ timeout: 10_000 });
}

  async selectDeliveryMethod(method: 'Email' | 'Sms' | 'Physical'): Promise<void> {
    await this.openMobileProductForm();
    await this.deliveryMethodDropdown.selectOption(method);
  }

  async selectDeliveryDate(date: string): Promise<void> {
    await this.openMobileProductForm();
    await this.page.getByText('Choose a date', { exact: true }).click();
    await expect(this.deliveryDateInput).toBeVisible({ timeout: 10_000 });
    await this.deliveryDateInput.fill(date);
  }

  async selectGiftCardValue(value: string): Promise<void> {
  await this.openMobileProductForm();

  await expect(this.valueDropdown).toBeVisible();
  await this.valueDropdown.scrollIntoViewIfNeeded();

  const escapedValue = value.replace(/\s+/g, '\\s+');
  const optionRegex = new RegExp(escapedValue, 'i');

  const ariaOption = this.page.getByRole('option', { name: optionRegex });
  const textOption = this.page.locator('[role="listbox"]').getByText(optionRegex).first();
  const optionLocator = ariaOption.or(textOption).first();

  // Open dropdown — retry up to 3 times if options don't appear (autosuggest flake).
  for (let attempt = 1; attempt <= 3; attempt++) {
    await this.valueDropdown.click();

    try {
      await expect(optionLocator).toBeVisible({ timeout: 5_000 });
      break;
    } catch {
      if (attempt === 3) throw new Error(`Value dropdown options never appeared after 3 attempts for value "${value}"`);
      // Close and retry: click elsewhere, then re-click the input.
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    }
  }

  await optionLocator.click();

  const numericValue = value.match(/\d+/)?.[0];
  if (numericValue) {
    await expect(this.valueDropdown).toHaveValue(new RegExp(numericValue));
  }
}

  async fillRecipientName(name: string): Promise<void> {
    await this.openMobileProductForm();
    await this.recipientNameInput.fill(name);
  }

  async fillRecipientEmail(email: string): Promise<void> {
    await this.openMobileProductForm();
    await this.recipientEmailInput.fill(email);
  }

  async fillRecipientEmailRepeat(email: string): Promise<void> {
    await this.openMobileProductForm();
    await this.recipientEmailRepeatInput.fill(email);
  }

  async fillRecipientDetails(name: string, email: string): Promise<void> {
    await this.fillRecipientName(name);
    await this.fillRecipientEmail(email);
    await this.fillRecipientEmailRepeat(email);
  }

  async clickAddToBasket(): Promise<void> {
    await expect(this.addToCartButton).toHaveText(/add to basket/i);
    await this.addToCartButton.click();
  }

  async verifyBasketUpdatedModal(): Promise<void> {
    await expect(this.basketUpdatedMessage).toBeVisible();
    await expect(this.goToBasketButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async goToBasket(): Promise<void> {
    await this.verifyBasketUpdatedModal();
    await this.goToBasketButton.click();
  }

  async verifyEmailDeliveryFieldsVisible(): Promise<void> {
    await this.openMobileProductForm();
    await expect(this.recipientNameInput).toBeVisible();
    await expect(this.recipientEmailInput).toBeVisible();
    await expect(this.recipientEmailRepeatInput).toBeVisible();
  }

  async verifySmsDeliveryFieldsVisible(): Promise<void> {
    await this.openMobileProductForm();
    await expect(this.recipientNameInput).toBeVisible();
    await expect(
      this.page
        .locator('input[name*="phone"], input[name*="mobile"], input[type="tel"]')
        .first()
    ).toBeVisible();
  }

  async verifyPostDeliveryFieldsVisible(): Promise<void> {
    await this.openMobileProductForm();
    await expect(
      this.page
        .locator('input[name*="address"], input[name*="postal"], input[name*="city"], input[name*="zip"]')
        .first()
    ).toBeVisible();
  }

  async verifySelectedDeliveryDate(expectedDate: string): Promise<void> {
    await expect(this.deliveryDateInput).toHaveValue(expectedDate);
  }
}