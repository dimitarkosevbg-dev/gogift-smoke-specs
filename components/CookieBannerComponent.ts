import { expect, Locator, Page } from '@playwright/test';

export class CookieBannerComponent {
  private acceptButton: Locator;
  private cookieDialog: Locator;

  constructor(private page: Page) {
    this.acceptButton = page.getByRole('button', {
      name: /allow all cookies/i,
    });

    this.cookieDialog = page.locator('#CybotCookiebotDialog');
  }

  async acceptAllCookies() {
    if (await this.cookieDialog.isVisible().catch(() => false)) {
      await this.acceptButton.click();
      await expect(this.cookieDialog).toBeHidden({ timeout: 10000 });
    }
  }
}