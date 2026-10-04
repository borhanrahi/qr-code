import { NextRequest, NextResponse } from "next/server";
import {
  createCode,
  listCodes,
  normalizeTargetUrl,
  removeCode,
  updateTarget,
} from "@/lib/server/dynamic-store";
import { summarize } from "@/lib/server/dynamic-analytics";

export const dynamic = "force-dynamic";

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
