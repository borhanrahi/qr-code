"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export type PopoverProps = {
  /** Trigger button label. */
  label: string;
  icon?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /** Panel heading, usually the current section name. */
  panelTitle?: ReactNode;
  /** Anchor edge on desktop; the panel is always a bottom sheet on mobile. */
  align?: "left" | "right";
  children: (close: () => void) => ReactNode;
};

/**
 * Small anchored panel for header actions (presets, UTM builder).
 * Renders as a bottom sheet under `sm` and as an anchored dropdown above it.
 */
export function Popover({
  label,
  icon,
  variant = "subtle",
  size = "sm",
  panelTitle,
  align = "right",
  children,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant={variant}
        size={size}
        icon={icon}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {label}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close panel"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] sm:hidden" />
          <div
            role="dialog"
            aria-label={label}
            className={cn(
              "z-50 border border-border-subtle bg-white shadow-modal",
              // Mobile: bottom sheet
              "fixed inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl p-4",
              // Desktop: anchored dropdown
              "sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-[calc(100%+0.5rem)] sm:max-h-[70vh] sm:w-80 sm:rounded-xl sm:p-3",
              align === "right" ? "sm:right-0" : "sm:left-0",
            )}
          >
            <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">{panelTitle ?? label}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-[15px] font-medium text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            {children(() => setOpen(false))}
          </div>
        </>
      ) : null}
    </div>
  );
}