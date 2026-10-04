import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const STEPS = [
  { number: 1, label: "Payload", state: "active" as const },
  { number: 2, label: "Brand Tuning", state: "upcoming" as const },
  { number: 3, label: "Export Master", state: "idle" as const },
];

/** Wizard breadcrumb: 1 Content → 2 Design → 3 Download. */
export function StepWizard({ current = 1 }: { current?: number }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1.5 rounded-xl shadow-xs">
      {STEPS.map((step, index) => {
        const active = step.number === current;
        const done = step.number < current;
        return (
          <div key={step.label} className="flex items-center gap-1">
            {index > 0 ? (
              <Icon name="chevron_right" className="text-[14px] text-slate-400" />
            ) : null}
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs",
                active && "bg-sky-50 border border-sky-200 text-sky-800 font-bold",
                !active && step.state !== "idle" && "bg-slate-50 text-slate-700 font-semibold",
                step.state === "idle" && !active && "text-slate-400",
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold",
                  active && "bg-sky-600 text-white",
                  done && "bg-slate-200 text-slate-700",
                  step.state === "idle" && "bg-slate-100 text-slate-400",
                )}
              >
                {step.number}
              </span>
              <span>{step.label}</span>
              {done ? (
                <Icon name="check" className="text-[14px] text-teal-600 font-bold" />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
