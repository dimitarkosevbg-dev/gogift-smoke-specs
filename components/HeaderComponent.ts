import { expect, Locator, Page } from '@playwright/test';
import { isMobileLayout, isMobileOrTabletLayout, getLayoutMode } from '../utils/viewport';
import { dismissOverlaysIfPresent } from '../utils/dismissOverlays';
export class HeaderComponent {
  private readonly page: Page;

  // Common locators
  private readonly searchInput: Locator;
  private readonly cartLink: Locator;

  // Desktop-specific locators
  private readonly desktopRedeemLink: Locator;
  private readonly desktopSeeAllGifts: Locator;
  private readonly desktopBusinessLink: Locator;

  // Mobile/tablet — hamburger trigger and modal drawer
  private readonly hamburgerButton: Locator;
  private readonly searchIconButton: Locator;
  private readonly menuDrawer: Locator;
  private readonly menuCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- Common ----
    this.searchInput = page.getByRole('searchbox', { name: /search products/i });
    this.cartLink = page.getByRole('link', { name: /basket|cart/i });

    // ---- Desktop ----
    this.desktopRedeemLink = page.getByRole('link', { name: /redeem gift card/i });
    this.desktopSeeAllGifts = page.getByText('See all gifts', { exact: true });
    this.desktopBusinessLink = page.locator('header a[href="https://corporate.gogift.com"]');

    // ---- Mobile/Tablet ----
    // Hamburger button has aria-label="Menu" — found in DevTools.
    this.hamburgerButton = page.locator('header button[aria-label="Menu"]');

    // Search icon button has no aria-label (BUG-013). Identified by unique
    // magnifying-glass SVG path.
    this.searchIconButton = page
      .locator('header button:has(svg path[d^="M98.53"])')
      .first();

    // Drawer modal opens when hamburger is clicked.
    this.menuDrawer = page.locator('[role="dialog"][aria-label="Menu"]');
    this.menuCloseButton = this.menuDrawer.locator('button[title="Close modal"]');
  }

  // ---- Public methods ----

  /**
   * Verify that the page header is visible and contains the expected key elements.
   * Adapts to mobile/tablet (hamburger + search icon) vs desktop (full nav row).
   */
 async verifyHeaderVisible(): Promise<void> {
  const layout = getLayoutMode(this.page);

  if (layout === 'desktop') {
    await expect(this.searchInput).toBeVisible();
    await expect(this.desktopRedeemLink).toBeVisible();
    await expect(this.desktopSeeAllGifts).toBeVisible();
  } else if (layout === 'tablet') {
    // Hybrid: desktop nav + icon-style search, no hamburger
    await expect(this.desktopRedeemLink).toBeVisible();
    await expect(this.searchIconButton).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  } else {
    // mobile
    await expect(this.hamburgerButton).toBeVisible();
    await expect(this.searchIconButton).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  }
}

  async verifyBusinessLinkVisible(): Promise<void> {
  const layout = getLayoutMode(this.page);

  if (layout === 'mobile') {
    await this.openHamburgerDrawer();
    const businessButton = this.menuDrawer.getByRole('link', { name: /business/i })
      .or(this.menuDrawer.getByRole('button', { name: /business/i }));
    await expect(businessButton.first()).toBeVisible();
    await this.closeHamburgerDrawer();
  } else {
    // desktop & tablet — Business link is in the header
    await expect(this.desktopBusinessLink).toBeVisible();
  }
}

  async search(productName: string): Promise<void> {
  await dismissOverlaysIfPresent(this.page);

  if (await isMobileOrTabletLayout(this.page)) {
    await this.searchIconButton.click();
  }

  await this.searchInput.waitFor({ state: 'visible', timeout: 10_000 });
  await this.searchInput.fill(productName);
  await this.page.keyboard.press('Enter');
}

  /**
   * Navigate to the Redeem Gift Card page.
   * Desktop: header link.
   * Mobile/Tablet: opens hamburger and clicks Redeem entry, OR
   * uses the homepage CTA button (whichever is visible).
   */
  async openRedeemGiftCardPage(): Promise<void> {
  if (await isMobileLayout(this.page)) {
    // Mobile: prefer homepage CTA
    const cta = this.page.getByRole('link', { name: /redeem super gift card/i });
    if (await cta.isVisible().catch(() => false)) {
      await cta.click();
      return;
    }
    await this.openHamburgerDrawer();
    const redeemInDrawer = this.menuDrawer.getByRole('link', { name: /redeem/i });
    await redeemInDrawer.first().click();
  } else {
    // desktop & tablet
    await this.desktopRedeemLink.click();
  }
}

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  // ---- Mobile/tablet drawer helpers ----

  /**
   * Open the hamburger menu drawer. No-op on desktop.
   */
  async openHamburgerDrawer(): Promise<void> {
  if (!(await isMobileLayout(this.page))) return;
  await this.hamburgerButton.click();
  await expect(this.menuDrawer).toBeVisible();
}

  /**
   * Close the hamburger drawer if open. No-op if already closed.
   */
  async closeHamburgerDrawer(): Promise<void> {
    if (await this.menuDrawer.isVisible().catch(() => false)) {
      await this.menuCloseButton.click();
      await expect(this.menuDrawer).toBeHidden();
    }
  }
}