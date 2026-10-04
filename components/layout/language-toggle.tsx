"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Locale = "en" | "bn";

/** EN / বাংলা (BN) locale switch — reused on every page header. */
export function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <div className="flex items-center bg-surface-subtle p-0.5 rounded-lg border border-border-subtle text-xs">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "px-2 py-0.5 rounded transition-colors",
          locale === "en"
            ? "font-bold bg-white text-slate-900 shadow-2xs"
            : "font-medium text-slate-600 hover:text-slate-900",
        )}
      >
        EN
      </button>
      <span className="text-slate-300 px-0.5">|</span>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={cn(
          "px-2 py-0.5 rounded transition-colors",
          locale === "bn"
            ? "font-bold bg-white text-slate-900 shadow-2xs"
            : "font-medium text-slate-600 hover:text-slate-900",
        )}
      >
        বাংলা<span className="hidden sm:inline"> (BN)</span>
      </button>
    </div>
  );
}
