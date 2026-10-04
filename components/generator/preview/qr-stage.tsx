"use client";

import { useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { buildPayload } from "@/lib/qr/builders";
import { toQrOptions } from "@/lib/qr/styling";
import { useQrStore } from "@/store/useQrStore";

/** Blueprint grid behind the matrix. */
function BlueprintGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none text-sky-200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="studioLightGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </pattern>
      </defs>
      <rect fill="url(#studioLightGrid)" width="100%" height="100%" />
    </svg>
  );
}

/** Precision frame calibration corners. */
function CalibrationCorners() {
  return (
    <div aria-hidden="true">
      <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-sky-500" />
      <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-500" />
      <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-500" />
      <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-sky-500" />
    </div>
  );
}

/** Renders the actual QR from store state and keeps the canvas in sync. */
export function QrStage() {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const design = useQrStore((state) => state.design);

  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const payload = useMemo(
    () => buildPayload(activeType, values),
    [activeType, values],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = toQrOptions({ data: payload, design, size: 640 });

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(container);
      return;
    }
    qrRef.current.update(options);
  }, [payload, design]);

  return (
    <div className="relative w-full aspect-square bg-surface-bg border border-border-subtle rounded-xl flex items-center justify-center p-6 sm:p-8 shadow-inner overflow-hidden">
      <BlueprintGrid />
      <CalibrationCorners />

      <div className="relative bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-200/90 flex items-center justify-center transition-transform hover:scale-[1.01] duration-300">
        <div
          ref={containerRef}
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 [&_canvas]:w-full [&_canvas]:h-full [&_img]:w-full [&_img]:h-full"
          role="img"
          aria-label="Generated QR code preview"
        />
      </div>

      {/* Live scanner sweep */}
      <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60 animate-pulse pointer-events-none" />
    </div>
  );
}
