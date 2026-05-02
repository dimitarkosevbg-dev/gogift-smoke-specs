import { expect, Locator, Page } from '@playwright/test';

export class CookieBannerComponent {
  private readonly acceptButton: Locator;
  private readonly cookieDialog: Locator;
  private readonly b2bPromoDialog: Locator;

  constructor(private readonly page: Page) {
    this.acceptButton = page.getByRole('button', {
      name: /allow all cookies/i,
    });
    this.cookieDialog = page.locator('#CybotCookiebotDialog');

    // Promotional popup that may appear after cookies are accepted
    // (especially on mobile/tablet viewports). Has its own close button.
    this.b2bPromoDialog = page.getByRole('dialog', {
      name: /are you shopping as a business/i,
    });
  }

  async acceptAllCookies(): Promise<void> {
    // 1. Cookie consent dialog
    if (await this.cookieDialog.isVisible().catch(() => false)) {
      await this.acceptButton.click();
      await expect(this.cookieDialog).toBeHidden({ timeout: 10_000 });
    }

    // 2. B2B promotional popup — may appear with a short delay after cookies.
    // Wait briefly for it; dismiss if it shows up. No-op otherwise.
    await this.dismissB2BPromoIfPresent();
  }

  private async dismissB2BPromoIfPresent(): Promise<void> {
    try {
      await this.b2bPromoDialog.waitFor({ state: 'visible', timeout: 2_000 });
    } catch {
      return; // Popup didn't appear within 2s — assume it won't
    }

    // Close button is the first <button> inside the dialog (X icon, no aria-label)
    await this.b2bPromoDialog.locator('button').first().click();
    await expect(this.b2bPromoDialog).toBeHidden({ timeout: 5_000 });
  }
}