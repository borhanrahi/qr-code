import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldProps = {
  label: ReactNode;
  /** Small note rendered next to the label. */
  hint?: ReactNode;
  /** Right-aligned status readout (e.g. validation state). */
  trailing?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

/** Label + hint/status row + control. Every form row in the app uses this. */
export function Field({ label, hint, trailing, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"
        >
          <span>{label}</span>
          {hint ? <span className="text-[11px] font-normal text-teal-700">{hint}</span> : null}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}
