import { StepWizard } from "./step-wizard";
import { SpecChips } from "./spec-chips";
import { StatusDot } from "@/components/ui/badge";

/** Studio hero: eyebrow, H1, supporting copy + wizard/spec column. */
export function GeneratorHero() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-7 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold">
              <StatusDot className="bg-sky-600" />
              ENGINE v3.4 CORE RUNTIME
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
              W3C EMVCo &amp; Bangla QR Compliant
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight font-extrabold">
            Next-Gen QR Code Studio
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Create high-fidelity, production-grade vector matrixes rendered entirely
            client-side with zero latency. Seamlessly toggle between immutable offline
            codes and telemetry-enabled dynamic smart links.
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
          <StepWizard />
          <SpecChips />
        </div>
      </div>
    </section>
  );
}

/** Ambient blurred blobs behind the studio. */
export function StudioBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 left-1/3 w-[36rem] h-[36rem] bg-sky-200/35 rounded-full blur-3xl" />
      <div className="absolute -top-24 right-1/4 w-[28rem] h-[28rem] bg-teal-100/40 rounded-full blur-3xl" />
    </div>
  );
}
