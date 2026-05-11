import { test } from '../../utils/test-fixtures';
import {
  snapshotFullPage,
  snapshotElement,
  stabilizeForSnapshot,
} from '../../utils/visual-helpers';

test.describe('@visual Homepage', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('VTC-001 | Homepage full page snapshot', async ({ page }) => {
    await snapshotFullPage(page, 'homepage-full.png');
  });

  test('VTC-002 | Header component snapshot', async ({ page }) => {
    await stabilizeForSnapshot(page);
    const header = page.locator('header').first();
    await snapshotElement(header, 'homepage-header.png');
  });

  test('VTC-003 | Main navigation snapshot', async ({ page, homePage }) => {
    await stabilizeForSnapshot(page);
    await snapshotElement(homePage.mainMenu, 'homepage-main-nav.png');
  });
});
