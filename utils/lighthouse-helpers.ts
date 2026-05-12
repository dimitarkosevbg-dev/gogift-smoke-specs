import { Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export interface LighthouseThresholds {
  performance?: number;
  accessibility?: number;
  'best-practices'?: number;
  seo?: number;
  pwa?: number;
}

export const DEFAULT_LH_THRESHOLDS: LighthouseThresholds = {
  performance: 40,
  accessibility: 80,
  'best-practices': 75,
  seo: 80,
};

export async function runLighthouse(
  page: Page,
  testInfo: TestInfo,
  label: string,
  thresholds: LighthouseThresholds = DEFAULT_LH_THRESHOLDS,
) {
  // Dynamic import: playwright-lighthouse is an ESM-only package, so we can't
  // statically `import` it from a CommonJS file. The dynamic import() returns
  // a Promise and works in both module systems.
  const { playAudit } = await import('playwright-lighthouse');

  const reportDir = path.join(testInfo.outputDir, 'lighthouse');
  fs.mkdirSync(reportDir, { recursive: true });

  await playAudit({
    page,
    port: 9222,
    thresholds: thresholds as any,
    reports: {
      formats: { html: true, json: true },
      name: label,
      directory: reportDir,
    },
    config: {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1280,
          height: 800,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
  });

  const htmlReport = path.join(reportDir, `${label}.html`);
  if (fs.existsSync(htmlReport)) {
    await testInfo.attach(`lighthouse-${label}.html`, {
      path: htmlReport,
      contentType: 'text/html',
    });
  }
}
