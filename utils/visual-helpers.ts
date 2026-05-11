import { Page, Locator, expect } from '@playwright/test';
import { dismissOverlaysIfPresent } from './dismissOverlays';

/**
 * Prepare a page for stable visual snapshots.
 *
 * NOTE: We deliberately do NOT inject animation-disable CSS here.
 * Playwright's `toHaveScreenshot({ animations: 'disabled' })` handles
 * that during capture, is retry-safe, and re-applying it ourselves
 * causes race conditions on Playwright's internal screenshot retries.
 */
export async function stabilizeForSnapshot(page: Page) {
  await page.waitForLoadState('domcontentloaded');

  // Short timeout — some pages (e.g. /basket) poll analytics endpoints
  // perpetually and networkidle never resolves. 5s is plenty for actual
  // load activity to drain; longer is just dead time that pushes the
  // test past its overall timeout.
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);

  // Re-appearing overlays (cookie / B2B popup) can creep back after nav
  await dismissOverlaysIfPresent(page);

  // Make sure web fonts are ready (prevents FOUT flicker in screenshots)
  await page.evaluate(() => (document as any).fonts?.ready).catch(() => undefined);

  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => undefined);
}

export function dynamicRegions(page: Page): Locator[] {
  return [
    page.locator('[class*="price"]'),
    page.locator('[class*="carousel"], [class*="slider"]'),
    page.locator('time, [class*="countdown"]'),
    page.locator('[class*="hero"], [class*="banner"]'),
    page.locator('input[name="datetime"]'),
    page.locator('[class*="product-grid"], [class*="results-grid"]'),
  ];
}

export async function snapshotFullPage(page: Page, name: string) {
  await stabilizeForSnapshot(page);
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    mask: dynamicRegions(page),
  });
}

export async function snapshotElement(locator: Locator, name: string) {
  await locator.page().waitForLoadState('domcontentloaded');
  await locator
    .page()
    .waitForLoadState('networkidle', { timeout: 5_000 })
    .catch(() => undefined);
  await dismissOverlaysIfPresent(locator.page());
  await expect(locator).toBeVisible();
  await expect(locator).toHaveScreenshot(name);
}
