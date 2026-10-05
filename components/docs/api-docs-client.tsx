"use client";

import { useEffect, useRef, useState } from "react";
import { useOrigin } from "@/lib/use-origin";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Segmented } from "@/components/ui/segmented";
import { Icon } from "@/components/ui/icon";
import {
  CodeBlock,
  DynamicApiSection,
  ErrorReference,
  QrParameters,
  ResponsesAndLimits,
} from "@/components/docs/api-reference";
import { DEMO_KEY } from "@/lib/api-demo-key";

type SampleTab = "curl" | "js" | "python";

type PlayResult = {
  status: number;
  contentType: string;
  elapsed: number;
  /** Object URL for image responses. */
  url: string | null;
  /** Body text for JSON errors (and raw SVG source). */
  raw: string | null;
  error?: string;
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/qr?data=…",
    body: "image/svg+xml / image/png",
    note: "Generate a QR from query params — drop straight into an <img> tag.",
  },
  {
    method: "POST",
    path: "/api/qr",
    body: "image/svg+xml / image/png",
    note: "Same engine with a JSON body: data, format, ec, size, margin, dark, light.",
  },
  {
    method: "GET",
    path: "/api/dynamic",
    body: "application/json",
    note: "List dynamic codes with scan analytics (7-day chart, device/OS/country).",
  },
  {
    method: "POST",
    path: "/api/dynamic",
    body: "application/json",
    note: "Create a dynamic code, or pass { slug } to retarget an existing one.",
  },
  {
    method: "DELETE",
    path: "/api/dynamic?slug=…",
    body: "application/json",
    note: "Delete a code and its scan history.",
  },
  {
    method: "GET",
    path: "/r/[slug]",
    body: "302 redirect",
    note: "The hop your QR encodes: logs the scan, then forwards to the destination.",
  },
];

