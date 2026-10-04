"use client";

import { cn } from "@/lib/utils";

export type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Right-aligned mono readout, e.g. "22% Area". */
  valueLabel?: string;
  minLabel?: string;
  maxLabel?: string;
  id?: string;
  className?: string;
};

/** Studio range control: 4px track, sky active span, 16px disk thumb. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  valueLabel,
  minLabel,
  maxLabel,
  id,
  className,
}: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="font-semibold text-slate-700">
          {label}
        </label>
        {valueLabel ? (
          <span className="font-mono font-semibold text-text-navy whitespace-nowrap shrink-0">
            {valueLabel}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        type="range"
        className="studio-slider w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {minLabel || maxLabel ? (
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
