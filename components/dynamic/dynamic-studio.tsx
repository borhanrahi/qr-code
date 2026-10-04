"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { CodeSummary, DailyCount } from "@/lib/server/dynamic-analytics";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Icon } from "@/components/ui/icon";

const DEVICE_ICONS: Record<string, string> = {
  Mobile: "smartphone",
  Desktop: "computer",
  Tablet: "tablet_mac",
  Bot: "smart_toy",
  Unknown: "device_unknown",
};

/** Mini 7-day column chart; each bar's tooltip carries the exact count. */
function SparkBars({ data }: { data: DailyCount[] }) {
  const max = Math.max(1, ...data.map((day) => day.count));
  return (
    <div className="flex items-end gap-1 h-14" role="img" aria-label="Scans over the last 7 days">
      {data.map((day) => (
        <div
          key={day.date}
          title={`${day.date}: ${day.count} scan${day.count === 1 ? "" : "s"}`}
          className="flex-1 flex flex-col items-center justify-end gap-1"
        >
          <div
            className="w-full rounded-t bg-gradient-to-t from-sky-600 to-cyan-400 min-h-[3px] transition-all"
            style={{ height: `${Math.max((day.count / max) * 100, day.count > 0 ? 8 : 2)}%` }}
          />
          <span className="text-[9px] text-slate-400 font-mono">{day.date.slice(8)}</span>
        </div>
      ))}
    </div>
  );
}

