"use client";

import { useTypeValues } from "./use-type-values";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Segmented } from "@/components/ui/segmented";

const CURRENCIES = [
  { value: "bitcoin", label: "BTC" },
  { value: "ethereum", label: "ETH" },
  { value: "litecoin", label: "LTC" },
];

/** Crypto URI payload with optional amount. */
export function CryptoForm() {
  const { values, set } = useTypeValues("crypto");

  return (
    <div className="flex flex-col gap-4">
      <Field label="Currency">
        <Segmented
          ariaLabel="Crypto currency"
          options={CURRENCIES}
          value={values.currency ?? "bitcoin"}
          onChange={(value) => set("currency", value)}
        />
      </Field>

      <Field htmlFor="qr-crypto-address" label="Receiving Address" hint="• Double-check" trailing={
        <span className="text-xs font-mono text-slate-400">
          {(values.currency ?? "bitcoin").slice(0, 3).toUpperCase()}
        </span>
      }>
        <TextInput
          id="qr-crypto-address"
          mono
          value={values.address ?? ""}
          onChange={(event) => set("address", event.target.value)}
          placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        />
      </Field>

      <Field htmlFor="qr-crypto-amount" label="Amount" hint="• Optional">
        <TextInput
          id="qr-crypto-amount"
          mono
          inputMode="decimal"
          value={values.amount ?? ""}
          onChange={(event) => set("amount", event.target.value)}
          placeholder="0.0025"
        />
      </Field>
    </div>
  );
}
