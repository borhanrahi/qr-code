"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/text-area";

/** WhatsApp deep link payload (wa.me). */
export function WhatsappForm() {
  const { values, set } = useTypeValues("whatsapp");

  return (
    <div className="flex flex-col gap-4">
      <Field
        htmlFor="qr-wa-phone"
        label="WhatsApp Number"
        hint="• Country code, no +"
        trailing={<span className="text-xs font-mono text-slate-400">wa.me/</span>}
      >
        <TextInput
          id="qr-wa-phone"
          mono
          value={values.phone ?? ""}
          onChange={(event) => set("phone", event.target.value)}
          placeholder="8801712345678"
        />
      </Field>

      <Field htmlFor="qr-wa-message" label="Pre-filled Message">
        <TextArea
          id="qr-wa-message"
          value={values.message ?? ""}
          onChange={(event) => set("message", event.target.value)}
          placeholder="Hi! I scanned your QR code."
        />
      </Field>
    </div>
  );
}
