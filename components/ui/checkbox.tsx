import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children?: ReactNode;
};

/** 18px studio checkbox: subtle border, sky fill when selected. */
export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-1.5 cursor-pointer", className)}>
      <input
        type="checkbox"
        className={cn(
          "h-3.5 w-3.5 rounded border-slate-300 text-primary accent-sky-600",
          "focus:ring-sky-500/40 focus:ring-2 focus:ring-offset-0",
        )}
        {...props}
      />
      {children ? <span className="text-[11px] text-text-muted">{children}</span> : null}
    </label>
  );
}
