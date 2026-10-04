"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Segmented } from "@/components/ui/segmented";

const SECURITY = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "Open" },
];

/** WiFi join payload (WIFI:T:…;S:…;P:…;;). */
export function WifiForm() {
  const { values, set } = useTypeValues("wifi");

  return (
    <div className="flex flex-col gap-4">
      <Field htmlFor="qr-wifi-ssid" label="Network Name (SSID)" trailing={
        <span className="text-xs font-mono text-slate-400">Broadcast ID</span>
      }>
        <TextInput
          id="qr-wifi-ssid"
          mono
          value={values.ssid ?? ""}
          onChange={(event) => set("ssid", event.target.value)}
          placeholder="ScanCraft-Studio"
        />
      </Field>

      <Field htmlFor="qr-wifi-password" label="Password" hint="• Hidden on scan">
        <TextInput
          id="qr-wifi-password"
          type="text"
          mono
          value={values.password ?? ""}
          onChange={(event) => set("password", event.target.value)}
          placeholder="••••••••"
        />
      </Field>

      <Field label="Security Protocol">
        <Segmented
          ariaLabel="WiFi security"
          options={SECURITY}
          value={values.security ?? "WPA"}
          onChange={(value) => set("security", value)}
        />
      </Field>
    </div>
  );
}
