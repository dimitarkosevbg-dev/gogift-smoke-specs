# GoGift Automation Testing Project (Playwright + TypeScript)

This project contains automated end-to-end tests for https://shop.gogift.com.

The purpose of the project is to demonstrate a real-world QA approach by combining manual test design with a structured and maintainable automation framework using Playwright and TypeScript.

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
├─ smoke/ Critical user flow tests
├─ regression/ Regression test suites
utils/ Fixtures and shared utilities

---

## Architecture

The project follows a production-style automation design:

- Page Object Model is used to encapsulate UI logic and improve maintainability
- Components are introduced for reusable elements such as header and cookie banner
- Custom fixtures manage test setup and dependencies
- Test files contain only business logic and assertions (no direct selectors)

---

## Test Coverage

### Smoke Tests
- Critical user flow:
- Open homepage
- Search for a product
- Open product page
- Select gift card value
- Select delivery method and fill required fields
- Add to basket
- Proceed to checkout (limited by Cloudflare)

---

### Regression Tests

#### Homepage
- Page load validation
- Header visibility
- Navigation visibility
- Search availability

#### Search
- Valid search functionality
- Case insensitivity
- Handling of leading/trailing spaces
- No results fallback behavior
- Navigation to product page from results

#### Navigation
- Main navigation visibility
- Redeem page navigation
- Business link visibility
- Basket access

#### Product Page
- Page load validation
- Gift card value selection (dynamic dropdown handling)
- Delivery method selection (Email, SMS, Post)
- Field visibility based on delivery method
- Behavior validation when switching delivery methods

#### Basket
- Basket page load validation
- Product visibility in basket
- Terms acceptance
- Ability to proceed to checkout

#### Checkout (Partial)
- Checkout step validation within basket page
- Form visibility validation:
- Full name
- Address
- Postal code
- City
- Phone number
- Email

---

## Test Execution

## Test Execution

Install: `npm install`
Install browsers: `npx playwright install`

Run all tests: `npm test`
Run smoke tests: `npm run test:smoke`
Run regression: `npm run test:regression`
Run on specific browser: `npm run test:chromium`
Open HTML report: `npm run report`

---

## Known Limitations

- Checkout flow is partially covered due to Cloudflare protection
- Payment scenarios are not automated
- Some UI elements are dynamic and require additional synchronization (e.g. dropdowns, overlays)
- Responsive (mobile/tablet) behavior is not fully covered in regression suite

---

## Notes

- The project includes handling of real-world UI challenges such as:
- Cookie consent overlays
- Dynamic dropdown components
- Non-standard DOM structures (e.g. custom value selectors)
- Stable locators are used (name, label, semantic selectors) instead of fragile text-based selectors
- Tests are designed to reflect actual product behavior rather than assumptions

---


