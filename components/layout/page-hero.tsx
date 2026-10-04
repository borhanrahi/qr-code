import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { StatusDot } from "@/components/ui/badge";

export type PageHeroProps = {
  /** Material Symbols name for the eyebrow chip. */
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Right-aligned controls (badges, buttons). */
  actions?: ReactNode;
};

/** Shared hero strip for the studio's secondary pages. */
export function PageHero({ icon, eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-7 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold">
              <StatusDot className="bg-sky-600" />
              {eyebrow}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1">
              <Icon name={icon} className="text-[14px]" />
              {title}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight font-extrabold">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2 flex-shrink-0">{actions}</div> : null}
      </div>
    </section>
  );
}
