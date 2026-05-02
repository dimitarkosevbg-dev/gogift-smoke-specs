/**
 * Centralized test data.
 * If you need different data for different environments, split this into
 * environment-specific exports later.
 */

export const URLS = {
  base: 'https://shop.gogift.com',
  homepage: 'https://shop.gogift.com/en/dk/dkk',
  basePattern: /shop\.gogift\.com/,
} as const;

export const SEARCH_TERMS = {
  validBrand: 'Zalando',
  validBrandLowercase: 'zalando',
  validBrandWithSpaces: '   zalando   ',
  noResults: 'zzzxxyy123',
} as const;

export const PRODUCTS = {
  zalandoDk: {
    name: 'Zalando DK Gift Card',
    defaultValue: 'DKK 150',
  },
} as const;

export const RECIPIENT = {
  name: 'Test User',
  email: 'test@example.com',
} as const;

