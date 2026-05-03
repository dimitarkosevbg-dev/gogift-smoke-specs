# GoGift Shop - QA Automation Framework

[![Playwright Tests](https://github.com/dimitarkosevbg-dev/gogift-smoke-specs/actions/workflows/playwright.yml/badge.svg)](https://github.com/dimitarkosevbg-dev/gogift-smoke-specs/actions/workflows/playwright.yml)

End-to-end test automation for [shop.gogift.com](https://shop.gogift.com) built with Playwright and TypeScript.

This project pairs a structured [manual QA test suite](https://docs.google.com/spreadsheets/d/14mdxKIcPYD_1ZU9IFhaC9_uH20JfJy2w/edit?usp=sharing&ouid=113728637981988979355&rtpof=true&sd=true) (in Excel, 100+ test cases across 12 suites) with a production-style automation framework. The same test cases are covered across **four browser/device projects**: Chromium, Firefox, Mobile Chrome (Pixel 5), and iPad Mini, yielding **96 individual test runs per full regression cycle**.

The automation work demonstrates real-world QA engineering: dealing with Cloudflare protection, dynamic React-based dropdowns, ReactModal drawers, responsive layouts that fundamentally restructure between desktop and mobile, and hybrid tablet layouts that mix desktop and mobile patterns.

---

## Tech Stack

- **[Playwright](https://playwright.dev)** `^1.59.1`: test runner & browser automation
- **TypeScript** `^6.0.3`: strict typing across page objects, fixtures, and tests
- **Node.js** `v24.x`: runtime
- **GitHub Actions CI**: parallel matrix runs across all 4 viewport projects on every push and PR; separate report artifacts per project
- **ESLint + Prettier**: TypeScript-aware linting and consistent code formatting; enforced as a CI gate before test execution

---

## Project Structure

```
gogift-smoke-specs/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI — parallel matrix per project
├── .vscode/
│   └── settings.json           # Workspace settings (format on save, ESLint integration)
├── components/                 # Reusable UI components
│   ├── HeaderComponent.ts      # Layout-aware header (mobile / tablet / desktop)
│   └── CookieBannerComponent.ts
├── pages/                      # Page Objects
│   ├── HomePage.ts             # Layout-aware navigation
│   ├── ProductPage.ts          # Layout-aware product form (modal on mobile, inline on tablet/desktop)
│   └── BasketPage.ts
├── fixtures/
│   └── testData.ts             # Centralized test data (URLs, search terms, recipients)
├── tests/
│   ├── smoke/
│   │   └── critical-user-flow.spec.ts
│   └── regression/
│       ├── homepage.regression.spec.ts
│       ├── navigation.regression.spec.ts
│       ├── search.regression.spec.ts
│       ├── product.regression.spec.ts
│       ├── basket.regression.spec.ts
│       └── checkout.regression.spec.ts
├── utils/
│   ├── test-fixtures.ts        # Custom Playwright fixtures
│   ├── test-date.ts            # Dynamic date helpers (no hardcoded dates)
│   ├── viewport.ts             # 3-way layout detection (mobile / tablet / desktop)
│   ├── dismissOverlays.ts      # Defensive overlay dismissal helper
│   └── helpers.ts
├── eslint.config.mjs           # ESLint flat config with Playwright plugin
├── .prettierrc.json            # Prettier formatting rules
├── .prettierignore             # Files Prettier should skip
├── playwright.config.ts        # Multi-project config (4 browsers/devices)
├── tsconfig.json
└── package.json
```

---

## Architecture

The framework follows production-grade automation principles:

- **Page Object Model** isolates locators and UI logic from test bodies. Tests read as business intent ("search for product, select value, add to basket") with no raw selectors.
- **Components** wrap UI elements that appear across multiple pages (Header, CookieBanner), avoiding duplication.
- **Custom fixtures** in `utils/test-fixtures.ts` inject page objects into tests, eliminating boilerplate setup.
- **Centralized test data** in `fixtures/testData.ts`: no magic strings scattered across spec files.
- **Dynamic dates** via `utils/test-date.ts`: no hardcoded `2026-05-01` that silently expires.
- **Stable locators**: `getByRole`, `getByLabel`, `getByText` preferred over CSS/XPath, with semantic ARIA attributes wherever the product exposes them.
- **Three-way layout detection**: `utils/viewport.ts` exposes a `LayoutMode` enum (`'mobile' | 'tablet' | 'desktop'`) so page objects can branch correctly for the tablet hybrid layout, not just mobile vs. desktop.
- **Defensive overlay dismissal**: `utils/dismissOverlays.ts` handles re-appearing cookie banners and B2B promotional popups that intercept clicks on certain viewports, particularly tablet.

---

## Test Coverage

### Smoke
Critical purchase flow up to checkout boundary: open homepage, search, open product, select value, fill recipient, add to basket, verify basket loaded.

### Regression: 6 spec files, 24 test cases

**Homepage** (5 tests): page load, header visibility, navigation, search input, gift card content.

**Navigation** (5 tests): main nav items, See all gifts, Redeem flow, Business link, basket access.

**Search** (6 tests): valid brand search, case insensitivity, leading/trailing whitespace, no-results scenario, exact match, click-through to product page.

**Product Page** (4 tests): page load, gift card value selection, delivery method field switching (Email/SMS/Post), preserved date across delivery method changes.

**Basket** (4 tests): page load, product visibility, terms acceptance enables checkout, checkout entry availability.

**Checkout** (2 tests): checkout button availability, checkout form fields visible (full name, address, postal code, city, phone, email).

### Cross-browser × cross-device matrix

Each test runs against 4 projects:

| Project        | Viewport          | Layout Mode  | Notes                                |
|----------------|-------------------|--------------|--------------------------------------|
| Chromium       | 1280×720          | desktop      | Desktop reference                    |
| Firefox        | 1280×720          | desktop      | Desktop cross-engine                 |
| Mobile Chrome  | 393×851 (Pixel 5) | mobile       | Hamburger drawer, modal product form |
| Tablet         | 768×1024 (iPad)   | tablet       | Hybrid: desktop nav + icon search    |

**Total: 24 tests × 4 projects = 96 individual runs per regression cycle.**

---

## Mobile & Tablet Coverage

This is one of the more interesting parts of the framework. shop.gogift.com renders three structurally different layouts depending on viewport - not just CSS resizing, but completely different DOM trees:

- **Desktop** (≥1024px): horizontal nav row, directly visible search input, product form alongside the description.
- **Mobile** (<768px): navigation collapsed behind a hamburger button (`aria-label="Menu"`) opening a ReactModal drawer; search hidden behind an icon-only button; product form hidden behind a sticky bottom "Choose" CTA which opens it in a ReactModal.
- **Tablet** (768-1023px): **hybrid layout** with full desktop nav row visible, but search uses the mobile-style icon button (no hamburger). Product form is inline like desktop.

### Approach

Rather than maintaining three parallel page object trees, the framework uses **layout-aware branching** inside page objects via a single helper exposing a three-way enum:

```typescript
// utils/viewport.ts
export type LayoutMode = 'mobile' | 'tablet' | 'desktop';

export function getLayoutMode(page: Page): LayoutMode {
  const viewport = page.viewportSize();
  if (!viewport) return 'desktop';
  if (viewport.width < 768) return 'mobile';
  if (viewport.width < 1024) return 'tablet';
  return 'desktop';
}

export async function isMobileLayout(page: Page): Promise<boolean> {
  return getLayoutMode(page) === 'mobile';
}

export async function isMobileOrTabletLayout(page: Page): Promise<boolean> {
  const mode = getLayoutMode(page);
  return mode === 'mobile' || mode === 'tablet';
}
```

Page objects then branch where layouts differ:

```typescript
// HeaderComponent.ts (excerpt)
async verifyHeaderVisible(): Promise<void> {
  const layout = getLayoutMode(this.page);

  if (layout === 'desktop') {
    await expect(this.searchInput).toBeVisible();
    await expect(this.desktopRedeemLink).toBeVisible();
    await expect(this.desktopSeeAllGifts).toBeVisible();
  } else if (layout === 'tablet') {
    // Hybrid: desktop nav + icon-style search, no hamburger
    await expect(this.desktopRedeemLink).toBeVisible();
    await expect(this.searchIconButton).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  } else {
    // mobile
    await expect(this.hamburgerButton).toBeVisible();
    await expect(this.searchIconButton).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  }
}
```

Tests stay clean and viewport-agnostic. They call `verifyHeaderVisible()` and the page object decides what "visible" means in context.

---

## Setup

### Prerequisites

- Node.js v18 or later (developed on v24.x)
- npm v9 or later

### Installation

```bash
git clone https://github.com/dimitarkosevbg-dev/gogift-smoke-specs.git
cd gogift-smoke-specs
npm install
npx playwright install
```

The last step downloads Playwright's bundled browsers (Chromium, Firefox, WebKit).

---

## Running Tests

```bash
npm test                    # Full suite, all projects, parallel
npm run test:smoke          # Smoke suite only
npm run test:regression     # Regression suite only
npm run test:chromium       # Chromium project only
npm run test:headed         # Watch tests run in a visible browser
npm run report              # Open the HTML report from the last run
```

### Code Quality

```bash
npm run lint                # Check for ESLint errors and warnings
npm run lint:fix            # Auto-fix ESLint issues where possible
npm run format              # Format all files with Prettier
npm run format:check        # Check if files are formatted (CI-friendly)
npm run typecheck           # Run TypeScript compiler in no-emit mode
```

Project-specific run examples:

```bash
# Single project, single worker, useful for debugging
npx playwright test --project=chromium --workers=1

# Single test by name pattern
npx playwright test --grep "TC-089"

# UI mode: interactive test runner with timeline & DOM snapshots
npx playwright test --ui
```

---

## Continuous Integration

The project runs on **GitHub Actions** with a parallel matrix strategy: each of the 4 Playwright projects (chromium, firefox, Mobile Chrome, Tablet) executes on its own runner simultaneously. Total CI time is around 7-8 minutes for the full 96-run regression cycle.

Workflow triggers:

- **Push to main**: full matrix runs on every commit
- **Pull request to main**: gates merges behind passing tests
- **Manual dispatch**: on-demand re-runs from the Actions tab

CI flow per matrix job:

1. Checkout repository
2. Install Node.js and project dependencies
3. Install Playwright browsers
4. **Lint check**: fail fast if code is not lint-clean
5. Run regression tests for the assigned project
6. Upload Playwright HTML report and (on failure) `test-results/` as artifacts

Each matrix job uploads its own Playwright HTML report as a separate artifact (`playwright-report-chromium`, `playwright-report-Tablet`, etc.), retained for 30 days. On test failure, raw `test-results/` (screenshots, videos, traces) are also uploaded for a shorter 7-day retention.

CI configuration: `.github/workflows/playwright.yml`.

---

## Test Reports

Playwright generates an HTML report after every run. To view the most recent run:

```bash
npm run report
```

Reports include:

- Pass/fail status per test, per project
- Step-by-step timeline with screenshots on failure
- Full DOM snapshots and trace viewer for debugging
- Network logs for failed requests

CI runs are configured to retry failed tests twice (configurable in `playwright.config.ts`).

---

## Known Limitations

- **Checkout flow is partial.** shop.gogift.com is protected by Cloudflare, which blocks automated traffic at the payment step. Tests verify availability and form rendering of the checkout entry but stop short of submitting payment.
- **Payment scenarios are not automated.** Test cards and full transaction flow would require sandbox environment access not publicly available.
- **Some manual test cases (TC-061 redeem flow) require valid voucher codes** and are tracked as Blocked/Observed in the manual suite. They're documented but not automated, since there's no test data available.

---

## Future Improvements

- **Visual regression**: Playwright's `toHaveScreenshot` for catching unintended UI changes across viewports
- **API-layer tests**: bypass Cloudflare to validate checkout logic at the API tier; complement E2E with faster, more reliable backend coverage
- **Accessibility audit suite**: `@axe-core/playwright` integration to systematically catch accessibility issues across the application
- **Test sharding**: split each project's tests across multiple parallel workers within the same CI job, reducing run time further
- **WebKit coverage**: currently testing on Chromium and Firefox engines; adding WebKit (Safari) would cover the third major browser engine

---

## About

Built by **[@dimitarkosevbg-dev](https://github.com/dimitarkosevbg-dev)** as a portfolio demonstration of QA engineering practice, combining manual test design, automation framework architecture, cross-browser/cross-device coverage, and real-world debugging of production sites.

This README was drafted with the help of Claude (Anthropic), based on the actual project structure, code, debugging process, and architectural decisions made during development.