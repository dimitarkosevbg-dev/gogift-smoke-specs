import { test, expect } from '../../utils/test-fixtures';

test.describe('Search Regression Tests', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('TC-023 | Search with valid brand name', async ({ header, page }) => {
    await header.search('Zalando');

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-024 | Search is case insensitive', async ({ header, page }) => {
    await header.search('zalando');

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-026 | Search exact match result', async ({ header, homePage }) => {
    await header.search('Zalando');

    await homePage.openSearchResult('Zalando DK Gift Card');
  });

  test('TC-027 | Search with leading/trailing spaces', async ({ header, page }) => {
    await header.search('   zalando   ');

    await expect(page.getByText(/zalando/i).first()).toBeVisible();
  });

  test('TC-028 | Search no results scenario', async ({ header, page }) => {
  const searchTerm = 'zzzxxyy123';

  await header.search(searchTerm);

  const results = page.locator('[data-testid="product-card"]'); // ако имаш такъв

  const texts = await results.allTextContents();

  expect(texts.some(t => t.toLowerCase().includes(searchTerm))).toBeFalsy();
});

  test('TC-030 | Search results are clickable', async ({ header, homePage, productPage }) => {
    await header.search('Zalando');

    await homePage.openSearchResult('Zalando DK Gift Card');
    await productPage.verifyProductPageLoaded();
  });
});