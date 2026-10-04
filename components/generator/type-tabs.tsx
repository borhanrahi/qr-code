"use client";

import { cn } from "@/lib/utils";
import { CONTENT_TYPES } from "@/lib/qr/content-types";
import { useQrStore } from "@/store/useQrStore";
import { Icon } from "@/components/ui/icon";
import { StatusDot } from "@/components/ui/badge";

/** Horizontal scrollable strip that picks the active content type. */
export function TypeTabs() {
  const activeType = useQrStore((state) => state.activeType);
  const setType = useQrStore((state) => state.setType);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
      <div className="bg-white p-1.5 rounded-xl border border-border-subtle shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max" role="tablist" aria-label="QR content type">
          {CONTENT_TYPES.map((type) => {
            const active = type.value === activeType;
            return (
              <button
                key={type.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(type.value)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all text-xs",
                  active
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-xs font-bold"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium",
                )}
              >
                <Icon
                  name={type.icon}
                  className={cn(
                    "text-[17px]",
                    !active && type.value === "bangla" && "text-teal-600",
                    !active && type.value !== "bangla" && "text-slate-400",
                  )}
                />
                <span className={cn(!active && type.tag && "font-semibold text-slate-800")}>
                  {type.label}
                </span>
                {type.tag ? (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-tight",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {type.tag}
                  </span>
                ) : null}
                {active ? <StatusDot className="bg-white" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
