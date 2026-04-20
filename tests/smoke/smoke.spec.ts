import { test, expect } from '@playwright/test';

test('Smoke test user flow', async ({ page }) => {
  await page.goto('https://shop.gogift.com/en/dk/dkk?showGlobalLink=true');

  // Homepage loaded
  await expect(page).toHaveURL(/shop\.gogift\.com\/en\/dk\/dkk/);
  await expect(page.getByRole('button', { name: 'Allow all cookies' })).toBeVisible();

  // Accept cookies
  await page.getByRole('button', { name: 'Allow all cookies' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search products' })).toBeVisible();

  // Search for a product
  const searchBox = page.getByRole('searchbox', { name: 'Search products' });
  await searchBox.click();
  await searchBox.fill('zalando');
  await expect(searchBox).toHaveValue('zalando');

  // Verify product is visible and open it
  const productLink = page.getByRole('link', { name: 'Zalando DK Gift Card product' });
  await expect(productLink).toBeVisible();
  await productLink.click();

  // Product detail page loaded
  await expect(page).toHaveURL(/zalando-dk-gift-card/i);
  await expect(page.getByRole('textbox', { name: 'Gift card value and quantity*' })).toBeVisible();

  // Select gift card value
  await page.getByRole('textbox', { name: 'Gift card value and quantity*' }).click();
  const valueOption = page.getByRole('option', { name: 'DKK 200' }).or(page.getByRole('option', { name: 'DKK 200' }));
  await expect(valueOption).toBeVisible();
  await valueOption.click();

  // Fill recipient form
  const fullNameInput = page.getByRole('textbox', { name: 'Full name (first and last)*' });
  const emailInput = page.getByRole('textbox', { name: 'E-mail*', exact: true });
  const repeatEmailInput = page.getByRole('textbox', { name: 'Repeat e-mail*' });

  await expect(fullNameInput).toBeVisible();
  await fullNameInput.fill('TestName');
  await expect(fullNameInput).toHaveValue('TestName');

  await expect(emailInput).toBeVisible();
  await emailInput.fill('TestEmail@gmail.com');
  await expect(emailInput).toHaveValue('TestEmail@gmail.com');

  await expect(repeatEmailInput).toBeVisible();
  await repeatEmailInput.fill('TestEmail@gmail.com');
  await expect(repeatEmailInput).toHaveValue('TestEmail@gmail.com');

  // Add to basket
  const addToBasketButton = page.getByRole('button', { name: 'Add to basket' });
  await expect(addToBasketButton).toBeEnabled();
  await addToBasketButton.click();

  // Wait for toast to disappear before clicking basket
  const toast = page.locator('.Toastify__toast-container');
  await toast.waitFor({ state: 'hidden' });

  const goToBasketLink = page.getByRole('link', { name: 'Go to basket' });
  await expect(goToBasketLink).toBeVisible();
  await goToBasketLink.click();

  // Basket page loaded
  await expect(page).toHaveURL(/\/basket/i);
  await expect(page.locator('body')).toContainText(/zalando/i);

  // Proceed to checkout
  await page.locator('.d5T7r').first().click();

  // Checkout page loaded
  await expect(page).toHaveURL(/checkout|payment|basket/i);
  await expect(page.getByRole('textbox', { name: 'Full name (first and last)*' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Address*' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Postal code*' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'City*' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'E-mail*' })).toBeVisible();

  // Fill checkout form
  const checkoutName = page.getByRole('textbox', { name: 'Full name (first and last)*' });
  const address1 = page.getByRole('textbox', { name: 'Address*' });
  const postalCode = page.getByRole('textbox', { name: 'Postal code*' });
  const city = page.getByRole('textbox', { name: 'City*' });
  const phone = page.getByRole('textbox', { name: 'Phone number' });
  const checkoutEmail = page.getByRole('textbox', { name: 'E-mail*' });

  await checkoutName.fill('TestName TestSurname');
  await expect(checkoutName).toHaveValue('TestName TestSurname');

  await address1.fill('Test Address 123');
  await expect(address1).toHaveValue('Test Address 123');

  await postalCode.fill('3333');
  await expect(postalCode).toHaveValue('3333');

  await city.fill('Sadssds');
  await expect(city).toHaveValue('Sadssds');

  await phone.fill('333333333');
  await expect(phone).toHaveValue('333333333');

  await checkoutEmail.fill('TestEmail@gmail.com');
  await expect(checkoutEmail).toHaveValue('TestEmail@gmail.com');
});