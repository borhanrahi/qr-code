import { Container } from "./container";

const FOOTER_LINKS = [
  { label: "Privacy Shield", href: "#" },
  { label: "Bangla QR Specs", href: "#" },
  { label: "Status", href: "#" },
  { label: "Terms", href: "#" },
];

/** Minimal studio footer: privacy status, legal links, copyright. */
export function SiteFooter() {
  return (
    <footer className="w-full bg-white border-t border-border-subtle mt-auto">
      <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-600 font-medium">
            100% Client-Side Ready • No Server Tracking for Static Codes
          </span>
        </div>

        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-slate-400">
          © 2025 ScanCraft Studio. Next-gen QR Engine.
        </p>
      </Container>
    </footer>
  );
}
