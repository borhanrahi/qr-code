"use client";

import { useRef } from "react";
import { useQrStore } from "@/store/useQrStore";
import { BRAND_MARKS, brandMarkDataUri } from "@/lib/qr/brand-marks";
import { Slider } from "@/components/ui/slider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024;

/** Logo upload, preset brand gallery, scale & padding controls. */
export function LogoPanel() {
  const design = useQrStore((state) => state.design);
  const setDesign = useQrStore((state) => state.setDesign);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => setDesign({ logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Upload dropzone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-5 rounded-xl bg-sky-50/40 border-2 border-dashed border-sky-200 hover:border-sky-400 hover:bg-sky-50/70 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group w-full"
      >
        <span className="w-10 h-10 rounded-full bg-white group-hover:bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs border border-sky-100 transition-colors">
          <Icon name="cloud_upload" className="text-[22px]" />
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">
            Click to upload SVG, PNG or WebP
          </span>
          <span className="text-[11px] text-slate-500">
            Max recommended payload size: 2.5 MB • Vector SVG ideal
          </span>
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {/* Preset brand gallery */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700">
          Quick Select Fintech &amp; Social Marks
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {BRAND_MARKS.map((mark) => {
            const uri = brandMarkDataUri(mark);
            const active = design.logo === uri;
            return (
              <button
                key={mark.id}
                type="button"
                onClick={() => setDesign({ logo: active ? undefined : uri })}
                className={cn(
                  "px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface-subtle border border-border-subtle hover:bg-slate-100 text-slate-700",
                )}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: mark.color }}
                >
                  {mark.glyph}
                </span>
                <span>{mark.label}</span>
              </button>
            );
          })}

          {design.logo ? (
            <button
              type="button"
              onClick={() => setDesign({ logo: undefined })}
              className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Icon name="close" className="text-[14px]" />
              Remove logo
            </button>
          ) : null}
        </div>
      </div>

      {/* Scale + padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <Slider
          id="logo-scale"
          label="Asset Scale"
          value={design.logoSize}
          min={10}
          max={34}
          onChange={(logoSize) => setDesign({ logoSize })}
          valueLabel={`${design.logoSize}% Area`}
        />
        <Slider
          id="logo-padding"
          label="Padding Buffer Clearance"
          value={design.logoPadding}
          min={0}
          max={24}
          onChange={(logoPadding) => setDesign({ logoPadding })}
          valueLabel={`${design.logoPadding} px`}
        />
      </div>
    </>
  );
}
