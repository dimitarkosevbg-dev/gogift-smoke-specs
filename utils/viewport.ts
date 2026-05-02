import { Page } from '@playwright/test';

export async function isMobileLayout(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  if (!viewport) return false;
  return viewport.width < 1024;
}