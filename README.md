# GoGift Automation Testing Project (Playwright + TypeScript)

This project contains automated end-to-end tests for https://shop.gogift.com.

The goal is to demonstrate a real-world QA approach by combining manual test design with a structured automation framework using Playwright and TypeScript.

---

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- Custom Fixtures
- Component-based architecture

---

## Project Structure

pages/ Page Objects (HomePage, ProductPage, BasketPage)
components/ Reusable UI components (Header, CookieBanner)
tests/
smoke/ Critical user flow
regression/ Regression test suites
utils/ Fixtures and shared utilities


---

## Architecture

The project follows a production-style automation structure:

- Page Object Model is used to encapsulate page-specific logic
- Components are used for reusable UI elements such as header and banners
- Custom fixtures are used to manage test setup and dependencies
- Test files contain only test logic, without direct selectors

---

## Test Coverage

### Smoke Tests
- Critical user flow:
  - Open homepage
  - Search for a product
  - Open product page
  - Select value and delivery options
  - Add to basket
  - Navigate towards checkout (limited by Cloudflare)

### Regression Tests

Homepage
- Page load validation
- Header and navigation visibility
- Search availability

Search
- Valid search
- Case insensitivity
- Leading and trailing spaces
- No results behavior (fallback content)
- Navigation to product page from results

Navigation
- Main navigation visibility
- Redeem page navigation
- Business link visibility
- Basket access

Product Page
- Page load validation
- Gift card value selection
- Delivery method handling (Email, SMS, Post)
- Field visibility based on delivery method
- State persistence when switching delivery methods

---

## Known Limitations

- Checkout flow is partially covered due to Cloudflare protection
- Payment scenarios are not automated
- Some UI elements rely on dynamic content and may require additional stabilization

---

## How to Run

Run all tests: npx playwright test

Run regression tests only:: npx playwright test tests/regression

Reports : npx playwright show-report


