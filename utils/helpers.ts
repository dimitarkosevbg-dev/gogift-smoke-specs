import { Page, Locator } from '@playwright/test';

export async function acceptCookies(page: Page) {
  const btn = page.getByRole('button', { name: /allow/i });

  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

export async function safeClick(locator: Locator) {
  await locator.waitFor({ state: 'visible' });
  await locator.click();
}

export async function waitForPage(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function debugScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png` });
}