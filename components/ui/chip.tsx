import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: string;
  children: ReactNode;
};

/** Compact pill button: preset shortcuts, brand marks, small actions. */
export function Chip({ active = false, icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
        active
          ? "bg-primary text-white shadow-xs"
          : "bg-surface-subtle text-slate-700 border border-border-subtle hover:bg-slate-200/70",
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} className="text-[15px]" /> : null}
      {children}
    </button>
  );
}
