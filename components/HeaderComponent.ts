import { expect, Locator, Page } from '@playwright/test';
import { isMobileLayout } from '../utils/viewport';

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
    if (await isMobileLayout(this.page)) {
      await expect(this.hamburgerButton).toBeVisible();
      await expect(this.searchIconButton).toBeVisible();
      await expect(this.cartLink).toBeVisible();
    } else {
      await expect(this.searchInput).toBeVisible();
      await expect(this.desktopRedeemLink).toBeVisible();
      await expect(this.desktopSeeAllGifts).toBeVisible();
    }
  }

  /**
   * Verify the Business entry point is reachable.
   * Desktop: header link to corporate.gogift.com.
   * Mobile/Tablet: button inside the hamburger drawer.
   */
  async verifyBusinessLinkVisible(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      await this.openHamburgerDrawer();
      const businessButton = this.menuDrawer.getByRole('link', { name: /business/i })
        .or(this.menuDrawer.getByRole('button', { name: /business/i }));
      await expect(businessButton.first()).toBeVisible();
      await this.closeHamburgerDrawer();
    } else {
      await expect(this.desktopBusinessLink).toBeVisible();
    }
  }

  /**
   * Search for a product. Handles both desktop (input visible) and
   * mobile/tablet (input hidden behind a search icon).
   */
  async search(productName: string): Promise<void> {
  if (await isMobileLayout(this.page)) {
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
      // Prefer the homepage CTA "REDEEM SUPER GIFT CARD" button — it's a more
      // realistic user path on mobile than navigating through the drawer.
      const cta = this.page.getByRole('link', { name: /redeem super gift card/i });
      if (await cta.isVisible().catch(() => false)) {
        await cta.click();
        return;
      }
      // Fallback: open hamburger and use Super Gift Card → Redeem
      await this.openHamburgerDrawer();
      const redeemInDrawer = this.menuDrawer.getByRole('link', { name: /redeem/i });
      await redeemInDrawer.first().click();
    } else {
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