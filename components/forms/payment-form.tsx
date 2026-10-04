"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Badge } from "@/components/ui/badge";

/** Bangla QR (EMVCo merchant payment) payload. */
export function PaymentForm() {
  const { values, set } = useTypeValues("bangla");

  return (
    <div className="flex flex-col gap-4">
      <Field
        htmlFor="qr-merchant"
        label="Merchant Name"
        trailing={<Badge tone="teal">EMVCo 2.3</Badge>}
      >
        <TextInput
          id="qr-merchant"
          value={values.merchant ?? ""}
          onChange={(event) => set("merchant", event.target.value)}
          placeholder="ScanCraft Studio"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field htmlFor="qr-account" label="Merchant Account" hint="• bKash / Nagad">
          <TextInput
            id="qr-account"
            mono
            value={values.account ?? ""}
            onChange={(event) => set("account", event.target.value)}
            placeholder="01712345678"
          />
        </Field>
        <Field htmlFor="qr-amount" label="Amount (BDT)" hint="• Optional">
          <TextInput
            id="qr-amount"
            mono
            inputMode="decimal"
            value={values.amount ?? ""}
            onChange={(event) => set("amount", event.target.value)}
            placeholder="250"
          />
        </Field>
      </div>

      <Field htmlFor="qr-reference" label="Reference / Invoice ID">
        <TextInput
          id="qr-reference"
          mono
          value={values.reference ?? ""}
          onChange={(event) => set("reference", event.target.value)}
          placeholder="ORDER-2049"
        />
      </Field>
    </div>
  );
}
