"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";

/** Phone dial payload (tel:). */
export function PhoneForm() {
  const { values, set } = useTypeValues("phone");

  return (
    <Field
      htmlFor="qr-phone"
      label="Phone Number"
      hint="• Dialled on tap"
      trailing={<span className="text-xs font-mono text-slate-400">tel:</span>}
    >
      <TextInput
        id="qr-phone"
        mono
        value={values.phone ?? ""}
        onChange={(event) => set("phone", event.target.value)}
        placeholder="+8801XXXXXXXXX"
      />
    </Field>
  );
}
