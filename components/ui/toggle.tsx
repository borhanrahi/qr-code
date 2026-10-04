"use client";

import { cn } from "@/lib/utils";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

/** Sleek iOS-style switch used for feature rows (dynamic QR, transparency...). */
export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <div
        className={cn(
          "w-11 h-6 rounded-full transition-colors",
          "bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500/40",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          "after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all",
          "peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-sky-600",
        )}
      />
    </label>
  );
}
