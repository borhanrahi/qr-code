import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/** A single logged scan of a dynamic code. */
export type ScanRecord = {
  ts: number;
  device: "Mobile" | "Desktop" | "Tablet" | "Bot" | "Unknown";
  os: string;
  referrer: string;
  country: string;
};

/** One dynamic QR code: short slug → editable destination + scan history. */
export type DynamicCode = {
  slug: string;
  title: string;
  targetUrl: string;
  createdAt: number;
  scans: ScanRecord[];
};

/** Per-code scan cap so the JSON file can never grow unbounded. */
const MAX_SCANS_PER_CODE = 500;

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "dynamic-codes.json");

/** In-process cache; the JSON file is the source of truth across restarts. */
let cache: DynamicCode[] | null = null;
/** Serializes writes so concurrent scans never clobber each other. */
let writeQueue: Promise<void> = Promise.resolve();

async function persist(codes: DynamicCode[]): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(codes, null, 2), "utf8");
  });
  await writeQueue;
}

async function load(): Promise<DynamicCode[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as DynamicCode[];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

/** Normalize user input into an absolute http(s) URL. */
export function normalizeTargetUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Create a code with a fresh random slug. */
export async function createCode(
  targetUrl: string,
  title: string,
): Promise<DynamicCode> {
  const codes = await load();

  let slug = randomBytes(3).toString("hex");
  while (codes.some((code) => code.slug === slug)) {
    slug = randomBytes(3).toString("hex");
  }

  const code: DynamicCode = {
    slug,
    title: title.trim() || "Untitled code",
    targetUrl,
    createdAt: Date.now(),
    scans: [],
  };
  codes.unshift(code);
  await persist(codes);
  return code;
}

/** Point an existing code at a new destination without reprinting the QR. */
export async function updateTarget(
  slug: string,
  targetUrl: string,
): Promise<DynamicCode | null> {
  const codes = await load();
  const code = codes.find((entry) => entry.slug === slug);
  if (!code) return null;
  code.targetUrl = targetUrl;
  await persist(codes);
  return code;
}

export async function removeCode(slug: string): Promise<boolean> {
  const codes = await load();
  const index = codes.findIndex((entry) => entry.slug === slug);
  if (index === -1) return false;
  codes.splice(index, 1);
  await persist(codes);
  return true;
}

export async function getBySlug(slug: string): Promise<DynamicCode | null> {
  const codes = await load();
  return codes.find((entry) => entry.slug === slug) ?? null;
}

export async function listCodes(): Promise<DynamicCode[]> {
  return [...(await load())];
}

/** Append a scan, capped per code, and persist. */
export async function logScan(slug: string, scan: ScanRecord): Promise<void> {
  const codes = await load();
  const code = codes.find((entry) => entry.slug === slug);
  if (!code) return;
  code.scans.push(scan);
  if (code.scans.length > MAX_SCANS_PER_CODE) {
    code.scans.splice(0, code.scans.length - MAX_SCANS_PER_CODE);
  }
  await persist(codes);
}

/** Derive device class from a user-agent string. */
export function classifyDevice(userAgent: string): ScanRecord["device"] {
  const ua = userAgent.toLowerCase();
  if (/bot|crawler|spider|curl|wget|preview/i.test(ua)) return "Bot";
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android|mobile/i.test(ua)) return "Mobile";
  if (ua) return "Desktop";
  return "Unknown";
}

/** Best-effort OS name from a user-agent string. */
export function classifyOs(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod|ios/.test(ua)) return "iOS";
  if (/android/.test(ua)) return "Android";
  if (/windows/.test(ua)) return "Windows";
  if (/mac os x|macintosh|macos/.test(ua)) return "macOS";
  if (/cros/.test(ua)) return "ChromeOS";
  if (/linux/.test(ua)) return "Linux";
  return "Unknown";
}
