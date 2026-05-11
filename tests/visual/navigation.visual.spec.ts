import { test } from '../../utils/test-fixtures';
import {
  snapshotFullPage,
  snapshotElement,
  stabilizeForSnapshot,
} from '../../utils/visual-helpers';

test.describe('@visual Navigation', () => {
  test.beforeEach(async ({ homePage, cookieBanner }) => {
    await homePage.open();
    await cookieBanner.acceptAllCookies();
  });

  test('VTC-020 | Main navigation bar snapshot', async ({ page, homePage }) => {
    await stabilizeForSnapshot(page);
    await snapshotElement(homePage.mainMenu, 'navigation-main-bar.png');
  });

  test('VTC-021 | Redeem gift card page snapshot', async ({ header, page }) => {
    await header.openRedeemGiftCardPage();
    await snapshotFullPage(page, 'navigation-redeem-page.png');
  });
});
