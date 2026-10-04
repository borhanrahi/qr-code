"use client";

import { useSyncExternalStore } from "react";

const SUBSCRIBE = (query: string, onChange: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

/**
 * Track a CSS media query in React state.
 *
 * Returns `undefined` during SSR/hydration so callers can avoid mounting the wrong branch
 * (and avoid a flash of the wrong layout), then resolves to a boolean on the client.
 * Pair with an explicit null check.
 */
export function useMediaQuery(query: string): boolean | undefined {
  return useSyncExternalStore(
    (onChange) => SUBSCRIBE(query, onChange),
    () => window.matchMedia(query).matches,
    () => undefined,
  );
}
