"use client";

import { useMemo, useState } from "react";
import { useQrStore } from "@/store/useQrStore";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

/** Field key that holds a URL for the active content type. */
const URL_KEYS: Record<string, string> = {
  url: "url",
  file: "fileUrl",
};

const SOURCES = ["qr", "poster", "packaging", "newsletter", "menu", "business-card"];
const MEDIUMS = ["qr_code", "print", "packaging", "email", "social"];
const CAMPAIGNS = ["spring_tech_conf", "menu_2025", "ramadan_offer", "product_launch"];

/**
 * Build a UTM-tagged destination URL and write it into the active form.
 * Only URL-based types (URL, File) expose a destination field, so others get a hint instead.
 */
export function UtmBuilder({ close }: { close: () => void }) {
  const activeType = useQrStore((state) => state.activeType);
  const values = useQrStore((state) => state.values[state.activeType]);
  const setValue = useQrStore((state) => state.setValue);

  const urlKey = URL_KEYS[activeType];

  const [source, setSource] = useState(SOURCES[0]);
  const [medium, setMedium] = useState(MEDIUMS[0]);
  const [campaign, setCampaign] = useState(CAMPAIGNS[0]);
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const base = values[urlKey]?.trim() ?? "";

  const preview = useMemo(() => {
    if (!base) return "";
    const params = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: campaign });
    if (term.trim()) params.set("utm_term", term.trim());
    if (content.trim()) params.set("utm_content", content.trim());
    const joiner = base.includes("?") ? "&" : "?";
    return `${base}${joiner}${params.toString()}`;
  }, [base, source, medium, campaign, term, content]);

  if (!urlKey) {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <Icon name="info" className="text-[18px] text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          UTM tags apply to link payloads. Switch to <strong>URL / Web</strong> or{" "}
          <strong>File &amp; PDF</strong> to build a tracked campaign link.
        </p>
      </div>
    );
  }

  const field = (label: string, value: string, onChange: (next: string) => void, list: string[]) => (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-slate-700">{label}</span>
      <TextInput
        list={`utm-${label}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        mono
        className="text-xs py-2"
      />
      <datalist id={`utm-${label}`}>
        {list.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </label>
  );

  return (
    <div className="flex flex-col gap-3">
      {field("utm_source", source, setSource, SOURCES)}
      {field("utm_medium", medium, setMedium, MEDIUMS)}
      {field("utm_campaign", campaign, setCampaign, CAMPAIGNS)}

      <div className="grid grid-cols-2 gap-2">
        {field("utm_term", term, setTerm, ["spring_tech", "menu"])}
        {field("utm_content", content, setContent, ["hero_banner", "footer"])}
      </div>

      <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Generated URL
        </span>
        <p className="text-[11px] font-mono text-slate-700 break-all mt-0.5">
          {preview || "Enter a destination URL first"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="gradient"
          size="md"
          icon="check"
          disabled={!preview}
          className="flex-1"
          onClick={() => {
            if (!preview) return;
            setValue(activeType, urlKey, preview);
            close();
          }}
          title="Write this URL into the destination field"
        >
          Apply to payload
        </Button>
        <Button
          variant="secondary"
          size="md"
          icon="content_copy"
          disabled={!preview}
          onClick={() => void navigator.clipboard.writeText(preview)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}