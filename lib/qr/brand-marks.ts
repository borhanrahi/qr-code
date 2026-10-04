/**
 * Preset centre logos rendered as SVG data URIs, so the logo gallery works
 * with zero network requests and never taints the export canvas.
 */

export type BrandMark = {
  id: string;
  label: string;
  color: string;
  glyph: string;
  /** Accent text drawn on the mark. */
  text?: string;
};

export const BRAND_MARKS: BrandMark[] = [
  { id: "scancraft", label: "ScanCraft", color: "#0284c7", glyph: "S" },
  { id: "bkash", label: "bKash", color: "#d82a6d", glyph: "b" },
  { id: "nagad", label: "Nagad", color: "#f7941e", glyph: "ন" },
  { id: "whatsapp", label: "WhatsApp", color: "#16a34a", glyph: "W" },
  { id: "youtube", label: "YouTube", color: "#dc2626", glyph: "▶" },
  { id: "facebook", label: "Facebook", color: "#2563eb", glyph: "f" },
  { id: "twitter", label: "Twitter / X", color: "#0f172a", glyph: "𝕏" },
];

export function brandMarkDataUri(mark: BrandMark): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
<rect width="96" height="96" rx="24" fill="${mark.color}"/>
<text x="48" y="62" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="44" font-weight="700" fill="#ffffff" text-anchor="middle">${mark.glyph}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
