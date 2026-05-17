import { test } from '../../utils/test-fixtures';
import { PRODUCTS, RECIPIENT, SEARCH_TERMS } from '../../fixtures/testData';

// KNOWN ISSUE — Mobile Safari product-flow coverage gap.
// Same root cause as basket regression suite: gogift's mobile product
// page does UA/fingerprint pattern matching, Playwright WebKit on Linux
// (CI) falls outside the recognized pattern and receives a degraded
// CTA flow without the "Choose" → value-selection modal. Reproduced
// and documented in the project's bug report.
test.describe('@regression Checkout Regression Tests', () => {
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
    await basketPage.acceptTerms();
  });

  test('TC-096 | Checkout entry button is available', async ({ basketPage }) => {
    await basketPage.verifyCheckoutEntryAvailable();
  });

  test('TC-097 | User can proceed towards checkout/payment step', async ({ basketPage }) => {
    // On shop.gogift.com the checkout form is rendered inline on the basket
    // page itself, not behind a modal. The "Go to payment" button is a
    // SUBMIT for the already-visible form — clicking it without filling
    // the form just triggers validation errors. So "user can proceed" is
    // really "the checkout form is available for the user to fill out".
    await basketPage.verifyCheckoutEntryAvailable();
    await basketPage.verifyCheckoutFormVisible();
  });
});
