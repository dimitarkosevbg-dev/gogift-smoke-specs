# GoGift Shop - QA Automation Framework

[![Playwright Tests](https://github.com/dimitarkosevbg-dev/gogift-smoke-specs/actions/workflows/playwright.yml/badge.svg)](https://github.com/dimitarkosevbg-dev/gogift-smoke-specs/actions/workflows/playwright.yml)

End-to-end test automation for [shop.gogift.com](https://shop.gogift.com) built with Playwright and TypeScript.

This project pairs a structured [manual QA test suite](https://docs.google.com/spreadsheets/d/14mdxKIcPYD_1ZU9IFhaC9_uH20JfJy2w/edit?usp=sharing&ouid=113728637981988979355&rtpof=true&sd=true) (100+ test cases across 12 suites) with a production-style automation framework. The same test cases are covered across six browser/device projects: Chromium, Firefox, WebKit (Desktop Safari), Mobile Chrome (Pixel 5), iPad Mini, and Mobile Safari (iPhone 13), with each project further split into 2 shards for parallel execution — yielding **12 concurrent CI jobs**. The framework additionally runs a dedicated **visual regression suite** (10 snapshot tests) and a **performance benchmark suite** (Core Web Vitals + Lighthouse audits) on isolated Playwright projects.

The automation work demonstrates real-world QA engineering: dealing with Cloudflare protection, dynamic React-based dropdowns, ReactModal drawers, responsive layouts that fundamentally restructure between desktop and mobile, hybrid tablet layouts that mix desktop and mobile patterns, re-appearing overlays that intercept clicks, and the practical challenges of stabilising pixel-level snapshots and capturing reliable Web Vitals on a third-party production site.

---

## Tech Stack

- **[Playwright](https://playwright.dev)** `^1.59.1`: test runner & browser automation
- **TypeScript** `^6.0.3`: strict typing across page objects, fixtures, and tests
- **Node.js** `v24.x`: runtime
- **[playwright-lighthouse](https://www.npmjs.com/package/playwright-lighthouse)** `^4.0.0` + **Lighthouse** `^12.2.0`: desktop performance audits
- **GitHub Actions CI**: 2-way sharded matrix per project, branch-protection gate on `main`
- **ESLint + Prettier**: TypeScript-aware linting and consistent code formatting; enforced as a CI gate before test execution

---

## Project Structure

```text
gogift-smoke-specs/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI — 6 projects × 2 shards + merge job
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
│   ├── regression/
│   │   ├── homepage.regression.spec.ts
│   │   ├── navigation.regression.spec.ts
│   │   ├── search.regression.spec.ts
│   │   ├── product.regression.spec.ts
│   │   ├── basket.regression.spec.ts
│   │   └── checkout.regression.spec.ts
│   ├── visual/                 # Pixel-level snapshot regression
│   │   ├── homepage.visual.spec.ts
│   │   ├── search.visual.spec.ts
│   │   ├── navigation.visual.spec.ts
│   │   ├── product.visual.spec.ts
│   │   ├── basket.visual.spec.ts
│   │   ├── checkout.visual.spec.ts
│   │   └── *-snapshots/        # Committed PNG baselines
│   └── performance/            # Core Web Vitals + Lighthouse benchmarks
│       ├── homepage.perf.spec.ts
│       ├── product.perf.spec.ts
│       ├── basket.perf.spec.ts
│       └── lighthouse.perf.spec.ts
├── utils/
│   ├── test-fixtures.ts        # Custom Playwright fixtures
│   ├── test-date.ts            # Dynamic date helpers (no hardcoded dates)
│   ├── viewport.ts             # 3-way layout detection (mobile / tablet / desktop)
│   ├── dismissOverlays.ts      # Defensive overlay dismissal helper
│   ├── visual-helpers.ts       # Snapshot stabilisation + dynamic region masking
│   ├── performance-helpers.ts  # CWV + navigation + resource metric collection
│   ├── lighthouse-helpers.ts   # Lighthouse audit wrapper with desktop profile
│   └── helpers.ts
├── eslint.config.mjs           # ESLint flat config with Playwright plugin
├── .prettierrc.json            # Prettier formatting rules
├── .prettierignore             # Files Prettier should skip
├── playwright.config.ts        # Multi-project config (6 projects total)
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
- **Defensive overlay dismissal**: `utils/dismissOverlays.ts` handles re-appearing cookie banners and B2B promotional popups that intercept clicks on certain viewports, particularly tablet. Reused by both functional and visual suites.
- **Layered Playwright projects**: functional, visual, and performance suites run as separate Playwright projects with appropriate settings (deterministic viewport for visual, single worker + debug port for performance), so each layer is configured for its purpose without leaking concerns across the others.

---

## Test Coverage

### Smoke
Critical purchase flow up to checkout boundary: open homepage, search, open product, select value, fill recipient, add to basket, verify basket loaded.

### Regression: 6 spec files, 24 test cases

**Homepage** (5 tests): page load, header visibility, navigation, search input, gift card content.

**Navigation** (5 tests): main nav items, See all gifts, Redeem flow, Business link, basket access.

**Search** (6 tests): valid brand search, case insensitivity, leading/trailing whitespace, no-results scenario, exact match, click-through to product page.

**Product Page** (4 tests): page load, gift card value selection, delivery method field switching (Email/SMS/Post), and end-to-end add-to-basket flow (TC-087: future delivery date, value selection, recipient details, add to basket, navigate to basket, verify product visible).

**Basket** (4 tests): page load, product visibility, terms acceptance enables checkout, checkout entry availability.

**Checkout** (2 tests): checkout button availability, checkout form fields visible (full name, address, postal code, city, phone, email).

### Visual Regression: 6 spec files, 10 tests

Pixel-level snapshot comparison covering the same areas as functional regression:

| Area        | States covered                                                          |
|-------------|-------------------------------------------------------------------------|
| Homepage    | Full page, header component, main navigation                            |
| Search      | Results page (Zalando query), no-results state                          |
| Navigation  | Main nav bar, Redeem gift card page                                     |
| Product     | Initial state, value selected, Email delivery, SMS delivery             |
| Basket      | Item added, terms accepted                                              |
| Checkout    | Checkout form rendered                                                  |

Implementation details that make snapshots stable on a third-party production site:

- **Deterministic viewport** (1280×800, scale 1) so snapshots are reproducible run-to-run
- **Animations disabled** via Playwright's `toHaveScreenshot({ animations: 'disabled' })` — retry-safe, no manual CSS injection
- **Reduced motion** forced at browser context level (`contextOptions.reducedMotion: 'reduce'`)
- **Fonts ready** awaited (`document.fonts.ready`) to prevent FOUT flicker
- **Re-appearing overlays** auto-dismissed via `dismissOverlaysIfPresent` inside the stabilisation helper
- **Dynamic regions masked**: prices, carousels, banners, datetime inputs, product grids — so snapshot diffs only fire on real UI changes, not on rotating promo content
- **Tolerances** tuned to the site: 5% pixel ratio, 0.25 per-pixel threshold
- **Short `networkidle` ceiling** (5s) — `/basket` polls analytics endpoints perpetually and a longer wait pushes tests past their overall timeout for no gain
- **Baselines committed** under `tests/visual/*.spec.ts-snapshots/`; intentional UI changes follow `update → review diff → commit` workflow via `npm run test:visual:update`

### Performance Benchmarks: 4 spec files, 5 tests

Three complementary measurement layers:

**1. Core Web Vitals** (homepage, product, basket) — collected via `PerformanceObserver`:
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)

**2. Navigation & Resource Timing** (same pages) — collected via Navigation Timing API:
- DOM Interactive, DOMContentLoaded, Load Complete
- Total request count and transfer size
- Breakdown by resource type (script, img, css, xhr, …)
- Slowest individual request

**3. Lighthouse Audits** (homepage, product page) — full desktop-profile audit with realistic throttling. HTML reports attached to each test run for trace viewer inspection.

Budgets in `utils/performance-helpers.ts` (`THRESHOLDS`) and `utils/lighthouse-helpers.ts` (`DEFAULT_LH_THRESHOLDS`) are set ~15% above the measured production baseline — strict enough to catch regressions, loose enough to absorb single-run variance (Lighthouse scores naturally fluctuate ±5-10 points run-to-run). Web Vitals use `expect.soft` so a single test surfaces all budget violations at once rather than failing on the first.

Current baseline (May 2026):

| Metric                  | Homepage | Product  | Basket   |
|-------------------------|----------|----------|----------|
| LCP                     | 1356 ms  | 2616 ms  | 2900 ms  |
| FCP                     | 1252 ms  | 1604 ms  | 1644 ms  |
| CLS                     | 0.172 ⚠️  | 0.013    | 0.013    |
| TTFB                    | 935 ms   | 1365 ms  | 1419 ms  |
| Load Complete           | 1492 ms  | 1714 ms  | 1987 ms  |
| Total transfer          | 994 KB   | 337 KB   | 404 KB   |
| Lighthouse Performance  | ~89      | ~89      | n/a      |
| Lighthouse A11y         | 90       | 96       | n/a      |
| Lighthouse Best Pract.  | 96       | 96       | n/a      |
| Lighthouse SEO          | 100      | 100      | n/a      |

⚠️ Homepage CLS (0.172) exceeds Google's "good" threshold (0.1) — likely caused by the lazy-loaded carousel and gift card grid hydrating after first paint. Documented in `homepage.perf.spec.ts` as a known UX issue rather than masked by loosening the global CLS budget.

### Cross-browser × cross-device matrix

Each functional regression test runs against 6 projects:

| Project        | Viewport            | Layout Mode  | Notes                                                                 |
|----------------|---------------------|--------------|-----------------------------------------------------------------------|
| Chromium       | 1280×720            | desktop      | Desktop reference                                                     |
| Firefox        | 1280×720            | desktop      | Desktop cross-engine                                                  |
| WebKit         | 1280×720            | desktop      | Desktop WebKit / Safari engine                                        |
| Mobile Chrome  | 393×851 (Pixel 5)   | mobile       | Hamburger drawer, modal product form                                  |
| Mobile Safari  | 390×844 (iPhone 13) | mobile       | iOS WebKit + touch (homepage / nav / search only — see Known Limitations) |
| Tablet         | 768×1024 (iPad)     | tablet       | Hybrid: desktop nav + icon search                                     |

**Total: 24 tests × 6 projects = 144 functional runs per regression cycle** (minus 6 skipped on Mobile Safari = **138 effective runs**), plus **10 visual snapshots** + **5 performance benchmarks** on dedicated single-browser projects.

---

## Mobile & Tablet Coverage

This is one of the more interesting parts of the framework. shop.gogift.com renders three structurally different layouts depending on viewport — not just CSS resizing, but completely different DOM trees:

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

## Playwright Projects Architecture

Six functional Playwright projects plus two specialized ones, each configured for its purpose:

| Project        | Folder                | Browser                | Why these settings                                   |
|----------------|-----------------------|------------------------|------------------------------------------------------|
| `chromium`     | `tests/` (no visual/perf) | Desktop Chrome     | Functional cross-browser reference                   |
| `firefox`      | `tests/` (no visual/perf) | Desktop Firefox    | Functional cross-engine coverage                     |
| `webkit`       | `tests/` (no visual/perf) | Desktop Safari     | Desktop WebKit engine coverage                       |
| `Mobile Chrome`| `tests/` (no visual/perf) | Pixel 5            | Mobile layout coverage                               |
| `Mobile Safari`| `tests/` (no visual/perf) | iPhone 13          | iOS WebKit + touch (partial — see Known Limitations) |
| `Tablet`       | `tests/` (no visual/perf) | iPad Mini          | Tablet hybrid layout coverage                        |
| `visual`       | `tests/visual/`           | Chrome 1280×800    | Deterministic snapshots, reduced motion              |
| `performance`  | `tests/performance/`      | Chrome + port 9222 | Single worker, no retries, Lighthouse-compatible     |

Functional projects use `testIgnore` for `visual/` and `performance/` folders, so `npm test` doesn't accidentally run snapshots on Firefox (where they'd diverge from the Chromium baseline) or measure Web Vitals multiple times in parallel (which would invalidate the numbers).

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
npm test                          # Full functional suite, all device projects, parallel
npm run test:smoke                # Smoke suite only
npm run test:regression           # Functional regression suite only
npm run test:chromium             # Chromium project only
npm run test:headed               # Watch tests run in a visible browser
npm run report                    # Open the HTML report from the last run
```

### Visual Regression

```bash
npm run test:visual               # Run snapshots against committed baselines
npm run test:visual:update        # Update baselines after intentional UI changes
```

First-time setup requires `--update-snapshots` to establish the baselines. After that, intentional UI changes follow the standard workflow: update → review diff in git → commit the new PNG baselines.

### Performance

```bash
npm run test:performance          # Everything performance (Web Vitals + Lighthouse)
npm run test:perf:no-lighthouse   # Web Vitals + Navigation Timing only (faster)
npm run test:lighthouse           # Lighthouse audits only
```

Performance runs use a single worker (no parallel jitter) and disable retries (clean signal). Lighthouse audits add ~20-30s per page, so they're isolated behind their own script for faster local iteration.

### Sharding (local validation of CI behaviour)

```bash
npm run test:shard:1              # First half of regression tests
npm run test:shard:2              # Second half
```

Useful for verifying CI behaviour locally before pushing — each command runs `--shard=N/2` and produces the same test split as a CI shard job.

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

The project runs on **GitHub Actions** with a **2-way sharded matrix strategy**: each of the 6 functional Playwright projects (chromium, firefox, Mobile Chrome, Mobile Safari, Tablet, webkit) is split into 2 shards via `--shard=N/M`, yielding **12 parallel jobs**. A separate `merge-reports` job consolidates all shard outputs into a single HTML report. Total CI time is around **~1.5–2.5 min** for the full regression cycle — roughly half the wall-clock time of the unsharded baseline.

Workflow triggers:

- **Push to main**: full matrix runs on every commit
- **Pull request to main**: gates merges behind passing tests
- **Manual dispatch**: on-demand re-runs from the Actions tab

CI flow per matrix job:

1. Checkout repository
2. Install project dependencies (`npm ci`)
3. Run regression tests for the assigned **project + shard** combination
4. Upload **blob report fragment** as an artifact
5. On failure, also upload raw `test-results/` (screenshots, videos, traces)

All three jobs (`quality-check`, `test`, `merge-reports`) run inside the official **`mcr.microsoft.com/playwright:v1.59.1-noble`** container image, which ships pre-installed Node.js, Chromium, Firefox, WebKit, and all required system libraries. This removes the browser-install step entirely — previously the slowest and most failure-prone part of the pipeline, occasionally taking 30+ minutes and timing out — and pins the CI environment to a single reproducible base image shared across all jobs. The Playwright version in the image tag is kept in sync with the `@playwright/test` version in `package.json`.

After all 12 shard jobs complete, the `merge-reports` job downloads all blob fragments, runs `playwright merge-reports --reporter html`, and uploads a single consolidated HTML report as a `playwright-report` artifact (retained 30 days). Failure artifacts are retained 7 days.

The reporter is **context-aware** in `playwright.config.ts`: CI uses `'blob'` so shard fragments can be merged; local runs use `'html'` for the normal interactive flow.

CI configuration: `.github/workflows/playwright.yml`.

### Branch Protection on `main`

The `main` branch is protected with the following rules:

- **Require a pull request before merging** — no direct pushes to `main`
- **Require status checks to pass before merging** — all 12 shard jobs + `merge-reports` must succeed
- **Require branches to be up to date before merging** — PRs must rebase or merge `main` if it has advanced
- **Block force pushes** — `git push --force` is rejected
- **Restrict deletions** — the branch cannot be accidentally deleted

This makes CI a true merge gate rather than an advisory check.

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
- Visual snapshot diffs (expected vs. actual vs. diff) for visual regression failures
- Attached performance JSON reports per page (Web Vitals, navigation timing, resource breakdown)
- Attached Lighthouse HTML reports per audited page

CI runs are configured to retry failed tests twice (configurable in `playwright.config.ts`).

---

## Known Limitations

- **Checkout flow is partial.** shop.gogift.com is protected by Cloudflare, which blocks automated traffic at the payment step. Tests verify availability and form rendering of the checkout entry but stop short of submitting payment.
- **Payment scenarios are not automated.** Test cards and full transaction flow would require sandbox environment access not publicly available.
- **Some manual test cases (TC-061 redeem flow) require valid voucher codes** and are tracked as Blocked/Observed in the manual suite. They're documented but not automated, since there's no test data available.
- **TTFB ~1000-1400 ms** reflects the geographical distance to gogift.com's Scandinavian infrastructure when measured from outside the region. Budget is set to account for this rather than aspirational <800 ms.
- **Lighthouse Performance score varies ±10 points between runs** due to network jitter, CPU contention, and cache state. Thresholds account for this; CI should not gate merges on Lighthouse alone.
- **Homepage CLS (0.172)** exceeds Google's "good" threshold. Documented as a known UX issue rather than masked — when the underlying lazy-loaded layout shift is fixed, the budget can be tightened.
- **WebKit testing reflects engine, not OS**. Playwright's WebKit on Linux CI is the same engine that powers Safari on macOS/iOS, but font rendering, sandbox behaviour, and some Web APIs differ from a real Safari install. A green WebKit job is good signal but not a substitute for manual smoke-testing on actual Apple devices before release.
- **Mobile Safari product-flow coverage is partial.** 6 regression tests (TC-089, TC-090, TC-094, TC-095, TC-096, TC-097) are skipped on the `Mobile Safari` project because `shop.gogift.com` uses User-Agent and browser-fingerprint pattern matching on the product page to choose between a "Choose → value-selection modal" flow and a simplified "Add to basket" direct flow. Recognized real iOS Safari clients see the modal; Playwright WebKit on Linux (CI Docker) falls outside the recognized pattern and receives the direct flow, so the "Choose" button is not rendered in the DOM and the test's mobile product flow cannot complete. Reproduced and documented in the project bug report; not fixable from the test side without paid real-device infrastructure. Mobile Safari still validates WebKit-engine behaviour on the 16 non-product-flow regression tests (homepage, navigation, search).

---

## Future Improvements

- **Accessibility audit suite**: `@axe-core/playwright` integration to systematically catch a11y issues across the application — would complement the per-page Lighthouse a11y scores with detailed rule-level findings
- **Mobile-viewport visual snapshots**: visual regression currently runs only on the 1280×800 desktop profile; adding mobile and tablet visual projects would catch responsive layout regressions
- **Performance regression history**: persist per-run performance JSON to track trends over time rather than only enforcing per-run budgets
- **Finer sharding**: at the current scale (~24 tests × 6 projects), 2-way sharding is the sweet spot. If the suite grows past ~50 tests per project, 4-way sharding becomes worthwhile

---

## About

Built by **[@dimitarkosevbg-dev](https://github.com/dimitarkosevbg-dev)** as a portfolio demonstration of QA engineering practice, combining manual test design, automation framework architecture, cross-browser/cross-device coverage, visual regression discipline, performance benchmarking, CI sharding, and real-world debugging of production sites.

This README was drafted with the help of Claude (Anthropic), based on the actual project structure, code, debugging process, and architectural decisions made during development.