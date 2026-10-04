"use client";

import { buildPayload } from "@/lib/qr/builders";
import { DEFAULT_DESIGN } from "@/lib/qr/types";
import { useQrStore } from "@/store/useQrStore";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PreviewToolbar } from "./preview-toolbar";
import { QrStage } from "./qr-stage";
import { ScanHealth } from "./scan-health";
import { ExportBar } from "./export-bar";
import { TelemetryCard } from "./telemetry-card";

/** Right column: sticky preview studio + export stack + telemetry. */
export function PreviewColumn() {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const design = useQrStore((state) => state.design);
  const setDesign = useQrStore((state) => state.setDesign);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(buildPayload(activeType, values));
    } catch {
      /* clipboard unavailable — silent no-op */
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 sm:p-6 flex flex-col gap-4 shadow-md overflow-hidden">
        <PreviewToolbar onReset={() => setDesign(DEFAULT_DESIGN)} onCopy={copyPayload} />
        <QrStage />
        <ScanHealth />

        <Slider
          id="export-resolution"
          label="Export Dimension Resolution"
          value={design.resolution}
          min={512}
          max={4096}
          step={256}
          onChange={(resolution) => setDesign({ resolution })}
          valueLabel={`${design.resolution} × ${design.resolution} px`}
          minLabel="Web / Social (512px)"
          maxLabel="Print Billboard (4096px)"
        />

        <ExportBar />
      </Card>

      <TelemetryCard />
    </div>
  );
}
