"use client";

import { useQrStore } from "@/store/useQrStore";
import { Toggle } from "@/components/ui/toggle";
import { Icon } from "@/components/ui/icon";

/** Feature row: enable dynamic (trackable) QR matrix. */
export function DynamicSwitch() {
  const dynamic = useQrStore((state) => state.dynamic);
  const setDynamic = useQrStore((state) => state.setDynamic);

  return (
    <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
          <Icon name="alt_route" className="text-[19px]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Enable Dynamic QR Matrix</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-200/80 text-sky-900 font-mono text-[9px] font-bold tracking-wider">
              TRACKABLE
            </span>
          </div>
          <span className="text-xs text-slate-600 leading-tight">
            Change destination link post-print, aggregate OS scans &amp; geo-heatmap.
          </span>
        </div>
      </div>

      <Toggle checked={dynamic} onChange={setDynamic} label="Enable dynamic QR matrix" />
    </div>
  );
}
