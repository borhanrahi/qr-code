"use client";

import { buildPayload } from "@/lib/qr/builders";
import { useQrStore } from "@/store/useQrStore";
import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Icon } from "@/components/ui/icon";
import { PresetRow, type Preset } from "@/components/generator/smart-presets";

const PRESETS: Preset[] = [
  { label: "Campaign Landing", apply: { url: "scancraft.studio/go/spring-tech-conf-2025" } },
  { label: "Bangla QR Standard", type: "bangla", apply: {} },
  { label: "Restaurant PDF Menu", type: "file", apply: { fileUrl: "scancraft.studio/files/menu.pdf" } },
  { label: "Google 5★ Review", apply: { url: "g.page/r/scancraft/review" } },
];

export function UrlForm() {
  const { values, set } = useTypeValues("url");
  const setValue = useQrStore((state) => state.setValue);
  const setType = useQrStore((state) => state.setType);

  const raw = values.url?.trim() ?? "";
  const valid = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i.test(raw);
  const payload = buildPayload("url", { url: raw });

  return (
    <>
      <Field
        htmlFor="qr-target-url"
        label="Destination Target URL"
        hint="• Auto-sanitized"
        trailing={
          valid ? (
            <span className="text-xs font-mono text-emerald-700 font-medium flex items-center gap-1">
              <Icon name="verified" className="text-[15px] text-emerald-600" />
              Valid HTTP/HTTPS Protocol
            </span>
          ) : (
            <span className="text-xs font-mono text-amber-600 font-medium flex items-center gap-1">
              <Icon name="error" className="text-[15px] text-amber-500" />
              Waiting for a valid host
            </span>
          )
        }
      >
        <TextInput
          id="qr-target-url"
          prefix="https://"
          mono
          value={values.url ?? ""}
          onChange={(event) => set("url", event.target.value)}
          placeholder="yourbrand.com/campaign-route"
          suffix={
            valid ? <Icon name="check_circle" className="text-[20px]" /> : undefined
          }
          aria-invalid={!valid}
        />
        <p className="text-[11px] text-slate-400 font-mono truncate" title={payload}>
          Payload: {payload}
        </p>
      </Field>

      <PresetRow
        presets={PRESETS}
        onPick={(preset) => {
          const target = preset.type ?? "url";
          Object.entries(preset.apply).forEach(([key, value]) =>
            setValue(target, key, value),
          );
          if (preset.type) setType(preset.type);
        }}
      />
    </>
  );
}