/** Horizontal label/count bars for device, OS and country breakdowns. */
function Breakdown({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (!entries.length) {
    return <p className="text-xs text-slate-400">No scans yet.</p>;
  }
  return (
    <div className="flex flex-col gap-1.5">
      {entries.map(([label, count]) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          <span className="w-20 shrink-0 text-slate-600 truncate">{label}</span>
          <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <span
              className="block h-full rounded-full bg-sky-500"
              style={{ width: `${Math.max((count / total) * 100, 4)}%` }}
            />
          </span>
          <span className="w-8 text-right font-mono font-semibold text-slate-700">{count}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border-subtle bg-white shadow-card">
      <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${tone}`}>
        <Icon name={icon} className="text-[18px]" />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-lg font-extrabold text-slate-900 leading-tight truncate">{value}</span>
        <span className="text-[11px] text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}

/** Renders the short-link QR for a freshly created code (canvas, no state). */
function ShortLinkQr({ shortPath }: { shortPath: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const origin = window.location.origin;
    const options = {
      width: 224,
      height: 224,
      type: "canvas" as const,
      data: origin + shortPath,
      margin: 1,
      dotsOptions: { type: "rounded" as const, color: "#0f172a" },
      cornersSquareOptions: { type: "extra-rounded" as const, color: "#0284c7" },
      cornersDotOptions: { type: "dot" as const, color: "#0284c7" },
      backgroundOptions: { color: "#ffffff" },
    };
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(container);
      return;
    }
    qrRef.current.update(options);
  }, [shortPath]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`QR code for dynamic link ${shortPath}`}
      className="w-56 h-56 [&_canvas]:w-full [&_canvas]:h-full [&_img]:w-full [&_img]:h-full"
    />
  );
}

export function DynamicStudio() {
  const [codes, setCodes] = useState<CodeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [fresh, setFresh] = useState<CodeSummary | null>(null);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dynamic", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; codes: CodeSummary[] };
      if (!json.ok) throw new Error("Unexpected response");
      setCodes(json.codes);
      setError(null);
    } catch {
      setError("Could not load codes. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load as a promise chain so no state is set synchronously here.
    let active = true;
    fetch("/api/dynamic", { cache: "no-store" })
      .then((res) => res.json() as Promise<{ ok: boolean; codes: CodeSummary[] }>)
      .then((json) => {
        if (!active) return;
        if (!json.ok) throw new Error("Unexpected response");
        setCodes(json.codes);
        setError(null);
      })
      .catch(() => {
        if (active) setError("Could not load codes. Is the dev server running?");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const timer = setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refresh]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const flashCopied = (key: string) => {
    setCopied(key);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 1600);
  };

  const copyLink = async (shortPath: string) => {
    await navigator.clipboard.writeText(window.location.origin + shortPath);
    flashCopied(shortPath);
  };

  const create = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/dynamic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetUrl: trimmed, title: title.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; code?: CodeSummary; error?: string };
      if (!json.ok || !json.code) throw new Error(json.error ?? "Create failed");
      setFresh(json.code);
      setCodes((current) => [json.code as CodeSummary, ...current]);
      setUrl("");
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const saveTarget = async (slug: string) => {
    const trimmed = editUrl.trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/dynamic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, targetUrl: trimmed }),
      });
      const json = (await res.json()) as { ok: boolean; code?: CodeSummary; error?: string };
      if (!json.ok || !json.code) throw new Error(json.error ?? "Update failed");
      setCodes((current) =>
        current.map((code) => (code.slug === slug ? (json.code as CodeSummary) : code)),
      );
      setEditingSlug(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const remove = async (slug: string) => {
    if (!window.confirm("Delete this dynamic code? Its scan history goes too.")) return;
    try {
      const res = await fetch(`/api/dynamic?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok: boolean };
      if (!json.ok) throw new Error("Delete failed");
      setCodes((current) => current.filter((code) => code.slug !== slug));
      if (selectedSlug === slug) setSelectedSlug(null);
      if (fresh?.slug === slug) setFresh(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const totals = codes.reduce(
    (acc, code) => ({
      scans: acc.scans + code.totalScans,
      week: acc.week + code.last7Days.reduce((sum, day) => sum + day.count, 0),
    }),
    { scans: 0, week: 0 },
  );
  const topDevice = (() => {
    const merged: Record<string, number> = {};
    for (const code of codes) {
      for (const [device, count] of Object.entries(code.devices)) {
        merged[device] = (merged[device] ?? 0) + count;
      }
    }
    const sorted = Object.entries(merged).sort((a, b) => b[1] - a[1]);
    return sorted.length ? `${sorted[0][0]} · ${sorted[0][1]}` : "—";
  })();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-14 flex flex-col gap-5">
      {error ? (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <Icon name="error" className="text-[16px] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Summary tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon="qr_code_2" label="Dynamic codes" value={String(codes.length)} tone="bg-sky-100 text-sky-700" />
        <StatCard icon="touch_app" label="Total scans" value={totals.scans.toLocaleString()} tone="bg-teal-100 text-teal-700" />
        <StatCard icon="calendar_month" label="Scans (7 days)" value={totals.week.toLocaleString()} tone="bg-emerald-50 text-emerald-700" />
        <StatCard icon="devices" label="Top device" value={topDevice} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Create form */}
        <Card className="overflow-hidden lg:sticky lg:top-20">
          <CardHeader icon="add_link" title={<span className="text-base">Create dynamic code</span>} />
          <div className="p-5 flex flex-col gap-4">
            <Field label="Destination URL" hint="editable anytime" htmlFor="dyn-url">
              <TextInput
                id="dyn-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/landing"
                mono
              />
            </Field>
            <Field label="Label" hint="for your dashboard" htmlFor="dyn-title">
              <TextInput
                id="dyn-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Spring campaign poster"
              />
            </Field>
            <Button
              variant="gradient"
              size="md"
              icon="bolt"
              disabled={!url.trim() || creating}
              onClick={() => void create()}
            >
              {creating ? "Creating…" : "Generate short link"}
            </Button>

            {fresh ? (
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50/60">
                <Badge tone="emerald" mono>
                  <StatusDot className="bg-emerald-500" />
                  Live · scans logged
                </Badge>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <ShortLinkQr shortPath={fresh.shortPath} />
                </div>
                <p className="text-xs font-mono font-bold text-slate-800 break-all text-center">
                  {fresh.shortPath}
                </p>
                <div className="flex items-center gap-2 w-full">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={copied === fresh.shortPath ? "check" : "content_copy"}
                    className="flex-1"
                    onClick={() => void copyLink(fresh.shortPath)}
                  >
                    {copied === fresh.shortPath ? "Copied" : "Copy link"}
                  </Button>
                  <Button
                    variant="subtle"
                    size="sm"
                    icon="open_in_new"
                    onClick={() => window.open(fresh.shortPath, "_blank", "noopener")}
                  >
                    Test
                  </Button>
                  <Button variant="ghost" size="sm" icon="close" onClick={() => setFresh(null)} aria-label="Dismiss" />
                </div>
                <p className="text-[11px] text-slate-500 text-center leading-snug">
                  Scan it (or hit Test) — the dashboard below counts it live.
                </p>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Codes list + analytics */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="overflow-hidden">
            <CardHeader
              icon="list_alt"
              title={<span className="text-base">Your dynamic codes</span>}
              badge={<Badge tone="sky" mono>{codes.length}</Badge>}
              actions={
                <Button variant="subtle" size="sm" icon="refresh" onClick={() => void refresh()}>
                  Refresh
                </Button>
              }
            />
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-sm text-slate-500 animate-pulse">Loading codes…</div>
              ) : codes.length === 0 ? (
                <div className="p-8 flex flex-col items-center gap-2 text-center">
                  <span className="w-11 h-11 rounded-xl bg-surface-subtle flex items-center justify-center">
                    <Icon name="qr_code_2" className="text-[22px] text-slate-400" />
                  </span>
                  <p className="text-sm font-semibold text-slate-700">No dynamic codes yet</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Create one on the left — you&apos;ll get a short <span className="font-mono">/r/xxxxxx</span>{" "}
                    link you can redirect anywhere, forever.
                  </p>
                </div>
              ) : (
                codes.map((code) => (
                  <div key={code.slug} className="p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="flex flex-col min-w-0 gap-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-bold text-slate-900 truncate">{code.title}</span>
                          <Badge tone="emerald" mono>
                            {code.totalScans} scans
                          </Badge>
                        </div>
                        <span className="text-xs font-mono text-sky-700">{code.shortPath}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          variant="subtle"
                          size="sm"
                          icon={copied === code.shortPath ? "check" : "content_copy"}
                          onClick={() => void copyLink(code.shortPath)}
                        >
                          {copied === code.shortPath ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant="subtle"
                          size="sm"
                          icon="edit"
                          onClick={() => {
                            setEditingSlug(editingSlug === code.slug ? null : code.slug);
                            setEditUrl(code.targetUrl);
                          }}
                        >
                          Retarget
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={selectedSlug === code.slug ? "expand_less" : "query_stats"}
                          onClick={() =>
                            setSelectedSlug(selectedSlug === code.slug ? null : code.slug)
                          }
                        >
                          Stats
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="delete"
                          aria-label={`Delete ${code.title}`}
                          onClick={() => void remove(code.slug)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Destination
                      </span>
                      {editingSlug === code.slug ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <TextInput
                            value={editUrl}
                            onChange={(event) => setEditUrl(event.target.value)}
                            mono
                            className="text-xs py-2"
                            aria-label="New destination URL"
                          />
                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="gradient"
                              size="sm"
                              icon="check"
                              onClick={() => void saveTarget(code.slug)}
                            >
                              Save
                            </Button>
                            <Button variant="subtle" size="sm" onClick={() => setEditingSlug(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={code.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-600 hover:text-sky-700 break-all font-mono"
                        >
                          {code.targetUrl}
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Last 7 days
                        </span>
                        <SparkBars data={code.last7Days} />
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Devices
                        </span>
                        <Breakdown data={code.devices} />
                      </div>
                    </div>

                    {selectedSlug === code.slug ? (
                      <div className="flex flex-col gap-4 p-4 rounded-xl border border-sky-200 bg-sky-50/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Operating systems
                            </span>
                            <Breakdown data={code.oses} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Countries
                            </span>
                            <Breakdown data={code.countries} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              Top referrers
                            </span>
                            <Breakdown
                              data={code.recent.reduce<Record<string, number>>((acc, scan) => {
                                acc[scan.referrer] = (acc[scan.referrer] ?? 0) + 1;
                                return acc;
                              }, {})}
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Recent scans
                          </span>
                          {code.recent.length === 0 ? (
                            <p className="text-xs text-slate-500 mt-1">No scans yet — share the link!</p>
                          ) : (
                            <div className="mt-1.5 overflow-x-auto rounded-lg border border-white bg-white">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-left text-slate-400 border-b border-slate-100">
                                    <th className="px-3 py-2 font-semibold">Time</th>
                                    <th className="px-3 py-2 font-semibold">Device</th>
                                    <th className="px-3 py-2 font-semibold">OS</th>
                                    <th className="px-3 py-2 font-semibold">Country</th>
                                    <th className="px-3 py-2 font-semibold">Referrer</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {code.recent.map((scan, index) => (
                                    <tr key={`${scan.ts}-${index}`} className="border-b border-slate-50 last:border-0">
                                      <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                                        {new Date(scan.ts).toLocaleString()}
                                      </td>
                                      <td className="px-3 py-2">
                                        <span className="inline-flex items-center gap-1 text-slate-700">
                                          <Icon
                                            name={DEVICE_ICONS[scan.device] ?? "device_unknown"}
                                            className="text-[13px] text-sky-600"
                                          />
                                          {scan.device}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-700">{scan.os}</td>
                                      <td className="px-3 py-2 font-mono text-slate-700">{scan.country}</td>
                                      <td className="px-3 py-2 text-slate-500 max-w-[10rem] truncate">
                                        {scan.referrer}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
