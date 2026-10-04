"use client";

import { useState } from "react";
import { buildPayload } from "@/lib/qr/builders";
import { downloadQr, toDataUrl } from "@/lib/qr/export";
import { useQrStore } from "@/store/useQrStore";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const FORMATS: { key: string; label: string; caption: string; ready: boolean }[] = [
  { key: "svg", label: "SVG", caption: "Vector", ready: true },
  { key: "pdf", label: "PDF", caption: "CMYK", ready: false },
  { key: "eps", label: "EPS", caption: "Illustrator", ready: false },
  { key: "base64", label: "Base64", caption: "Data URI", ready: true },
];

/** Master export stack: primary PNG download + secondary format cluster. */
export function ExportBar() {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const design = useQrStore((state) => state.design);
  const [notice, setNotice] = useState<string | null>(null);

  const payload = buildPayload(activeType, values);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const run = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      flash(message);
    } catch {
      flash("Export failed");
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-1">
      <Button
        variant="gradient"
        size="lg"
        icon="download"
        onClick={() =>
          run(() => downloadQr(payload, design, "png"), "PNG downloaded")
        }
      >
        Download Master PNG (Lossless {design.resolution}px)
      </Button>

      <div className="grid grid-cols-4 gap-2">
        {FORMATS.map((format) => (
          <button
            key={format.key}
            type="button"
            disabled={!format.ready}
            title={format.ready ? undefined : "Planned for v2 (PDF/EPS are plain-design exports)"}
            onClick={() => {
              if (format.key === "svg") {
                void run(() => downloadQr(payload, design, "svg"), "SVG downloaded");
              } else if (format.key === "base64") {
                void run(async () => {
                  const dataUrl = await toDataUrl(payload, design);
                  await navigator.clipboard.writeText(dataUrl);
                }, "Base64 copied");
              }
            }}
            className={cn(
              "py-2 px-2 rounded-lg border text-center transition-colors flex flex-col items-center",
              format.ready
                ? "bg-surface-subtle hover:bg-slate-100 border-border-subtle text-slate-800"
                : "bg-slate-50 border-slate-200/60 text-slate-400 cursor-not-allowed",
            )}
          >
            <span className="font-bold text-xs">{format.label}</span>
            <span className="text-[9px] text-slate-400">
              {format.ready ? format.caption : "v2"}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(
                "scancraft:design",
                JSON.stringify({ payload, design }),
              );
              flash("Saved to workspace");
            } catch {
              flash("Storage unavailable");
            }
          }}
          className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors"
        >
          <Icon name="bookmark_add" className="text-[16px] text-slate-400" />
          <span>Save to Workspace</span>
        </button>

        <button
          type="button"
          onClick={() =>
            run(async () => {
              await navigator.clipboard.writeText(payload);
            }, "Payload copied")
          }
          className="text-slate-600 hover:text-sky-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <Icon name="share" className="text-[16px] text-slate-400" />
          <span>Share Vector Link</span>
        </button>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "text-[11px] font-mono text-center transition-opacity",
          notice ? "text-teal-700 opacity-100" : "opacity-0",
        )}
      >
        {notice ?? "—"}
      </p>
    </div>
  );
}
