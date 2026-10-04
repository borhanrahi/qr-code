"use client";

import { useEffect, useState } from "react";
import { useQrStore } from "@/store/useQrStore";
import { contrastRatio, gradeContrast } from "@/lib/qr/contrast";
import { ColorField } from "@/components/generator/color-field";
import { Segmented } from "@/components/ui/segmented";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const MODES = [
  { value: "solid" as const, label: "Solid Flat" },
  { value: "linear" as const, label: "Linear Gradient" },
  { value: "radial" as const, label: "Radial Glow" },
];

/** Colours, gradient mode, eye overrides and background. */
export function ColorsPanel() {
  const design = useQrStore((state) => state.design);
  const setDesign = useQrStore((state) => state.setDesign);
  const [eyeLocked, setEyeLocked] = useState(false);

  // While the eye colour is synced, it always mirrors the matrix start colour.
  useEffect(() => {
    if (eyeLocked && design.eyeFrameColor !== design.startColor) {
      setDesign({ eyeFrameColor: design.startColor });
    }
  }, [eyeLocked, design.startColor, design.eyeFrameColor, setDesign]);

  const background = design.transparentBg ? "#FFFFFF" : design.backgroundColor;
  const ratio = contrastRatio(design.startColor, background);
  const grade = gradeContrast(ratio);

  return (
    <>
      <Segmented
        ariaLabel="Colour mode"
        options={MODES}
        value={design.colorMode}
        onChange={(colorMode) => setDesign({ colorMode })}
        appearance="plain"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorField
          label="Matrix Start Color"
          value={design.startColor}
          onChange={(startColor) => setDesign({ startColor })}
          actionIcon="colorize"
        />
        <ColorField
          label="Matrix Stop Color"
          value={design.stopColor}
          onChange={(stopColor) => setDesign({ stopColor })}
          actionIcon="colorize"
          disabled={design.colorMode === "solid"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorField
          label="Corner Eye Frame Color"
          labelNote={eyeLocked ? "Sync with Matrix" : undefined}
          headerExtra={
            <button
              type="button"
              onClick={() => setEyeLocked((locked) => !locked)}
              className="text-[10px] font-medium text-sky-700 hover:text-sky-900"
            >
              {eyeLocked ? "Unlock sync" : "Sync with Matrix"}
            </button>
          }
          value={eyeLocked ? design.startColor : design.eyeFrameColor}
          onChange={(eyeFrameColor) => setDesign({ eyeFrameColor })}
          actionIcon={eyeLocked ? "lock" : "lock_open"}
          onAction={() => setEyeLocked((locked) => !locked)}
          actionTitle={eyeLocked ? "Synced with matrix colour" : "Lock to matrix colour"}
        />

        <ColorField
          label="Matrix Background"
          headerExtra={
            <Checkbox
              checked={design.transparentBg}
              onChange={(event) => setDesign({ transparentBg: event.target.checked })}
            >
              Transparent
            </Checkbox>
          }
          value={design.backgroundColor}
          onChange={(backgroundColor) => setDesign({ backgroundColor })}
          actionIcon="colorize"
          disabled={design.transparentBg}
        />
      </div>

      {/* Validation badge — real WCAG ratio between matrix and background */}
      <div
        className={cn(
          "p-3 border rounded-lg flex flex-wrap items-center justify-between gap-2",
          grade === "AAA" && "bg-emerald-50/70 border-emerald-200",
          grade === "AA" && "bg-emerald-50/70 border-emerald-200",
          grade === "PASS" && "bg-sky-50/70 border-sky-200",
          grade === "FAIL" && "bg-rose-50/70 border-rose-200",
        )}
      >
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              grade === "AAA" && "bg-emerald-500",
              grade === "AA" && "bg-emerald-500",
              grade === "PASS" && "bg-sky-500",
              grade === "FAIL" && "bg-rose-500",
            )}
          />
          <span className="text-slate-800">
            Compliance Rating:{" "}
            <strong className="font-semibold font-mono">
              {grade === "FAIL"
                ? "Low contrast — darken the matrix or lighten the background"
                : grade === "PASS"
                  ? "Non-text Contrast Pass (WCAG 1.4.11 ≥ 3:1)"
                  : `WCAG ${grade} / High Speed Lens Pass`}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Icon name="contrast" className="text-[15px]" />
          <span>
            Contrast Ratio:{" "}
            <span
              className={cn(
                "font-bold font-mono",
                grade === "AAA" && "text-emerald-800",
                grade === "AA" && "text-emerald-800",
                grade === "PASS" && "text-sky-700",
                grade === "FAIL" && "text-rose-700",
              )}
            >
              {ratio.toFixed(2)} : 1
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

/** Compact contrast readout used as an accordion header trailing chip. */
export function ContrastChip() {
  const design = useQrStore((state) => state.design);
  const background = design.transparentBg ? "#FFFFFF" : design.backgroundColor;
  const ratio = contrastRatio(design.startColor, background);
  const grade = gradeContrast(ratio);

  return (
    <span
      className={cn(
        "text-xs font-mono font-semibold px-2 py-0.5 rounded border",
        grade === "AAA" && "text-emerald-700 bg-emerald-50 border-emerald-200",
        grade === "AA" && "text-emerald-700 bg-emerald-50 border-emerald-200",
        grade === "PASS" && "text-sky-700 bg-sky-50 border-sky-200",
        grade === "FAIL" && "text-rose-700 bg-rose-50 border-rose-200",
      )}
    >
      Contrast {ratio.toFixed(1)}:1 {grade}
    </span>
  );
}
