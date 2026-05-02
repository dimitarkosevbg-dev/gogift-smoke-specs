import { Page } from '@playwright/test';

/**
 * Returns true if the current viewport width matches a mobile or tablet device.
 * Threshold is 1024px — anything below is treated as needing mobile/tablet UX.
 */
export async function isMobileLayout(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  if (!viewport) return false;
  return viewport.width < 1024;
}