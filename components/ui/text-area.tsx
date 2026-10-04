import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  mono?: boolean;
};

/** Studio textarea matching the TextInput treatment. */
export function TextArea({ mono = false, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-slate-300 bg-surface-subtle px-3 py-2.5 text-sm text-text-navy",
        "placeholder:text-slate-400 transition-all shadow-2xs resize-y min-h-[92px]",
        "focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30",
        mono && "font-mono",
        className,
      )}
      {...props}
    />
  );
}
