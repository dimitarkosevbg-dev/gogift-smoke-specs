import { test, expect } from '../../utils/test-fixtures';
import { PRODUCTS, SEARCH_TERMS } from '../../fixtures/testData';

test.describe('@regression Search Regression Tests', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('TC-023 | Search with valid brand name', async ({ header, page }) => {
    await header.search(SEARCH_TERMS.validBrand);

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-024 | Search is case insensitive', async ({ header, page }) => {
    await header.search(SEARCH_TERMS.validBrandLowercase);

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-026 | Search exact match result', async ({ header, homePage }) => {
    await header.search(SEARCH_TERMS.validBrand);

    await homePage.openSearchResult(PRODUCTS.zalandoDk.name);
  });

  test('TC-027 | Search with leading/trailing spaces', async ({ header, page }) => {
    await header.search(SEARCH_TERMS.validBrandWithSpaces);

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-028 | Search no results scenario', async ({ header, page }) => {
    const searchTerm = SEARCH_TERMS.noResults;

    await header.search(searchTerm);

    const results = page.locator('[data-testid="product-card"]');
    const texts = await results.allTextContents();

    expect(texts.some(t => t.toLowerCase().includes(searchTerm))).toBeFalsy();
  });

  test('TC-030 | Search results are clickable', async ({ header, homePage, productPage }) => {
    await header.search(SEARCH_TERMS.validBrand);

    await homePage.openSearchResult(PRODUCTS.zalandoDk.name);
    await productPage.verifyProductPageLoaded();
  });
});