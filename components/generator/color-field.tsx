"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export type ColorFieldProps = {
  label: string;
  /** Note rendered right under/next to the label. */
  labelNote?: ReactNode;
  /** Extra control on the label row (checkbox, sync link). */
  headerExtra?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  /** Trailing icon button (eyedropper, lock...). */
  actionIcon?: string;
  onAction?: () => void;
  actionTitle?: string;
  disabled?: boolean;
};

/** Swatch (native color picker) + editable hex readout + action button. */
export function ColorField({
  label,
  labelNote,
  headerExtra,
  value,
  onChange,
  actionIcon = "colorize",
  onAction,
  actionTitle,
  disabled = false,
}: ColorFieldProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-1.5", disabled && "opacity-50")}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
          {labelNote ? (
            <span className="ml-1.5 text-[10px] font-medium text-sky-700">{labelNote}</span>
          ) : null}
        </label>
        {headerExtra}
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-surface-subtle border border-border-subtle rounded-lg">
        <label
          htmlFor={id}
          className="w-7 h-7 shrink-0 rounded-md shadow-2xs border border-slate-200 cursor-pointer"
          style={{ backgroundColor: value }}
          title={actionTitle ?? "Pick color"}
        >
          <input
            id={id}
            type="color"
            className="sr-only"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
          />
        </label>
        <input
          type="text"
          value={value.toUpperCase()}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label={`${label} hex value`}
          className="bg-transparent font-mono text-xs font-semibold text-text-navy uppercase w-24 focus:outline-none"
        />
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onAction}
            disabled={disabled}
            title={actionTitle}
            className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 disabled:cursor-not-allowed"
          >
            <Icon name={actionIcon} className="text-[15px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
