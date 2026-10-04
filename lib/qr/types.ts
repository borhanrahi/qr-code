/** Content types offered in the type tab strip. */
export type QrContentType =
  | "url"
  | "bangla"
  | "wifi"
  | "vcard"
  | "text"
  | "email"
  | "sms"
  | "phone"
  | "geo"
  | "event"
  | "whatsapp"
  | "file"
  | "crypto";

export type ColorMode = "solid" | "linear" | "radial";
export type BodyShape = "square" | "rounded" | "dots" | "fluid" | "classy" | "diamond";
export type EyeFrame = "curved" | "circle" | "leaf";
export type EyeBall = "square" | "dot" | "rhombus";
export type ErrorCorrection = "L" | "M" | "Q" | "H";

/** Everything that affects how the matrix renders. */
export type QrDesign = {
  colorMode: ColorMode;
  startColor: string;
  stopColor: string;
  eyeFrameColor: string;
  backgroundColor: string;
  transparentBg: boolean;
  bodyShape: BodyShape;
  eyeFrame: EyeFrame;
  eyeBall: EyeBall;
  logo?: string;
  logoSize: number;
  logoPadding: number;
  errorCorrection: ErrorCorrection;
  resolution: number;
};

export type QrContentValues = Record<string, string>;

export const DEFAULT_DESIGN: QrDesign = {
  colorMode: "linear",
  startColor: "#0284C7",
  stopColor: "#0D9488",
  eyeFrameColor: "#0369A1",
  backgroundColor: "#FFFFFF",
  transparentBg: false,
  bodyShape: "rounded",
  eyeFrame: "curved",
  eyeBall: "dot",
  logo: undefined,
  logoSize: 22,
  logoPadding: 8,
  errorCorrection: "H",
  resolution: 2048,
};

/** Max capacity of a level-H QR (version 40) in bytes, used by the density meter. */
export const CAPACITY_BY_EC: Record<ErrorCorrection, number> = {
  L: 7897,
  M: 6109,
  Q: 4654,
  H: 3439,
};
