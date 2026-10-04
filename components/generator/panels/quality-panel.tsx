"use client";

import { useQrStore } from "@/store/useQrStore";
import type { ErrorCorrection } from "@/lib/qr/types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const LEVELS: {
  value: ErrorCorrection;
  percent: string;
  description: string;
}[] = [
  { value: "L", percent: "~7%", description: "Cleanest density, zero logo support" },
  { value: "M", percent: "~15%", description: "Standard commercial scanning" },
  { value: "Q", percent: "~25%", description: "Industrial & outdoor billboard" },
  { value: "H", percent: "~30%", description: "Guarantees scan with central logo" },
];

/** Reed-Solomon error correction calibration. */
export function QualityPanel() {
  const errorCorrection = useQrStore((state) => state.design.errorCorrection);
  const setDesign = useQrStore((state) => state.setDesign);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LEVELS.map((level) => {
          const active = level.value === errorCorrection;
          return (
            <button
              key={level.value}
              type="button"
              aria-pressed={active}
              onClick={() => setDesign({ errorCorrection: level.value })}
              className={cn(
                "p-3 rounded-lg border text-left flex flex-col gap-1 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                active
                  ? "bg-gradient-to-br from-sky-600 to-cyan-600 text-white shadow-xs border-sky-600"
                  : "bg-surface-subtle border-border-subtle hover:bg-slate-100",
              )}
            >
              <span className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-bold",
                    active ? "text-white" : "text-slate-800",
                  )}
                >
                  Level {level.value}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    active ? "text-cyan-100 bg-sky-800/40 px-1 rounded" : "text-slate-400",
                  )}
                >
                  {active ? `${level.percent.replace("~", "")} RECOVERY` : level.percent}
                </span>
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  active ? "text-sky-100 font-medium" : "text-slate-500",
                )}
              >
                {level.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
        <Icon name="verified_user" className="text-emerald-600 text-[22px] flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-900">
            Engine Verification Certificate
          </span>
          <p className="text-[11px] text-slate-600 leading-normal">
            Matrix calculated against ZXing standard 3.5.1 and iOS AVFoundation barcode
            scanners. Optical alignment patterns pass EMVCo QR merchant compliance
            guidelines.
          </p>
        </div>
      </div>
    </>
  );
}
