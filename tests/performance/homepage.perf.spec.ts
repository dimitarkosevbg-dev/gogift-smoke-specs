import { test } from '../../utils/test-fixtures';
import { captureReport, assertWithinBudget } from '../../utils/performance-helpers';

test.describe('@performance Homepage', () => {
  test('PTC-001 | Homepage Core Web Vitals + navigation timing', async ({
    homePage,
    cookieBanner,
    page,
  }, testInfo) => {
    // KNOWN ISSUE: Homepage CLS measures ~0.17 (Google good is <0.1).
    // Likely caused by lazy-loaded carousel + gift card grid pushing
    // content as they hydrate. Tightening CLS threshold globally to
    // <0.1 would only catch this one offender — leaving room in the
    // budget until the underlying layout shift is fixed.
    await homePage.open();
    await cookieBanner.acceptAllCookies();

    const report = await captureReport(page, testInfo, 'homepage');
    await assertWithinBudget(report);
  });
});
