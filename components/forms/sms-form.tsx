"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/text-area";

/** SMS draft payload (SMSTO:). */
export function SmsForm() {
  const { values, set } = useTypeValues("sms");

  return (
    <div className="flex flex-col gap-4">
      <Field htmlFor="qr-sms-phone" label="Recipient Number" hint="• Include country code" trailing={
        <span className="text-xs font-mono text-slate-400">SMSTO:</span>
      }>
        <TextInput
          id="qr-sms-phone"
          mono
          value={values.phone ?? ""}
          onChange={(event) => set("phone", event.target.value)}
          placeholder="+8801XXXXXXXXX"
        />
      </Field>

      <Field htmlFor="qr-sms-message" label="Message" trailing={
        <span className="text-xs font-mono text-slate-400">{(values.message ?? "").length}/160</span>
      }>
        <TextArea
          id="qr-sms-message"
          value={values.message ?? ""}
          onChange={(event) => set("message", event.target.value)}
          placeholder="Your table is ready. Show this code."
        />
      </Field>
    </div>
  );
}
