"use client";

import { CAPACITY_BY_EC } from "@/lib/qr/types";
import { useQrStore } from "@/store/useQrStore";
import { buildPayload } from "@/lib/qr/builders";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Payload size vs. capacity for the selected error-correction level. */
export function DensityMeter() {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const errorCorrection = useQrStore((state) => state.design.errorCorrection);

  const payload = buildPayload(activeType, values);
  const used = new TextEncoder().encode(payload).length;
  const capacity = CAPACITY_BY_EC[errorCorrection];
  const percent = Math.min((used / capacity) * 100, 100);

  const verdict =
    percent < 30
      ? { label: "Ultra-Reliable Scan", tone: "text-teal-700", bar: "bg-teal-500" }
      : percent < 65
        ? { label: "Reliable Scan", tone: "text-amber-600", bar: "bg-amber-500" }
        : { label: "Dense — lower ECC", tone: "text-rose-600", bar: "bg-rose-500" };

  return (
    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1.5 text-slate-600">
        <Icon name="memory" className="text-[15px] text-teal-600" />
        <span>
          Payload Density:{" "}
          <strong className="text-slate-900 font-mono">
            {used} / {capacity} bytes
          </strong>{" "}
          ({percent.toFixed(1)}% Capacity utilized)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", verdict.bar)}
            style={{ width: `${Math.max(percent, 3)}%` }}
          />
        </div>
        <span className={cn("text-xs font-mono font-semibold", verdict.tone)}>
          {verdict.label}
        </span>
      </div>
    </div>
  );
}
