"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Icon } from "@/components/ui/icon";

/** Direct file link payload (PDF, image, audio). */
export function FileForm() {
  const { values, set } = useTypeValues("file");

  return (
    <div className="flex flex-col gap-4">
      <Field
        htmlFor="qr-file-url"
        label="File URL"
        hint="• Hosted PDF, MP3 or image"
        trailing={
          <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
            <Icon name="verified" className="text-[15px] text-emerald-600" />
            Direct link
          </span>
        }
      >
        <TextInput
          id="qr-file-url"
          prefix="https://"
          mono
          value={values.fileUrl ?? ""}
          onChange={(event) => set("fileUrl", event.target.value)}
          placeholder="yourbrand.com/menu.pdf"
        />
      </Field>

      <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200/80 flex items-start gap-2.5">
        <Icon name="info" className="text-[18px] text-sky-600 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Keep files under 5 MB for fast mobile loads. The QR itself stays static —
          re-host the file at the same URL to update it without reprinting.
        </p>
      </div>
    </div>
  );
}
