"use client";

import { useCallback } from "react";
import type { QrContentType } from "@/lib/qr/types";
import { useQrStore } from "@/store/useQrStore";

/** Read/write the field values of one content type. Every form uses this. */
export function useTypeValues(type: QrContentType) {
  const values = useQrStore((state) => state.values[type]);
  const setValue = useQrStore((state) => state.setValue);

  const set = useCallback(
    (key: string, value: string) => setValue(type, key, value),
    [setValue, type],
  );

  return { values, set };
}
