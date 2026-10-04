"use client";

import { useMemo } from "react";
import { buildPayload } from "@/lib/qr/builders";
import { contrastRatio } from "@/lib/qr/contrast";
import { CAPACITY_BY_EC } from "@/lib/qr/types";
import { useQrStore } from "@/store/useQrStore";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Live scannability diagnostics: contrast, logo budget, payload density. */
export function ScanHealth() {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const design = useQrStore((state) => state.design);

  const result = useMemo(() => {
    const background = design.transparentBg ? "#FFFFFF" : design.backgroundColor;
    const ratio = contrastRatio(design.startColor, background);
    const payload = buildPayload(activeType, values);
    const used = new TextEncoder().encode(payload).length;
    const fill = used / CAPACITY_BY_EC[design.errorCorrection];

    const checks = [
      { label: `Contrast ${ratio.toFixed(1)}:1`, ok: ratio >= 3 },
      {
        label: design.logo ? `Logo ${design.logoSize}% of area` : "No logo occlusion",
        ok: !design.logo || design.logoSize <= 30,
      },
      { label: `Density ${(fill * 100).toFixed(0)}%`, ok: fill < 0.7 },
      {
        label: `ECC Level ${design.errorCorrection}`,
        ok: design.logo ? design.errorCorrection === "Q" || design.errorCorrection === "H" : true,
      },
    ];

    return { checks, passed: checks.every((check) => check.ok) };
  }, [activeType, values, design]);

  return (
    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-200/60 text-emerald-800 flex items-center justify-center">
          <Icon name={result.passed ? "verified" : "warning"} className="text-[16px]" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-emerald-950">
            {result.passed ? "100% Scan Readability Index" : "Scan reliability warning"}
          </span>
          <span className="text-[10px] text-emerald-700 truncate">
            {result.checks.map((check) => check.label).join(" • ")}
          </span>
        </div>
      </div>

      <span
        className={cn(
          "px-2 py-0.5 rounded text-white font-mono text-[11px] font-bold shrink-0",
          result.passed ? "bg-emerald-600" : "bg-amber-500",
        )}
      >
        {result.passed ? "PASSED" : "REVIEW"}
      </span>
    </div>
  );
}
