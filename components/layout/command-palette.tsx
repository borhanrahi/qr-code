"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CONTENT_TYPES } from "@/lib/qr/content-types";
import type { QrContentType } from "@/lib/qr/types";
import { useQrStore } from "@/store/useQrStore";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint: string;
  icon: string;
  keywords: string;
  run: () => void;
};

const PAGES: Array<{ label: string; hint: string; icon: string; href: string }> = [
  { label: "Generator", hint: "Design a static QR code", icon: "qr_code_2", href: "/" },
  {
    label: "Dynamic QR & Analytics",
    hint: "Short links with scan tracking",
    icon: "query_stats",
    href: "/dynamic-qr",
  },
  { label: "Bulk CSV", hint: "Generate a batch from a spreadsheet", icon: "table_rows", href: "/bulk-csv" },
  { label: "API & Docs", hint: "REST endpoints and live playground", icon: "code", href: "/api-docs" },
];

/** Rank matches: label prefix beats label substring beats keyword hit. */
function score(item: CommandItem, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  if (label.startsWith(q)) return 100;
  if (label.includes(q)) return 60;
  if (item.keywords.includes(q)) return 30;
  return 0;
}

export function CommandPalette() {
  const router = useRouter();
  const setType = useQrStore((state) => state.setType);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<CommandItem[]>(() => {
    const typeItems: CommandItem[] = CONTENT_TYPES.map((type) => ({
      id: `type:${type.value}`,
      label: type.label,
      hint: type.blurb,
      icon: type.icon,
      keywords: `${type.value} ${type.label} ${type.blurb} qr code`.toLowerCase(),
      run: () => {
        setType(type.value as QrContentType);
        router.push("/");
      },
    }));

    const pageItems: CommandItem[] = PAGES.map((page) => ({
      id: `page:${page.href}`,
      label: page.label,
      hint: page.hint,
      icon: page.icon,
      keywords: `${page.label} ${page.hint} page`.toLowerCase(),
      run: () => router.push(page.href),
    }));

    return [...typeItems, ...pageItems];
  }, [router, setType]);

  const matches = useMemo(() => {
    const scored = items
      .map((item) => ({ item, value: score(item, query) }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value);
    return scored.map((entry) => entry.item).slice(0, 8);
  }, [items, query]);

  // ⌘K / Ctrl+K toggles the palette from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  /** Open with a clean slate; all callers funnel through here. */
  const openPalette = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const closePalette = () => setOpen(false);

  // A new query always restarts the highlight on the first match.
  const highlighted = query ? 0 : active;

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPalette}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
      >
        <Icon name="search" className="text-[15px]" />
        <span>Quick Search</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-slate-200 text-slate-500 rounded font-semibold shadow-2xs">
          ⌘K
        </kbd>
      </button>
    );
  }

  const choose = (item: CommandItem | undefined) => {
    if (!item) return;
    closePalette();
    item.run();
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (matches.length ? (current + 1) % matches.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        matches.length ? (current - 1 + matches.length) % matches.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(matches[highlighted]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
      <button
        type="button"
        aria-label="Close search"
        onClick={closePalette}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        className="relative w-full max-w-lg bg-white rounded-xl border border-border-subtle shadow-modal overflow-hidden"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
          <Icon name="search" className="text-[18px] text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onListKeyDown}
            placeholder="Search QR types and pages…"
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded font-semibold">
            ESC
          </kbd>
        </div>

        {matches.length ? (
          <ul ref={listRef} className="max-h-72 overflow-y-auto py-1.5">
            {matches.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-index={index}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    index === highlighted ? "bg-sky-50" : "hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    index === highlighted
                      ? "bg-sky-100 text-sky-700"
                      : "bg-surface-subtle text-slate-500",
                  )}
                  >
                    <Icon name={item.icon} className="text-[17px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900 truncate">
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">{item.hint}</span>
                  </span>
                  {index === highlighted ? (
                    <span className="text-[10px] font-mono uppercase text-sky-600 shrink-0">
                      ↵
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 flex flex-col items-center gap-1.5 text-center">
            <Icon name="search_off" className="text-[24px] text-slate-300" />
            <p className="text-xs text-slate-500">No matches for “{query}”</p>
          </div>
        )}

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 text-[10px] text-slate-400">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
