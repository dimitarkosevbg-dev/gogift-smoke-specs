import { expect, Page, Locator } from '@playwright/test';
import { isMobileLayout } from '../utils/viewport';
import { URLS } from '../fixtures/testData';

export class HomePage {
  readonly page: Page;

  // Branding / global UI
  readonly logo: Locator;
  readonly menuButton: Locator;
  readonly basketButton: Locator;
  readonly businessLink: Locator;

  // Desktop / tablet nav (top menu bar)
  readonly mainMenu: Locator;
  readonly superGiftCardLink: Locator;
  readonly seeAllGiftsLink: Locator;
  readonly categoriesLink: Locator;
  readonly occasionsLink: Locator;
  readonly brandsLink: Locator;
  readonly superGiftCardMenu: Locator;
  readonly buySuperGiftCardLink: Locator;
  readonly redeemSuperGiftCardLink: Locator;

  // Mobile drawer
  readonly hamburgerButton: Locator;
  readonly menuDrawer: Locator;
  readonly menuCloseButton: Locator;

  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('#logo');
    this.menuButton = page.getByRole('button', { name: 'Menu' });
    this.basketButton = page.locator('#basketButton');
    this.businessLink = page.getByRole('link', { name: 'Business' });

    // Desktop / tablet top menu
    this.mainMenu = page.getByLabel('Main menu bar');
    this.superGiftCardLink = page.locator('#menu-super_gift_card > a');
    this.seeAllGiftsLink = page.locator('#menu-see_all_gifts > a');
    this.categoriesLink = page.locator('#menu-categories > a');
    this.occasionsLink = page.locator('#menu-occasions > a');
    this.brandsLink = page.locator('#menu-brands > a');

    this.superGiftCardMenu = page.locator('#menu-super_gift_card');
    this.buySuperGiftCardLink = page.getByRole('link', { name: 'Buy Super Gift Card' });
    this.redeemSuperGiftCardLink = page.getByRole('link', { name: 'Redeem Super Gift Card' });

    // Mobile drawer
    this.hamburgerButton = page.locator('header button[aria-label="Menu"]');
    this.menuDrawer = page.locator('[role="dialog"][aria-label="Menu"]');
    this.menuCloseButton = this.menuDrawer.locator('button[title="Close modal"]');

    this.searchInput = page.locator('#searchBox');
  }

  searchResult(productName: string): Locator {
    return this.page.getByRole('link', {
      name: new RegExp(productName, 'i'),
    });
  }

  async open(): Promise<void> {
    await this.page.goto(URLS.homepage);
    await expect(this.logo).toBeVisible();
  }

  /**
   * Verify the main navigation is reachable.
   * Mobile (<768px): hamburger drawer contains the nav items.
   * Desktop & Tablet (>=768px): top menu bar with all primary nav items.
   */
  async verifyMainNavigationVisible(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      await this.openHamburgerDrawer();

      await expect(
        this.menuDrawer
          .getByRole('link', { name: /see all gifts/i })
          .or(this.menuDrawer.getByText(/see all gifts/i))
          .first(),
      ).toBeVisible();

      await expect(this.menuDrawer.getByText(/super gift card/i).first()).toBeVisible();
      await expect(this.menuDrawer.getByText(/categories/i).first()).toBeVisible();
      await expect(this.menuDrawer.getByText(/occasions/i).first()).toBeVisible();
      await expect(this.menuDrawer.getByText(/brands/i).first()).toBeVisible();

      await this.closeHamburgerDrawer();
    } else {
      await expect(this.mainMenu).toBeVisible();
      await expect(this.superGiftCardLink).toBeVisible();
      await expect(this.seeAllGiftsLink).toBeVisible();
      await expect(this.categoriesLink).toBeVisible();
      await expect(this.occasionsLink).toBeVisible();
      await expect(this.brandsLink).toBeVisible();
    }
  }

  /**
   * Verify "See all gifts" entry point is reachable.
   * Mobile: prominent CTA on the homepage.
   * Desktop & Tablet: top menu link.
   */
  async verifySeeAllGiftsVisible(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      const cta = this.page.getByRole('link', { name: /^see all gifts$/i });
      await expect(cta).toBeVisible();
    } else {
      await expect(this.seeAllGiftsLink).toBeVisible();
    }
  }

  async openSearchResult(productName: string): Promise<void> {
    const result = this.page.getByRole('link', {
      name: `${productName} product`,
    });

    await expect(result).toBeVisible({ timeout: 10000 });

    const href = await result.getAttribute('href');
    if (!href) {
      throw new Error(`No href found for search result: ${productName}`);
    }

    await this.page.goto(href);
  }

  async openSeeAllGifts(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      const cta = this.page.getByRole('link', { name: /^see all gifts$/i });
      await expect(cta).toBeVisible();
      await cta.click();
    } else {
      await expect(this.seeAllGiftsLink).toBeVisible();
      await this.seeAllGiftsLink.click();
    }
  }

  async openBrands(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      await this.openHamburgerDrawer();
      const brandsItem = this.menuDrawer.getByText(/^brands$/i).first();
      await brandsItem.click();
    } else {
      await expect(this.brandsLink).toBeVisible();
      await this.brandsLink.click();
    }
  }

  async openSuperGiftCardFromMenu(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      const cta = this.page.getByRole('link', { name: /buy super gift card/i });
      await expect(cta).toBeVisible();
      await cta.click();
    } else {
      await expect(this.superGiftCardMenu).toBeVisible();
      await this.superGiftCardMenu.hover();
      await expect(this.buySuperGiftCardLink).toBeVisible();
      await this.buySuperGiftCardLink.click();
    }
  }

  async openRedeemSuperGiftCardFromMenu(): Promise<void> {
    if (await isMobileLayout(this.page)) {
      const cta = this.page.getByRole('link', { name: /redeem super gift card/i });
      await expect(cta).toBeVisible();
      await cta.click();
    } else {
      await expect(this.superGiftCardMenu).toBeVisible();
      await this.superGiftCardMenu.hover();
      await expect(this.redeemSuperGiftCardLink).toBeVisible();
      await this.redeemSuperGiftCardLink.click();
    }
  }

  async openBasket(): Promise<void> {
    await expect(this.basketButton).toBeVisible();
    await this.basketButton.click();
  }

  // ---- Mobile drawer helpers ----

  private async openHamburgerDrawer(): Promise<void> {
    await this.hamburgerButton.click();
    await expect(this.menuDrawer).toBeVisible();
  }

  private async closeHamburgerDrawer(): Promise<void> {
    if (await this.menuDrawer.isVisible().catch(() => false)) {
      await this.menuCloseButton.click();
      await expect(this.menuDrawer).toBeHidden();
    }
  }
}
