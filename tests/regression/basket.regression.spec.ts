import { test, expect } from '../../utils/test-fixtures';
import { PRODUCTS, RECIPIENT, SEARCH_TERMS } from '../../fixtures/testData';

// KNOWN ISSUE — Mobile Safari product-flow coverage gap.
//
// The product page on shop.gogift.com uses User-Agent + browser-fingerprint
// pattern matching to decide which CTA flow to render on mobile layouts:
//   - Recognized "real" iOS Safari → "Choose" button → value-selection modal
//   - Unrecognized fingerprint    → "Add to basket" direct, no value modal
//
// Playwright WebKit on Linux (the CI Docker runtime) is not recognized,
// so the "Choose" button is not rendered in the DOM and ProductPage's
// mobile flow cannot complete. Reproduced across environments and
// documented in the project's bug report; not fixable from the test side.
//
// Mobile Safari still runs homepage / navigation / search regression
// (no product-flow dependency), so WebKit-engine mobile coverage is
// partial rather than absent.
test.describe('@regression Basket Regression Tests', () => {
  test.beforeEach(async ({ homePage, header, productPage, basketPage, cookieBanner }, testInfo) => {
    // eslint-disable-next-line playwright/no-skipped-test -- intentional project-scoped skip; see file-header KNOWN ISSUE
    test.skip(
      testInfo.project.name === 'Mobile Safari',
      'Mobile Safari skipped — gogift UA discrimination hides Choose button. See README → Known Limitations.',
    );

    await homePage.open();
    await cookieBanner.acceptAllCookies();

    await header.search(SEARCH_TERMS.validBrand);
    await homePage.openSearchResult(PRODUCTS.zalandoDk.name);

    await productPage.selectGiftCardValue(PRODUCTS.zalandoDk.defaultValue);
    await productPage.fillRecipientDetails(RECIPIENT.name, RECIPIENT.email);

    await productPage.clickAddToBasket();
    await productPage.goToBasket();

    await basketPage.verifyBasketLoaded();
  });

  test('TC-089 | Basket page loads correctly', async ({ basketPage }) => {
    await basketPage.verifyBasketLoaded();
  });

  test('TC-090 | Product is visible in basket', async ({ basketPage }) => {
    await basketPage.verifyProductIsVisible();
  });

  test('TC-094 | Accepting terms enables checkout', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await expect(basketPage.checkoutButton).toBeVisible();
    await expect(basketPage.checkoutButton).toHaveText(/go to payment/i);
  });

  test('TC-095 | Checkout entry is available after accepting terms', async ({ basketPage }) => {
    await basketPage.acceptTerms();
    await basketPage.verifyCheckoutEntryAvailable();
  });
});
