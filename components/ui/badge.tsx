import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = {
  children: ReactNode;
  tone?: "sky" | "teal" | "emerald" | "slate" | "amber" | "gradient";
  variant?: "soft" | "outline" | "solid";
  mono?: boolean;
  className?: string;
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  sky: "bg-sky-100 text-sky-800 border-sky-200",
  teal: "bg-teal-100 text-teal-800 border-teal-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  gradient:
    "bg-gradient-to-r from-sky-500 to-cyan-600 text-white border-transparent",
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  soft: "border",
  outline: "border bg-transparent",
  solid: "border-0",
};

/** Small metadata pill used across headers, tabs and panel titles. */
export function Badge({
  children,
  tone = "sky",
  variant = "soft",
  mono = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        mono && "font-mono text-[10px] font-bold uppercase tracking-wide",
        variants[variant],
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Pulsing status dot used in live/status chips. */
export function StatusDot({
  className,
  pulse = true,
}: {
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        pulse && "animate-pulse",
        className,
      )}
    />
  );
}
