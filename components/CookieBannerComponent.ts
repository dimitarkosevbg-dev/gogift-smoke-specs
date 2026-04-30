import { expect, Page, Locator } from '@playwright/test';

export class CookieBannerComponent {
  private acceptButton: Locator;

  constructor(private page: Page) {
    this.acceptButton = page.getByRole('button', {
      name: /allow all cookies/i,
    });
  }

  async acceptAllCookies() {
    if (await this.acceptButton.isVisible().catch(() => false)) {
      await this.acceptButton.click();
      await expect(this.acceptButton).toBeHidden();
    }
  }
}