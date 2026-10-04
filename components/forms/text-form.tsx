"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextArea } from "@/components/ui/text-area";

/** Free text / markdown payload. */
export function TextForm() {
  const { values, set } = useTypeValues("text");

  return (
    <Field
      htmlFor="qr-text"
      label="Text Payload"
      hint="• Plain or markdown"
      trailing={
        <span className="text-xs font-mono text-slate-400">
          {(values.text ?? "").length} chars
        </span>
      }
    >
      <TextArea
        id="qr-text"
        value={values.text ?? ""}
        onChange={(event) => set("text", event.target.value)}
        placeholder="Type the text to encode…"
      />
    </Field>
  );
}
