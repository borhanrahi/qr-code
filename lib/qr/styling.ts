import type { Options } from "qr-code-styling";
import type {
  BodyShape,
  ColorMode,
  EyeBall,
  EyeFrame,
  QrDesign,
} from "./types";

const bodyShapeMap: Record<BodyShape, NonNullable<Options["dotsOptions"]>["type"]> = {
  square: "square",
  rounded: "rounded",
  dots: "dots",
  fluid: "extra-rounded",
  classy: "classy",
  // qr-code-styling has no diamond figure; square is the closest neutral.
  diamond: "square",
};

const eyeFrameMap: Record<EyeFrame, NonNullable<Options["cornersSquareOptions"]>["type"]> = {
  curved: "extra-rounded",
  circle: "dot",
  leaf: "classy",
};

const eyeBallMap: Record<EyeBall, NonNullable<Options["cornersDotOptions"]>["type"]> = {
  square: "square",
  dot: "dot",
  rhombus: "extra-rounded",
};

function gradientFor(mode: ColorMode, startColor: string, stopColor: string) {
  if (mode === "solid") return undefined;
  return {
    type: mode as "linear" | "radial",
    rotation: mode === "linear" ? 90 : 0,
    colorStops: [
      { offset: 0, color: startColor },
      { offset: 1, color: stopColor },
    ],
  };
}

export type QrRenderOptions = {
  data: string;
  design: QrDesign;
  /** Canvas size in px (preview or export resolution). */
  size?: number;
};

/** Build the qr-code-styling configuration for the current payload + design. */
export function toQrOptions({ data, design, size = 600 }: QrRenderOptions): Options {
  const gradient = gradientFor(design.colorMode, design.startColor, design.stopColor);

  return {
    width: size,
    height: size,
    type: "canvas",
    data,
    qrOptions: { errorCorrectionLevel: design.errorCorrection },
    image: design.logo,
    imageOptions: {
      imageSize: Math.min(Math.max(design.logoSize / 100, 0.1), 0.4),
      margin: design.logoPadding,
      hideBackgroundDots: true,
    },
    dotsOptions: {
      type: bodyShapeMap[design.bodyShape],
      ...(gradient ? { gradient } : { color: design.startColor }),
    },
    cornersSquareOptions: {
      type: eyeFrameMap[design.eyeFrame],
      color: design.eyeFrameColor,
    },
    cornersDotOptions: {
      type: eyeBallMap[design.eyeBall],
      color: design.startColor,
    },
    backgroundOptions: {
      color: design.transparentBg ? "rgba(0,0,0,0)" : design.backgroundColor,
    },
  };
}
