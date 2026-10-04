"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShapeOption<T extends string> = {
  value: T;
  label: string;
  /** SVG swatch shown inside the tile. */
  swatch: ReactNode;
};

export type ShapePickerProps<T extends string> = {
  title: string;
  caption?: string;
  options: ShapeOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Grid of icon tiles for picking a visual preset (body/eye shapes). */
export function ShapePicker<T extends string>({
  title,
  caption,
  options,
  value,
  onChange,
}: ShapePickerProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800">{title}</span>
        {caption ? <span className="text-xs text-slate-500 font-mono">{caption}</span> : null}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "p-2.5 rounded-lg flex flex-col items-center gap-1.5 transition-all",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                active
                  ? "bg-gradient-to-br from-sky-600 to-cyan-600 text-white border-transparent shadow-xs"
                  : "bg-surface-subtle border-border-subtle hover:bg-slate-100 text-slate-500",
              )}
            >
              {option.swatch}
              <span
                className={cn(
                  "text-[11px]",
                  active ? "font-bold" : "font-medium text-slate-600",
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
