"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";

/** vCard 3.0 contact payload. */
export function VCardForm() {
  const { values, set } = useTypeValues("vcard");

  const row = (id: string, label: string, placeholder: string) => (
    <Field key={id} htmlFor={`qr-vcard-${id}`} label={label}>
      <TextInput
        id={`qr-vcard-${id}`}
        value={values[id] ?? ""}
        onChange={(event) => set(id, event.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {row("firstName", "First Name", "Rafi")}
        {row("lastName", "Last Name", "Ahmed")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {row("org", "Organisation", "ScanCraft")}
        {row("title", "Job Title", "Product Designer")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {row("phone", "Phone", "+8801712345678")}
        {row("email", "Email", "rafi@scancraft.studio")}
      </div>
      {row("address", "Address", "Dhaka, Bangladesh")}
    </div>
  );
}
