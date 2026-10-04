import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Static left affix, e.g. "https://" or an icon. */
  prefix?: ReactNode;
  /** Static right affix, e.g. a validation check. */
  suffix?: ReactNode;
  mono?: boolean;
};

/** Studio text input: hairline border, sky focus halo, optional affixes. */
export function TextInput({
  prefix,
  suffix,
  mono = false,
  className,
  type = "text",
  ...props
}: TextInputProps) {
  const input = (
    <input
      type={type}
      className={cn(
        "w-full rounded-lg border border-slate-300 bg-surface-subtle px-3 py-2.5 text-sm text-text-navy",
        "placeholder:text-slate-400 transition-all shadow-2xs",
        "focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30",
        mono && "font-mono",
        !!prefix && "pl-20",
        !!suffix && "pr-10",
        className,
      )}
      {...props}
    />
  );

  if (!prefix && !suffix) return input;

  return (
    <div className="relative flex items-center">
      {prefix ? (
        <span className="pointer-events-none absolute left-3.5 flex items-center font-mono text-xs font-semibold text-slate-400">
          {prefix}
        </span>
      ) : null}
      {input}
      {suffix ? (
        <span className="pointer-events-none absolute right-3 flex items-center text-teal-600">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
