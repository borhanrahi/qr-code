"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
};

export type SegmentedProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** "pill" = white active card, "plain" = flat text segments. */
  appearance?: "pill" | "plain";
  className?: string;
  ariaLabel?: string;
};

/**
 * Segmented rail: inset track with an elevated active segment.
 * Used for color modes, eye shapes, and any 2-4 way choice.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  appearance = "pill",
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-1.5 p-1 rounded-lg bg-surface-subtle border border-border-subtle",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs transition-colors",
              appearance === "pill" && "font-semibold text-slate-600 hover:text-slate-900",
              appearance === "plain" && "font-semibold text-slate-600 hover:text-slate-900",
              active &&
                appearance === "pill" &&
                "bg-white text-sky-800 font-bold shadow-2xs border border-slate-200/60",
              active &&
                appearance === "plain" &&
                "bg-sky-50 text-sky-700 font-bold border border-sky-200/80",
            )}
          >
            {option.icon ? <Icon name={option.icon} className="text-[15px]" /> : null}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
