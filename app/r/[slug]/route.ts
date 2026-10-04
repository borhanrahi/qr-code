import { NextRequest, NextResponse } from "next/server";
import {
  classifyDevice,
  classifyOs,
  getBySlug,
  logScan,
} from "@/lib/server/dynamic-store";

export const dynamic = "force-dynamic";

function countryFrom(request: NextRequest): string {
  const header =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code");
  if (header) return header.toUpperCase();
  const accept = request.headers.get("accept-language") ?? "";
  const primary = accept.split(",")[0]?.trim();
  const region = primary?.includes("-") ? primary.split("-")[1] : null;
  return region ? region.toUpperCase() : "Unknown";
}

/**
 * GET /r/[slug] — the dynamic QR landing hop: log the scan, then 302 to the
 * current destination. Editing the destination updates every printed code.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const code = await getBySlug(slug);

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "Direct";

  await logScan(slug, {
    ts: Date.now(),
    device: classifyDevice(userAgent),
    os: classifyOs(userAgent),
    referrer: referrer === "Direct" ? "Direct" : safeHost(referrer),
    country: countryFrom(request),
  });

  return NextResponse.redirect(code.targetUrl, 302);
}

/** Reduce a full referrer URL to its host for compact analytics rows. */
function safeHost(referrer: string): string {
  try {
    return new URL(referrer).host;
  } catch {
    return "Unknown";
  }
}
