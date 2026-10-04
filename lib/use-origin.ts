"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => void 0;
const getSnapshot = () => (typeof window !== "undefined" ? window.location.origin : "");
const getServerSnapshot = () => "";

/**
 * `window.location.origin`, SSR-safe: empty string on the server and during
 * hydration, resolved on the client — same pattern as useMediaQuery.
 */
export function useOrigin(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
