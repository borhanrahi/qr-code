import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Responsive page gutter used by header, sections and footer. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}
