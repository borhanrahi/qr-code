"use client";

import { StatusDot } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

/** Viewport toolbar: live badge, zoom readout, utility icon buttons. */
export function PreviewToolbar({
  onReset,
  onCopy,
}: {
  onReset: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <StatusDot className="bg-teal-500" />
        <span className="text-xs font-bold text-slate-800 tracking-wide">
          LIVE COMPLIANCE VIEWPORT
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded text-slate-600 text-xs font-mono font-medium">
          <span>100% Zoom</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset matrix view"
          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icon name="refresh" className="text-[16px] block" />
        </button>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy payload"
          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icon name="content_copy" className="text-[16px] block" />
        </button>
      </div>
    </div>
  );
}
