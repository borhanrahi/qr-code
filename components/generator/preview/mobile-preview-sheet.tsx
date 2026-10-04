"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { useQrStore } from "@/store/useQrStore";
import { buildPayload } from "@/lib/qr/builders";
import { PreviewColumn } from "./preview-column";

/**
 * Mobile preview access (guide §4.3: "mobile: preview in bottom sheet").
 *
 * A fixed trigger bar keeps the live matrix one tap away while editing forms, and opens the full
 * preview studio + export stack as a scrollable bottom sheet. Only mounted below `lg`, so the
 * desktop sticky column remains the single preview instance on large screens.
 */
export function MobilePreviewSheet() {
  const [open, setOpen] = useState(false);
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);

  // Lock body scroll and wire Escape while the sheet is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const payload = buildPayload(activeType, values);

  return (
    <>
      {/* Trigger bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-surface-bg via-surface-bg/95 to-transparent pointer-events-none">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-preview-sheet"
          className="pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-500/25 active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Icon name="qr_code_2" className="text-[22px] shrink-0" />
            <span className="flex flex-col items-start min-w-0">
              <span className="text-sm font-bold">Preview &amp; Download</span>
              <span className="text-[11px] text-sky-100 font-mono truncate max-w-[13rem]">
                {payload}
              </span>
            </span>
          </span>
          <Icon name="expand_less" className="text-[22px] shrink-0" />
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close preview"
          onClick={() => setOpen(false)}
          className="absolute inset-0 w-full bg-slate-900/40 backdrop-blur-sm"
        />

        <div
          id="mobile-preview-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="QR preview and export"
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto overscroll-contain",
            "bg-surface-bg rounded-t-2xl border-t border-border-subtle shadow-modal",
            "transition-transform duration-300 ease-out",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="sticky top-0 z-10 bg-surface-bg/95 backdrop-blur-sm border-b border-border-subtle px-4 py-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Icon name="qr_code_2" className="text-[20px] text-sky-700" />
              <span className="text-sm font-bold text-slate-900">
                Preview Studio
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close preview"
              className="p-2 -mr-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Icon name="close" className="text-[20px] block" />
            </button>
          </div>

          {open ? (
            <div className="p-4 pb-8">
              <PreviewColumn />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}