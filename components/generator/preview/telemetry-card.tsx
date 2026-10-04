import { Icon } from "@/components/ui/icon";

/** Analytics teaser shown under the preview (v3 dynamic QR dashboards). */
export function TelemetryCard() {
  return (
    <div className="bg-white rounded-xl p-4 border border-border-subtle shadow-card flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
          <Icon name="query_stats" className="text-[18px]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900">
            Real-Time Redirection Telemetry
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            0 initial scans logged • Dhaka &amp; Global CDN Active
          </span>
        </div>
      </div>

      <a
        href="#"
        className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-0.5 hover:underline shrink-0"
      >
        <span>View Stats</span>
        <Icon name="arrow_forward" className="text-[14px]" />
      </a>
    </div>
  );
}
