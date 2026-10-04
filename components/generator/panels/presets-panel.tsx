"use client";

import { PRESET_GROUPS, type Preset } from "@/lib/qr/presets";
import { useQrStore } from "@/store/useQrStore";
import { Icon } from "@/components/ui/icon";

/** Curated preset catalog grouped by intent; picking one fills the active form. */
export function PresetsPanel({ close }: { close: () => void }) {
  const setValue = useQrStore((state) => state.setValue);
  const setType = useQrStore((state) => state.setType);
  const activeType = useQrStore((state) => state.activeType);

  const apply = (preset: Preset) => {
    const target = preset.type ?? activeType;
    Object.entries(preset.apply).forEach(([key, value]) => {
      setValue(target, key, value);
    });
    if (preset.type) setType(preset.type);
    close();
  };

  return (
    <div className="flex flex-col gap-3">
      {PRESET_GROUPS.map((group) => (
        <div key={group.group} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {group.group}
          </span>
          {group.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => apply(preset)}
              className="w-full flex items-start gap-2.5 p-2 rounded-lg border border-border-subtle bg-surface-subtle/60 hover:bg-slate-100 hover:border-border-strong text-left transition-colors"
            >
              <span className="w-6 h-6 shrink-0 rounded-md bg-white border border-slate-200 text-sky-700 flex items-center justify-center mt-0.5">
                <Icon name="bookmark" className="text-[14px]" />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800">{preset.label}</span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  {preset.caption}
                </span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}