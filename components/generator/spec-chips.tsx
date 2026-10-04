import { Icon } from "@/components/ui/icon";
import { StatusDot } from "@/components/ui/badge";

const SPECS = [
  { icon: "bolt", iconTone: "text-amber-500", label: "Client-Side: 0ms Overhead" },
  { icon: "verified_user", iconTone: "text-emerald-600", label: "Reed-Solomon Level H (30%)" },
];

/** Engine capability chips shown beside the wizard. */
export function SpecChips() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {SPECS.map((spec) => (
        <div
          key={spec.label}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs"
        >
          <Icon name={spec.icon} className={`text-[15px] ${spec.iconTone}`} />
          <span>{spec.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-teal-800 text-xs font-medium shadow-2xs">
        <StatusDot className="bg-teal-500" />
        <span>Bangla QR EMVCo 2.3 Ready</span>
      </div>
    </div>
  );
}
