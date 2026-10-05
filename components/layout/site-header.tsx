"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Icon } from "@/components/ui/icon";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LanguageToggle } from "./language-toggle";
import { CommandPalette } from "./command-palette";

const NAV_ITEMS = [
  { label: "Generator", href: "/" },
  { label: "Dynamic QR & Analytics", href: "/dynamic-qr" },
  { label: "Bulk CSV", href: "/bulk-csv" },
  { label: "API & Docs", href: "/api-docs" },
];

/** Fixed application header shared by every page of the studio. */
export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <Container className="h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand + primary navigation */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-cyan-600 text-white shadow-xs">
              <Icon name="qr_code_scanner" className="text-[19px]" />
            </span>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ScanCraft
            </span>
            <span className="hidden sm:block">
              <Badge tone="gradient" variant="solid" className="px-2 py-0.5 text-[11px] font-bold tracking-wide">
                PRO
              </Badge>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs"
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Status, search, locale, account */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <Icon name="lock" className="text-[15px] text-emerald-600" />
            <span>Client-side Encrypted</span>
            <StatusDot className="bg-emerald-500" />
          </div>

          <div className="hidden xl:block">
            <CommandPalette />
          </div>

          <LanguageToggle />

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          >
            <Icon name="notifications" className="text-[20px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="relative flex items-center pl-1">
            <span className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20 bg-gradient-to-br from-sky-600 to-cyan-600 text-white text-xs font-bold flex items-center justify-center">
              SC
            </span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      </Container>
    </header>
  );
}
