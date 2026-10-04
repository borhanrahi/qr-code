"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Icon } from "@/components/ui/icon";

/** Map pin payload (geo:lat,lng). */
export function GeoForm() {
  const { values, set } = useTypeValues("geo");

  const lat = Number(values.lat);
  const lng = Number(values.lng);
  const valid = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field htmlFor="qr-lat" label="Latitude" trailing={
        valid ? (
          <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
            <Icon name="verified" className="text-[15px] text-emerald-600" /> In range
          </span>
        ) : undefined
      }>
        <TextInput
          id="qr-lat"
          mono
          inputMode="decimal"
          value={values.lat ?? ""}
          onChange={(event) => set("lat", event.target.value)}
          placeholder="23.8103"
        />
      </Field>

      <Field htmlFor="qr-lng" label="Longitude">
        <TextInput
          id="qr-lng"
          mono
          inputMode="decimal"
          value={values.lng ?? ""}
          onChange={(event) => set("lng", event.target.value)}
          placeholder="90.4125"
        />
      </Field>
    </div>
  );
}
