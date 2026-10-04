import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

/** Layer 1 surface: white card, hairline border, ultra-diffused shadow. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border-subtle shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = {
  /** Material Symbols name for the leading tile. */
  icon?: string;
  iconTone?: string;
  title: ReactNode;
  /** Small pill shown right after the title. */
  badge?: ReactNode;
  /** Right-aligned controls (buttons, mono readouts). */
  actions?: ReactNode;
  className?: string;
};

/** Inspector section header: icon tile + title + badge, trailing actions. */
export function CardHeader({
  icon,
  iconTone = "bg-sky-100 text-sky-700",
  title,
  badge,
  actions,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-slate-100 px-4 sm:px-5 py-3.5",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {icon ? (
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              iconTone,
            )}
          >
            <Icon name={icon} className="text-[17px]" />
          </span>
        ) : null}
        <span className="text-sm font-bold text-slate-900 sm:truncate">{title}</span>
        {badge}
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">{actions}</div>
      ) : null}
    </div>
  );
}
