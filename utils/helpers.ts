export async function acceptCookies(page) {
  const btn = page.getByRole('button', { name: /allow/i });

  if (await btn.isVisible()) {
    await btn.click();
  }
}

export async function safeClick(locator) {
  await locator.waitFor({ state: 'visible' });
  await locator.click();
}

export async function waitForPage(page) {
  await page.waitForLoadState('networkidle');
}

export async function debugScreenshot(page, name) {
  await page.screenshot({ path: `screenshots/${name}.png` });
}