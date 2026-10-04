"use client";

import { useMediaQuery } from "@/lib/use-media-query";
import { useQrStore } from "@/store/useQrStore";
import type { QrDesign } from "@/lib/qr/types";
import { Badge } from "@/components/ui/badge";
import { AccordionItem } from "@/components/ui/accordion";
import { PayloadCard } from "./payload-card";
import { DynamicSwitch } from "./dynamic-switch";
import { ContentForm } from "@/components/forms";
import { ColorsPanel, ContrastChip } from "./panels/colors-panel";
import { ShapesPanel } from "./panels/shapes-panel";
import { LogoPanel } from "./panels/logo-panel";
import { QualityPanel } from "./panels/quality-panel";
import { PreviewColumn } from "./preview/preview-column";
import { MobilePreviewSheet } from "./preview/mobile-preview-sheet";

const BODY_SHAPE_LABELS: Record<QrDesign["bodyShape"], string> = {
  square: "Classic Square",
  rounded: "Smooth Pillows",
  dots: "Circuit Dots",
  fluid: "Fluid Capsules",
  classy: "Classy Connect",
  diamond: "Diamond Grid",
};

const COLOR_MODE_LABELS: Record<QrDesign["colorMode"], string> = {
  solid: "Solid Flat",
  linear: "Duo-tone Gradient",
  radial: "Radial Glow",
};

/** Two-column workstation: configuration inspector + sticky preview stage. */
export function Workspace() {
  const activeType = useQrStore((state) => state.activeType);
  const design = useQrStore((state) => state.design);
  // Desktop breakpoint: only one preview studio (column or sheet) is ever mounted.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-28 lg:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: inspector */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <PayloadCard>
            <ContentForm type={activeType} />
            <DynamicSwitch />
          </PayloadCard>

          <AccordionItem
            icon="palette"
            title="Colors & Gradient Matrix"
            badge={<Badge tone="sky">{COLOR_MODE_LABELS[design.colorMode]}</Badge>}
            trailing={<ContrastChip />}
            defaultOpen
          >
            <ColorsPanel />
          </AccordionItem>

          <AccordionItem
            icon="interests"
            iconTone="bg-teal-100 text-teal-700"
            title="Body & Eye Frame Geometry"
            badge={<Badge tone="teal">Pattern: {BODY_SHAPE_LABELS[design.bodyShape]}</Badge>}
          >
            <ShapesPanel />
          </AccordionItem>

          <AccordionItem
            icon="verified"
            iconTone="bg-emerald-100 text-emerald-700"
            title="Center Brand Asset & Watermark"
            badge={<Badge tone="slate">{design.logo ? "Custom Asset" : "No Asset"}</Badge>}
          >
            <LogoPanel />
          </AccordionItem>

          <AccordionItem
            icon="shield"
            title="Precision & Redundancy Calibration"
            badge={
              <Badge mono tone="sky">
                Level {design.errorCorrection}
              </Badge>
            }
          >
            <QualityPanel />
          </AccordionItem>
        </div>

        {/* Right: sticky preview studio (desktop only — mobile uses the bottom sheet) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-5">
          {isDesktop ? <PreviewColumn /> : null}
        </div>
      </div>

      <MobilePreviewSheet />
    </div>
  );
}
