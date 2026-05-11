import { Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface CoreWebVitals {
  LCP: number | null;
  FCP: number | null;
  CLS: number | null;
  TTFB: number | null;
}

export interface NavigationMetrics {
  ttfb: number;
  domInteractive: number;
  domContentLoaded: number;
  loadComplete: number;
  transferSize: number;
}

export interface ResourceMetrics {
  totalRequests: number;
  totalTransferKB: number;
  byType: Record<string, { count: number; transferKB: number }>;
  slowestRequest: { url: string; durationMs: number } | null;
}

export interface PerformanceReport {
  url: string;
  timestamp: string;
  vitals: CoreWebVitals;
  navigation: NavigationMetrics;
  resources: ResourceMetrics;
}

export const THRESHOLDS = {
  LCP_MS: 2500,
  FCP_MS: 1800,
  CLS: 0.1,
  TTFB_MS: 800,
  LOAD_MS: 5000,
  TOTAL_TRANSFER_KB: 3000,
  TOTAL_REQUESTS: 150,
};

export async function collectCoreWebVitals(page: Page): Promise<CoreWebVitals> {
  await page.waitForTimeout(2000);

  return await page.evaluate(() => {
    return new Promise<CoreWebVitals>((resolve) => {
      const vitals: CoreWebVitals = { LCP: null, FCP: null, CLS: null, TTFB: null };

      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) vitals.TTFB = Math.round(nav.responseStart - nav.requestStart);

      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find((e) => e.name === 'first-contentful-paint');
      if (fcp) vitals.FCP = Math.round(fcp.startTime);

      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as any;
          if (last) vitals.LCP = Math.round(last.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        /* not supported */
      }

      try {
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
          vitals.CLS = Math.round(cls * 1000) / 1000;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        /* not supported */
      }

      setTimeout(() => resolve(vitals), 1500);
    });
  });
}

export async function collectNavigationMetrics(page: Page): Promise<NavigationMetrics> {
  return await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      ttfb: Math.round(nav.responseStart - nav.requestStart),
      domInteractive: Math.round(nav.domInteractive),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      loadComplete: Math.round(nav.loadEventEnd),
      transferSize: nav.transferSize ?? 0,
    };
  });
}

export async function collectResourceMetrics(page: Page): Promise<ResourceMetrics> {
  return await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const byType: Record<string, { count: number; transferKB: number }> = {};
    let totalTransfer = 0;
    let slowest: { url: string; durationMs: number } | null = null;

    for (const e of entries) {
      const type = e.initiatorType || 'other';
      if (!byType[type]) byType[type] = { count: 0, transferKB: 0 };
      byType[type].count++;
      byType[type].transferKB += (e.transferSize ?? 0) / 1024;
      totalTransfer += e.transferSize ?? 0;

      if (!slowest || e.duration > slowest.durationMs) {
        slowest = { url: e.name, durationMs: Math.round(e.duration) };
      }
    }

    for (const type of Object.keys(byType)) {
      byType[type].transferKB = Math.round(byType[type].transferKB);
    }

    return {
      totalRequests: entries.length,
      totalTransferKB: Math.round(totalTransfer / 1024),
      byType,
      slowestRequest: slowest,
    };
  });
}

export async function captureReport(
  page: Page,
  testInfo: TestInfo,
  label: string,
): Promise<PerformanceReport> {
  const [vitals, navigation, resources] = await Promise.all([
    collectCoreWebVitals(page),
    collectNavigationMetrics(page),
    collectResourceMetrics(page),
  ]);

  const report: PerformanceReport = {
    url: page.url(),
    timestamp: new Date().toISOString(),
    vitals,
    navigation,
    resources,
  };

  const reportDir = path.join(testInfo.outputDir, 'performance');
  fs.mkdirSync(reportDir, { recursive: true });
  const file = path.join(reportDir, `${label}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
  await testInfo.attach(`perf-${label}.json`, { path: file, contentType: 'application/json' });

  console.log(`\n📊 Performance — ${label}`);
  console.log(`  LCP:  ${report.vitals.LCP} ms  (target ≤ ${THRESHOLDS.LCP_MS})`);
  console.log(`  FCP:  ${report.vitals.FCP} ms  (target ≤ ${THRESHOLDS.FCP_MS})`);
  console.log(`  CLS:  ${report.vitals.CLS}    (target ≤ ${THRESHOLDS.CLS})`);
  console.log(`  TTFB: ${report.vitals.TTFB} ms (target ≤ ${THRESHOLDS.TTFB_MS})`);
  console.log(`  Load: ${report.navigation.loadComplete} ms`);
  console.log(
    `  Requests: ${report.resources.totalRequests}, ${report.resources.totalTransferKB} KB`,
  );

  return report;
}

export async function assertWithinBudget(report: PerformanceReport) {
  if (report.vitals.LCP !== null) {
    expect.soft(report.vitals.LCP, 'LCP within budget').toBeLessThanOrEqual(THRESHOLDS.LCP_MS);
  }
  if (report.vitals.FCP !== null) {
    expect.soft(report.vitals.FCP, 'FCP within budget').toBeLessThanOrEqual(THRESHOLDS.FCP_MS);
  }
  if (report.vitals.CLS !== null) {
    expect.soft(report.vitals.CLS, 'CLS within budget').toBeLessThanOrEqual(THRESHOLDS.CLS);
  }
  if (report.vitals.TTFB !== null) {
    expect.soft(report.vitals.TTFB, 'TTFB within budget').toBeLessThanOrEqual(THRESHOLDS.TTFB_MS);
  }
  expect
    .soft(report.navigation.loadComplete, 'Load within budget')
    .toBeLessThanOrEqual(THRESHOLDS.LOAD_MS);
  expect
    .soft(report.resources.totalTransferKB, 'Total transfer within budget')
    .toBeLessThanOrEqual(THRESHOLDS.TOTAL_TRANSFER_KB);
  expect
    .soft(report.resources.totalRequests, 'Request count within budget')
    .toBeLessThanOrEqual(THRESHOLDS.TOTAL_REQUESTS);
}
