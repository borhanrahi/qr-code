import type { DynamicCode } from "./dynamic-store";

export type DailyCount = { date: string; count: number };

export type CodeSummary = {
  slug: string;
  title: string;
  targetUrl: string;
  shortPath: string;
  createdAt: number;
  totalScans: number;
  last7Days: DailyCount[];
  devices: Record<string, number>;
  oses: Record<string, number>;
  countries: Record<string, number>;
  recent: DynamicCode["scans"];
};

/** Collapse the raw scan log into one summary row for the dashboard. */
export function summarize(code: DynamicCode): CodeSummary {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const devices: Record<string, number> = {};
  const oses: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const byDay = new Map<string, number>();

  for (const scan of code.scans) {
    devices[scan.device] = (devices[scan.device] ?? 0) + 1;
    oses[scan.os] = (oses[scan.os] ?? 0) + 1;
    countries[scan.country] = (countries[scan.country] ?? 0) + 1;
    if (scan.ts >= sevenDaysAgo) {
      const date = new Date(scan.ts).toISOString().slice(0, 10);
      byDay.set(date, (byDay.get(date) ?? 0) + 1);
    }
  }

  const last7Days: DailyCount[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now - offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    last7Days.push({ date: day, count: byDay.get(day) ?? 0 });
  }

  return {
    slug: code.slug,
    title: code.title,
    targetUrl: code.targetUrl,
    shortPath: `/r/${code.slug}`,
    createdAt: code.createdAt,
    totalScans: code.scans.length,
    last7Days,
    devices,
    oses,
    countries,
    recent: code.scans.slice(-10).reverse(),
  };
}
