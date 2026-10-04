"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCodeStyling from "qr-code-styling";
import { SAMPLE_CSV, parseCsv, toCsv, type BulkRow, type CsvParseResult } from "@/lib/csv";
import { toQrOptions } from "@/lib/qr/styling";
import { downloadQr } from "@/lib/qr/export";
import { useQrStore } from "@/store/useQrStore";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/text-area";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Small live QR preview that follows the studio design settings. */
function BulkQrPreview({ payload }: { payload: string }) {
  const design = useQrStore((state) => state.design);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const options = toQrOptions({ data: payload, design, size: 320 });
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(container);
      return;
    }
    qrRef.current.update(options);
  }, [payload, design]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`QR preview for ${payload.slice(0, 60)}`}
      className="w-full max-w-[18rem] aspect-square [&_canvas]:w-full [&_canvas]:h-full [&_img]:w-full [&_img]:h-full"
    />
  );
}

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function BulkStudio() {
  const router = useRouter();
  const design = useQrStore((state) => state.design);
  const setType = useQrStore((state) => state.setType);
  const setValue = useQrStore((state) => state.setValue);

  const [source, setSource] = useState("");
  const [result, setResult] = useState<CsvParseResult | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [batch, setBatch] = useState<{ done: number; total: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => result?.rows ?? [], [result]);
  const validRows = useMemo(() => rows.filter((row) => row.valid), [rows]);
  const selected = useMemo(
    () => validRows.find((row) => row.id === selectedId) ?? validRows[0] ?? null,
    [validRows, selectedId],
  );

  const runParse = (text: string) => {
    const parsed = parseCsv(text);
    setResult(parsed);
    setSelectedId(parsed.rows.find((row) => row.valid)?.id ?? null);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setSource(text);
      runParse(text);
    };
    reader.readAsText(file);
  };

  const downloadAll = async () => {
    if (!validRows.length || batch) return;
    setBatch({ done: 0, total: validRows.length });
    for (let i = 0; i < validRows.length; i += 1) {
      try {
        await downloadQr(validRows[i].payload, design, "png");
      } catch {
        // Skip rows the engine cannot render; keep the batch moving.
      }
      setBatch({ done: i + 1, total: validRows.length });
      await sleep(250);
    }
    setBatch(null);
  };

  const sendToStudio = (row: BulkRow) => {
    const isUrl = /^https?:\/\//i.test(row.payload);
    if (isUrl) {
      setType("url");
      setValue("url", "url", row.payload);
    } else {
      setType("text");
      setValue("text", "text", row.payload);
    }
    router.push("/");
  };

  const copyPayload = async (payload: string) => {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-14 flex flex-col gap-5">
      {/* Input */}
      <Card className="overflow-hidden">
        <CardHeader
          icon="upload_file"
          title={<span className="text-base">1. Import your CSV</span>}
          badge={<Badge tone="sky" mono>title,url</Badge>}
          actions={
            <>
              <Button variant="subtle" size="sm" icon="description" onClick={() => triggerDownload("scancraft-bulk-template.csv", "title,url\nExample Landing,https://example.com/landing\n", "text/csv")}>
                Template
              </Button>
              <Button variant="subtle" size="sm" icon="playlist_add" onClick={() => { setSource(SAMPLE_CSV); runParse(SAMPLE_CSV); }}>
                Load sample
              </Button>
            </>
          }
        />
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.tsv,.txt,text/csv"
              className="hidden"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            <Button variant="secondary" size="md" icon="folder_open" onClick={() => fileRef.current?.click()}>
              Upload .csv file
            </Button>
            <div className="flex-1" />
            <Button
              variant="gradient"
              size="md"
              icon="play_arrow"
              disabled={!source.trim()}
              onClick={() => runParse(source)}
            >
              Parse rows
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon="delete_sweep"
              disabled={!source && !result}
              onClick={() => { setSource(""); setResult(null); setSelectedId(null); }}
            >
              Clear
            </Button>
          </div>

          <TextArea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder={"title,url\nSpring Campaign,https://example.com/spring\nMenu PDF,https://example.com/menu.pdf"}
            mono
            className="min-h-[120px] font-mono text-xs"
            aria-label="CSV content"
          />
        </div>
      </Card>

      {/* Results */}
      {result ? (
        <>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge tone="sky" mono>{rows.length} rows</Badge>
            <Badge tone="emerald" mono>{validRows.length} valid</Badge>
            {result.duplicates > 0 ? <Badge tone="amber" mono>{result.duplicates} duplicates</Badge> : null}
            <Badge tone="slate" mono>delimiter “{result.delimiter === "\t" ? "tab" : result.delimiter}”</Badge>
            <Badge tone={result.hasHeader ? "teal" : "slate"} mono>{result.hasHeader ? "header row" : "no header"}</Badge>
            <div className="flex-1" />
            <Button
              variant="secondary"
              size="sm"
              icon="download"
              disabled={!rows.length}
              onClick={() => triggerDownload("scancraft-bulk-export.csv", toCsv(rows), "text/csv")}
            >
              Export CSV
            </Button>
            <Button
              variant="gradient"
              size="sm"
              icon="zip"
              disabled={!validRows.length || !!batch}
              onClick={() => void downloadAll()}
            >
              {batch ? `Exporting ${batch.done}/${batch.total}…` : `Download all PNGs (${validRows.length})`}
            </Button>
          </div>

          {result.errors.length ? (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <Icon name="warning" className="text-[16px] shrink-0 mt-0.5" />
              <span>{result.errors.slice(0, 3).join(" · ")}{result.errors.length > 3 ? ` · +${result.errors.length - 3} more` : ""}</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Table */}
            <Card className="overflow-hidden lg:col-span-2">
              <CardHeader
                icon="table_rows"
                title={<span className="text-base">2. Review rows</span>}
                badge={<Badge tone="sky" mono>{rows.length}</Badge>}
              />
              <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
                <table className="w-full text-xs min-w-[34rem]">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-left text-slate-400 border-b border-slate-100">
                      <th className="px-4 py-2.5 font-semibold">#</th>
                      <th className="px-4 py-2.5 font-semibold">Title</th>
                      <th className="px-4 py-2.5 font-semibold">Payload</th>
                      <th className="px-4 py-2.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => row.valid && setSelectedId(row.id)}
                        className={cn(
                          "border-b border-slate-50 last:border-0 transition-colors",
                          row.valid && "cursor-pointer hover:bg-sky-50/50",
                          selected?.id === row.id && "bg-sky-50/70",
                          !row.valid && "opacity-50",
                        )}
                      >
                        <td className="px-4 py-2.5 font-mono text-slate-400">{row.id}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800 max-w-[9rem] truncate">{row.title}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-600 max-w-[16rem] truncate" title={row.payload}>
                          {row.payload || "— empty —"}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="download"
                              aria-label={`Download ${row.title}`}
                              disabled={!row.valid}
                              onClick={(event) => {
                                event.stopPropagation();
                                if (row.valid) void downloadQr(row.payload, design, "png");
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="delete"
                              aria-label={`Remove ${row.title}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setResult((current) =>
                                  current
                                    ? { ...current, rows: current.rows.filter((entry) => entry.id !== row.id) }
                                    : current,
                                );
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Preview */}
            <Card className="overflow-hidden lg:sticky lg:top-20">
              <CardHeader
                icon="qr_code_2"
                title={<span className="text-base">3. Row preview</span>}
                badge={selected ? <Badge tone="emerald" mono>#{selected.id}</Badge> : null}
              />
              <div className="p-5 flex flex-col items-center gap-4">
                {selected ? (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <BulkQrPreview payload={selected.payload} />
                    </div>
                    <div className="text-center flex flex-col gap-0.5 min-w-0 w-full">
                      <p className="text-sm font-bold text-slate-900 truncate">{selected.title}</p>
                      <p className="text-[11px] font-mono text-slate-500 break-all">{selected.payload}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                      <Button
                        variant="gradient"
                        size="sm"
                        icon="download"
                        onClick={() => void downloadQr(selected.payload, design, "png")}
                      >
                        PNG
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={copied ? "check" : "content_copy"}
                        onClick={() => void copyPayload(selected.payload)}
                      >
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button variant="subtle" size="sm" icon="construction" onClick={() => sendToStudio(selected)}>
                        Open in studio
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-10 flex flex-col items-center gap-2 text-center">
                    <Icon name="drag_indicator" className="text-[26px] text-slate-300" />
                    <p className="text-xs text-slate-500">Select a valid row to preview its QR.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
