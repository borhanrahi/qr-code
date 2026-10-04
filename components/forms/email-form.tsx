"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/text-area";

/** Pre-filled email composer payload. */
export function EmailForm() {
  const { values, set } = useTypeValues("email");

  return (
    <div className="flex flex-col gap-4">
      <Field htmlFor="qr-email" label="Recipient Address" trailing={
        <span className="text-xs font-mono text-slate-400">mailto:</span>
      }>
        <TextInput
          id="qr-email"
          type="email"
          mono
          value={values.email ?? ""}
          onChange={(event) => set("email", event.target.value)}
          placeholder="hello@example.com"
        />
      </Field>

      <Field htmlFor="qr-email-subject" label="Subject Line">
        <TextInput
          id="qr-email-subject"
          value={values.subject ?? ""}
          onChange={(event) => set("subject", event.target.value)}
          placeholder="Campaign QR artwork"
        />
      </Field>

      <Field htmlFor="qr-email-body" label="Message Body">
        <TextArea
          id="qr-email-body"
          value={values.body ?? ""}
          onChange={(event) => set("body", event.target.value)}
          placeholder="Hi, here is…"
        />
      </Field>
    </div>
  );
}
