import { Page } from '@playwright/test';

/**
 * Best-effort dismissal of cookie banner and B2B promo popup if currently visible.
 *
 * These overlays can re-appear after navigation on certain viewports (notably tablet),
 * intercepting pointer events and breaking otherwise-valid clicks. This helper is
 * idempotent and safe to call before any critical interaction.
 *
 * - Cookie banner (Cookiebot): #CybotCookiebotDialog
 * - B2B promotional popup: dialog with name "Are you shopping as a business?"
 */
export async function dismissOverlaysIfPresent(page: Page): Promise<void> {
  // 1. Cookie banner
  const cookieDialog = page.locator('#CybotCookiebotDialog');
  if (await cookieDialog.isVisible().catch(() => false)) {
    const acceptButton = page.getByRole('button', { name: /allow all cookies/i });
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click();
      await cookieDialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    }
  }

  // 2. B2B promotional popup
  const b2bDialog = page.getByRole('dialog', {
    name: /are you shopping as a business/i,
  });
  if (await b2bDialog.isVisible().catch(() => false)) {
    // First button inside the dialog is the X close icon (no aria-label).
    const closeButton = b2bDialog.locator('button').first();
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
      await b2bDialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    }
  }
}
