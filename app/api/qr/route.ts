import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

/** Demo key issued by the API & Docs page; real keys would come from billing. */
const KEY_PATTERN = /^sk_live_[A-Za-z0-9_]{8,}$/;
const MAX_DATA_LENGTH = 2048;
const EC_LEVELS = ["L", "M", "Q", "H"] as const;

type QrRequest = {
  data: string;
  format: "svg" | "png";
  ec: (typeof EC_LEVELS)[number];
  size: number;
  margin: number;
  dark: string;
  light: string;
};

function extractKey(request: NextRequest, searchParams: URLSearchParams): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice("Bearer ".length).trim();
  const headerKey = request.headers.get("x-api-key");
  if (headerKey) return headerKey.trim();
  return searchParams.get("key");
}

function parseRequest(input: Record<string, unknown>, query: URLSearchParams) {
  const pick = (name: string): string => {
    const fromBody = input[name];
    if (typeof fromBody === "string" || typeof fromBody === "number") {
      return String(fromBody);
    }
    return query.get(name) ?? "";
  };

  const data = pick("data");
  if (!data) return { error: "data is required" };
  if (data.length > MAX_DATA_LENGTH) {
    return { error: `data exceeds ${MAX_DATA_LENGTH} characters` };
  }

  const format = pick("format").toLowerCase() || "svg";
  if (format !== "svg" && format !== "png") {
    return { error: "format must be svg or png" };
  }

  const ec = (pick("ec").toUpperCase() || "M") as QrRequest["ec"];
  if (!EC_LEVELS.includes(ec)) return { error: "ec must be one of L, M, Q, H" };

  const sizeRaw = Number(pick("size") || 512);
  const size = Number.isFinite(sizeRaw) ? Math.min(Math.max(Math.round(sizeRaw), 64), 2048) : 512;

  const marginRaw = Number(pick("margin") || 2);
  const margin = Number.isFinite(marginRaw) ? Math.min(Math.max(Math.round(marginRaw), 0), 16) : 2;

  const dark = pick("dark") || "#000000";
  const light = pick("light") || "#ffffff";

  return { value: { data, format, ec, size, margin, dark, light } satisfies QrRequest };
}

async function respond(request: NextRequest, raw: string, searchParams: URLSearchParams) {
  const key = extractKey(request, searchParams);
  if (!key || !KEY_PATTERN.test(key)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid API key. Use Authorization: Bearer sk_live_..." },
      { status: 401 },
    );
  }

  let body: Record<string, unknown> = {};
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "POST requires Content-Type: application/json" },
        { status: 415 },
      );
    }
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }
  }

  const parsed = parseRequest(body, searchParams);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const { data, format, ec, size, margin, dark, light } = parsed.value;

  try {
    if (format === "svg") {
      const svg = await QRCode.toString(data, {
        type: "svg",
        errorCorrectionLevel: ec,
        margin,
        color: { dark, light },
      });
      return new NextResponse(svg, {
        headers: {
          "content-type": "image/svg+xml; charset=utf-8",
          "x-qr-format": "svg",
          "cache-control": "no-store",
        },
      });
    }

    const buffer = await QRCode.toBuffer(data, {
      type: "png",
      errorCorrectionLevel: ec,
      margin,
      width: size,
      color: { dark, light },
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "content-type": "image/png",
        "x-qr-format": "png",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "QR generation failed";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}

/** GET /api/qr?data=...&key=sk_live_... — convenient for <img src> usage. */
export async function GET(request: NextRequest) {
  return respond(request, "", request.nextUrl.searchParams);
}

/** POST /api/qr — JSON body: { data, format?, ec?, size?, margin?, dark?, light? } */
export async function POST(request: NextRequest) {
  return respond(request, "", request.nextUrl.searchParams);
}
