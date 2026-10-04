import { cn } from "@/lib/utils";

export type IconProps = {
  /** Material Symbols ligature name, e.g. "palette", "download". */
  name: string;
  className?: string;
  filled?: boolean;
};

/** Material Symbols icon wrapper — one component for every icon in the app. */
export function Icon({ name, className, filled }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined select-none", filled && "FILLED", className)}
    >
      {name}
    </span>
  );
}