export function ApiDocsClient() {
  const origin = useOrigin();
  const displayOrigin = origin || "https://your-domain.example";

  const [tab, setTab] = useState<SampleTab>("curl");
  const [copied, setCopied] = useState(false);

  const [apiKey, setApiKey] = useState(DEMO_KEY);
  const [data, setData] = useState("https://scancraft.studio/go/api-demo");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const [ec, setEc] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState("512");
  const [margin, setMargin] = useState("2");
  const [dark, setDark] = useState("#0F172A");
  const [light, setLight] = useState("#FFFFFF");

  const payload = {
    data,
    format,
    ec,
    size: Number(size),
    margin: Number(margin),
    dark,
    light,
  };

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PlayResult | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const sample = (() => {
    const body = JSON.stringify(payload, null, 2);
    if (tab === "curl") {
      return [
        `# Generate a QR as ${format.toUpperCase()} (EC level ${ec}, margin ${margin})`,
        `curl -X POST ${displayOrigin}/api/qr \\`,
        `  -H "Authorization: Bearer ${apiKey}" \\`,
        `  -H "Content-Type: application/json" \\`,
        `  -d '${JSON.stringify(payload).replace(/'/g, "'\\\\''")}'`,
        ``,
        `# Or simply: ${displayOrigin}/api/qr?data=hello&key=${apiKey}`,
      ].join("\n");
    }
    if (tab === "js") {
      return [
        `const res = await fetch("${displayOrigin}/api/qr", {`,
        `  method: "POST",`,
        `  headers: {`,
        `    "Authorization": "Bearer ${apiKey}",`,
        `    "Content-Type": "application/json",`,
        `  },`,
        `  body: JSON.stringify(${body.split("\n").join("\n  ")}),`,
        `});`,
        ``,
        `if (!res.ok) throw new Error(await res.text());`,
        `const blob = await res.blob(); // image/${format === "svg" ? "svg+xml" : "png"}`,
      ].join("\n");
    }
    return [
      `import requests`,
      ``,
      `res = requests.post(`,
      `    "${displayOrigin}/api/qr",`,
      `    headers={"Authorization": "Bearer ${apiKey}"},`,
      `    json=${JSON.stringify(payload)},`,
      `)`,
      `res.raise_for_status()`,
      `open("qr.${format === "svg" ? "svg" : "png"}", "wb").write(res.content)`,
    ].join("\n");
  })();

  const copySample = async () => {
    await navigator.clipboard.writeText(sample);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const run = async () => {
    setBusy(true);
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    const started = performance.now();
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey.trim()}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const elapsed = Math.round(performance.now() - started);
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.startsWith("image/")) {
        const text = contentType.includes("svg") ? await res.text() : null;
        const blob = text !== null ? new Blob([text], { type: contentType }) : await res.blob();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setResult({ status: res.status, contentType, elapsed, url, raw: text });
      } else {
        const raw = await res.text();
        setResult({ status: res.status, contentType, elapsed, url: null, raw });
      }
    } catch (error) {
      setResult({
        status: 0,
        contentType: "",
        elapsed: 0,
        url: null,
        raw: null,
        error: error instanceof Error ? error.message : "Request failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const methodTone = (method: string) =>
    method === "GET"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : method === "POST"
        ? "bg-sky-100 text-sky-800 border-sky-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-14 flex flex-col gap-5">
      {/* Quick start + auth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <Card className="overflow-hidden">
          <CardHeader icon="key" title={<span className="text-base">Authentication</span>} />
          <div className="p-5 flex flex-col gap-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Every generate request needs a live key via{" "}
              <code className="font-mono text-sky-700">Authorization: Bearer …</code> header (the{" "}
              <code className="font-mono text-sky-700">key</code> query param works too, for{" "}
              <code className="font-mono text-sky-700">&lt;img&gt;</code> usage). This demo ships
              with one working key:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle font-mono text-xs text-slate-800 break-all">
                {DEMO_KEY}
              </code>
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? "check" : "content_copy"}
                onClick={async () => {
                  await navigator.clipboard.writeText(DEMO_KEY);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
              >
                Copy
              </Button>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <Icon name="info" className="text-[15px] shrink-0 mt-0.5" />
              <span>
                Missing/invalid keys get <strong>401</strong>; bad payloads get{" "}
                <strong>400/422</strong>. Live key issuance will arrive with billing (v3).
              </span>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            icon="image"
            title={<span className="text-base">Live GET example</span>}
            badge={<Badge tone="emerald" mono>200 OK</Badge>}
          />
          <div className="p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- raw API response on purpose */}
              <img
                src="/api/qr?data=ScanCraft%20API%20Demo&ec=H&key=sk_live_demo_scancraft_2025"
                alt="QR code generated live by the ScanCraft /api/qr endpoint"
                width={132}
                height={132}
                className="w-[132px] h-[132px]"
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0 text-xs text-slate-600">
              <code className="font-mono text-sky-700 break-all">
                GET /api/qr?data=…&amp;ec=H&amp;key=…
              </code>
              <p className="leading-relaxed">
                That image is rendered by the Node QR engine on each request — no client JS, no
                library on your side. Point a <code className="font-mono">&lt;img&gt;</code> at it
                and you have server-generated QR codes anywhere.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Endpoint reference */}
      <Card className="overflow-hidden">
        <CardHeader
          icon="api"
          title={<span className="text-base">Endpoint reference</span>}
          badge={<Badge tone="sky" mono>v1</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[36rem]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-4 py-2.5 font-semibold">Method</th>
                <th className="px-4 py-2.5 font-semibold">Path</th>
                <th className="px-4 py-2.5 font-semibold">Returns</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((endpoint) => (
                <tr key={`${endpoint.method} ${endpoint.path}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded border font-bold font-mono text-[10px] ${methodTone(endpoint.method)}`}
                    >
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-800 whitespace-nowrap">{endpoint.path}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap">{endpoint.body}</td>
                  <td className="px-4 py-2.5 text-slate-600">{endpoint.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Code samples */}
        <Card className="overflow-hidden">
          <CardHeader
            icon="code"
            title={<span className="text-base">Quick start</span>}
            actions={
              <Button variant="subtle" size="sm" icon={copied ? "check" : "content_copy"} onClick={() => void copySample()}>
                {copied ? "Copied" : "Copy"}
              </Button>
            }
          />
          <div className="p-5 flex flex-col gap-3">
            <Segmented
              ariaLabel="Language"
              value={tab}
              onChange={setTab}
              options={[
                { value: "curl", label: "cURL" },
                { value: "js", label: "JavaScript" },
                { value: "python", label: "Python" },
              ]}
            />
            <CodeBlock code={sample} />
            <p className="text-[11px] text-slate-500">
              Samples track the playground inputs on the right — tweak them and copy again.
            </p>
          </div>
        </Card>

        {/* Playground */}
        <Card className="overflow-hidden lg:sticky lg:top-20">
          <CardHeader
            icon="terminal"
            title={<span className="text-base">API playground</span>}
            badge={
              result ? (
                <Badge tone={result.status >= 200 && result.status < 300 ? "emerald" : "amber"} mono>
                  {result.status || "ERR"} · {result.elapsed}ms
                </Badge>
              ) : (
                <Badge tone="slate" mono>idle</Badge>
              )
            }
          />
          <div className="p-5 flex flex-col gap-3.5">
            <Field label="API key" htmlFor="pg-key">
              <TextInput id="pg-key" value={apiKey} onChange={(event) => setApiKey(event.target.value)} mono className="text-xs py-2" />
            </Field>

            <Field label="Data" hint="max 2048 chars" htmlFor="pg-data">
              <TextInput id="pg-data" value={data} onChange={(event) => setData(event.target.value)} mono className="text-xs py-2" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Format">
                <Segmented
                  ariaLabel="Format"
                  value={format}
                  onChange={setFormat}
                  options={[
                    { value: "svg", label: "SVG" },
                    { value: "png", label: "PNG" },
                  ]}
                />
              </Field>
              <Field label="Error correction">
                <Segmented
                  ariaLabel="Error correction"
                  value={ec}
                  onChange={setEc}
                  options={[
                    { value: "L", label: "L" },
                    { value: "M", label: "M" },
                    { value: "Q", label: "Q" },
                    { value: "H", label: "H" },
                  ]}
                />
              </Field>
            </div>

            {format === "png" ? (
              <Field label="Size (px)" hint="64–2048" htmlFor="pg-size">
                <TextInput
                  id="pg-size"
                  type="number"
                  min={64}
                  max={2048}
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  className="text-xs py-2"
                />
              </Field>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Margin"
                hint="0–16"
                htmlFor="pg-margin"
                className={format === "png" ? undefined : "col-span-2"}
              >
                <TextInput
                  id="pg-margin"
                  type="number"
                  min={0}
                  max={16}
                  value={margin}
                  onChange={(event) => setMargin(event.target.value)}
                  className="text-xs py-2"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Dark">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={dark}
                    onChange={(event) => setDark(event.target.value.toUpperCase())}
                    aria-label="Dark color picker"
                    className="w-8 h-8 shrink-0 rounded cursor-pointer border border-slate-200 bg-white p-0.5"
                  />
                  <TextInput
                    value={dark}
                    onChange={(event) => setDark(event.target.value)}
                    mono
                    aria-label="Dark hex value"
                    className="text-xs py-2"
                  />
                </div>
              </Field>
              <Field label="Light">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={light}
                    onChange={(event) => setLight(event.target.value.toUpperCase())}
                    aria-label="Light color picker"
                    className="w-8 h-8 shrink-0 rounded cursor-pointer border border-slate-200 bg-white p-0.5"
                  />
                  <TextInput
                    value={light}
                    onChange={(event) => setLight(event.target.value)}
                    mono
                    aria-label="Light hex value"
                    className="text-xs py-2"
                  />
                </div>
              </Field>
            </div>

            <Button variant="gradient" size="md" icon="play_arrow" disabled={busy || !data.trim()} onClick={() => void run()}>
              {busy ? "Sending…" : "Send request"}
            </Button>

            {result ? (
              <div className="flex flex-col gap-3 p-3.5 rounded-lg bg-surface-subtle border border-border-subtle">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <Badge tone={result.status >= 200 && result.status < 300 ? "emerald" : "amber"} mono>
                    {result.status || "NETWORK ERR"}
                  </Badge>
                  <span className="text-slate-500">{result.contentType || "—"}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{result.elapsed} ms</span>
                </div>

                {result.error ? (
                  <p className="text-xs text-rose-700">{result.error}</p>
                ) : result.url ? (
                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- dynamic API blob response */}
                    <img
                      src={result.url}
                      alt="QR code returned by the API"
                      className="max-w-[13rem] bg-white rounded-lg border border-slate-200 p-2"
                    />
                    {result.raw ? (
                      <details className="w-full">
                        <summary className="text-[11px] text-slate-500 cursor-pointer">Raw SVG source</summary>
                        <pre className="mt-1 max-h-32 overflow-auto text-[10px] font-mono text-slate-600 whitespace-pre-wrap break-all">
                          {result.raw.slice(0, 1200)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                ) : (
                  <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap break-all">
                    {result.raw}
                  </pre>
                )}
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Deep reference */}
      <QrParameters />
      <ErrorReference />
      <DynamicApiSection origin={displayOrigin} />
      <ResponsesAndLimits />
    </div>
  );
}
