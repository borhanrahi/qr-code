import QRCodeStyling from "qr-code-styling";
import { toQrOptions } from "./styling";
import type { QrDesign } from "./types";

export type ExportFormat = "png" | "svg" | "jpeg" | "webp";

const fileBase = (data: string) =>
  `qrcode-${data.replace(/[^a-z0-9]+/gi, "-").slice(0, 32).toLowerCase() || "export"}`;

/** Render a throwaway instance at full resolution and trigger a download. */
export async function downloadQr(
  data: string,
  design: QrDesign,
  format: ExportFormat,
) {
  const qr = new QRCodeStyling(
    toQrOptions({ data, design, size: design.resolution }),
  );
  await qr.download({ name: fileBase(data), extension: format });
}

/** Render at export resolution and return a data URL (copy/share flows). */
export async function toDataUrl(data: string, design: QrDesign): Promise<string> {
  const qr = new QRCodeStyling(toQrOptions({ data, design, size: design.resolution }));
  const blob = await qr.getRawData("png");
  if (!(blob instanceof Blob)) throw new Error("QR render failed");
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
