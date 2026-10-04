export type ClassValue = string | false | null | undefined;

/** Minimal className joiner — keeps component variant logic readable. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
