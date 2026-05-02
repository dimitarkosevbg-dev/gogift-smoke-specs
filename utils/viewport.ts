import { Page } from '@playwright/test';

/**
 * Layout modes supported by the framework.
 * - mobile: < 768px — hamburger drawer, icon search, modal product form
 * - tablet: 768-1023px — desktop nav, but icon search (no hamburger), inline product form
 * - desktop: >= 1024px — full nav, direct searchbox, inline product form
 */
export type LayoutMode = 'mobile' | 'tablet' | 'desktop';

export function getLayoutMode(page: Page): LayoutMode {
  const viewport = page.viewportSize();
  if (!viewport) return 'desktop';
  if (viewport.width < 768) return 'mobile';
  if (viewport.width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * True for mobile only (not tablet). Use when behaviour differs between
 * tablet and pure mobile (e.g. hamburger drawer, modal product form).
 */
export async function isMobileLayout(page: Page): Promise<boolean> {
  return getLayoutMode(page) === 'mobile';
}

/**
 * True for mobile or tablet — anything sub-desktop.
 * Use for elements that look the same on both (e.g. search icon button).
 */
export async function isMobileOrTabletLayout(page: Page): Promise<boolean> {
  const mode = getLayoutMode(page);
  return mode === 'mobile' || mode === 'tablet';
}