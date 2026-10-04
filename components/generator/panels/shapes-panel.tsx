"use client";

import { useQrStore } from "@/store/useQrStore";
import type { BodyShape, EyeBall, EyeFrame } from "@/lib/qr/types";
import { ShapePicker, type ShapeOption } from "@/components/generator/shape-picker";
import { Segmented } from "@/components/ui/segmented";

const swatch = "w-5 h-5 text-current";

const BODY_SHAPES: ShapeOption<BodyShape>[] = [
  {
    value: "square",
    label: "Square",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect height="7" width="7" x="3" y="3" />
        <rect height="7" width="7" x="14" y="3" />
        <rect height="7" width="7" x="3" y="14" />
        <rect height="7" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    value: "rounded",
    label: "Rounded",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect height="7" rx="2.5" width="7" x="3" y="3" />
        <rect height="7" rx="2.5" width="7" x="14" y="3" />
        <rect height="7" rx="2.5" width="7" x="3" y="14" />
        <rect height="7" rx="2.5" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    value: "dots",
    label: "Dots",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="3.5" />
        <circle cx="17.5" cy="6.5" r="3.5" />
        <circle cx="6.5" cy="17.5" r="3.5" />
        <circle cx="17.5" cy="17.5" r="3.5" />
      </svg>
    ),
  },
  {
    value: "fluid",
    label: "Fluid",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect height="7" rx="3.5" width="7" x="3" y="3" />
        <rect height="7" rx="3.5" width="7" x="14" y="3" />
        <rect height="7" rx="3.5" width="7" x="3" y="14" />
        <rect height="7" rx="3.5" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    value: "classy",
    label: "Classy",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 4C3 3.44772 3.44772 3 4 3H10V10H3V4Z" />
        <path d="M14 3H20C20.5523 3 21 3.44772 21 4V10H14V3Z" />
        <path d="M3 14H10V21H4C3.44772 21 3 20.5523 3 20V14Z" />
        <path d="M14 14H21V20C21 20.5523 20.5523 21 20 21H14V14Z" />
      </svg>
    ),
  },
  {
    value: "diamond",
    label: "Diamond",
    swatch: (
      <svg className={swatch} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect height="5" transform="rotate(45 6.5 1.5)" width="5" x="6.5" y="1.5" />
        <rect height="5" transform="rotate(45 17.5 1.5)" width="5" x="17.5" y="1.5" />
        <rect height="5" transform="rotate(45 6.5 12.5)" width="5" x="6.5" y="12.5" />
        <rect height="5" transform="rotate(45 17.5 12.5)" width="5" x="17.5" y="12.5" />
      </svg>
    ),
  },
];

const EYE_FRAMES = [
  { value: "curved" as const, label: "Curved Box" },
  { value: "circle" as const, label: "Circle Eye" },
  { value: "leaf" as const, label: "Leaf Border" },
];

const EYE_BALLS = [
  { value: "square" as const, label: "Square" },
  { value: "dot" as const, label: "Smooth Dot" },
  { value: "rhombus" as const, label: "Rhombus" },
];

/** Body dot matrix pattern + eye frame/core geometry. */
export function ShapesPanel() {
  const design = useQrStore((state) => state.design);
  const setDesign = useQrStore((state) => state.setDesign);

  return (
    <>
      <ShapePicker
        title="Body Dot Matrix Pattern"
        caption="6 Geometry Presets"
        options={BODY_SHAPES}
        value={design.bodyShape}
        onChange={(bodyShape: BodyShape) => setDesign({ bodyShape })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-700">Eye Frame Contour</span>
          <Segmented
            ariaLabel="Eye frame contour"
            options={EYE_FRAMES}
            value={design.eyeFrame}
            onChange={(eyeFrame: EyeFrame) => setDesign({ eyeFrame })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-700">Eye Core Nucleus</span>
          <Segmented
            ariaLabel="Eye core nucleus"
            options={EYE_BALLS}
            value={design.eyeBall}
            onChange={(eyeBall: EyeBall) => setDesign({ eyeBall })}
          />
        </div>
      </div>
    </>
  );
}
