"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/text-area";

/** iCal VEVENT payload. */
export function EventForm() {
  const { values, set } = useTypeValues("event");

  return (
    <div className="flex flex-col gap-4">
      <Field htmlFor="qr-event-title" label="Event Title" trailing={
        <span className="text-xs font-mono text-slate-400">BEGIN:VEVENT</span>
      }>
        <TextInput
          id="qr-event-title"
          value={values.title ?? ""}
          onChange={(event) => set("title", event.target.value)}
          placeholder="Spring Tech Conf 2025"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field htmlFor="qr-event-start" label="Starts (UTC)" hint="• YYYYMMDDTHHMMSSZ">
          <TextInput
            id="qr-event-start"
            mono
            value={values.start ?? ""}
            onChange={(event) => set("start", event.target.value)}
            placeholder="20250101T100000Z"
          />
        </Field>
        <Field htmlFor="qr-event-end" label="Ends (UTC)">
          <TextInput
            id="qr-event-end"
            mono
            value={values.end ?? ""}
            onChange={(event) => set("end", event.target.value)}
            placeholder="20250101T120000Z"
          />
        </Field>
      </div>

      <Field htmlFor="qr-event-location" label="Location">
        <TextInput
          id="qr-event-location"
          value={values.location ?? ""}
          onChange={(event) => set("location", event.target.value)}
          placeholder="Dhaka, Bangladesh"
        />
      </Field>

      <Field htmlFor="qr-event-description" label="Description">
        <TextArea
          id="qr-event-description"
          value={values.description ?? ""}
          onChange={(event) => set("description", event.target.value)}
          placeholder="Client-side QR engineering summit."
        />
      </Field>
    </div>
  );
}
