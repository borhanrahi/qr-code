"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

/** Monospace code sample, styled like every other snippet in the docs. */
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
      {code}
    </pre>
  );
}

type ParamRow = {
  name: string;
  type: string;
  def: string;
  desc: React.ReactNode;
};

const QR_PARAMS: ParamRow[] = [
  {
    name: "data",
    type: "string",
    def: "— required",
    desc: (
      <>
        The payload to encode: a URL, plain text, <code className="font-mono">WIFI:…</code>,{" "}
        <code className="font-mono">MECARD:…</code>, etc. Max{" "}
        <strong>2048 characters</strong> — longer payloads return 400.
      </>
    ),
  },
  {
    name: "format",
    type: '"svg" | "png"',
    def: "svg",
    desc: (
      <>
        <code className="font-mono">svg</code> → <code className="font-mono">image/svg+xml</code>{" "}
        (infinitely scalable); <code className="font-mono">png</code> →{" "}
        <code className="font-mono">image/png</code> rendered at <code className="font-mono">size</code>.
      </>
    ),
  },
  {
    name: "ec",
    type: '"L" | "M" | "Q" | "H"',
    def: "M",
    desc: (
      <>
        Error-correction level: L ≈ 7%, M ≈ 15%, Q ≈ 25%, H ≈ 30% of the code stays readable when
        damaged or partly covered (logos).
      </>
    ),
  },
  {
    name: "size",
    type: "integer 64–2048",
    def: "512",
    desc: (
      <>
        PNG edge length in pixels. Ignored for SVG — scale SVGs with CSS instead.
      </>
    ),
  },
  {
    name: "margin",
    type: "integer 0–16",
    def: "2",
    desc: <>Quiet zone around the code, in modules (dots). Keep ≥ 2 for reliable scans.</>,
  },
  {
    name: "dark",
    type: "hex color",
    def: "#000000",
    desc: <>Foreground (module) color, e.g. <code className="font-mono">#0F172A</code>.</>,
  },
  {
    name: "light",
    type: "hex color",
    def: "#ffffff",
    desc: <>Background color. Maintain good contrast with <code className="font-mono">dark</code>.</>,
  },
  {
    name: "key",
    type: "string",
    def: "—",
    desc: (
      <>
        API key passed as a query param — the alternative to the{" "}
        <code className="font-mono">Authorization</code> header, for{" "}
        <code className="font-mono">&lt;img src&gt;</code> usage.
      </>
    ),
  },
];

