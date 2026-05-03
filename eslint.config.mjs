// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  // Ignore generated and dependency files
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'playwright/.cache/**'],
  },

  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Playwright-specific rules for spec files
  {
    files: ['**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-conditional-in-test': 'warn',
      'playwright/expect-expect': [
        'warn',
        {
          // Page object methods that wrap expect() calls — count as assertions.
          assertFunctionNames: [
            'expect',
            'verifyHeaderVisible',
            'verifyBusinessLinkVisible',
            'verifyMainNavigationVisible',
            'verifySeeAllGiftsVisible',
            'verifyProductPageLoaded',
            'verifyEmailDeliveryFieldsVisible',
            'verifySmsDeliveryFieldsVisible',
            'verifyPostDeliveryFieldsVisible',
            'verifySelectedDeliveryDate',
            'verifyBasketUpdatedModal',
            'verifyBasketLoaded',
            'verifyProductIsVisible',
            'verifyCheckoutEntryAvailable',
            'verifyCheckoutFormVisible',
          ],
        },
      ],
    },
  },

  // Project-wide rule customisations
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
  },
];
