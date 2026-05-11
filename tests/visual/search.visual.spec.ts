import { test } from '../../utils/test-fixtures';
import { snapshotFullPage, stabilizeForSnapshot } from '../../utils/visual-helpers';
import { expect } from '@playwright/test';

test.describe('@visual Search results', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('VTC-010 | Search results page snapshot', async ({ header, page }) => {
    await header.search('Zalando');
    await expect(page.getByText(/zalando/i).first()).toBeVisible();
    await snapshotFullPage(page, 'search-results-zalando.png');
  });

  test('VTC-011 | No results state snapshot', async ({ header, page }) => {
    await header.search('zzzxxyy123nonexistent');
    await stabilizeForSnapshot(page);
    await snapshotFullPage(page, 'search-no-results.png');
  });
});
