import { NextRequest, NextResponse } from "next/server";
import {
  createCode,
  listCodes,
  normalizeTargetUrl,
  removeCode,
  updateTarget,
  type DynamicCode,
} from "@/lib/server/dynamic-store";

export const dynamic = "force-dynamic";

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
function summarize(code: DynamicCode): CodeSummary {
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
    const day = new Date(now - offset * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
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

/** GET /api/dynamic — all codes with analytics summaries. */
export async function GET() {
  const codes = await listCodes();
  return NextResponse.json({ ok: true, codes: codes.map(summarize) });
}

/** POST /api/dynamic — create a code, or update one when `slug` is given. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const rawUrl = typeof body.targetUrl === "string" ? body.targetUrl : "";
  const targetUrl = normalizeTargetUrl(rawUrl);
  if (!targetUrl) {
    return NextResponse.json(
      { ok: false, error: "targetUrl must be a valid http(s) URL" },
      { status: 400 },
    );
  }
  const title = typeof body.title === "string" ? body.title : "";

  if (typeof body.slug === "string" && body.slug) {
    const updated = await updateTarget(body.slug, targetUrl);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Unknown slug" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, code: summarize(updated) });
  }

  const created = await createCode(targetUrl, title);
  return NextResponse.json({ ok: true, code: summarize(created) }, { status: 201 });
}

/** DELETE /api/dynamic?slug=abc123 — remove a code. */
export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });
  }
  const removed = await removeCode(slug);
  if (!removed) {
    return NextResponse.json({ ok: false, error: "Unknown slug" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
