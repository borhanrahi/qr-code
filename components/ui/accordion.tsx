"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export type AccordionItemProps = {
  /** Icon tile shown in the header. */
  icon?: string;
  iconTone?: string;
  title: ReactNode;
  /** Pill right after the title. */
  badge?: ReactNode;
  /** Trailing readout (contrast score, ECC level...). */
  trailing?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

/** One collapsible studio section styled as a bordered white card. */
export function AccordionItem({
  icon,
  iconTone = "bg-sky-100 text-sky-700",
  title,
  badge,
  trailing,
  defaultOpen = false,
  children,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        "bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden transition-all",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="w-full px-4 sm:px-5 py-3.5 bg-surface-subtle/70 border-b border-border-subtle flex items-center justify-between gap-2 text-left hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1">
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
          {badge ? <span className="inline-flex shrink-0">{badge}</span> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {trailing}
          <Icon
            name={open ? "expand_less" : "expand_more"}
            className="text-[20px] text-slate-400"
          />
        </div>
      </button>
      {open ? <div className="p-4 sm:p-5 flex flex-col gap-4">{children}</div> : null}
    </section>
  );
}
