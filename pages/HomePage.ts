import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // Locators
  readonly cookieButton: Locator;
  readonly searchBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieButton = page.getByRole('button', { name: 'Allow all cookies' });
    this.searchBox = page.getByRole('searchbox', { name: 'Search products' });
  }

  // Actions
  async goto() {
    await this.page.goto('/en/dk/dkk?showGlobalLink=true');
  }

  async acceptCookies() {
    await this.cookieButton.click();
  }

  async searchFor(term: string) {
    await this.searchBox.click();
    await this.searchBox.fill(term);
  }

  // Assertions
  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/shop\.gogift\.com\/en\/dk\/dkk/);
    await expect(this.cookieButton).toBeVisible();
  }

  async assertSearchBoxVisible() {
    await expect(this.searchBox).toBeVisible();
  }
}