/** Full parameter reference for GET/POST /api/qr. */
export function QrParameters() {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon="tune"
        title={<span className="text-base">Request parameters — /api/qr</span>}
        badge={<Badge tone="teal" mono>GET + POST</Badge>}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[42rem]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="px-4 py-2.5 font-semibold">Parameter</th>
              <th className="px-4 py-2.5 font-semibold">Type</th>
              <th className="px-4 py-2.5 font-semibold">Default</th>
              <th className="px-4 py-2.5 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {QR_PARAMS.map((param) => (
              <tr key={param.name} className="border-b border-slate-50 last:border-0 align-top">
                <td className="px-4 py-2.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                  {param.name}
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                  {param.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                  {param.def}
                </td>
                <td className="px-4 py-2.5 text-slate-600 leading-relaxed">{param.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
        <Icon name="info" className="text-[15px] shrink-0 mt-0.5 text-sky-600" />
        <span>
          <strong>POST</strong> reads the JSON body first and falls back to query params;{" "}
          <strong>GET</strong> reads query params only. Out-of-range numbers are clamped
          (size 64–2048, margin 0–16) rather than rejected.
        </span>
      </div>
    </Card>
  );
}

type ErrorRow = { status: string; endpoint: string; trigger: string; message: string };

const ERRORS: ErrorRow[] = [
  {
    status: "401",
    endpoint: "/api/qr",
    trigger: "Missing, malformed or non-`sk_live_` key",
    message: "Missing or invalid API key. Use Authorization: Bearer sk_live_...",
  },
  { status: "400", endpoint: "/api/qr", trigger: "No data in body or query", message: "data is required" },
  {
    status: "400",
    endpoint: "/api/qr",
    trigger: "Payload over 2048 chars",
    message: "data exceeds 2048 characters",
  },
  {
    status: "400",
    endpoint: "/api/qr",
    trigger: "format is not svg/png",
    message: "format must be svg or png",
  },
  {
    status: "400",
    endpoint: "/api/qr",
    trigger: "ec outside L/M/Q/H",
    message: "ec must be one of L, M, Q, H",
  },
  { status: "400", endpoint: "/api/qr", trigger: "Unparseable JSON body", message: "Invalid JSON body" },
  {
    status: "415",
    endpoint: "/api/qr",
    trigger: "POST without Content-Type: application/json",
    message: "POST requires Content-Type: application/json",
  },
  {
    status: "422",
    endpoint: "/api/qr",
    trigger: "QR engine could not render the payload",
    message: "(engine message)",
  },
  {
    status: "400",
    endpoint: "/api/dynamic",
    trigger: "Empty targetUrl, or a non-http(s) scheme (javascript:, ftp:)",
    message: "targetUrl must be a valid http(s) URL",
  },
  { status: "404", endpoint: "/api/dynamic", trigger: "slug not found on retarget/delete", message: "Unknown slug" },
  { status: "400", endpoint: "DELETE /api/dynamic", trigger: "No ?slug= provided", message: "slug is required" },
  { status: "302", endpoint: "/r/[slug]", trigger: "Unknown slug — redirects home instead of erroring", message: "(redirect to /)" },
];

/** Every failure mode, with the exact JSON body you get back. */
export function ErrorReference() {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon="error_outline"
        title={<span className="text-base">Error reference</span>}
        badge={<Badge tone="amber" mono>application/json</Badge>}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[44rem]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Endpoint</th>
              <th className="px-4 py-2.5 font-semibold">When</th>
              <th className="px-4 py-2.5 font-semibold">error message</th>
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((row) => (
              <tr key={`${row.status} ${row.endpoint} ${row.message}`} className="border-b border-slate-50 last:border-0 align-top">
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex px-1.5 py-0.5 rounded border font-bold font-mono text-[10px] ${
                      row.status.startsWith("2")
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.status === "401" || row.status === "404"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-700 whitespace-nowrap">{row.endpoint}</td>
                <td className="px-4 py-2.5 text-slate-600">{row.trigger}</td>
                <td className="px-4 py-2.5 font-mono text-slate-500 break-all">{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
        <Icon name="info" className="text-[15px] shrink-0 mt-0.5 text-sky-600" />
        <span>
          Every error body has the same shape:{" "}
          <code className="font-mono">{`{ "ok": false, "error": "…" }`}</code> — check{" "}
          <code className="font-mono">ok</code> first, surface <code className="font-mono">error</code>{" "}
          to users.
        </span>
      </div>
    </Card>
  );
}

/** Dynamic-code endpoints: create, retarget, list, delete — with live examples. */
export function DynamicApiSection({ origin }: { origin: string }) {
  const createExample = [
    `# Create a dynamic code → 201`,
    `curl -X POST ${origin}/api/dynamic \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"targetUrl":"https://example.com/spring-sale","title":"Spring sale"}'`,
    ``,
    `# Response:`,
    `# {`,
    `#   "ok": true,`,
    `#   "code": {`,
    `#     "slug": "b3db90",`,
    `#     "title": "Spring sale",`,
    `#     "targetUrl": "https://example.com/spring-sale",`,
    `#     "shortPath": "/r/b3db90",`,
    `#     "createdAt": 1760000000000,`,
    `#     "totalScans": 0,`,
    `#     "last7Days": [{ "date": "2026-10-05", "count": 0 }, …],`,
    `#     "devices": {}, "oses": {}, "countries": {},`,
    `#     "recent": []`,
    `#   }`,
    `# }`,
  ].join("\n");

  const retargetExample = [
    `# Point an existing code somewhere new — printed QRs keep working`,
    `curl -X POST ${origin}/api/dynamic \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"slug":"b3db90","targetUrl":"https://example.com/summer-sale"}'`,
    ``,
    `# List every code with full analytics → 200`,
    `curl ${origin}/api/dynamic`,
    ``,
    `# Delete a code and its scan history → 200`,
    `curl -X DELETE "${origin}/api/dynamic?slug=b3db90"`,
  ].join("\n");

  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon="link"
        title={<span className="text-base">Dynamic codes &amp; analytics</span>}
        badge={<Badge tone="sky" mono>JSON · no auth</Badge>}
      />
      <div className="p-5 flex flex-col gap-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          Dynamic codes encode a short hop —{" "}
          <code className="font-mono text-sky-700">{"{origin}/r/[slug]"}</code> — instead of the
          destination itself. Every scan is logged (device class, OS, referrer host, country), then
          answered with a <strong>302</strong> to the current target, so you can retarget a printed
          QR without reprints. Slugs are 6 random hex chars.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <CodeBlock code={createExample} />
          <CodeBlock code={retargetExample} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: "add_circle", label: "Create", body: "POST /api/dynamic { targetUrl, title? } → 201" },
            { icon: "edit", label: "Retarget", body: "POST with { slug, targetUrl } → 200" },
            { icon: "insights", label: "List + stats", body: "GET /api/dynamic → summaries for every code" },
            { icon: "delete", label: "Delete", body: "DELETE /api/dynamic?slug=… → { ok: true }" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon name={item.icon} className="text-[15px] text-sky-600" />
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 leading-relaxed break-words">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
          <Icon name="priority_high" className="text-[15px] shrink-0 mt-0.5" />
          <span>
            <strong>URL rules:</strong> bare hostnames get <code className="font-mono">https://</code>{" "}
            prepended (<code className="font-mono">example.com/x</code> →{" "}
            <code className="font-mono">https://example.com/x</code>); only{" "}
            <code className="font-mono">http:</code>/<code className="font-mono">https:</code>{" "}
            schemes are accepted — empty or <code className="font-mono">javascript:</code> values
            return 400. Each code stores up to <strong>500 scans</strong> (oldest dropped); the
            dashboard shows a 7-day chart, device/OS/country breakdown and the last 10 scans.
          </span>
        </div>
      </div>
    </Card>
  );
}

/** Response headers + platform limits, side by side. */
export function ResponsesAndLimits() {
  const headers = [
    { name: "content-type", value: "image/svg+xml; charset=utf-8 · image/png · application/json" },
    { name: "x-qr-format", value: "svg | png — which renderer handled the request" },
    { name: "cache-control", value: "no-store on images — always a fresh render" },
  ];

  const limits = [
    { label: "Payload", value: "2 048 chars max" },
    { label: "PNG size", value: "64–2 048 px (clamped)" },
    { label: "Quiet zone", value: "0–16 modules" },
    { label: "Scans / code", value: "500 stored" },
    { label: "Analytics window", value: "7-day chart" },
    { label: "Keys issued", value: "1 demo key" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <Card className="overflow-hidden">
        <CardHeader
          icon="http"
          title={<span className="text-base">Responses &amp; headers</span>}
          badge={<Badge tone="emerald" mono>200 OK</Badge>}
        />
        <div className="p-5 flex flex-col gap-2.5">
          {headers.map((header) => (
            <div key={header.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <code className="font-mono text-xs font-bold text-slate-800 sm:w-36 shrink-0">
                {header.name}
              </code>
              <span className="text-[11px] font-mono text-slate-500 break-all">
                {header.value}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100 mt-1">
            Successful image responses are the raw image bytes — no wrapping JSON. Error responses
            are JSON. The live playground above renders both.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          icon="speed"
          title={<span className="text-base">Limits &amp; quotas</span>}
          badge={<Badge tone="slate" mono>demo stage</Badge>}
        />
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {limits.map((limit) => (
              <div
                key={limit.label}
                className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {limit.label}
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{limit.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 p-2.5 mt-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
            <Icon name="info" className="text-[15px] shrink-0 mt-0.5" />
            <span>
              Calls are <strong>same-origin only</strong> (no CORS headers yet) — call from your
              server or the same site. The demo ships one key and no rate limits; per-key quotas,
              key revocation and webhooks arrive with billing (v3).
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
