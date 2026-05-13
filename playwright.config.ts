/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter:
  //  - In CI: 'blob' so shards produce mergeable fragments (consolidated
  //    into one HTML report by the merge-reports CI job)
  //  - Locally: 'html' + 'list' for normal interactive dev
  reporter: process.env.CI ? [['blob'], ['list']] : [['html'], ['list']],

  use: {
    baseURL: 'https://shop.gogift.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Global config for visual snapshots — tolerate tiny anti-aliasing differences
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.25,
      animations: 'disabled',
    },
  },

  projects: [
    // ─────────────────────────────────────────────
    // FUNCTIONAL TESTS (smoke + regression)
    // ─────────────────────────────────────────────
    {
      name: 'chromium',
      testIgnore: ['**/visual/**', '**/performance/**'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: ['**/visual/**', '**/performance/**'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      testIgnore: ['**/visual/**', '**/performance/**'],
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Tablet',
      testIgnore: ['**/visual/**', '**/performance/**'],
      use: { ...devices['iPad Mini'] },
    },
    {
      name: 'webkit',
      testIgnore: ['**/visual/**', '**/performance/**'],
      use: { ...devices['Desktop Safari'] },
    },

    // ─────────────────────────────────────────────
    // VISUAL REGRESSION
    // Not sharded — deterministic single-browser run
    // ─────────────────────────────────────────────
    {
      name: 'visual',
      testDir: './tests/visual',
      retries: 0,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
        contextOptions: {
          reducedMotion: 'reduce',
        },
      },
    },

    // ─────────────────────────────────────────────
    // PERFORMANCE BENCHMARKS
    // Not sharded — parallel workers would invalidate metrics
    // ─────────────────────────────────────────────
    {
      name: 'performance',
      testDir: './tests/performance',
      retries: 0,
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--remote-debugging-port=9222'],
        },
      },
    },
  ],
});
