"use client";

import type { ReactNode } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover } from "@/components/ui/popover";
import { DensityMeter } from "./density-meter";
import { PresetsPanel } from "./panels/presets-panel";
import { UtmBuilder } from "./panels/utm-builder";

/** Step 1 card: content payload engine shell + capacity footer. */
export function PayloadCard({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="px-5 sm:px-6 py-4"
        icon="dataset"
        title={<span className="text-base">1. Content Payload Engine</span>}
        badge={
          <Badge mono tone="sky" className="ml-1">
            Live Binding
          </Badge>
        }
        actions={
          <>
            <Popover
              label="Presets"
              icon="history"
              panelTitle="Smart Presets"
              align="right"
            >
              {(close) => <PresetsPanel close={close} />}
            </Popover>
            <Popover
              label="UTM Builder"
              icon="tune"
              panelTitle="UTM Campaign Builder"
              align="right"
            >
              {(close) => <UtmBuilder close={close} />}
            </Popover>
          </>
        }
      />

      <div className="px-5 sm:px-6 pt-5 pb-5 flex flex-col gap-4">
        {children}
        <DensityMeter />
      </div>
    </Card>
  );
}