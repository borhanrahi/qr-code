import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type Variant = "primary" | "gradient" | "secondary" | "ghost" | "subtle" | "active-tab";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Material Symbols name rendered before the label. */
  icon?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:bg-primary-hover",
  gradient:
    "bg-gradient-to-r from-sky-600 via-sky-600 to-cyan-600 text-white shadow-md shadow-sky-500/25 hover:from-sky-700 hover:to-cyan-700",
  secondary:
    "bg-white text-text-navy border border-border-subtle hover:bg-surface-bg hover:border-border-strong",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-surface-subtle",
  subtle:
    "bg-surface-subtle text-slate-700 border border-border-subtle hover:bg-slate-200/80",
  "active-tab":
    "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-xs font-bold",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3 py-1.5 text-sm gap-2",
  lg: "w-full py-3.5 px-4 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} className="text-[15px]" /> : null}
      {children}
    </button>
  );
}
