"use client";

import { Chip } from "@/components/ui/chip";
import type { QrContentType } from "@/lib/qr/types";

export type Preset = {
  label: string;
  /** Field values to apply. */
  apply: Record<string, string>;
  /** Optionally switch to another content type at the same time. */
  type?: QrContentType;
};

/** Row of quick preset chips; picking one overwrites matching form fields. */
export function PresetRow({
  presets,
  onPick,
}: {
  presets: Preset[];
  onPick: (preset: Preset) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-slate-500 mr-1 font-medium">Smart Presets:</span>
      {presets.map((preset) => (
        <Chip key={preset.label} onClick={() => onPick(preset)}>
          {preset.label}
        </Chip>
      ))}
    </div>
  );
}
